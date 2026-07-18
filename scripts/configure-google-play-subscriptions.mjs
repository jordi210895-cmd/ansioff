import { google } from 'googleapis';

const PACKAGE_NAME = 'com.ansioff.app';
const SCOPE = 'https://www.googleapis.com/auth/androidpublisher';
const API_ROOT = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}`;

const PRODUCTS = [
  {
    productId: 'com.ansioff.premium.monthly',
    basePlanId: 'monthly',
    title: 'ANSIOFF Premium mensual',
    titleEn: 'ANSIOFF Premium monthly',
    description: 'Acceso mensual a ANSIOFF Premium con 7 días de prueba.',
    descriptionEn: 'Monthly access to ANSIOFF Premium with a 7-day free trial.',
    billingPeriodDuration: 'P1M',
    eurPrice: '8.99',
    usdPrice: '8.99',
  },
  {
    productId: 'com.ansioff.premium.annual',
    basePlanId: 'annual',
    title: 'ANSIOFF Premium anual',
    titleEn: 'ANSIOFF Premium annual',
    description: 'Acceso anual a ANSIOFF Premium con 7 días de prueba.',
    descriptionEn: 'Annual access to ANSIOFF Premium with a 7-day free trial.',
    billingPeriodDuration: 'P1Y',
    eurPrice: '59.99',
    usdPrice: '59.99',
  },
];

function requireCredentials() {
  const raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Missing GOOGLE_PLAY_SERVICE_ACCOUNT_JSON');
  return JSON.parse(raw);
}

function money(currencyCode, amount) {
  const [unitsPart, decimalsPart = ''] = amount.split('.');
  const nanos = Number(decimalsPart.padEnd(9, '0').slice(0, 9));
  return { currencyCode, units: unitsPart, nanos };
}

function query(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : '';
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    credentials: requireCredentials(),
    scopes: [SCOPE],
  });
  const client = await auth.getClient();

  async function request(method, path, data, params = {}) {
    const url = `${API_ROOT}${path}${query(params)}`;
    try {
      const response = await client.request({ method, url, data });
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const body = error.response?.data;
      const message = body?.error?.message || error.message;
      const details = body ? ` ${JSON.stringify(body)}` : '';
      throw new Error(`${method} ${path} failed${status ? ` (${status})` : ''}: ${message}${details}`);
    }
  }

  async function convertPrices(eurPrice, usdPrice) {
    const converted = await request('POST', '/pricing:convertRegionPrices', {
      price: money('EUR', eurPrice),
    });
    const regionalConfigs = Object.entries(converted.convertedRegionPrices || {}).map(([regionCode, item]) => {
      const price = regionCode === 'US' ? money('USD', usdPrice) : item.price;
      return {
        regionCode,
        newSubscriberAvailability: true,
        price,
      };
    });
    const regionCodes = regionalConfigs.map((item) => item.regionCode);
    const otherRegionsConfig = {
      ...(converted.convertedOtherRegionsPrice || {}),
      newSubscriberAvailability: true,
    };
    return {
      regionalConfigs,
      regionCodes,
      otherRegionsConfig,
      regionVersion: converted.regionVersion || { version: '2022/01' },
    };
  }

  async function getSubscription(productId) {
    try {
      return await request('GET', `/subscriptions/${encodeURIComponent(productId)}`);
    } catch (error) {
      if (String(error.message).includes('(404)')) return null;
      throw error;
    }
  }

  async function upsertSubscription(product) {
    const prices = await convertPrices(product.eurPrice, product.usdPrice);
    const subscription = {
      packageName: PACKAGE_NAME,
      productId: product.productId,
      listings: [
        {
          languageCode: 'es-ES',
          title: product.title,
          benefits: [
            'Herramientas inmediatas',
            'Diario y reflexión IA',
            'Pausas, diario y rutinas',
            'Constancia flexible',
          ],
          description: product.description,
        },
        {
          languageCode: 'en-US',
          title: product.titleEn,
          benefits: [
            'Immediate tools',
            'AI journal reflection',
            'Breathing and self-care',
            'Flexible consistency',
          ],
          description: product.descriptionEn,
        },
      ],
      basePlans: [
        {
          basePlanId: product.basePlanId,
          regionalConfigs: prices.regionalConfigs,
          otherRegionsConfig: prices.otherRegionsConfig,
          autoRenewingBasePlanType: {
            billingPeriodDuration: product.billingPeriodDuration,
            gracePeriodDuration: 'P7D',
            resubscribeState: 'RESUBSCRIBE_STATE_ACTIVE',
            prorationMode: 'SUBSCRIPTION_PRORATION_MODE_CHARGE_ON_NEXT_BILLING_DATE',
          },
        },
      ],
    };

    const existing = await getSubscription(product.productId);
    if (existing) {
      await request(
        'PATCH',
        `/subscriptions/${encodeURIComponent(product.productId)}`,
        subscription,
        {
          updateMask: 'listings,basePlans',
          'regionsVersion.version': prices.regionVersion.version,
          latencyTolerance: 'PRODUCT_UPDATE_LATENCY_TOLERANCE_LATENCY_TOLERANT',
        },
      );
      console.log(`Updated subscription ${product.productId}`);
    } else {
      await request(
        'POST',
        '/subscriptions',
        subscription,
        {
          productId: product.productId,
          'regionsVersion.version': prices.regionVersion.version,
        },
      );
      console.log(`Created subscription ${product.productId}`);
    }

    return prices;
  }

  async function createTrialOffer(product, prices) {
    const offerId = 'trial-7-days';
    const path = `/subscriptions/${encodeURIComponent(product.productId)}/basePlans/${encodeURIComponent(product.basePlanId)}/offers`;
    const offer = {
      packageName: PACKAGE_NAME,
      productId: product.productId,
      basePlanId: product.basePlanId,
      offerId,
      phases: [
        {
          recurrenceCount: 1,
          duration: 'P7D',
          regionalConfigs: prices.regionCodes.map((regionCode) => ({ regionCode, free: {} })),
          otherRegionsConfig: { free: {} },
        },
      ],
      regionalConfigs: prices.regionCodes.map((regionCode) => ({
        regionCode,
        newSubscriberAvailability: true,
      })),
      otherRegionsConfig: {
        otherRegionsNewSubscriberAvailability: true,
      },
      targeting: {
        acquisitionRule: {
          scope: {
            thisSubscription: {},
          },
        },
      },
    };

    try {
      await request('POST', path, offer, {
        offerId,
        'regionsVersion.version': prices.regionVersion.version,
      });
      console.log(`Created trial offer ${product.productId}:${product.basePlanId}:${offerId}`);
    } catch (error) {
      if (!String(error.message).includes('(409)')) throw error;
      await request('PATCH', `${path}/${offerId}`, offer, {
        updateMask: 'phases,targeting,regionalConfigs,otherRegionsConfig',
        'regionsVersion.version': prices.regionVersion.version,
        latencyTolerance: 'PRODUCT_UPDATE_LATENCY_TOLERANCE_LATENCY_TOLERANT',
      });
      console.log(`Updated trial offer ${product.productId}:${product.basePlanId}:${offerId}`);
    }

    await request('POST', `${path}/${offerId}:activate`, {
      packageName: PACKAGE_NAME,
      productId: product.productId,
      basePlanId: product.basePlanId,
      offerId,
      latencyTolerance: 'PRODUCT_UPDATE_LATENCY_TOLERANCE_LATENCY_TOLERANT',
    });
    console.log(`Activated trial offer ${product.productId}:${product.basePlanId}:${offerId}`);
  }

  async function activateBasePlan(product) {
    await request('POST', `/subscriptions/${encodeURIComponent(product.productId)}/basePlans/${encodeURIComponent(product.basePlanId)}:activate`, {
      packageName: PACKAGE_NAME,
      productId: product.productId,
      basePlanId: product.basePlanId,
      latencyTolerance: 'PRODUCT_UPDATE_LATENCY_TOLERANCE_LATENCY_TOLERANT',
    });
    console.log(`Activated base plan ${product.productId}:${product.basePlanId}`);
  }

  for (const product of PRODUCTS) {
    const prices = await upsertSubscription(product);
    await activateBasePlan(product);
    await createTrialOffer(product, prices);
  }

  const result = await request('GET', '/subscriptions');
  console.log(JSON.stringify({
    configured: PRODUCTS.map(({ productId, basePlanId }) => `${productId}:${basePlanId}`),
    subscriptionCount: result.subscriptions?.length || 0,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
