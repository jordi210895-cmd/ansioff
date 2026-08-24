import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type RevenueCatAttribute = string | number | boolean | null | { value?: unknown; Value?: unknown };

type RevenueCatEvent = {
    id?: string;
    type?: string;
    app_user_id?: string;
    aliases?: string[];
    product_id?: string;
    entitlement_id?: string;
    period_type?: string;
    purchased_at_ms?: number;
    event_timestamp_ms?: number;
    expiration_at_ms?: number;
    price?: number;
    price_in_purchased_currency?: number;
    currency?: string;
    store?: string;
    country_code?: string;
    is_trial_conversion?: boolean;
    transaction_id?: string;
    original_transaction_id?: string;
    subscriber_attributes?: Record<string, RevenueCatAttribute>;
};

type RevenueCatWebhookBody = {
    event?: RevenueCatEvent;
    api_version?: string;
};

type ConversionMapping = {
    metaEventName: 'StartTrial' | 'Subscribe' | 'Purchase';
    ga4EventName: 'start_trial' | 'subscribe' | 'purchase';
    value: number;
};

const META_GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || 'v25.0';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ansioff.com';

function hash(value?: string | null) {
    const normalized = value?.trim().toLowerCase();
    if (!normalized) return undefined;
    return createHash('sha256').update(normalized).digest('hex');
}

function getAttribute(attributes: Record<string, RevenueCatAttribute> | undefined, keys: string[]) {
    if (!attributes) return undefined;
    for (const key of keys) {
        const raw = attributes[key];
        if (raw == null) continue;
        if (typeof raw === 'object' && ('value' in raw || 'Value' in raw)) {
            const value = raw.value ?? raw.Value;
            if (typeof value === 'string' && value.trim()) return value.trim();
            if (typeof value === 'number' || typeof value === 'boolean') return String(value);
            continue;
        }
        if (typeof raw === 'string' && raw.trim()) return raw.trim();
        if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw);
    }
    return undefined;
}

function getEventTime(event: RevenueCatEvent) {
    const timestamp = event.event_timestamp_ms || event.purchased_at_ms || Date.now();
    return Math.floor(timestamp / 1000);
}

function getEventId(event: RevenueCatEvent, mapping: ConversionMapping) {
    return [
        'revenuecat',
        mapping.ga4EventName,
        event.id || event.transaction_id || event.original_transaction_id || event.product_id || 'event',
    ].join('_');
}

function getEventValue(event: RevenueCatEvent) {
    return Number(event.price_in_purchased_currency ?? event.price ?? 0) || 0;
}

function mapRevenueCatEvent(event: RevenueCatEvent): ConversionMapping | null {
    const type = event.type?.toUpperCase();
    const periodType = event.period_type?.toUpperCase();
    const value = getEventValue(event);

    if (type === 'INITIAL_PURCHASE' && periodType === 'TRIAL') {
        return { metaEventName: 'StartTrial', ga4EventName: 'start_trial', value: 0 };
    }

    if (type === 'INITIAL_PURCHASE') {
        return { metaEventName: 'Subscribe', ga4EventName: 'subscribe', value };
    }

    if (type === 'RENEWAL' && event.is_trial_conversion) {
        return { metaEventName: 'Subscribe', ga4EventName: 'subscribe', value };
    }

    if (type === 'RENEWAL' || type === 'NON_RENEWING_PURCHASE') {
        return { metaEventName: 'Purchase', ga4EventName: 'purchase', value };
    }

    return null;
}

function revenueCatAuthMatches(req: NextRequest) {
    const expected = process.env.REVENUECAT_WEBHOOK_AUTH_TOKEN;
    if (!expected) return true;
    const authorization = req.headers.get('authorization') || '';
    const tokenHeader = req.headers.get('x-revenuecat-webhook-token') || '';
    return authorization === `Bearer ${expected}` || tokenHeader === expected;
}

async function sendMetaEvent(event: RevenueCatEvent, mapping: ConversionMapping) {
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    if (!pixelId || !accessToken) return { sent: false, reason: 'missing_meta_credentials' };

    const attributes = event.subscriber_attributes;
    const email = getAttribute(attributes, ['$email', 'email', 'Email']);
    const phone = getAttribute(attributes, ['$phoneNumber', 'phoneNumber', 'phone', 'Phone']);
    const fbp = getAttribute(attributes, ['$fbp', 'fbp']);
    const fbc = getAttribute(attributes, ['$fbc', 'fbc']);
    const fbLoginId = getAttribute(attributes, ['$fbLoginId', 'fbLoginId']);
    const fbAnonymousId = getAttribute(attributes, ['$fbAnonId', '$fbAnonymousId', 'fbAnonymousID', 'fbAnonymousId']);

    const eventId = getEventId(event, mapping);
    const userData: Record<string, string | string[]> = {};
    const hashedEmail = hash(email);
    const hashedPhone = hash(phone);
    const hashedExternalId = hash(event.app_user_id);
    if (hashedEmail) userData.em = [hashedEmail];
    if (hashedPhone) userData.ph = [hashedPhone];
    if (hashedExternalId) userData.external_id = [hashedExternalId];
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;
    if (fbLoginId) userData.fb_login_id = fbLoginId;
    if (fbAnonymousId) userData.anon_id = fbAnonymousId;

    const payload: Record<string, unknown> = {
        data: [{
            event_name: mapping.metaEventName,
            event_time: getEventTime(event),
            event_id: eventId,
            action_source: 'app',
            event_source_url: APP_URL,
            user_data: userData,
            custom_data: {
                value: mapping.value,
                currency: event.currency || 'EUR',
                content_ids: event.product_id ? [event.product_id] : undefined,
                content_type: 'product',
                predicted_ltv: event.product_id?.includes('annual') ? 59.99 : 4.99,
                subscription_event_type: event.type,
                period_type: event.period_type,
                store: event.store,
                country: event.country_code,
            },
        }],
    };

    if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

    const response = await fetch(`https://graph.facebook.com/${META_GRAPH_VERSION}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Meta CAPI failed (${response.status}): ${text.slice(0, 400)}`);
    }

    return { sent: true, eventId, eventName: mapping.metaEventName };
}

async function sendGa4Event(event: RevenueCatEvent, mapping: ConversionMapping) {
    const apiSecret = process.env.GA4_API_SECRET;
    const measurementId = process.env.GA4_MEASUREMENT_ID;
    const firebaseAppId = process.env.GA4_FIREBASE_APP_ID;

    const attributes = event.subscriber_attributes;
    const firebaseAppInstanceId = getAttribute(attributes, ['$firebaseAppInstanceId', 'firebaseAppInstanceID', 'firebaseAppInstanceId']);
    const useFirebaseStream = Boolean(firebaseAppId && firebaseAppInstanceId);
    if (!apiSecret || (!measurementId && !useFirebaseStream)) return { sent: false, reason: 'missing_ga4_credentials' };

    const clientId = getAttribute(attributes, ['ga_client_id', '$gaClientId']) || event.app_user_id || event.id || 'ansioff-revenuecat';
    const query = useFirebaseStream
        ? `firebase_app_id=${encodeURIComponent(firebaseAppId)}&api_secret=${encodeURIComponent(apiSecret)}`
        : `measurement_id=${encodeURIComponent(measurementId!)}&api_secret=${encodeURIComponent(apiSecret)}`;

    const body: Record<string, unknown> = {
        timestamp_micros: String((event.event_timestamp_ms || event.purchased_at_ms || Date.now()) * 1000),
        user_id: event.app_user_id,
        non_personalized_ads: false,
        events: [{
            name: mapping.ga4EventName,
            params: {
                transaction_id: getEventId(event, mapping),
                currency: event.currency || 'EUR',
                value: mapping.value,
                item_id: event.product_id,
                item_name: event.product_id,
                entitlement_id: event.entitlement_id,
                subscription_event_type: event.type,
                period_type: event.period_type,
                store: event.store,
            },
        }],
    };

    if (useFirebaseStream) body.app_instance_id = firebaseAppInstanceId;
    else body.client_id = clientId;

    const response = await fetch(`https://www.google-analytics.com/mp/collect?${query}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`GA4 Measurement Protocol failed (${response.status}): ${text.slice(0, 400)}`);
    }

    return { sent: true, eventName: mapping.ga4EventName };
}

export async function POST(req: NextRequest) {
    if (!revenueCatAuthMatches(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: RevenueCatWebhookBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const event = body.event;
    if (!event) return NextResponse.json({ error: 'Missing RevenueCat event' }, { status: 400 });

    const mapping = mapRevenueCatEvent(event);
    if (!mapping) {
        return NextResponse.json({ received: true, skipped: true, eventType: event.type });
    }

    const [meta, ga4] = await Promise.allSettled([
        sendMetaEvent(event, mapping),
        sendGa4Event(event, mapping),
    ]);

    const metaResult = meta.status === 'fulfilled' ? meta.value : { sent: false, error: meta.reason instanceof Error ? meta.reason.message : 'Meta CAPI failed' };
    const ga4Result = ga4.status === 'fulfilled' ? ga4.value : { sent: false, error: ga4.reason instanceof Error ? ga4.reason.message : 'GA4 Measurement Protocol failed' };

    return NextResponse.json({
        received: true,
        eventType: event.type,
        conversion: mapping,
        forwarded: {
            meta: metaResult,
            ga4: ga4Result,
        },
    });
}
