import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';

const PACKAGE_NAME = process.env.GOOGLE_PLAY_PACKAGE_NAME || 'com.ansioff.app';
const SCOPE = 'https://www.googleapis.com/auth/androidpublisher';
const DATA_SAFETY_CSV_PATH = path.resolve(process.env.GOOGLE_PLAY_DATA_SAFETY_CSV || 'store-assets/google-play/data-safety.csv');

function requireCredentials() {
  const raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Missing GOOGLE_PLAY_SERVICE_ACCOUNT_JSON');
  return JSON.parse(raw);
}

async function main() {
  if (!fs.existsSync(DATA_SAFETY_CSV_PATH)) {
    throw new Error(`Missing data safety CSV: ${DATA_SAFETY_CSV_PATH}`);
  }

  const safetyLabels = fs.readFileSync(DATA_SAFETY_CSV_PATH, 'utf8');
  if (!safetyLabels.includes('Question ID (machine readable)')) {
    throw new Error('The data safety CSV does not look like a Google Play Data safety export.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: requireCredentials(),
    scopes: [SCOPE],
  });
  const client = await auth.getClient();

  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(PACKAGE_NAME)}/dataSafety`;
  const { data } = await client.request({
    url,
    method: 'POST',
    data: { safetyLabels },
  });

  console.log(`Uploaded Google Play Data safety declaration for ${PACKAGE_NAME}`);
  if (data?.safetyLabels) console.log(`Uploaded ${data.safetyLabels.length} CSV characters`);
}

main().catch((error) => {
  const apiError = error.response?.data?.error;
  if (apiError) {
    console.error(`Google Play API error code=${apiError.code || 'unknown'} status=${apiError.status || 'unknown'}`);
    console.error(`Google Play API message=${apiError.message || error.message}`);
    for (const detail of apiError.errors || []) {
      console.error([
        'Google Play API detail',
        `domain=${detail.domain || 'unknown'}`,
        `reason=${detail.reason || 'unknown'}`,
        `message=${detail.message || 'unknown'}`,
      ].join(' | '));
    }
  } else {
    console.error(error.message);
  }
  process.exit(1);
});
