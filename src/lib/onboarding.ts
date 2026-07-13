export const ONBOARDING_VERSION = 2;
export const ONBOARDING_STORAGE_KEY = 'ansioff_onboarding_v1';
export const ONBOARDING_COMPLETE_KEY = 'ansioff_onboarding_complete_v1';

export type OnboardingGoal =
    | 'calm_now'
    | 'slow_thoughts'
    | 'sleep_better'
    | 'daily_stress'
    | 'understand_patterns';

export type Manifestation =
    | 'breathing_heart'
    | 'physical_tension'
    | 'racing_thoughts'
    | 'avoidance'
    | 'sleep'
    | 'unclear';

export type Trigger =
    | 'work_study'
    | 'relationships'
    | 'health'
    | 'uncertainty'
    | 'digital_environment'
    | 'unclear';

export type Impact =
    | 'sleep'
    | 'focus'
    | 'relationships'
    | 'energy'
    | 'enjoyment'
    | 'body';

export type Coping =
    | 'talk'
    | 'distract'
    | 'breathe'
    | 'write'
    | 'rest'
    | 'unsure';

export type DailyMinutes = 3 | 5 | 10 | 15;

export interface OnboardingAnswers {
    goal: OnboardingGoal | null;
    manifestations: Manifestation[];
    triggers: Trigger[];
    impacts: Impact[];
    coping: Coping[];
    dailyMinutes: DailyMinutes | null;
}

export type PlanModule =
    | 'sos'
    | 'breathing_426'
    | 'breathing_478'
    | 'breathing_444'
    | 'audio'
    | 'journal'
    | 'cbt'
    | 'act'
    | 'checkin'
    | 'night'
    | 'games'
    | 'progress';

export interface PlanStep {
    stage: 'Ahora' | 'Comprender' | 'Practicar' | 'Avanzar';
    title: string;
    description: string;
    module: PlanModule;
}

export interface PersonalizedPlan {
    title: string;
    summary: string;
    exercisePattern: '4-7-8';
    steps: PlanStep[];
}

export interface StoredOnboardingState {
    version: number;
    step: number;
    answers: OnboardingAnswers;
    updatedAt: string;
}

export const EMPTY_ONBOARDING_ANSWERS: OnboardingAnswers = {
    goal: null,
    manifestations: [],
    triggers: [],
    impacts: [],
    coping: [],
    dailyMinutes: null,
};

export function toggleLimitedSelection<T>(current: T[], value: T, max = 3) {
    if (current.includes(value)) return current.filter((item) => item !== value);
    return current.length < max ? [...current, value] : current;
}

const GOAL_LABELS: Record<OnboardingGoal, string> = {
    calm_now: 'calmar los momentos intensos',
    slow_thoughts: 'dar espacio a tus pensamientos',
    sleep_better: 'descansar mejor',
    daily_stress: 'bajar el estrés del día a día',
    understand_patterns: 'entender lo que se repite',
};

const TRIGGER_LABELS: Record<Trigger, string> = {
    work_study: 'el trabajo o los estudios',
    relationships: 'las relaciones',
    health: 'las sensaciones relacionadas con tu salud',
    uncertainty: 'la incertidumbre',
    digital_environment: 'el entorno y las pantallas',
    unclear: 'situaciones que todavía no identificas',
};

const IMPACT_LABELS: Record<Impact, string> = {
    sleep: 'el sueño',
    focus: 'la concentración',
    relationships: 'las relaciones',
    energy: 'la energía',
    enjoyment: 'el disfrute del día',
    body: 'el cuerpo y la respiración',
};

function firstLabel<T extends string>(values: T[], labels: Record<T, string>, fallback: string) {
    return values[0] ? labels[values[0]] : fallback;
}

export function createPersonalizedPlan(answers: OnboardingAnswers): PersonalizedPlan {
    const goal = answers.goal || 'daily_stress';
    const trigger = firstLabel(answers.triggers, TRIGGER_LABELS, 'el día a día');
    const impact = firstLabel(answers.impacts, IMPACT_LABELS, 'tu bienestar diario');

    const exercisePattern: PersonalizedPlan['exercisePattern'] = '4-7-8';

    const nowStep: PlanStep = goal === 'sleep_better'
        ? { stage: 'Ahora', title: 'Preparar el descanso', description: 'Una respiración lenta para bajar el ritmo antes de dormir.', module: 'breathing_478' }
        : goal === 'calm_now'
            ? { stage: 'Ahora', title: 'Calmar el momento intenso', description: 'SOS y respiración 4-7-8 para volver al presente sin forzar.', module: 'sos' }
            : { stage: 'Ahora', title: 'Crear una pausa', description: 'Respiración 4-7-8 para bajar el ritmo y recuperar margen.', module: 'breathing_478' };

    const understandStep: PlanStep = goal === 'slow_thoughts' || answers.manifestations.includes('racing_thoughts')
        ? { stage: 'Comprender', title: 'Ordenar pensamientos', description: 'Registro guiado para observarlos con más perspectiva.', module: 'cbt' }
        : { stage: 'Comprender', title: 'Encontrar temas repetidos', description: 'Diario personal y reflexión opcional con IA.', module: 'journal' };

    const practiceStep: PlanStep = goal === 'sleep_better' || answers.impacts.includes('sleep')
        ? { stage: 'Practicar', title: 'Cuidar tu noche', description: 'Sonidos y una rutina breve de descanso.', module: 'night' }
        : answers.coping.includes('distract')
            ? { stage: 'Practicar', title: 'Hacer una pausa activa', description: 'Ejercicios de atención cortos y sin presión.', module: 'games' }
            : { stage: 'Practicar', title: 'Registrar cómo estás', description: 'Un check-in breve adaptado al tiempo que tienes.', module: 'checkin' };

    return {
        title: `Tu plan para ${GOAL_LABELS[goal]}`,
        summary: `Lo que notas aparece especialmente alrededor de ${trigger} y afecta sobre todo a ${impact}. Empezaremos con una pausa sencilla y construiremos desde ahí.`,
        exercisePattern,
        steps: [
            nowStep,
            understandStep,
            practiceStep,
            { stage: 'Avanzar', title: 'Ver tu constancia', description: 'Actividad y progreso sin penalizar los días de descanso.', module: 'progress' },
        ],
    };
}

export function loadOnboardingState(): StoredOnboardingState | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as StoredOnboardingState;
        return parsed.version === ONBOARDING_VERSION ? parsed : null;
    } catch {
        return null;
    }
}

export function saveOnboardingState(step: number, answers: OnboardingAnswers) {
    if (typeof window === 'undefined') return;
    const value: StoredOnboardingState = {
        version: ONBOARDING_VERSION,
        step,
        answers,
        updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(value));
}

export function completeOnboarding() {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ONBOARDING_COMPLETE_KEY, String(ONBOARDING_VERSION));
}

export function isOnboardingComplete() {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(ONBOARDING_COMPLETE_KEY) === String(ONBOARDING_VERSION);
}
