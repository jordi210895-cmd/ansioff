import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';

const PACKAGE_NAME = 'com.ansioff.app';
const SCOPE = 'https://www.googleapis.com/auth/androidpublisher';
const ICON_PATH = path.resolve('assets/play-store-icon.png');
const FALLBACK_LISTING = {
  title: 'Ansioff',
  shortDescription: 'Diario, sonidos y rutinas para crear pausas y ordenar tus ideas.',
  fullDescription: [
    'ANSIOFF reúne diario personal, sonidos, pausas guiadas y rutinas para ayudarte a ordenar ideas durante el día.',
    '',
    'Es una herramienta de organización personal e informativa para crear pausas, escribir y seguir hábitos cotidianos.',
  ].join('\n'),
};

function requireCredentials() {
  const raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Missing GOOGLE_PLAY_SERVICE_ACCOUNT_JSON');
  return JSON.parse(raw);
}

async function main() {
  if (!fs.existsSync(ICON_PATH)) throw new Error(`Missing icon file: ${ICON_PATH}`);

  const auth = new google.auth.GoogleAuth({
    credentials: requireCredentials(),
    scopes: [SCOPE],
  });
  const androidpublisher = google.androidpublisher({ version: 'v3', auth });

  const { data: edit } = await androidpublisher.edits.insert({ packageName: PACKAGE_NAME });
  const editId = edit.id;
  if (!editId) throw new Error('Google Play did not return an edit id');

  console.log(`Created edit ${editId}`);

  const { data: listingList } = await androidpublisher.edits.listings.list({
    packageName: PACKAGE_NAME,
    editId,
  });
  let languages = (listingList.listings || [])
    .map((listing) => listing.language)
    .filter(Boolean);

  if (!languages.length) {
    await androidpublisher.edits.listings.update({
      packageName: PACKAGE_NAME,
      editId,
      language: 'es-ES',
      requestBody: {
        language: 'es-ES',
        ...FALLBACK_LISTING,
      },
    });
    languages = ['es-ES'];
    console.log('Created fallback es-ES store listing');
  }

  for (const language of languages) {
    await androidpublisher.edits.images.deleteall({
      packageName: PACKAGE_NAME,
      editId,
      language,
      imageType: 'icon',
    }).catch((error) => {
      const status = error.response?.status;
      if (status !== 404) throw error;
    });

    const { data } = await androidpublisher.edits.images.upload({
      packageName: PACKAGE_NAME,
      editId,
      language,
      imageType: 'icon',
      media: {
        mimeType: 'image/png',
        body: fs.createReadStream(ICON_PATH),
      },
    });
    console.log(`Uploaded store icon for ${language}: ${data.image?.url || 'ok'}`);
  }

  const { data: commit } = await androidpublisher.edits.commit({
    packageName: PACKAGE_NAME,
    editId,
  });
  console.log(`Committed edit ${commit.id || editId}`);
}

main().catch((error) => {
  console.error(error.response?.data || error.message);
  process.exit(1);
});
