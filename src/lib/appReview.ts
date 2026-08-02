import { App, type AppState } from '@capacitor/app';
import { Capacitor, registerPlugin, type PluginListenerHandle } from '@capacitor/core';

export const REVIEW_ENTRY_INTERVAL = 3;
export const REVIEW_ENTRY_COUNT_KEY = 'ansioff_native_review_entry_count_v1';
export const REVIEW_LAST_REQUESTED_COUNT_KEY = 'ansioff_native_review_last_requested_count_v1';

interface NativeAppReviewPlugin {
    requestReview(): Promise<{ requested: boolean; reason?: string }>;
}

const NativeAppReview = registerPlugin<NativeAppReviewPlugin>('AppReview');

let countedInCurrentActiveEntry = false;
let requestInFlight = false;

const getStorage = () => {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
};

const readNumber = (key: string) => {
    const storage = getStorage();
    if (!storage) return 0;
    const value = Number(storage.getItem(key) || 0);
    return Number.isFinite(value) ? value : 0;
};

const writeNumber = (key: string, value: number) => {
    getStorage()?.setItem(key, String(value));
};

export const shouldRequestReview = (entryCount: number, lastRequestedCount: number) => (
    entryCount > 0
    && entryCount % REVIEW_ENTRY_INTERVAL === 0
    && lastRequestedCount !== entryCount
);

export const recordReviewEntry = () => {
    const entryCount = readNumber(REVIEW_ENTRY_COUNT_KEY) + 1;
    const lastRequestedCount = readNumber(REVIEW_LAST_REQUESTED_COUNT_KEY);
    writeNumber(REVIEW_ENTRY_COUNT_KEY, entryCount);

    return {
        entryCount,
        due: shouldRequestReview(entryCount, lastRequestedCount),
    };
};

export const recordReviewRequestAttempt = (entryCount: number, requested: boolean) => {
    if (requested) writeNumber(REVIEW_LAST_REQUESTED_COUNT_KEY, entryCount);
};

export const resetReviewEntryCycle = () => {
    countedInCurrentActiveEntry = false;
};

export const requestNativeReviewIfDue = async () => {
    if (!Capacitor.isNativePlatform() || requestInFlight || countedInCurrentActiveEntry) return null;

    countedInCurrentActiveEntry = true;
    const reviewEntry = recordReviewEntry();
    if (!reviewEntry.due) return reviewEntry;

    requestInFlight = true;

    try {
        const result = await NativeAppReview.requestReview();
        recordReviewRequestAttempt(reviewEntry.entryCount, Boolean(result.requested));
        return { ...reviewEntry, requested: Boolean(result.requested), reason: result.reason };
    } finally {
        requestInFlight = false;
    }
};

export const registerNativeReviewResumeListener = async (onActiveEntry: () => void): Promise<PluginListenerHandle | null> => {
    if (!Capacitor.isNativePlatform()) return null;

    return App.addListener('appStateChange', (state: AppState) => {
        if (!state.isActive) {
            resetReviewEntryCycle();
            return;
        }
        onActiveEntry();
    });
};
