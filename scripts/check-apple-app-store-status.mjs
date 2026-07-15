import crypto from 'node:crypto';

const KEY_ID = process.env.APP_STORE_CONNECT_API_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_API_KEY_ISSUER_ID;
const KEY_BASE64 = process.env.APP_STORE_CONNECT_API_KEY_BASE64 || process.env.APP_STORE_CONNECT_API_KEY;
const BUNDLE_ID = process.env.APP_STORE_BUNDLE_ID || 'com.ansioff.app.jordi';
const FALLBACK_APP_ID = process.env.APP_STORE_APP_ID || '6761905804';

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

async function request(path) {
  const response = await fetch(`https://api.appstoreconnect.apple.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
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

function itemSummary(item) {
  if (!item) return null;
  return {
    id: item.id,
    type: item.type,
    attributes: item.attributes || {},
    relationships: item.relationships
      ? Object.fromEntries(Object.entries(item.relationships).map(([key, value]) => [
        key,
        value?.data
          ? Array.isArray(value.data)
            ? value.data.map((entry) => ({ id: entry.id, type: entry.type }))
            : { id: value.data.id, type: value.data.type }
          : null,
      ]))
      : undefined,
  };
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
const app = apps.data?.[0] || { id: FALLBACK_APP_ID, attributes: { bundleId: BUNDLE_ID } };
const appId = app.id;

console.log('APP');
console.log(JSON.stringify(itemSummary(app), null, 2));

const versions = await optional('APP_STORE_VERSIONS_ERROR', () =>
  request(`/v1/apps/${appId}/appStoreVersions?filter[platform]=IOS&include=appStoreVersionSubmission,build,appStoreReviewDetail&limit=10`),
);
if (versions) {
  console.log('APP_STORE_VERSIONS');
  console.log(JSON.stringify({
    data: versions.data?.map(itemSummary),
    included: versions.included?.map(itemSummary),
  }, null, 2));

  for (const version of versions.data || []) {
    const versionId = version.id;
    const reviewDetail = await optional(`APP_STORE_REVIEW_DETAIL_ERROR version=${versionId}`, () =>
      request(`/v1/appStoreVersions/${versionId}/appStoreReviewDetail`),
    );
    if (reviewDetail) {
      console.log(`APP_STORE_REVIEW_DETAIL version=${versionId}`);
      console.log(JSON.stringify({
        data: itemSummary(reviewDetail.data),
        included: reviewDetail.included?.map(itemSummary),
      }, null, 2));
    }

    const submission = await optional(`APP_STORE_VERSION_SUBMISSION_ERROR version=${versionId}`, () =>
      request(`/v1/appStoreVersions/${versionId}/appStoreVersionSubmission`),
    );
    if (submission) {
      console.log(`APP_STORE_VERSION_SUBMISSION version=${versionId}`);
      console.log(JSON.stringify({
        data: itemSummary(submission.data),
        included: submission.included?.map(itemSummary),
      }, null, 2));
    }
  }
}

const reviewSubmissions = await optional('REVIEW_SUBMISSIONS_ERROR', () =>
  request(`/v1/apps/${appId}/reviewSubmissions?include=items&limit=20`),
);
if (reviewSubmissions) {
  console.log('REVIEW_SUBMISSIONS');
  console.log(JSON.stringify({
    data: reviewSubmissions.data?.map(itemSummary),
    included: reviewSubmissions.included?.map(itemSummary),
  }, null, 2));
}

const subscriptionGroups = await optional('SUBSCRIPTION_GROUPS_ERROR', () =>
  request(`/v1/apps/${appId}/subscriptionGroups`),
);
if (subscriptionGroups) {
  console.log('SUBSCRIPTION_GROUPS');
  console.log(JSON.stringify(subscriptionGroups.data?.map(itemSummary), null, 2));

  for (const group of subscriptionGroups.data || []) {
    const subscriptions = await optional(`SUBSCRIPTIONS_ERROR group=${group.id}`, () =>
      request(`/v1/subscriptionGroups/${group.id}/subscriptions?include=introductoryOffers,prices&limit=200`),
    );
    if (subscriptions) {
      console.log(`SUBSCRIPTIONS group=${group.id}`);
      console.log(JSON.stringify({
        data: subscriptions.data?.map(itemSummary),
        included: subscriptions.included?.map(itemSummary),
      }, null, 2));
    }
  }
}

const inAppPurchases = await optional('IN_APP_PURCHASES_ERROR', () =>
  request(`/v1/apps/${appId}/inAppPurchasesV2?limit=200`),
);
if (inAppPurchases) {
  console.log('IN_APP_PURCHASES_V2');
  console.log(JSON.stringify(inAppPurchases.data?.map(itemSummary), null, 2));
}
