import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'placeholder' || supabaseAnonKey === 'placeholder_key') {
    throw new Error('Falta configurar NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY para ANSIOFF.');
}

const isNativeRuntime = () => {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).Capacitor?.isNativePlatform?.());
};

const authStorage = {
    async getItem(key: string) {
        if (typeof window === 'undefined') return null;
        if (isNativeRuntime()) {
            try {
                const { Preferences } = await import('@capacitor/preferences');
                const { value } = await Preferences.get({ key });
                if (value !== null) return value;
                const localValue = window.localStorage.getItem(key);
                if (localValue) await Preferences.set({ key, value: localValue });
                return localValue;
            } catch (error) {
                console.warn('Native auth storage read skipped:', error);
            }
        }
        return window.localStorage.getItem(key);
    },
    async setItem(key: string, value: string) {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, value);
        if (!isNativeRuntime()) return;
        try {
            const { Preferences } = await import('@capacitor/preferences');
            await Preferences.set({ key, value });
        } catch (error) {
            console.warn('Native auth storage write skipped:', error);
        }
    },
    async removeItem(key: string) {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
        if (!isNativeRuntime()) return;
        try {
            const { Preferences } = await import('@capacitor/preferences');
            await Preferences.remove({ key });
        } catch (error) {
            console.warn('Native auth storage removal skipped:', error);
        }
    },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: authStorage,
    },
})

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
    return data;
}

export async function logUsageStat(companyId: string, moduleId: string) {
    const { error } = await supabase
        .from('usage_stats')
        .insert({
            company_id: companyId,
            module_id: moduleId,
            timestamp: new Date().toISOString()
        });
    if (error) console.error("Error logging usage stat:", error);
}
