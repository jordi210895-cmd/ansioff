export const STATS_KEYS = {
    POINTS: 'ansioff_stats_points',
    SOS_USES: 'ansioff_stats_sos_uses',
    BREATH_MINS: 'ansioff_stats_breath_mins',
    CBT_ENTRIES: 'ansioff_stats_cbt_entries',
    ACTIVITY_DAYS: 'ansioff_stats_activity_days'
};

export interface UserStats {
    points: number;
    sosUses: number;
    breathMins: number;
    cbtEntries: number;
    tracksCount?: number;
    streak: number;
}

function getLocalDay(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getActivityDays(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const value = JSON.parse(localStorage.getItem(STATS_KEYS.ACTIVITY_DAYS) || '[]');
        return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
    } catch {
        return [];
    }
}

function calculateStreak(days: string[]) {
    const daySet = new Set(days);
    const cursor = new Date();
    if (!daySet.has(getLocalDay(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
        if (!daySet.has(getLocalDay(cursor))) return 0;
    }

    let streak = 0;
    while (daySet.has(getLocalDay(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

export function recordActivity() {
    if (typeof window === 'undefined') return;
    const days = Array.from(new Set([...getActivityDays(), getLocalDay()])).slice(-365);
    localStorage.setItem(STATS_KEYS.ACTIVITY_DAYS, JSON.stringify(days));
}

export function getStats(): UserStats {
    if (typeof window === 'undefined') {
        return { points: 0, sosUses: 0, breathMins: 0, cbtEntries: 0, streak: 0 };
    }

    return {
        points: parseInt(localStorage.getItem(STATS_KEYS.POINTS) || '0', 10),
        sosUses: parseInt(localStorage.getItem(STATS_KEYS.SOS_USES) || '0', 10),
        breathMins: parseInt(localStorage.getItem(STATS_KEYS.BREATH_MINS) || '0', 10),
        cbtEntries: parseInt(localStorage.getItem(STATS_KEYS.CBT_ENTRIES) || '0', 10),
        streak: calculateStreak(getActivityDays()),
    };
}

// 50 points per SOS grounding completion
export function addSosUse() {
    if (typeof window === 'undefined') return;
    const stats = getStats();
    localStorage.setItem(STATS_KEYS.SOS_USES, (stats.sosUses + 1).toString());
    localStorage.setItem(STATS_KEYS.POINTS, (stats.points + 50).toString());
    recordActivity();
}

// 10 points per minute of breathing
export function addBreathMins(minutes: number) {
    if (typeof window === 'undefined') return;
    const stats = getStats();
    localStorage.setItem(STATS_KEYS.BREATH_MINS, (stats.breathMins + minutes).toString());
    localStorage.setItem(STATS_KEYS.POINTS, (stats.points + (minutes * 10)).toString());
    recordActivity();
}

// 100 points per CBT / Journal entry
export function addCbtEntry() {
    if (typeof window === 'undefined') return;
    const stats = getStats();
    localStorage.setItem(STATS_KEYS.CBT_ENTRIES, (stats.cbtEntries + 1).toString());
    localStorage.setItem(STATS_KEYS.POINTS, (stats.points + 100).toString());
    recordActivity();
}

// Psychological progression levels based on points
export function getLevelForPoints(points: number): { title: string; subtitle: string; progress: number; nextThreshold: number; currentThreshold: number } {
    if (points < 100) return { title: 'Nivel 1: Primeros pasos', subtitle: 'Conociendo las herramientas de ANSIOFF', progress: points, nextThreshold: 100, currentThreshold: 0 };
    if (points < 500) return { title: 'Nivel 2: Rutina', subtitle: 'Sumando momentos de práctica', progress: points, nextThreshold: 500, currentThreshold: 100 };
    if (points < 1500) return { title: 'Nivel 3: Constancia', subtitle: 'Volviendo a tus herramientas con frecuencia', progress: points, nextThreshold: 1500, currentThreshold: 500 };
    if (points < 5000) return { title: 'Nivel 4: Práctica', subtitle: 'Ampliando tu repertorio de autocuidado', progress: points, nextThreshold: 5000, currentThreshold: 1500 };
    return { title: 'Nivel 5: Continuidad', subtitle: 'Manteniendo una práctica personal', progress: points, nextThreshold: 10000, currentThreshold: 5000 };
}
