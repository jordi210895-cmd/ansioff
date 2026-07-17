import crypto from 'node:crypto';

const KEY_ID = process.env.APP_STORE_CONNECT_API_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_API_KEY_ISSUER_ID;
const KEY_BASE64 = process.env.APP_STORE_CONNECT_API_KEY_BASE64 || process.env.APP_STORE_CONNECT_API_KEY;
const BUNDLE_ID = process.env.APP_STORE_BUNDLE_ID || 'com.ansioff.app.jordi';
const APPLY = String(process.env.APPLY_APPLE_SUBSCRIPTION_PRICES || '').toLowerCase() === 'true';
const START_DATE = process.env.APPLE_PRICE_START_DATE || new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Madrid',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const TARGETS = [
  { productId: 'com.ansioff.premium.monthly', eur: 8.99, usd: 8.99 },
  { productId: 'com.ansioff.premium.annual', eur: 59.99, usd: 59.99 },
];

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

async function request(method, path, body, attempt = 0) {
  const url = path.startsWith('https://')
    ? path
    : `https://api.appstoreconnect.apple.com${path}`;
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (response.status === 429 && attempt < 5) {
    const retryAfter = Number(response.headers.get('retry-after') || 2);
    await new Promise((resolve) => setTimeout(resolve, Math.max(1, retryAfter) * 1000));
    return request(method, path, body, attempt + 1);
  }

  if (!response.ok) {
    const message = typeof parsed === 'object' ? JSON.stringify(parsed) : String(parsed);
    throw new Error(`${response.status} ${response.statusText} for ${method} ${path}: ${message}`);
  }

  return parsed;
}

async function requestAll(path) {
  const data = [];
  const included = [];
  let next = path;

  while (next) {
    const result = await request('GET', next);
    data.push(...(result.data || []));
    included.push(...(result.included || []));
    next = result.links?.next || null;
  }

  return { data, included };
}

async function findSubscriptions() {
  const apps = await request('GET', `/v1/apps?filter[bundleId]=${encodeURIComponent(BUNDLE_ID)}`);
  const app = apps.data?.[0];
  if (!app) throw new Error(`App not found for ${BUNDLE_ID}`);

  const groups = await request('GET', `/v1/apps/${app.id}/subscriptionGroups?limit=200`);
  const subscriptions = [];
  for (const group of groups.data || []) {
    const result = await request('GET', `/v1/subscriptionGroups/${group.id}/subscriptions?limit=200`);
    subscriptions.push(...(result.data || []));
  }
  return subscriptions;
}

async function findPricePoint(subscriptionId, territory, customerPrice) {
  const result = await requestAll(
    `/v1/subscriptions/${subscriptionId}/pricePoints?filter[territory]=${territory}&include=territory&limit=200`,
  );
  const point = (result.data || []).find(
    (item) => Math.abs(Number(item.attributes?.customerPrice) - customerPrice) < 0.001,
  );
  if (!point) {
    const available = (result.data || []).map((item) => item.attributes?.customerPrice).filter(Boolean);
    throw new Error(`No ${territory} price point ${customerPrice} for subscription ${subscriptionId}. Available sample: ${available.slice(0, 20).join(', ')}`);
  }
  return point;
}

async function equalizedPricePoints(pricePointId) {
  const result = await request(
    'GET',
    `/v1/subscriptionPricePoints/${encodeURIComponent(pricePointId)}/equalizations?include=territory&limit=200`,
  );
  return result.data || [];
}

async function configuredPrices(subscriptionId, territory) {
  const result = await request(
    'GET',
    `/v1/subscriptions/${subscriptionId}/prices?filter[territory]=${territory}&include=subscriptionPricePoint,territory&limit=200`,
  );
  const points = new Map(
    (result.included || [])
      .filter((item) => item.type === 'subscriptionPricePoints')
      .map((item) => [item.id, item]),
  );
  return (result.data || []).map((price) => {
    const pointId = price.relationships?.subscriptionPricePoint?.data?.id;
    return {
      startDate: price.attributes?.startDate || null,
      preserved: Boolean(price.attributes?.preserved),
      customerPrice: points.get(pointId)?.attributes?.customerPrice || null,
    };
  });
}

async function createPrice(subscriptionId, pricePointId) {
  return request('POST', '/v1/subscriptionPrices', {
    data: {
      type: 'subscriptionPrices',
      attributes: {
        startDate: START_DATE,
        preserveCurrentPrice: false,
      },
      relationships: {
        subscription: {
          data: { type: 'subscriptions', id: subscriptionId },
        },
        subscriptionPricePoint: {
          data: { type: 'subscriptionPricePoints', id: pricePointId },
        },
      },
    },
  });
}

async function applyInBatches(entries, subscriptionId) {
  const batchSize = 6;
  for (let offset = 0; offset < entries.length; offset += batchSize) {
    const batch = entries.slice(offset, offset + batchSize);
    await Promise.all(batch.map(([, pricePoint]) => createPrice(subscriptionId, pricePoint.id)));
    console.log(`Applied ${Math.min(offset + batch.length, entries.length)}/${entries.length} territory prices`);
  }
}

const subscriptions = await findSubscriptions();
const summary = [];

for (const target of TARGETS) {
  const subscription = subscriptions.find((item) => item.attributes?.productId === target.productId);
  if (!subscription) throw new Error(`Subscription ${target.productId} not found`);

  const espPoint = await findPricePoint(subscription.id, 'ESP', target.eur);
  const usaPoint = await findPricePoint(subscription.id, 'USA', target.usd);
  const equalizations = await equalizedPricePoints(espPoint.id);
  const territoryPoints = new Map();

  for (const point of equalizations) {
    const territory = point.relationships?.territory?.data?.id;
    if (territory) territoryPoints.set(territory, point);
  }
  territoryPoints.set('ESP', espPoint);
  territoryPoints.set('USA', usaPoint);

  const before = {
    ESP: await configuredPrices(subscription.id, 'ESP'),
    USA: await configuredPrices(subscription.id, 'USA'),
  };

  console.log(JSON.stringify({
    productId: target.productId,
    subscriptionId: subscription.id,
    target: { EUR: target.eur, USD: target.usd },
    territoryCount: territoryPoints.size,
    startDate: START_DATE,
    apply: APPLY,
    before,
  }, null, 2));

  const explicitTargets = [
    ['ESP', espPoint, target.eur],
    ['USA', usaPoint, target.usd],
  ];
  const changes = explicitTargets.filter(([territory, , desiredPrice]) => (
    !(before[territory] || []).some(
      (price) => Math.abs(Number(price.customerPrice) - desiredPrice) < 0.001,
    )
  ));

  console.log(JSON.stringify({
    productId: target.productId,
    explicitChanges: changes.map(([territory, , customerPrice]) => ({ territory, customerPrice })),
  }, null, 2));

  if (APPLY && changes.length > 0) {
    await applyInBatches(changes.map(([territory, point]) => [territory, point]), subscription.id);
  }

  const after = APPLY ? {
    ESP: await configuredPrices(subscription.id, 'ESP'),
    USA: await configuredPrices(subscription.id, 'USA'),
  } : undefined;

  summary.push({
    productId: target.productId,
    territoryCount: territoryPoints.size,
    before,
    after,
  });
}

console.log('APPLE_SUBSCRIPTION_PRICE_SUMMARY');
console.log(JSON.stringify({ apply: APPLY, startDate: START_DATE, subscriptions: summary }, null, 2));
