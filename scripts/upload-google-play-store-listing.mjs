import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';

const PACKAGE_NAME = 'com.ansioff.app';
const SCOPE = 'https://www.googleapis.com/auth/androidpublisher';
const LISTING_DIR = path.resolve('store-assets/listing/es-ES');
const SCREENSHOTS_DIR = path.resolve('store-assets/google-play/phone-screenshots');
const ICON_PATH = path.resolve('assets/play-store-icon.png');
const FEATURE_GRAPHIC_PATH = path.resolve('assets/play-feature-graphic.png');

function readText(fileName) {
  return fs.readFileSync(path.join(LISTING_DIR, fileName), 'utf8').trim();
}

function requireCredentials() {
  const raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Missing GOOGLE_PLAY_SERVICE_ACCOUNT_JSON');
  return JSON.parse(raw);
}

function listScreenshots() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) throw new Error(`Missing screenshots dir: ${SCREENSHOTS_DIR}`);
  return fs.readdirSync(SCREENSHOTS_DIR)
    .filter((file) => /\.(jpe?g|png)$/i.test(file))
    .sort()
    .map((file) => path.join(SCREENSHOTS_DIR, file));
}

async function replaceImage(androidpublisher, editId, language, imageType, imagePath) {
  if (!fs.existsSync(imagePath)) throw new Error(`Missing ${imageType} file: ${imagePath}`);

  await androidpublisher.edits.images.deleteall({
    packageName: PACKAGE_NAME,
    editId,
    language,
    imageType,
  }).catch((error) => {
    const status = error.response?.status;
    if (status !== 404) throw error;
  });

  const mimeType = imagePath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const { data } = await androidpublisher.edits.images.upload({
    packageName: PACKAGE_NAME,
    editId,
    language,
    imageType,
    media: {
      mimeType,
      body: fs.createReadStream(imagePath),
    },
  });
  console.log(`Uploaded ${imageType} for ${language}: ${data.image?.url || 'ok'}`);
}

async function main() {
  const listing = {
    title: readText('title.txt'),
    shortDescription: readText('short-description.txt'),
    fullDescription: readText('full-description.txt'),
  };
  const screenshots = listScreenshots();

  if (listing.title.length > 30) throw new Error(`Google Play title is too long: ${listing.title.length}`);
  if (listing.shortDescription.length > 80) throw new Error(`Google Play short description is too long: ${listing.shortDescription.length}`);
  if (listing.fullDescription.length > 4000) throw new Error(`Google Play full description is too long: ${listing.fullDescription.length}`);
  if (screenshots.length < 2 || screenshots.length > 8) throw new Error(`Google Play requires 2-8 phone screenshots; found ${screenshots.length}`);

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
    .map((item) => item.language)
    .filter(Boolean);

  if (!languages.includes('es-ES')) languages = ['es-ES', ...languages];
  languages = [...new Set(languages)];

  for (const language of languages) {
    await androidpublisher.edits.listings.update({
      packageName: PACKAGE_NAME,
      editId,
      language,
      requestBody: {
        language,
        ...listing,
      },
    });
    console.log(`Updated listing text for ${language}`);

    await replaceImage(androidpublisher, editId, language, 'icon', ICON_PATH);
    await replaceImage(androidpublisher, editId, language, 'featureGraphic', FEATURE_GRAPHIC_PATH);

    await androidpublisher.edits.images.deleteall({
      packageName: PACKAGE_NAME,
      editId,
      language,
      imageType: 'phoneScreenshots',
    }).catch((error) => {
      const status = error.response?.status;
      if (status !== 404) throw error;
    });

    for (const screenshot of screenshots) {
      const mimeType = screenshot.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      const { data } = await androidpublisher.edits.images.upload({
        packageName: PACKAGE_NAME,
        editId,
        language,
        imageType: 'phoneScreenshots',
        media: {
          mimeType,
          body: fs.createReadStream(screenshot),
        },
      });
      console.log(`Uploaded ${path.basename(screenshot)} for ${language}: ${data.image?.url || 'ok'}`);
    }
  }

  const { data: commit } = await androidpublisher.edits.commit({
    packageName: PACKAGE_NAME,
    editId,
    changesNotSentForReview: true,
  });
  console.log(`Committed edit ${commit.id || editId}`);
}

main().catch((error) => {
  console.error(error.response?.data || error.message);
  process.exit(1);
});
