import crypto from 'node:crypto';

const KEY_ID = process.env.APP_STORE_CONNECT_API_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_API_KEY_ISSUER_ID;
const KEY_BASE64 = process.env.APP_STORE_CONNECT_API_KEY_BASE64 || process.env.APP_STORE_CONNECT_API_KEY;
const BUNDLE_ID = process.env.APP_STORE_BUNDLE_ID || 'com.ansioff.app.jordi';
const APP_VERSION = process.env.APP_STORE_VERSION || '1.1.10';
const BUILD_NUMBER = process.env.APP_STORE_BUILD_NUMBER || '63';
const SELECT_BUILD = process.env.SELECT_BUILD === 'true';
const CREATE_VERSION = process.env.CREATE_APP_STORE_VERSION === 'true';
const BUILD_WAIT_ATTEMPTS = Number(process.env.APP_STORE_BUILD_WAIT_ATTEMPTS || 45);
const BUILD_WAIT_MS = Number(process.env.APP_STORE_BUILD_WAIT_MS || 20_000);

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
    throw new Error(`${response.status} ${response.statusText} for ${path}: ${message}`);
  }
  return body;
}

const apps = await request(`/v1/apps?filter[bundleId]=${encodeURIComponent(BUNDLE_ID)}`);
const app = apps.data?.[0];
if (!app) throw new Error(`App not found for bundleId ${BUNDLE_ID}`);

let versions = await request(`/v1/apps/${app.id}/appStoreVersions?filter[platform]=IOS&filter[versionString]=${encodeURIComponent(APP_VERSION)}&include=build&limit=10`);
let version = versions.data?.[0];
if (!version && CREATE_VERSION) {
  version = (await request('/v1/appStoreVersions', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        type: 'appStoreVersions',
        attributes: {
          platform: 'IOS',
          versionString: APP_VERSION,
          copyright: 'ANSIOFF',
          releaseType: 'AFTER_APPROVAL',
          usesIdfa: false,
        },
        relationships: {
          app: { data: { type: 'apps', id: app.id } },
        },
      },
    }),
  })).data;
  console.log(`Created iOS app version ${APP_VERSION} (${version.id}).`);
  versions = await request(`/v1/apps/${app.id}/appStoreVersions?filter[platform]=IOS&filter[versionString]=${encodeURIComponent(APP_VERSION)}&include=build&limit=10`);
  version = versions.data?.[0] || version;
}
if (!version) throw new Error(`iOS app version ${APP_VERSION} not found`);

let build = null;
for (let attempt = 1; attempt <= BUILD_WAIT_ATTEMPTS; attempt += 1) {
  const builds = await request(`/v1/builds?filter[app]=${app.id}&filter[version]=${encodeURIComponent(BUILD_NUMBER)}&sort=-uploadedDate&limit=10`);
  build = builds.data?.[0] || null;
  if (build?.attributes?.processingState === 'VALID') break;
  const state = build?.attributes?.processingState || 'not found';
  console.log(`Build ${BUILD_NUMBER} is ${state}; waiting (${attempt}/${BUILD_WAIT_ATTEMPTS})...`);
  if (attempt < BUILD_WAIT_ATTEMPTS) {
    await new Promise((resolve) => setTimeout(resolve, BUILD_WAIT_MS));
  }
}

console.log(JSON.stringify({
  app: { id: app.id, name: app.attributes?.name, bundleId: app.attributes?.bundleId },
  appStoreVersion: {
    id: version.id,
    versionString: version.attributes?.versionString,
    appStoreState: version.attributes?.appStoreState,
    appVersionState: version.attributes?.appVersionState,
    currentBuild: versions.included?.find((item) => item.type === 'builds')?.attributes || null,
  },
  requestedBuildNumber: BUILD_NUMBER,
  latestMatchingBuild: build ? {
    id: build.id,
    version: build.attributes?.version,
    uploadedDate: build.attributes?.uploadedDate,
    processingState: build.attributes?.processingState,
    expired: build.attributes?.expired,
  } : null,
  selectBuild: SELECT_BUILD,
}, null, 2));

if (!build) {
  throw new Error(`Build ${BUILD_NUMBER} not found yet`);
}

if (build.attributes?.processingState !== 'VALID') {
  throw new Error(`Build ${BUILD_NUMBER} is not VALID yet; current state is ${build.attributes?.processingState}`);
}

if (SELECT_BUILD) {
  await request(`/v1/appStoreVersions/${version.id}/relationships/build`, {
    method: 'PATCH',
    body: JSON.stringify({
      data: { id: build.id, type: 'builds' },
    }),
  });
  console.log(`Selected build ${BUILD_NUMBER} (${build.id}) for iOS version ${APP_VERSION}.`);
}
