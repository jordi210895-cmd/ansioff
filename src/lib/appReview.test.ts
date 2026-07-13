import { beforeEach, describe, expect, it } from 'vitest';
import {
    recordReviewEntry, recordReviewRequestAttempt, resetReviewEntryCycle, REVIEW_ENTRY_COUNT_KEY,
    REVIEW_LAST_REQUESTED_COUNT_KEY, shouldRequestReview,
} from './appReview';

class MemoryStorage {
    private values = new Map<string, string>();
    getItem(key: string) { return this.values.get(key) ?? null; }
    setItem(key: string, value: string) { this.values.set(key, String(value)); }
    clear() { this.values.clear(); }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, 'window', { value: { localStorage: storage }, configurable: true });

describe('native app review cadence', () => {
    beforeEach(() => {
        storage.clear();
        resetReviewEntryCycle();
    });

    it('requests the native review prompt every third app entry', () => {
        expect(recordReviewEntry()).toEqual({ entryCount: 1, due: false });
        expect(recordReviewEntry()).toEqual({ entryCount: 2, due: false });
        expect(recordReviewEntry()).toEqual({ entryCount: 3, due: true });
    });

    it('does not request twice for the same counted entry', () => {
        storage.setItem(REVIEW_ENTRY_COUNT_KEY, '2');
        storage.setItem(REVIEW_LAST_REQUESTED_COUNT_KEY, '3');

        expect(recordReviewEntry()).toEqual({ entryCount: 3, due: false });
    });

    it('continues the cadence after a skipped prompt window', () => {
        expect(shouldRequestReview(3, 0)).toBe(true);
        expect(shouldRequestReview(4, 3)).toBe(false);
        expect(shouldRequestReview(6, 3)).toBe(true);
    });

    it('only consumes a review attempt when the native flow could be requested', () => {
        recordReviewRequestAttempt(3, false);
        expect(storage.getItem(REVIEW_LAST_REQUESTED_COUNT_KEY)).toBeNull();

        recordReviewRequestAttempt(3, true);
        expect(storage.getItem(REVIEW_LAST_REQUESTED_COUNT_KEY)).toBe('3');
    });
});
