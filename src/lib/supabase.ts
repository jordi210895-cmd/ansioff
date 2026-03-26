import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export type SubscriptionStatus = 'none' | 'trialing' | 'active' | 'expired';

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

export function calculateTrialRemaining(createdAt: string): { days: number, hours: number, expired: boolean } {
    const start = new Date(createdAt);
    const end = new Date(start.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days
    const now = new Date();
    
    const diff = end.getTime() - now.getTime();
    const expired = diff <= 0;
    
    if (expired) return { days: 0, hours: 0, expired: true };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days, hours, expired: false };
}
