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
import DisclaimerModal from '@/components/DisclaimerModal';
import AuthScreen from '@/components/AuthScreen';
import InstallPWA from '@/components/InstallPWA';
import OnboardingFlow from '@/components/OnboardingFlow';
import Paywall, { PaywallPlacement } from '@/components/Paywall';
import PostOnboardingSetup from '@/components/PostOnboardingSetup';
import { Capacitor } from '@capacitor/core';
import {
  attachSubscriptionUser, detachSubscriptionUser, initializeSubscriptions,
  PaywallProduct, purchaseProduct, restoreSubscriptions, SubscriptionSnapshot,
} from '@/lib/subscriptions';
import {
  completeOnboarding, createPersonalizedPlan, isOnboardingComplete, loadOnboardingState,
  OnboardingAnswers, PersonalizedPlan,
} from '@/lib/onboarding';
import {
  markGeneralPaywallShown, markRecoveryPaywallShown, PREMIUM_SCREEN_FEATURES,
  recordFreeAction, shouldShowGeneralPaywall, shouldShowRecoveryPaywall,
} from '@/lib/access';

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
  const [personalizedPlan, setPersonalizedPlan] = useState<PersonalizedPlan | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionSnapshot>({
    status: 'loading', isPremium: false, products: [], managementURL: null,
  });

  const [curScreen, setCurScreen] = useState('home');
  const [prevScreen, setPrevScreen] = useState('home');
  const [cbtCount, setCbtCount] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([
    { name: 'Superación Agorafobia', url: '/audio/audio1.m4a', icon: '🧘', duration: '—' },
    { name: 'Calma Profunda', url: '/audio/audio2.m4a', icon: '🌊', duration: '—' },
    { name: 'Respiración Guiada', url: '/audio/audio3.m4a', icon: '🍃', duration: '—' }
  ]);

  const isDemo = isDemoSession(session);
  const hasPremium = Boolean(isDemo || subscription.isPremium || profile?.is_premium);

  // Auth, onboarding and subscription bootstrap
  useEffect(() => {
    const nativeApp = Capacitor.isNativePlatform() || (process.env.NODE_ENV === 'development' && new URLSearchParams(window.location.search).get('nativePreview') === '1');
    const onboardingComplete = isOnboardingComplete();
    setIsNativeApp(nativeApp);
    setOnboardingDone(!nativeApp || onboardingComplete);
    const storedAnswers = loadOnboardingState()?.answers;
    if (storedAnswers) setPersonalizedPlan(createPersonalizedPlan(storedAnswers));

    let active = true;
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
      if (session) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (uid: string) => {
    const prof = await getUserProfile(uid);
    setProfile(prof);
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
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (session) {
      await fetchProfile(session.user.id);
      if (isNativeApp) {
        const nextSubscription = await attachSubscriptionUser(session.user.id);
        if (nextSubscription) {
          setSubscription((current) => ({ ...nextSubscription, products: current.products }));
          if (nextSubscription.status === 'expired' && subscription.products.some((product) => product.winBackOffer) && shouldShowRecoveryPaywall()) {
            markRecoveryPaywallShown();
            setPaywallPlacement('recovery');
          }
        }
        completeOnboarding();
        setOnboardingDone(true);
      }
    }
    setShowAuth(false);
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
        setCbtCount(JSON.parse(localStorage.getItem('ansioff_cbt_entries') || '[]').length);
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
    if (isNativeApp && !hasPremium && PREMIUM_SCREEN_FEATURES[id]) {
      setPaywallPlacement('feature');
      return;
    }
    setPrevScreen(curScreen);
    setCurScreen(id);
  };

  const handleFreeActionCompleted = () => {
    if (!isNativeApp || hasPremium) return;
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
    if (next.isPremium) closePaywall();
  };

  const handleRestore = async () => {
    const next = await restoreSubscriptions();
    setSubscription((current) => ({ ...next, products: current.products }));
    if (!next.isPremium) throw new Error('No encontramos una suscripción activa para restaurar.');
    closePaywall();
  };

  const closePaywall = () => {
    const shouldOfferSetup = paywallPlacement === 'onboarding' && localStorage.getItem('ansioff_post_onboarding_setup_v1') !== 'done';
    setPaywallPlacement(null);
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
            <HomeScreen onNav={handleNav} cbtCount={cbtCount} trackCount={tracks.length} userName={profile?.name?.split(' ')[0] || "Amigo"} isPremium={hasPremium} />
          </>
        );
      case 'sounds':
      case 'sc-audio':
        return <AudioScreen onBack={goBack} tracks={tracks} onAddTrack={addTrack} onDeleteTrack={removeTrack} trackCount={tracks.length} isPremium={hasPremium} onUpgrade={() => setPaywallPlacement('feature')} onPracticeComplete={handleFreeActionCompleted} />;
      case 'notes':
      case 'sc-notes':
        return <NotesScreen onBack={goBack} />;
      case 'crisis':
      case 'sc-sos':
        return <SOSScreen onBack={goBack} onFinished={() => { handleFreeActionCompleted(); handleNav('home'); }} />;
      case 'breath':
      case 'sc-breath':
        return <BreathingScreen onBack={goBack} isPremium={hasPremium} onUpgrade={() => setPaywallPlacement('feature')} onPracticeComplete={handleFreeActionCompleted} />;
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
        return <SettingsScreen onBack={goBack} profile={profile} onLogout={handleLogout} onDeleteAccount={session ? handleDeleteAccount : undefined} onLogin={() => setShowAuth(true)} isPremium={hasPremium} subscriptionStatus={subscription.status} managementURL={subscription.managementURL} onUpgrade={() => setPaywallPlacement('feature')} onRestore={handleRestore} />;
      case 'sc-exposure-why':
        return <ExposureScreen onBack={goBack} />;
      default:
        return (
          <>
            <HomeScreen onNav={handleNav} cbtCount={cbtCount} trackCount={tracks.length} userName={profile?.name?.split(' ')[0] || "Amigo"} isPremium={hasPremium} />
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
  if (showAuth) return <AuthScreen onAuth={handleAuth} onCancel={isNativeApp ? () => setShowAuth(false) : undefined} />;
  if (isNativeApp && !onboardingDone) return <OnboardingFlow onFinished={handleOnboardingFinished} onLogin={() => setShowAuth(true)} />;

  return (
    <div className="app-container">

      <main className="screen-wrapper">
        <div key={curScreen} className="screen-fade">
          {renderScreen()}
        </div>
      </main>

      <button className="sos-fab" onClick={() => handleNav('crisis')}>
        <div className="sos-fab-pulse"></div>
        <span>SOS</span>
      </button>

      <BottomNav activeScreen={curScreen} onNav={handleNav} isPremium={hasPremium} />
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
      />
      <PostOnboardingSetup
        open={showPostOnboardingSetup}
        hasAccount={Boolean(session)}
        onLogin={() => { setShowPostOnboardingSetup(false); setResumeSetupAfterAuth(true); setShowAuth(true); }}
        onDone={finishPostOnboardingSetup}
      />
    </div>
  );
}
