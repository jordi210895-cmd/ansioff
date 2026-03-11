export interface NeuroUXSettings {
    reduceAnimations: boolean;
    breathingSpeed: 'slow' | 'normal' | 'fast';
}

const NEUROUX_KEY = 'ansioff_neuroux_settings';

export const defaultSettings: NeuroUXSettings = {
    reduceAnimations: false,
    breathingSpeed: 'normal'
};

export const getNeuroSettings = (): NeuroUXSettings => {
    if (typeof window === 'undefined') return defaultSettings;
    try {
        const stored = localStorage.getItem(NEUROUX_KEY);
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
        return defaultSettings;
    }
};

export const saveNeuroSettings = (settings: NeuroUXSettings) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NEUROUX_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('neuroux_changed'));
};
