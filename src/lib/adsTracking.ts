'use client';

import { Capacitor } from '@capacitor/core';
import type { PaywallProduct, SubscriptionSnapshot } from '@/lib/subscriptions';

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
        fbq?: MetaPixelFunction;
        _fbq?: Window['fbq'];
    }
}

type MetaPixelFunction = ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue?: unknown[];
    loaded?: boolean;
    version?: string;
};

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-18311870973';
const GOOGLE_ADS_PURCHASE_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL || 'm1EWCN-z4s0cEP3z45tE';
const GOOGLE_ADS_TRIAL_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_TRIAL_LABEL || GOOGLE_ADS_PURCHASE_LABEL;
const GOOGLE_ADS_REGISTRATION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_REGISTRATION_LABEL;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TRACK_META_STORE_PURCHASES = process.env.NEXT_PUBLIC_META_CLIENT_PURCHASE_EVENTS === 'true';

let googleTagPromise: Promise<void> | null = null;
let metaPixelPromise: Promise<void> | null = null;

type TrackStorePurchaseOptions = {
    product: PaywallProduct;
    subscription: SubscriptionSnapshot;
    placement?: string | null;
};

type TrackRegistrationOptions = {
    method?: string;
};

function loadScript(id: string, src: string) {
    if (typeof document === 'undefined') return Promise.resolve();
    const existing = document.getElementById(id);
    if (existing) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.id = id;
        script.async = true;
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
        document.head.appendChild(script);
    });
}

function ensureGoogleTag() {
    if (typeof window === 'undefined' || !GOOGLE_ADS_ID) return Promise.resolve();
    if (!googleTagPromise) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function gtag() {
            window.dataLayer?.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', GOOGLE_ADS_ID);
        googleTagPromise = loadScript('ansioff-google-ads-tag', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ADS_ID)}`)
            .catch((error) => {
                console.warn('Google Ads tag skipped:', error);
            });
    }
    return googleTagPromise;
}

function ensureMetaPixel() {
    if (typeof window === 'undefined' || !META_PIXEL_ID) return Promise.resolve();
    if (!metaPixelPromise) {
        if (!window.fbq) {
            const fbq: MetaPixelFunction = function fbq(...args: unknown[]) {
                if (window.fbq?.callMethod) window.fbq.callMethod(...args);
                else window.fbq?.queue?.push(args);
            };
            fbq.queue = [];
            fbq.loaded = true;
            fbq.version = '2.0';
            window.fbq = fbq;
            window._fbq = fbq;
        }
        window.fbq('init', META_PIXEL_ID);
        metaPixelPromise = loadScript('ansioff-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js')
            .catch((error) => {
                console.warn('Meta Pixel skipped:', error);
            });
    }
    return metaPixelPromise;
}

function makeEventId(prefix: string, productId?: string) {
    const safeProduct = productId?.replace(/[^a-z0-9_.-]/gi, '_') || 'event';
    const random = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return `ansioff_${prefix}_${safeProduct}_${random}`;
}

function inferCurrency(product: PaywallProduct) {
    if (product.price.includes('€')) return 'EUR';
    return 'EUR';
}

function conversionLabelFor(subscription: SubscriptionSnapshot) {
    return subscription.status === 'trial' ? GOOGLE_ADS_TRIAL_LABEL : GOOGLE_ADS_PURCHASE_LABEL;
}

export async function trackStorePurchaseConversion({ product, subscription, placement }: TrackStorePurchaseOptions) {
    if (typeof window === 'undefined' || !subscription.isPremium) return;

    const currency = inferCurrency(product);
    const isTrialStart = subscription.status === 'trial';
    const value = isTrialStart ? 0 : Number(product.priceValue || 0);
    const eventId = makeEventId(isTrialStart ? 'start_trial' : 'subscribe', product.id);
    const platform = Capacitor.getPlatform();
    const conversionLabel = conversionLabelFor(subscription);

    if (GOOGLE_ADS_ID && conversionLabel) {
        await ensureGoogleTag();
        window.gtag?.('event', 'conversion', {
            send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
            value,
            currency,
            transaction_id: eventId,
            new_customer: placement === 'onboarding' || placement === 'trialExpired',
            platform,
            product_id: product.id,
            plan: product.kind,
        });
    }

    // Purchase/trial events are deliberately opt-in for Meta on the client.
    // RevenueCat/webhook server events are the safer default for store purchases because they work after renewals too.
    if (META_PIXEL_ID && TRACK_META_STORE_PURCHASES) {
        await ensureMetaPixel();
        window.fbq?.('track', isTrialStart ? 'StartTrial' : 'Subscribe', {
            value,
            currency,
            content_ids: [product.id],
            content_type: 'product',
            platform,
            plan: product.kind,
        }, { eventID: eventId });
    }
}

export async function trackCompleteRegistration({ method = 'email' }: TrackRegistrationOptions = {}) {
    if (typeof window === 'undefined') return;
    const eventId = makeEventId('complete_registration');
    const platform = Capacitor.getPlatform();

    if (GOOGLE_ADS_ID && GOOGLE_ADS_REGISTRATION_LABEL) {
        await ensureGoogleTag();
        window.gtag?.('event', 'conversion', {
            send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_REGISTRATION_LABEL}`,
            value: 0,
            currency: 'EUR',
            transaction_id: eventId,
            platform,
            method,
        });
    }

    if (META_PIXEL_ID) {
        await ensureMetaPixel();
        window.fbq?.('track', 'CompleteRegistration', {
            value: 0,
            currency: 'EUR',
            platform,
            method,
        }, { eventID: eventId });
    }
}
