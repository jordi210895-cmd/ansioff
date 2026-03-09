export const STATS_KEYS = {
    POINTS: 'ansioff_stats_points',
    SOS_USES: 'ansioff_stats_sos_uses',
    BREATH_MINS: 'ansioff_stats_breath_mins',
    CBT_ENTRIES: 'ansioff_stats_cbt_entries'
};

export interface UserStats {
    points: number;
    sosUses: number;
    breathMins: number;
    cbtEntries: number;
}

export function getStats(): UserStats {
    if (typeof window === 'undefined') {
        return { points: 0, sosUses: 0, breathMins: 0, cbtEntries: 0 };
    }

    return {
        points: parseInt(localStorage.getItem(STATS_KEYS.POINTS) || '0', 10),
        sosUses: parseInt(localStorage.getItem(STATS_KEYS.SOS_USES) || '0', 10),
        breathMins: parseInt(localStorage.getItem(STATS_KEYS.BREATH_MINS) || '0', 10),
        cbtEntries: parseInt(localStorage.getItem(STATS_KEYS.CBT_ENTRIES) || '0', 10),
    };
}

// 50 points per SOS grounding completion
export function addSosUse() {
    if (typeof window === 'undefined') return;
    const stats = getStats();
    localStorage.setItem(STATS_KEYS.SOS_USES, (stats.sosUses + 1).toString());
    localStorage.setItem(STATS_KEYS.POINTS, (stats.points + 50).toString());
}

// 10 points per minute of breathing
export function addBreathMins(minutes: number) {
    if (typeof window === 'undefined') return;
    const stats = getStats();
    localStorage.setItem(STATS_KEYS.BREATH_MINS, (stats.breathMins + minutes).toString());
    localStorage.setItem(STATS_KEYS.POINTS, (stats.points + (minutes * 10)).toString());
}

// 100 points per CBT / Journal entry
export function addCbtEntry() {
    if (typeof window === 'undefined') return;
    const stats = getStats();
    localStorage.setItem(STATS_KEYS.CBT_ENTRIES, (stats.cbtEntries + 1).toString());
    localStorage.setItem(STATS_KEYS.POINTS, (stats.points + 100).toString());
}

// Psychological progression levels based on points
export function getLevelForPoints(points: number): { title: string; subtitle: string; progress: number; nextThreshold: number; currentThreshold: number } {
    if (points < 100) return { title: 'Fase 1: Descubrimiento', subtitle: 'Empezando a conocer tus herramientas', progress: points, nextThreshold: 100, currentThreshold: 0 };
    if (points < 500) return { title: 'Fase 2: Consciencia', subtitle: 'Identificando patrones y emociones', progress: points, nextThreshold: 500, currentThreshold: 100 };
    if (points < 1500) return { title: 'Fase 3: Afrontamiento', subtitle: 'Tolerando el malestar activamente', progress: points, nextThreshold: 1500, currentThreshold: 500 };
    if (points < 5000) return { title: 'Fase 4: Resiliencia', subtitle: 'Manejando las crisis con soltura', progress: points, nextThreshold: 5000, currentThreshold: 1500 };
    return { title: 'Fase 5: Maestría Emocional', subtitle: 'Expertise total en gestión de crisis', progress: points, nextThreshold: points, currentThreshold: 5000 };
}
