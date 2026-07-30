import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    ACCOUNT_TRIAL_DURATION_MS, GENERAL_PAYWALL_INTERVAL_MS, getAccountTrialStatus,
    hasComplimentaryAccess,
    markGeneralPaywallShown, markRecoveryPaywallShown,
    MAX_RECOVERY_IMPRESSIONS, PREMIUM_SCREEN_FEATURES, recordFreeAction,
    RECOVERY_INTERVAL_MS, shouldShowGeneralPaywall, shouldShowRecoveryPaywall,
    startAccountTrial,
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

    it('keeps premium modules mapped while basic tools remain outside the gate', () => {
        expect(PREMIUM_SCREEN_FEATURES.notes).toBe('notes');
        expect(PREMIUM_SCREEN_FEATURES.progress).toBe('progress');
        expect(PREMIUM_SCREEN_FEATURES.breath).toBeUndefined();
        expect(PREMIUM_SCREEN_FEATURES.sounds).toBeUndefined();
    });

    it('keeps the Jordi account complimentary regardless of email casing', () => {
        expect(hasComplimentaryAccess('Jordi210895@gmail.com')).toBe(true);
        expect(hasComplimentaryAccess('  jordi210895@GMAIL.COM  ')).toBe(true);
        expect(hasComplimentaryAccess('otro@gmail.com')).toBe(false);
        expect(hasComplimentaryAccess(null)).toBe(false);
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
});
