import crypto from 'node:crypto';

const KEY_ID = process.env.APP_STORE_CONNECT_API_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_API_KEY_ISSUER_ID;
const KEY_BASE64 = process.env.APP_STORE_CONNECT_API_KEY_BASE64 || process.env.APP_STORE_CONNECT_API_KEY;
const BUNDLE_ID = process.env.APP_STORE_BUNDLE_ID || 'com.ansioff.app.jordi';
const APP_VERSION = process.env.APP_STORE_VERSION || '1.1.1';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function createToken() {
  if (!KEY_ID || !ISSUER_ID || !KEY_BASE64) {
    throw new Error('Missing App Store Connect API key environment variables');
  }

  const key = Buffer.from(KEY_BASE64, 'base64').toString('utf8');
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: ISSUER_ID,
    iat: now,
    exp: now + 20 * 60,
    aud: 'appstoreconnect-v1',
  }));
  const signingInput = `${header}.${payload}`;
  const signature = crypto.sign('sha256', Buffer.from(signingInput), {
    key,
    dsaEncoding: 'ieee-p1363',
  });
  return `${signingInput}.${base64url(signature)}`;
}

const token = createToken();

async function request(path, options = {}) {
  const response = await fetch(`https://api.appstoreconnect.apple.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    const message = typeof body === 'object' ? JSON.stringify(body) : String(body);
    const error = new Error(`${response.status} ${response.statusText} for ${path}: ${message}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

async function optional(label, fn) {
  try {
    return await fn();
  } catch (error) {
    console.log(`${label}: ${error.message}`);
    return null;
  }
}

const apps = await request(`/v1/apps?filter[bundleId]=${encodeURIComponent(BUNDLE_ID)}`);
const app = apps.data?.[0];
if (!app) throw new Error(`App not found for bundleId ${BUNDLE_ID}`);

const versions = await request(`/v1/apps/${app.id}/appStoreVersions?filter[platform]=IOS&filter[versionString]=${encodeURIComponent(APP_VERSION)}&include=build&limit=10`);
const version = versions.data?.[0];
if (!version) throw new Error(`iOS app version ${APP_VERSION} not found`);
const build = versions.included?.find((item) => item.type === 'builds');
if (!build) throw new Error(`No build selected for version ${APP_VERSION}`);

console.log(JSON.stringify({
  app: { id: app.id, name: app.attributes?.name },
  version: {
    id: version.id,
    versionString: version.attributes?.versionString,
    appStoreState: version.attributes?.appStoreState,
    appVersionState: version.attributes?.appVersionState,
  },
  selectedBuild: {
    id: build.id,
    version: build.attributes?.version,
    processingState: build.attributes?.processingState,
  },
}, null, 2));

const reviewSubmissions = await request(`/v1/apps/${app.id}/reviewSubmissions?include=items&limit=20`);
const existingUnresolved = reviewSubmissions.data?.find((submission) => submission.attributes?.state === 'UNRESOLVED_ISSUES');
const existingReady = reviewSubmissions.data?.find((submission) => ['PREPARE_FOR_SUBMISSION', 'READY_FOR_REVIEW'].includes(submission.attributes?.state));

let submission = existingReady || existingUnresolved;

if (!submission) {
  submission = (await request('/v1/reviewSubmissions', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        type: 'reviewSubmissions',
        attributes: { platform: 'IOS' },
        relationships: {
          app: { data: { type: 'apps', id: app.id } },
        },
      },
    }),
  })).data;
  console.log(`Created review submission ${submission.id}.`);
} else {
  console.log(`Using existing review submission ${submission.id} with state ${submission.attributes?.state}.`);
}

const includedItems = reviewSubmissions.included || [];
const alreadyHasVersionItem = includedItems.some((item) =>
  item.type === 'reviewSubmissionItems'
  && item.relationships?.appStoreVersion?.data?.id === version.id
);

if (!alreadyHasVersionItem && submission.attributes?.state !== 'UNRESOLVED_ISSUES') {
  const item = await optional('CREATE_REVIEW_SUBMISSION_ITEM_ERROR', () => request('/v1/reviewSubmissionItems', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        type: 'reviewSubmissionItems',
        relationships: {
          reviewSubmission: { data: { type: 'reviewSubmissions', id: submission.id } },
          appStoreVersion: { data: { type: 'appStoreVersions', id: version.id } },
        },
      },
    }),
  }));
  if (item) console.log(`Added appStoreVersion ${version.id} to review submission ${submission.id}.`);
}

const submitted = await request(`/v1/reviewSubmissions/${submission.id}`, {
  method: 'PATCH',
  body: JSON.stringify({
    data: {
      type: 'reviewSubmissions',
      id: submission.id,
      attributes: { submitted: true },
    },
  }),
});

console.log('SUBMITTED_REVIEW_SUBMISSION');
console.log(JSON.stringify(submitted.data, null, 2));
