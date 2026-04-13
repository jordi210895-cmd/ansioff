import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { supabase } from './supabase';

export const IAP_CONFIG = {
    appleApiKey: 'appl_placeholder_key', // User must replace this
    googleApiKey: 'goog_placeholder_key' // Optional for now
};

export async function initIAP(userId: string) {
    try {
        if (typeof window === 'undefined') return;
        
        // This only works on native devices
        const isNative = (window as any).Capacitor?.isNative;
        if (!isNative) return;

        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
        await Purchases.configure({ 
            apiKey: IAP_CONFIG.appleApiKey,
            appUserID: userId 
        });
        
        console.log("RevenueCat initialized for user:", userId);
    } catch (e) {
        console.error("Error initializing RevenueCat:", e);
    }
}

export async function getSubscriptionOfferings() {
    try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
            return offerings.current.availablePackages;
        }
    } catch (e) {
        console.error("Error fetching offerings:", e);
    }
    return [];
}

export async function purchaseSubscription(packageToPurchase: any) {
    try {
        const { customerInfo } = await Purchases.purchasePackage({ aPackage: packageToPurchase });
        
        // Check if the subscription is active
        // Assuming your entitlement ID is 'premium'
        if (typeof customerInfo.entitlements.active['premium'] !== "undefined") {
            return { success: true, customerInfo };
        }
        return { success: false, error: 'Acceso premium no activado.' };
    } catch (e: any) {
        if (!e.userCancelled) {
            console.error("Purchase error:", e);
            return { success: false, error: e.message };
        }
        return { success: false, userCancelled: true };
    }
}

export async function restorePurchases() {
    try {
        const { customerInfo } = await Purchases.restorePurchases();
        if (typeof customerInfo.entitlements.active['premium'] !== "undefined") {
            return { success: true, customerInfo };
        }
    } catch (e) {
        console.error("Restore error:", e);
    }
    return { success: false };
}
