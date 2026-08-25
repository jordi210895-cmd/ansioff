import { google } from 'googleapis';

const PACKAGE_NAME = 'com.ansioff.app';
const SCOPE = 'https://www.googleapis.com/auth/androidpublisher';
const SOURCE_TRACK = process.env.GOOGLE_PLAY_SOURCE_TRACK || 'alpha';
const TARGET_TRACK = process.env.GOOGLE_PLAY_TARGET_TRACK || 'production';
// A draft avoids Play's production country-targeting restriction. The owner
// can choose countries and send the staged production release for review in
// Play Console.
const RELEASE_STATUS = process.env.GOOGLE_PLAY_RELEASE_STATUS || 'draft';
const CHANGES_NOT_SENT_FOR_REVIEW = process.env.GOOGLE_PLAY_CHANGES_NOT_SENT_FOR_REVIEW !== 'false';
const RELEASE_NAME = process.env.GOOGLE_PLAY_RELEASE_NAME || 'ANSIOFF 1.1.11';
const RELEASE_NOTES = process.env.GOOGLE_PLAY_RELEASE_NOTES || [
  'Mejora de la exportación y el uso compartido del informe PDF.',
  'El informe incluye más detalle del estado de ánimo, objetivos y registros terapéuticos.',
].join('\n');

function requireCredentials() {
  const raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Missing GOOGLE_PLAY_SERVICE_ACCOUNT_JSON');
  return JSON.parse(raw);
}

function getVersionCodes(track) {
  const releases = track?.releases || [];
  return releases
    .flatMap((release) => release.versionCodes || [])
    .map((versionCode) => String(versionCode))
    .filter(Boolean);
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    credentials: requireCredentials(),
    scopes: [SCOPE],
  });
  const androidpublisher = google.androidpublisher({ version: 'v3', auth });

  const { data: edit } = await androidpublisher.edits.insert({ packageName: PACKAGE_NAME });
  const editId = edit.id;
  if (!editId) throw new Error('Google Play did not return an edit id');
  console.log(`Created edit ${editId}`);

  const { data: sourceTrack } = await androidpublisher.edits.tracks.get({
    packageName: PACKAGE_NAME,
    editId,
    track: SOURCE_TRACK,
  });
  const versionCodes = [...new Set(getVersionCodes(sourceTrack))];
  if (!versionCodes.length) throw new Error(`No version codes found in ${SOURCE_TRACK} track`);

  console.log(`Promoting version codes from ${SOURCE_TRACK} to ${TARGET_TRACK}: ${versionCodes.join(', ')}`);

  await androidpublisher.edits.tracks.update({
    packageName: PACKAGE_NAME,
    editId,
    track: TARGET_TRACK,
    requestBody: {
      track: TARGET_TRACK,
      releases: [{
        name: RELEASE_NAME,
        versionCodes,
        status: RELEASE_STATUS,
        releaseNotes: [{
          language: 'es-ES',
          text: RELEASE_NOTES,
        }],
      }],
    },
  });

  const commitOptions = {
    packageName: PACKAGE_NAME,
    editId,
  };
  if (CHANGES_NOT_SENT_FOR_REVIEW) {
    commitOptions.changesNotSentForReview = true;
  }
  const { data: commit } = await androidpublisher.edits.commit(commitOptions);
  console.log(`Committed production edit ${commit.id || editId}`);
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
