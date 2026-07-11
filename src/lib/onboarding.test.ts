import { beforeEach, describe, expect, it } from 'vitest';
import {
    completeOnboarding, createPersonalizedPlan, EMPTY_ONBOARDING_ANSWERS,
    isOnboardingComplete, loadOnboardingState, saveOnboardingState,
    toggleLimitedSelection, type OnboardingAnswers,
} from './onboarding';

class MemoryStorage {
    private values = new Map<string, string>();
    getItem(key: string) { return this.values.get(key) ?? null; }
    setItem(key: string, value: string) { this.values.set(key, String(value)); }
    removeItem(key: string) { this.values.delete(key); }
    clear() { this.values.clear(); }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, 'window', { value: { localStorage: storage }, configurable: true });

const answers = (partial: Partial<OnboardingAnswers>): OnboardingAnswers => ({ ...EMPTY_ONBOARDING_ANSWERS, ...partial });

describe('onboarding personalization', () => {
    beforeEach(() => storage.clear());

    it('chooses 4-7-8 and a night routine for sleep needs', () => {
        const plan = createPersonalizedPlan(answers({ goal: 'sleep_better', impacts: ['sleep'] }));
        expect(plan.exercisePattern).toBe('4-7-8');
        expect(plan.steps.map((step) => step.module)).toContain('night');
    });

    it('chooses 4-2-6 for an intense or physical presentation', () => {
        const plan = createPersonalizedPlan(answers({ goal: 'calm_now', manifestations: ['breathing_heart'] }));
        expect(plan.exercisePattern).toBe('4-2-6');
        expect(plan.steps[0].module).toBe('sos');
    });

    it('uses 4-4-4 for daily stress without physical signals', () => {
        expect(createPersonalizedPlan(answers({ goal: 'daily_stress' })).exercisePattern).toBe('4-4-4');
    });

    it('limits multi-select answers to three and allows deselection', () => {
        const three = toggleLimitedSelection(toggleLimitedSelection(toggleLimitedSelection([], 'a'), 'b'), 'c');
        expect(toggleLimitedSelection(three, 'd')).toEqual(['a', 'b', 'c']);
        expect(toggleLimitedSelection(three, 'b')).toEqual(['a', 'c']);
    });

    it('persists the current step and completion only in local storage', () => {
        const value = answers({ goal: 'understand_patterns', dailyMinutes: 5 });
        saveOnboardingState(6, value);
        expect(loadOnboardingState()).toMatchObject({ step: 6, answers: value });
        expect(isOnboardingComplete()).toBe(false);
        completeOnboarding();
        expect(isOnboardingComplete()).toBe(true);
    });
});
