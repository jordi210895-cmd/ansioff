import crypto from 'node:crypto';

const KEY_ID = process.env.APP_STORE_CONNECT_API_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_API_KEY_ISSUER_ID;
const KEY_BASE64 = process.env.APP_STORE_CONNECT_API_KEY_BASE64 || process.env.APP_STORE_CONNECT_API_KEY;
const BUNDLE_ID = process.env.APP_STORE_BUNDLE_ID || 'com.ansioff.app.jordi';
const APP_VERSION = process.env.APP_STORE_VERSION || '1.1.10';
const DELETE_DUPLICATES = process.env.DELETE_DUPLICATES === 'true';

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

const versions = await request(`/v1/apps/${app.id}/appStoreVersions?filter[platform]=IOS&filter[versionString]=${encodeURIComponent(APP_VERSION)}&limit=10`);
const version = versions.data?.[0];
if (!version) throw new Error(`iOS app version ${APP_VERSION} not found`);

const localizations = await request(`/v1/appStoreVersions/${version.id}/appStoreVersionLocalizations?limit=200`);
const spanish = localizations.data?.find((item) => item.attributes?.locale === 'es-ES') || localizations.data?.[0];
if (!spanish) throw new Error(`No localizations found for version ${APP_VERSION}`);

const sets = await request(`/v1/appStoreVersionLocalizations/${spanish.id}/appScreenshotSets?include=appScreenshots&limit=200`);
const screenshotsBySet = new Map();
for (const set of sets.data || []) {
  const screenshotIds = (set.relationships?.appScreenshots?.data || []).map((item) => item.id);
  const screenshots = (sets.included || [])
    .filter((item) => item.type === 'appScreenshots' && screenshotIds.includes(item.id));
  screenshotsBySet.set(set.id, { set, screenshots });
}

const deletions = [];
for (const { set, screenshots } of screenshotsBySet.values()) {
  const seen = new Map();
  for (const screenshot of screenshots) {
    const fileName = screenshot.attributes?.fileName || screenshot.attributes?.assetDeliveryState?.errorCode || screenshot.id;
    const key = fileName.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, screenshot);
      continue;
    }
    deletions.push({ setId: set.id, displayType: set.attributes?.screenshotDisplayType, id: screenshot.id, fileName });
  }
}

console.log(JSON.stringify({
  app: { id: app.id, name: app.attributes?.name },
  version: { id: version.id, versionString: version.attributes?.versionString },
  localization: { id: spanish.id, locale: spanish.attributes?.locale },
  sets: [...screenshotsBySet.values()].map(({ set, screenshots }) => ({
    id: set.id,
    displayType: set.attributes?.screenshotDisplayType,
    screenshots: screenshots.map((s) => ({ id: s.id, fileName: s.attributes?.fileName })),
  })),
  deleteDuplicates: DELETE_DUPLICATES,
  duplicateCount: deletions.length,
  deletions,
}, null, 2));

if (DELETE_DUPLICATES) {
  for (const deletion of deletions) {
    await request(`/v1/appScreenshots/${deletion.id}`, { method: 'DELETE' });
    console.log(`Deleted duplicate screenshot ${deletion.fileName} (${deletion.id}) from ${deletion.displayType}.`);
  }
}
