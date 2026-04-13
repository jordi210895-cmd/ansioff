import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
