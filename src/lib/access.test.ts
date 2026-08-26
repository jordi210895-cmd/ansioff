import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    ACCOUNT_TRIAL_DURATION_MS, GENERAL_PAYWALL_INTERVAL_MS, getAccountTrialStatus,
    markGeneralPaywallShown, markRecoveryPaywallShown, markTrialExpiredPaywallDismissed,
    MAX_RECOVERY_IMPRESSIONS, PREMIUM_SCREEN_FEATURES, recordFreeAction,
    RECOVERY_INTERVAL_MS, shouldShowGeneralPaywall, shouldShowRecoveryPaywall,
    shouldShowTrialExpiredPaywall, startAccountTrial,
} from './access';

class MemoryStorage {
    private values = new Map<string, string>();
    getItem(key: string) { return this.values.get(key) ?? null; }
    setItem(key: string, value: string) { this.values.set(key, String(value)); }
    clear() { this.values.clear(); }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, 'window', { value: { localStorage: storage }, configurable: true });

describe('premium access and commercial cadence', () => {
    beforeEach(() => {
        storage.clear();
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-07-10T12:00:00Z'));
    });

    it('keeps only the agreed post-trial tools outside the premium gate', () => {
        expect(PREMIUM_SCREEN_FEATURES['sc-my-therapy']).toBe('therapy');
        expect(PREMIUM_SCREEN_FEATURES.notes).toBe('notes');
        expect(PREMIUM_SCREEN_FEATURES.progress).toBe('progress');
        expect(PREMIUM_SCREEN_FEATURES.sounds).toBe('sounds');
        expect(PREMIUM_SCREEN_FEATURES['sc-bodymap']).toBe('body_map');
        expect(PREMIUM_SCREEN_FEATURES.breath).toBeUndefined();
        expect(PREMIUM_SCREEN_FEATURES.pause).toBeUndefined();
        expect(PREMIUM_SCREEN_FEATURES['sc-community']).toBeUndefined();
        expect(PREMIUM_SCREEN_FEATURES['sc-wizard']).toBeUndefined();
        expect(PREMIUM_SCREEN_FEATURES['sc-exposure-why']).toBeUndefined();
    });

    it('shows a reminder after the third completed free action', () => {
        expect(recordFreeAction()).toBe(1);
        expect(recordFreeAction()).toBe(2);
        const third = recordFreeAction();
        expect(third).toBe(3);
        expect(shouldShowGeneralPaywall(third)).toBe(true);
    });

    it('does not show another general paywall until seven days pass', () => {
        markGeneralPaywallShown();
        expect(shouldShowGeneralPaywall(5)).toBe(false);
        vi.advanceTimersByTime(GENERAL_PAYWALL_INTERVAL_MS);
        expect(shouldShowGeneralPaywall(5)).toBe(true);
    });

    it('limits real recovery offers to three impressions separated by fourteen days', () => {
        expect(shouldShowRecoveryPaywall()).toBe(true);
        for (let index = 0; index < MAX_RECOVERY_IMPRESSIONS; index += 1) {
            markRecoveryPaywallShown();
            expect(shouldShowRecoveryPaywall()).toBe(false);
            vi.advanceTimersByTime(RECOVERY_INTERVAL_MS);
        }
        expect(shouldShowRecoveryPaywall()).toBe(false);
    });

    it('unlocks the account trial for seven days and then expires it', () => {
        const started = startAccountTrial('user-1');
        expect(started.active).toBe(true);
        expect(started.daysLeft).toBe(7);

        vi.advanceTimersByTime(ACCOUNT_TRIAL_DURATION_MS - 1000);
        expect(getAccountTrialStatus().active).toBe(true);

        vi.advanceTimersByTime(1000);
        const expired = getAccountTrialStatus();
        expect(expired.active).toBe(false);
        expect(expired.expired).toBe(true);
    });

    it('scopes account trials by registered user on the same device', () => {
        startAccountTrial('user-1');
        vi.advanceTimersByTime(ACCOUNT_TRIAL_DURATION_MS);
        expect(getAccountTrialStatus('user-1').expired).toBe(true);
        expect(getAccountTrialStatus('user-2').active).toBe(false);

        const secondUserTrial = startAccountTrial('user-2');
        expect(secondUserTrial.active).toBe(true);
        expect(secondUserTrial.startedAt).toBe(Date.now());
        expect(getAccountTrialStatus('user-1').active).toBe(false);
    });

    it('does not restart the same registered user trial after it expires', () => {
        startAccountTrial('user-1');
        vi.advanceTimersByTime(ACCOUNT_TRIAL_DURATION_MS);

        const restarted = startAccountTrial('user-1');
        expect(restarted.active).toBe(false);
        expect(restarted.expired).toBe(true);
    });

    it('shows the expired-trial paywall once and keeps it dismissed for that trial', () => {
        startAccountTrial('user-1');
        vi.advanceTimersByTime(ACCOUNT_TRIAL_DURATION_MS);
        const expired = getAccountTrialStatus('user-1');

        expect(shouldShowTrialExpiredPaywall(expired, 'user-1')).toBe(true);
        markTrialExpiredPaywallDismissed(expired, 'user-1');
        expect(shouldShowTrialExpiredPaywall(expired, 'user-1')).toBe(false);
        expect(shouldShowTrialExpiredPaywall(expired, 'user-2')).toBe(true);
    });
});
