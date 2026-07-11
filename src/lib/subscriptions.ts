import { Capacitor } from '@capacitor/core';
import { INTRO_ELIGIBILITY_STATUS, LOG_LEVEL, Purchases } from '@revenuecat/purchases-capacitor';
import type { CustomerInfo, PurchasesPackage, PurchasesWinBackOffer } from '@revenuecat/purchases-capacitor';

export const PREMIUM_ENTITLEMENT = 'premium';

export type SubscriptionStatus = 'loading' | 'free' | 'trial' | 'premium' | 'expired' | 'unavailable';

export interface PaywallProduct {
    id: string;
    kind: 'annual' | 'monthly';
    title: string;
    price: string;
    monthlyEquivalent?: string;
    trialLabel?: string;
    trialEligible: boolean;
    priceValue: number;
    winBackOffer?: PurchasesWinBackOffer;
    winBackPrice?: string;
    winBackDiscountPercent?: number;
    winBackPeriodLabel?: string;
    revenueCatPackage: PurchasesPackage;
}

export interface SubscriptionSnapshot {
    status: SubscriptionStatus;
    isPremium: boolean;
    products: PaywallProduct[];
    managementURL: string | null;
    error?: string;
}

const EMPTY_SNAPSHOT: SubscriptionSnapshot = {
    status: 'unavailable',
    isPremium: false,
    products: [],
    managementURL: null,
};

let configured = false;

function getApiKey() {
    const platform = Capacitor.getPlatform();
    if (platform === 'ios') return process.env.NEXT_PUBLIC_REVENUECAT_IOS_API_KEY;
    if (platform === 'android') return process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY;
    return undefined;
}

function getEntitlement(customerInfo: CustomerInfo) {
    return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT];
}

function snapshotFromCustomer(customerInfo: CustomerInfo, products: PaywallProduct[] = []): SubscriptionSnapshot {
    const entitlement = getEntitlement(customerInfo);
    const previousEntitlement = customerInfo.entitlements.all[PREMIUM_ENTITLEMENT];
    const isPremium = Boolean(entitlement);
    const periodType = entitlement?.periodType;
    return {
        status: isPremium ? (periodType === 'TRIAL' ? 'trial' : 'premium') : previousEntitlement ? 'expired' : 'free',
        isPremium,
        products,
        managementURL: customerInfo.managementURL,
    };
}

function formatTrial(introPrice: PurchasesPackage['product']['introPrice']) {
    if (!introPrice || introPrice.price !== 0) return undefined;
    const units = introPrice.periodNumberOfUnits;
    const labels: Record<string, [string, string]> = {
        DAY: ['día', 'días'],
        WEEK: ['semana', 'semanas'],
        MONTH: ['mes', 'meses'],
        YEAR: ['año', 'años'],
    };
    const [one, many] = labels[introPrice.periodUnit] || ['periodo', 'periodos'];
    return `${units} ${units === 1 ? one : many} gratis`;
}

function formatWinBackPeriod(offer?: PurchasesWinBackOffer) {
    if (!offer) return undefined;
    if (offer.cycles === 1 && offer.periodUnit === 'YEAR' && offer.periodNumberOfUnits === 1) return 'durante el primer año';
    const totalUnits = offer.cycles * offer.periodNumberOfUnits;
    const labels: Record<string, [string, string]> = {
        DAY: ['día', 'días'], WEEK: ['semana', 'semanas'], MONTH: ['mes', 'meses'], YEAR: ['año', 'años'],
    };
    const [one, many] = labels[offer.periodUnit] || ['periodo', 'periodos'];
    return `durante ${totalUnits} ${totalUnits === 1 ? one : many}`;
}

async function loadProducts(packages: PurchasesPackage[]) {
    const supported = packages.filter((item) => item.packageType === 'ANNUAL' || item.packageType === 'MONTHLY');
    let eligibility: Record<string, { status: INTRO_ELIGIBILITY_STATUS }> = {};
    const winBackOffers = new Map<string, PurchasesWinBackOffer>();
    if (Capacitor.getPlatform() === 'ios' && supported.length) {
        try {
            eligibility = await Purchases.checkTrialOrIntroductoryPriceEligibility({
                productIdentifiers: supported.map((item) => item.product.identifier),
            });
        } catch {
            eligibility = {};
        }

        await Promise.all(supported.filter((item) => item.packageType === 'ANNUAL').map(async (item) => {
            try {
                const { eligibleWinBackOffers } = await Purchases.getEligibleWinBackOffersForPackage({ aPackage: item });
                const bestOffer = [...eligibleWinBackOffers].sort((a, b) => a.price - b.price)[0];
                if (bestOffer) winBackOffers.set(item.product.identifier, bestOffer);
            } catch {
                // Win-back offers require iOS 18+ and StoreKit 2. Regular products stay available otherwise.
            }
        }));
    }

    return supported.map<PaywallProduct>((item) => {
        const isAnnual = item.packageType === 'ANNUAL';
        const introStatus = eligibility[item.product.identifier]?.status;
        const trialEligible = Capacitor.getPlatform() === 'android'
            ? Boolean(item.product.defaultOption?.freePhase)
            : introStatus === INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE;
        const winBackOffer = winBackOffers.get(item.product.identifier);
        const winBackDiscountPercent = winBackOffer && item.product.price > 0
            ? Math.round((1 - (winBackOffer.price / item.product.price)) * 100)
            : undefined;
        return {
            id: item.product.identifier,
            kind: isAnnual ? 'annual' : 'monthly',
            title: isAnnual ? 'Anual' : 'Mensual',
            price: item.product.priceString,
            priceValue: item.product.price,
            monthlyEquivalent: isAnnual ? item.product.pricePerMonthString : undefined,
            trialLabel: trialEligible ? formatTrial(item.product.introPrice) || 'Prueba gratis disponible' : undefined,
            trialEligible,
            winBackOffer,
            winBackPrice: winBackOffer?.priceString,
            winBackDiscountPercent,
            winBackPeriodLabel: formatWinBackPeriod(winBackOffer),
            revenueCatPackage: item,
        };
    }).sort((a, b) => a.kind === 'annual' ? -1 : b.kind === 'annual' ? 1 : 0);
}

export async function initializeSubscriptions(): Promise<SubscriptionSnapshot> {
    if (!Capacitor.isNativePlatform()) return EMPTY_SNAPSHOT;
    const apiKey = getApiKey();
    if (!apiKey) return { ...EMPTY_SNAPSHOT, error: 'Falta configurar RevenueCat para esta plataforma.' };

    try {
        if (!configured) {
            if (process.env.NODE_ENV !== 'production') await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
            await Purchases.configure({ apiKey });
            configured = true;
        }
        const [{ customerInfo }, offerings] = await Promise.all([
            Purchases.getCustomerInfo(),
            Purchases.getOfferings(),
        ]);
        const packages = offerings.current?.availablePackages || [];
        return snapshotFromCustomer(customerInfo, await loadProducts(packages));
    } catch (error) {
        return { ...EMPTY_SNAPSHOT, error: error instanceof Error ? error.message : 'No se pudieron cargar las suscripciones.' };
    }
}

export async function purchaseProduct(product: PaywallProduct, useWinBackOffer = false): Promise<SubscriptionSnapshot> {
    const result = useWinBackOffer && product.winBackOffer
        ? await Purchases.purchasePackageWithWinBackOffer({
            aPackage: product.revenueCatPackage,
            winBackOffer: product.winBackOffer,
        })
        : await Purchases.purchasePackage({ aPackage: product.revenueCatPackage });
    if (!result) throw new Error('La App Store no pudo iniciar la compra. Vuelve a intentarlo.');
    const { customerInfo } = result;
    const snapshot = snapshotFromCustomer(customerInfo, [product]);
    if (!snapshot.isPremium) throw new Error('La compra no ha activado Premium. Prueba a restaurarla o vuelve a intentarlo.');
    return snapshot;
}

export async function restoreSubscriptions(): Promise<SubscriptionSnapshot> {
    const { customerInfo } = await Purchases.restorePurchases();
    return snapshotFromCustomer(customerInfo);
}

export async function attachSubscriptionUser(appUserID: string) {
    if (!configured) return null;
    const result = await Purchases.logIn({ appUserID });
    return snapshotFromCustomer(result.customerInfo);
}

export async function detachSubscriptionUser() {
    if (!configured) return null;
    const { customerInfo } = await Purchases.logOut();
    return snapshotFromCustomer(customerInfo);
}

export function isSubscriptionsConfigured() {
    return configured;
}
