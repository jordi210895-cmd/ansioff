export type PremiumFeature =
    | 'notes'
    | 'cbt'
    | 'act'
    | 'games'
    | 'night'
    | 'exposure'
    | 'progress'
    | 'custom_audio';

export const PREMIUM_SCREEN_FEATURES: Record<string, PremiumFeature> = {
    notes: 'notes',
    'sc-notes': 'notes',
    'sc-cbt': 'cbt',
    'sc-act': 'act',
    'sc-games': 'games',
    'sc-night': 'night',
    'sc-exposure-why': 'exposure',
    progress: 'progress',
    'sc-stats': 'progress',
};

export const FREE_ACTIONS_KEY = 'ansioff_free_actions_v1';
export const LAST_GENERAL_PAYWALL_KEY = 'ansioff_last_general_paywall_v1';
export const GENERAL_PAYWALL_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
export const RECOVERY_IMPRESSIONS_KEY = 'ansioff_recovery_impressions_v1';
export const RECOVERY_INTERVAL_MS = 14 * 24 * 60 * 60 * 1000;
export const MAX_RECOVERY_IMPRESSIONS = 3;

export function recordFreeAction() {
    if (typeof window === 'undefined') return 0;
    const next = Number(window.localStorage.getItem(FREE_ACTIONS_KEY) || 0) + 1;
    window.localStorage.setItem(FREE_ACTIONS_KEY, String(next));
    return next;
}

export function shouldShowGeneralPaywall(actionCount: number) {
    if (actionCount !== 3 && actionCount % 5 !== 0) return false;
    if (typeof window === 'undefined') return false;
    const lastShown = Number(window.localStorage.getItem(LAST_GENERAL_PAYWALL_KEY) || 0);
    return Date.now() - lastShown >= GENERAL_PAYWALL_INTERVAL_MS;
}

export function markGeneralPaywallShown() {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LAST_GENERAL_PAYWALL_KEY, String(Date.now()));
}

function getRecoveryImpressions() {
    if (typeof window === 'undefined') return [] as number[];
    try {
        const value = JSON.parse(window.localStorage.getItem(RECOVERY_IMPRESSIONS_KEY) || '[]');
        return Array.isArray(value) ? value.filter((item): item is number => typeof item === 'number' && Number.isFinite(item)) : [];
    } catch {
        return [] as number[];
    }
}

export function shouldShowRecoveryPaywall(now = Date.now()) {
    const impressions = getRecoveryImpressions();
    if (impressions.length >= MAX_RECOVERY_IMPRESSIONS) return false;
    const lastShown = impressions.at(-1);
    return lastShown === undefined || now - lastShown >= RECOVERY_INTERVAL_MS;
}

export function markRecoveryPaywallShown(now = Date.now()) {
    if (typeof window === 'undefined') return;
    const impressions = [...getRecoveryImpressions(), now].slice(0, MAX_RECOVERY_IMPRESSIONS);
    window.localStorage.setItem(RECOVERY_IMPRESSIONS_KEY, JSON.stringify(impressions));
}
