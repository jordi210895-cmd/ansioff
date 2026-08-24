'use client';

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import HomeScreen from '@/components/HomeScreen';
import AudioScreen from '@/components/AudioScreen';
import NotesScreen from '@/components/NotesScreen';
import SOSScreen from '@/components/SOSScreen';
import BreathingScreen from '@/components/BreathingScreen';
import ToolsScreen from '@/components/ToolsScreen';
import GamesScreen from '@/components/GamesScreen';
import ACTScreen from '@/components/ACTScreen';
import CBTScreen from '@/components/CBTScreen';
import EvaluationScreen from '@/components/EvaluationScreen';
import StatsScreen from '@/components/StatsScreen';
import SupportScreen from '@/components/SupportScreen';
import NightModeScreen from '@/components/NightModeScreen';
import SettingsScreen from '@/components/SettingsScreen';
import * as db from '@/lib/db';
import { supabase, getUserProfile } from '@/lib/supabase';
import ExposureScreen from '@/components/ExposureScreen';
import AuthScreen from '@/components/AuthScreen';
import InstallPWA from '@/components/InstallPWA';
import DisclaimerModal from '@/components/DisclaimerModal';
import PsychologistsScreen from '@/components/PsychologistsScreen';
import MyTherapyScreen from '@/components/MyTherapyScreen';
import CommunityScreen from '@/components/CommunityScreen';
import BodyMapScreen from '@/components/BodyMapScreen';
import CalmAssistantModal from '@/components/CalmAssistantModal';
import OnboardingFlow from '@/components/OnboardingFlow';
import Paywall, { PaywallPlacement } from '@/components/Paywall';
import PostOnboardingSetup from '@/components/PostOnboardingSetup';
import { Capacitor } from '@capacitor/core';
import {
  attachSubscriptionUser, detachSubscriptionUser, initializeSubscriptions,
  PaywallProduct, purchaseProduct, restoreSubscriptions, SubscriptionSnapshot,
  syncSubscriptionUserAttributes,
} from '@/lib/subscriptions';
import { trackCompleteRegistration, trackStorePurchaseConversion } from '@/lib/adsTracking';
import {
  completeOnboarding, createPersonalizedPlan, isOnboardingComplete, loadOnboardingState,
  OnboardingAnswers, PersonalizedPlan,
} from '@/lib/onboarding';
import {
  AccountTrialStatus, getAccountTrialStatus, markGeneralPaywallShown, markRecoveryPaywallShown,
  PREMIUM_SCREEN_FEATURES, recordFreeAction, shouldShowGeneralPaywall, shouldShowRecoveryPaywall,
  startAccountTrial,
} from '@/lib/access';
import { registerNativeReviewResumeListener, requestNativeReviewIfDue } from '@/lib/appReview';
import { registerInactivityLifecycle, scheduleInactivityReminders } from '@/lib/reminders';

interface Track {
  id?: number;
  name: string;
  url: string;
  icon: string;
  duration: string;
}

const ICONS = ['🌊', '🌧️', '🌿', '🎵', '🔔', '🌬️', '🌙', '☀️', '🎶', '🦋'];
const DEMO_SESSION_KEY = 'ansioff_demo_session';
const DEMO_USER_ID = 'app-review-demo';
const DEMO_EMAIL = 'smitsolutionshelp@gmail.com';
const DEMO_PROFILE = {
  id: DEMO_USER_ID,
  name: 'Apple Review',
  is_premium: true,
};

const createDemoSession = () => ({
  user: {
    id: DEMO_USER_ID,
    email: DEMO_EMAIL,
  },
});

const isDemoSession = (value: any) => value?.user?.id === DEMO_USER_ID;

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [resumeSetupAfterAuth, setResumeSetupAfterAuth] = useState(false);
  const [paywallPlacement, setPaywallPlacement] = useState<PaywallPlacement | null>(null);
  const [showPostOnboardingSetup, setShowPostOnboardingSetup] = useState(false);
  const [trialAuthOffer, setTrialAuthOffer] = useState(false);
  const [personalizedPlan, setPersonalizedPlan] = useState<PersonalizedPlan | null>(null);
  const [accountTrial, setAccountTrial] = useState<AccountTrialStatus>({
    active: false, expired: false, startedAt: null, endsAt: null, daysLeft: 0,
  });
  const [subscription, setSubscription] = useState<SubscriptionSnapshot>({
    status: 'loading', isPremium: false, products: [], managementURL: null,
  });

  const [curScreen, setCurScreen] = useState('home');
  const [prevScreen, setPrevScreen] = useState('home');
  const [cbtCount, setCbtCount] = useState(0);
  const [reviewEntryTick, setReviewEntryTick] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([
    { name: 'Superación Agorafobia', url: '/audio/audio1.m4a', icon: '🧘', duration: '—' },
    { name: 'Calma Profunda', url: '/audio/audio2.m4a', icon: '🌊', duration: '—' },
    { name: 'Respiración Guiada', url: '/audio/audio3.m4a', icon: '🍃', duration: '—' }
  ]);

  const isDemo = isDemoSession(session);
  const currentUserId = session?.user?.id as string | undefined;
  const hasPaidPremium = Boolean(isDemo || subscription.isPremium || profile?.is_premium);
  const hasPremium = Boolean(hasPaidPremium || (isNativeApp && accountTrial.active));

  useEffect(() => {
    if (hasPaidPremium && paywallPlacement) {
      setPaywallPlacement(null);
    }
  }, [hasPaidPremium, paywallPlacement]);

  useEffect(() => {
    if (!isNativeApp || !onboardingDone || hasPaidPremium) return;
    const refreshTrial = () => {
      const nextTrial = getAccountTrialStatus(currentUserId);
      setAccountTrial(nextTrial);
      if (nextTrial.expired) {
        setPaywallPlacement('trialExpired');
      }
    };
    refreshTrial();
    const timeout = accountTrial.active && accountTrial.endsAt
      ? window.setTimeout(refreshTrial, Math.max(250, accountTrial.endsAt - Date.now() + 250))
      : undefined;
    document.addEventListener('visibilitychange', refreshTrial);
    window.addEventListener('focus', refreshTrial);
    return () => {
      if (timeout) window.clearTimeout(timeout);
      document.removeEventListener('visibilitychange', refreshTrial);
      window.removeEventListener('focus', refreshTrial);
    };
  }, [accountTrial.active, accountTrial.endsAt, currentUserId, hasPaidPremium, isNativeApp, onboardingDone]);

  useEffect(() => {
    if (!isNativeApp) return;
    let active = true;
    let reviewLifecycle: Awaited<ReturnType<typeof registerNativeReviewResumeListener>> = null;

    registerNativeReviewResumeListener(() => {
      if (active) setReviewEntryTick((value) => value + 1);
    }).then((handle) => {
      if (active) reviewLifecycle = handle;
      else handle?.remove();
    }).catch((error) => console.warn('Native review lifecycle skipped:', error));

    return () => {
      active = false;
      reviewLifecycle?.remove();
    };
  }, [isNativeApp]);

  useEffect(() => {
    if (!isNativeApp || loading || !onboardingDone || showAuth || paywallPlacement || showPostOnboardingSetup) return;
    requestNativeReviewIfDue().catch((error) => console.warn('Native review prompt skipped:', error));
  }, [isNativeApp, loading, onboardingDone, paywallPlacement, reviewEntryTick, showAuth, showPostOnboardingSetup]);

  useEffect(() => {
    if (!isNativeApp || loading || !onboardingDone) return;
    let active = true;

    const refreshNativeAccess = async () => {
      const nextTrial = getAccountTrialStatus(currentUserId);
      if (active) setAccountTrial(nextTrial);

      try {
        const nextSubscription = await initializeSubscriptions();
        if (!active) return;
        setSubscription((current) => ({
          ...nextSubscription,
          products: nextSubscription.products.length ? nextSubscription.products : current.products,
        }));
        if (nextSubscription.isPremium) {
          setPaywallPlacement((current) => current === 'trialExpired' ? null : current);
        } else if (nextTrial.expired) {
          setPaywallPlacement('trialExpired');
        }
      } catch (error) {
        console.warn('Subscription refresh skipped:', error);
        if (active && nextTrial.expired) setPaywallPlacement('trialExpired');
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshNativeAccess();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', refreshNativeAccess);
    return () => {
      active = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', refreshNativeAccess);
    };
  }, [currentUserId, isNativeApp, loading, onboardingDone]);

  // Auth, onboarding and subscription bootstrap
  useEffect(() => {
    const nativeApp = Capacitor.isNativePlatform() || (process.env.NODE_ENV === 'development' && new URLSearchParams(window.location.search).get('nativePreview') === '1');
    const onboardingComplete = isOnboardingComplete();
    setIsNativeApp(nativeApp);
    setOnboardingDone(!nativeApp || onboardingComplete);
    const storedTrial = getAccountTrialStatus();
    setAccountTrial(storedTrial);
    const storedAnswers = loadOnboardingState()?.answers;
    if (storedAnswers) setPersonalizedPlan(createPersonalizedPlan(storedAnswers));
    if (nativeApp && onboardingComplete) {
      scheduleInactivityReminders(false).catch((error) => console.warn('Inactivity reminders skipped:', error));
    }

    let active = true;
    let inactivityLifecycle: Awaited<ReturnType<typeof registerInactivityLifecycle>> = null;
    if (nativeApp) {
      registerInactivityLifecycle().then((handle) => {
        if (active) inactivityLifecycle = handle;
        else handle?.remove();
      }).catch((error) => console.warn('Notification lifecycle skipped:', error));
    }

    let authReady = false;
    let subscriptionReady = !nativeApp;
    const finishBootstrap = () => {
      if (active && authReady && subscriptionReady) setLoading(false);
    };

    if (localStorage.getItem(DEMO_SESSION_KEY) === 'true') {
      setSession(createDemoSession());
      setProfile(DEMO_PROFILE);
      completeOnboarding();
      setOnboardingDone(true);
      authReady = true;
      finishBootstrap();
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!active) return;
        setSession(session);
        setAccountTrial(getAccountTrialStatus(session?.user?.id));
        if (session) fetchProfile(session.user.id);
        authReady = true;
        finishBootstrap();
      });
    }

    if (nativeApp) {
      initializeSubscriptions().then((snapshot) => {
        if (!active) return;
        setSubscription(snapshot);
        if (onboardingComplete && snapshot.status === 'expired' && snapshot.products.some((product) => product.winBackOffer) && shouldShowRecoveryPaywall()) {
          markRecoveryPaywallShown();
          setPaywallPlacement('recovery');
        }
        subscriptionReady = true;
        finishBootstrap();
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setSession(session);
      setAccountTrial(getAccountTrialStatus(session?.user?.id));
      if (session) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => {
      active = false;
      inactivityLifecycle?.remove();
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (uid: string) => {
    let prof = await getUserProfile(uid);
    if (!prof) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fallbackName = user.user_metadata?.name || '';
        try {
          const { data, error } = await supabase
            .from('profiles')
            .insert({ id: uid, name: fallbackName, is_premium: false })
            .select()
            .single();
          prof = !error && data ? data : { id: uid, name: fallbackName, is_premium: false };
        } catch {
          prof = { id: uid, name: fallbackName, is_premium: false };
        }
      }
    }
    setProfile(prof);
    return prof;
  };

  const activateAccountTrial = (userId?: string) => {
    const trial = startAccountTrial(userId);
    setAccountTrial(trial);
    return trial;
  };

  const handleAuth = async (authSession?: any, authProfile?: any) => {
    if (authSession) {
      localStorage.setItem(DEMO_SESSION_KEY, 'true');
      setSession(authSession);
      setProfile(authProfile || DEMO_PROFILE);
      completeOnboarding();
      setOnboardingDone(true);
      setShowAuth(false);
      if (resumeSetupAfterAuth) {
        setResumeSetupAfterAuth(false);
        setShowPostOnboardingSetup(true);
      }
      setTrialAuthOffer(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (session) {
      const nextProfile = await fetchProfile(session.user.id);
      if (isNativeApp) {
        const nextSubscription = await attachSubscriptionUser(session.user.id);
        await syncSubscriptionUserAttributes({
          appUserID: session.user.id,
          email: session.user.email,
          displayName: nextProfile?.name || session.user.user_metadata?.name,
        }).catch((error) => console.warn('RevenueCat attributes skipped:', error));
        if (nextSubscription) {
          setSubscription((current) => ({ ...nextSubscription, products: current.products }));
          if (nextSubscription.status === 'expired' && subscription.products.some((product) => product.winBackOffer) && shouldShowRecoveryPaywall()) {
            markRecoveryPaywallShown();
            setPaywallPlacement('recovery');
          }
        }
        if (!nextSubscription?.isPremium) {
          activateAccountTrial(session.user.id);
        }
        completeOnboarding();
        setOnboardingDone(true);
      }
    }
    setShowAuth(false);
    setTrialAuthOffer(false);
    if (resumeSetupAfterAuth) {
      setResumeSetupAfterAuth(false);
      setShowPostOnboardingSetup(true);
    }
  };

  const handleTrialSignup = (userId: string) => {
    activateAccountTrial(userId);
    trackCompleteRegistration({ method: 'email' }).catch((error) => console.warn('Registration tracking skipped:', error));
    completeOnboarding();
    setOnboardingDone(true);
    setShowAuth(false);
    setTrialAuthOffer(false);
    if (resumeSetupAfterAuth) {
      setResumeSetupAfterAuth(false);
      setShowPostOnboardingSetup(true);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem(DEMO_SESSION_KEY);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Supabase sign-out skipped:', error);
    }

    if (isNativeApp) {
      try {
        const nextSubscription = await detachSubscriptionUser();
        if (nextSubscription) setSubscription((current) => ({ ...nextSubscription, products: current.products }));
      } catch (error) {
        console.warn('RevenueCat logout skipped:', error);
      }
    }
    setSession(null);
    setProfile(null);
    setAccountTrial(getAccountTrialStatus());
    setCurScreen('home');
    setPrevScreen('home');
    setCbtCount(0);
  };

  const clearLocalAppData = async () => {
    try {
      const storedTracks = await db.getAllTracks();
      for (const track of storedTracks) {
        if (track.id) await db.deleteTrack(track.id);
      }
    } catch (error) {
      console.warn('Local audio cleanup skipped:', error);
    }

    Object.keys(localStorage)
      .filter((key) => key.startsWith('ansioff'))
      .forEach((key) => localStorage.removeItem(key));
  };

  const handleDeleteAccount = async () => {
    const currentSession = session;
    setLoading(true);

    if (currentSession && !isDemoSession(currentSession)) {
      const userId = currentSession.user?.id;
      const email = currentSession.user?.email;

      if (userId) {
        try {
          await supabase.from('profiles').delete().eq('id', userId);
        } catch (error) {
          console.warn('Remote profile deletion skipped:', error);
        }
      }

      try {
        await supabase.from('account_deletion_requests').insert({
          user_id: userId,
          email,
          requested_at: new Date().toISOString(),
        });
      } catch (error) {
        console.warn('Account deletion request could not be registered:', error);
      }
    }

    await clearLocalAppData();

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Supabase sign-out skipped:', error);
    }

    if (isNativeApp) {
      try {
        const nextSubscription = await detachSubscriptionUser();
        if (nextSubscription) setSubscription((current) => ({ ...nextSubscription, products: current.products }));
      } catch (error) {
        console.warn('RevenueCat account detachment skipped:', error);
      }
    }

    setSession(null);
    setProfile(null);
    setAccountTrial(getAccountTrialStatus());
    setCurScreen('home');
    setPrevScreen('home');
    setCbtCount(0);
    setLoading(false);
  };

  // Load local persistence for both guests and signed-in users.
  useEffect(() => {
    const loadTracks = async () => {
      try {
        const stored = await db.getAllTracks();
        const loadedTracks: Track[] = stored.map(s => ({
          id: s.id,
          name: s.name,
          url: URL.createObjectURL(s.data),
          icon: s.icon,
          duration: '—'
        }));

        setTracks(prev => {
          const defaults = prev.filter(t => t.url.startsWith('/audio'));
          return [...defaults, ...loadedTracks];
        });

        loadedTracks.forEach(track => {
          const audio = new Audio(track.url);
          audio.addEventListener('loadedmetadata', () => {
            setTracks(prev => prev.map(t =>
              t.url === track.url ? { ...t, duration: fmt(audio.duration) } : t
            ));
          });
        });

      } catch (e) { console.error("Error loading tracks", e); }
    };

    // Get durations for defaults
    tracks.forEach((track) => {
      if (track.duration === '—') {
        const audio = new Audio(track.url);
        audio.addEventListener('loadedmetadata', () => {
          setTracks(prev => prev.map(t =>
            t.url === track.url ? { ...t, duration: fmt(audio.duration) } : t
          ));
        });
      }
    });

    loadTracks();

    if (isDemoSession(session)) {
      setCbtCount(Number(localStorage.getItem('ansioff_demo_cbt_count') || 0));
      return;
    }

    if (session) {
      supabase.from('cbt_records').select('id', { count: 'exact', head: true }).then(({ count }) => {
        if (count !== null) setCbtCount(count);
      });
    } else {
      try {
        const localCbtRecords = localStorage.getItem('ansioff_local_cbt_records') || localStorage.getItem('ansioff_cbt_entries') || '[]';
        setCbtCount(JSON.parse(localCbtRecords).length);
      } catch {
        setCbtCount(0);
      }
    }

    // 4. Request Persistent Storage to prevent mobile browsers from wiping LocalStorage/IndexedDB
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(isPersisted => {
        if (isPersisted) console.log("Persistent storage granted.");
      });
    }

    if (session) fetchProfile(session.user.id);
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNav = (id: string) => {
    if (id === curScreen) return;
    const currentTrial = isNativeApp ? getAccountTrialStatus(currentUserId) : accountTrial;
    if (isNativeApp && (
      currentTrial.active !== accountTrial.active
      || currentTrial.expired !== accountTrial.expired
      || currentTrial.endsAt !== accountTrial.endsAt
      || currentTrial.startedAt !== accountTrial.startedAt
    )) {
      setAccountTrial(currentTrial);
    }
    const canUsePremiumFeature = hasPaidPremium || (isNativeApp && currentTrial.active);
    const expiredWithoutPremium = isNativeApp && currentTrial.expired && !hasPaidPremium;
    if (expiredWithoutPremium && id !== 'sc-settings') {
      setPaywallPlacement('trialExpired');
      return;
    }
    if (isNativeApp && !canUsePremiumFeature && PREMIUM_SCREEN_FEATURES[id]) {
      setPaywallPlacement('feature');
      return;
    }
    setPrevScreen(curScreen);
    setCurScreen(id);
  };

  const handleFreeActionCompleted = () => {
    if (!isNativeApp) return;
    const currentTrial = getAccountTrialStatus(currentUserId);
    if (
      currentTrial.active !== accountTrial.active
      || currentTrial.expired !== accountTrial.expired
      || currentTrial.endsAt !== accountTrial.endsAt
      || currentTrial.startedAt !== accountTrial.startedAt
    ) {
      setAccountTrial(currentTrial);
    }
    if (hasPaidPremium || currentTrial.active) return;
    if (currentTrial.expired) {
      setPaywallPlacement('trialExpired');
      return;
    }
    const actionCount = recordFreeAction();
    if (shouldShowGeneralPaywall(actionCount)) {
      markGeneralPaywallShown();
      window.setTimeout(() => setPaywallPlacement('reminder'), 350);
    }
  };

  const handleOnboardingFinished = (answers: OnboardingAnswers, plan: PersonalizedPlan) => {
    setPersonalizedPlan(plan);
    setOnboardingDone(true);
    setPaywallPlacement('onboarding');
  };

  const handlePurchase = async (product: PaywallProduct, useWinBackOffer: boolean) => {
    const next = await purchaseProduct(product, useWinBackOffer);
    setSubscription((current) => ({ ...next, products: current.products }));
    trackStorePurchaseConversion({ product, subscription: next, placement: paywallPlacement })
      .catch((error) => console.warn('Purchase tracking skipped:', error));
    if (next.isPremium) {
      const wasOnboarding = paywallPlacement === 'onboarding';
      setPaywallPlacement(null);
      if (wasOnboarding) setShowPostOnboardingSetup(true);
    }
  };

  const handleRestore = async () => {
    const next = await restoreSubscriptions();
    setSubscription((current) => ({ ...next, products: current.products }));
    if (!next.isPremium) throw new Error('No encontramos una suscripción activa para restaurar.');
    const wasOnboarding = paywallPlacement === 'onboarding';
    setPaywallPlacement(null);
    if (wasOnboarding) setShowPostOnboardingSetup(true);
  };

  const handleReloadSubscriptions = async () => {
    setSubscription((current) => ({ ...current, status: 'loading', error: undefined }));
    const next = await initializeSubscriptions();
    setSubscription(next);
    if (!next.products.length) throw new Error('La tienda todavía no ha publicado los planes para este dispositivo.');
  };

  const closePaywall = () => {
    const currentPlacement = paywallPlacement;
    if (currentPlacement === 'trialExpired') return;
    const shouldOfferSetup = currentPlacement === 'onboarding' && localStorage.getItem('ansioff_post_onboarding_setup_v1') !== 'done';
    setPaywallPlacement(null);
    if (currentPlacement === 'onboarding') {
      setTrialAuthOffer(true);
      setResumeSetupAfterAuth(true);
      setShowAuth(true);
      return;
    }
    if (shouldOfferSetup) setShowPostOnboardingSetup(true);
  };

  const finishPostOnboardingSetup = () => {
    localStorage.setItem('ansioff_post_onboarding_setup_v1', 'done');
    setShowPostOnboardingSetup(false);
  };

  const goBack = () => {
    setCurScreen(prevScreen);
  };

  // Audio Logic
  const addTrack = async (file: File) => {
    const name = file.name.replace(/\.[^/.]+$/, '');
    const icon = ICONS[tracks.length % ICONS.length];

    try {
      const id = await db.saveTrack({ name, data: file, icon });
      const url = URL.createObjectURL(file);
      const newTrack: Track = { id, name, url, icon, duration: '—' };

      setTracks(prev => [...prev, newTrack]);

      const tmp = new Audio(url);
      tmp.addEventListener('loadedmetadata', () => {
        setTracks(prev => prev.map(t =>
          t.url === url ? { ...t, duration: fmt(tmp.duration) } : t
        ));
      });
    } catch (e) {
      console.error("Error saving track", e);
    }
  };

  const removeTrack = async (idxIdx: number) => {
    const track = tracks[idxIdx];
    if (!track.id) return; // Can't delete default tracks for now
    try {
      await db.deleteTrack(track.id);
      setTracks(prev => prev.filter((_, i) => i !== idxIdx));
    } catch (e) {
      console.error("Error deleting track", e);
    }
  };

  const fmt = (s: number) => {
    if (isNaN(s) || !isFinite(s)) return '—';
    return Math.floor(s / 60) + ':' + (Math.floor(s % 60) < 10 ? '0' : '') + Math.floor(s % 60);
  };

  const renderScreen = () => {
    switch (curScreen) {
      case 'home':
        return (
          <>
            <HomeScreen onNav={handleNav} cbtCount={cbtCount} trackCount={tracks.length} userName={profile?.name?.split(' ')[0] || session?.user?.user_metadata?.name?.split(' ')[0] || ""} isPremium={hasPremium} />
          </>
        );
      case 'sounds':
      case 'sc-audio':
        return <AudioScreen onBack={goBack} tracks={tracks} onAddTrack={addTrack} onDeleteTrack={removeTrack} trackCount={tracks.length} isPremium={hasPremium} onUpgrade={() => setPaywallPlacement('feature')} onPracticeComplete={handleFreeActionCompleted} />;
      case 'notes':
      case 'sc-notes':
        return <NotesScreen onBack={goBack} />;
      case 'pause':
      case 'sc-pause':
      case 'crisis':
      case 'sc-sos':
        return <SOSScreen onBack={goBack} onFinished={() => { handleFreeActionCompleted(); handleNav('home'); }} />;
      case 'breath':
      case 'sc-breath':
        return <BreathingScreen onBack={goBack} isPremium={hasPremium} onUpgrade={() => setPaywallPlacement('feature')} onPracticeComplete={handleFreeActionCompleted} initialPatternId="4-7-8" />;
      case 'sc-breath-426':
        return <BreathingScreen onBack={goBack} isPremium={hasPremium} onUpgrade={() => setPaywallPlacement('feature')} onPracticeComplete={handleFreeActionCompleted} initialPatternId="4-2-6" />;
      case 'progress':
      case 'sc-stats':
        return <StatsScreen onBack={goBack} />;
      // Modules / Tools Hub
      case 'sc-tools':
        return <ToolsScreen onBack={goBack} onNav={handleNav} isPremium={hasPremium} />;
      case 'sc-games':
        return <GamesScreen onBack={goBack} />;
      case 'sc-act':
        return <ACTScreen onBack={goBack} />;
      case 'sc-cbt':
        return <CBTScreen onBack={goBack} />;
      case 'sc-eval':
        return <EvaluationScreen onBack={goBack} onComplete={handleFreeActionCompleted} />;
      case 'sc-support':
        return <SupportScreen onBack={goBack} />;
      case 'sc-night':
        return <NightModeScreen onBack={goBack} onNav={handleNav} />;
      case 'sc-settings':
        return <SettingsScreen onBack={goBack} profile={profile} session={session} onLogout={handleLogout} onDeleteAccount={session ? handleDeleteAccount : undefined} />;
      case 'sc-exposure-why':
        return <ExposureScreen onBack={goBack} userId={currentUserId} />;
      case 'sc-psychologists':
        return <PsychologistsScreen onBack={goBack} />;
      case 'sc-my-therapy':
        return <MyTherapyScreen onBack={goBack} onNav={handleNav} />;
      case 'sc-community':
        return <CommunityScreen onBack={goBack} onNav={handleNav} />;
      case 'sc-wizard':
      case 'wizard':
        return <CalmAssistantModal onBack={goBack} onNav={handleNav} />;
      case 'sc-bodymap':
      case 'bodymap':
        return <BodyMapScreen onBack={goBack} onNav={handleNav} />;
      default:
        return (
          <>
            <HomeScreen onNav={handleNav} cbtCount={cbtCount} trackCount={tracks.length} userName={profile?.name?.split(' ')[0] || session?.user?.user_metadata?.name?.split(' ')[0] || ""} isPremium={hasPremium} />
          </>
        );
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#03080f]">
        <div className="w-8 h-8 border-4 border-[#5aadcf]/30 border-t-[#5aadcf] rounded-full animate-spin"></div>
    </div>
  );

  if (!isNativeApp && !session) return <AuthScreen onAuth={handleAuth} />;
  if (showAuth) return (
    <AuthScreen
      onAuth={handleAuth}
      onTrialSignup={handleTrialSignup}
      onCancel={isNativeApp ? () => {
        setShowAuth(false);
        if (trialAuthOffer) {
          setTrialAuthOffer(false);
          setResumeSetupAfterAuth(false);
          setPaywallPlacement('onboarding');
          return;
        }
        setResumeSetupAfterAuth(false);
      } : undefined}
      trialOffer={trialAuthOffer}
    />
  );
  if (isNativeApp && !onboardingDone) return <OnboardingFlow onFinished={handleOnboardingFinished} onLogin={() => setShowAuth(true)} />;
  if (isNativeApp && !session && !paywallPlacement) return (
    <AuthScreen
      onAuth={handleAuth}
      onTrialSignup={handleTrialSignup}
    />
  );

  return (
    <div className="app-container">

      <main className="screen-wrapper">
        <div key={curScreen} className="screen-fade">
          {renderScreen()}
        </div>
      </main>

      {curScreen !== 'sc-community' && (
        <button className="sos-fab" onClick={() => handleNav('crisis')}>
          <div className="sos-fab-pulse"></div>
          <span>SOS</span>
        </button>
      )}

      {curScreen !== 'sc-community' && (
        <BottomNav activeScreen={curScreen} onNav={handleNav} isPremium={hasPremium} />
      )}
      <DisclaimerModal />
      <InstallPWA />
      <Paywall
        open={paywallPlacement !== null}
        placement={paywallPlacement || 'feature'}
        plan={personalizedPlan}
        products={subscription.products}
        loading={subscription.status === 'loading'}
        error={subscription.error}
        onClose={closePaywall}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        onReload={handleReloadSubscriptions}
      />
      <PostOnboardingSetup
        open={showPostOnboardingSetup}
        onDone={finishPostOnboardingSetup}
      />
    </div>
  );
}
