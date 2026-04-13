'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
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
import { supabase, calculateTrialRemaining, getUserProfile } from '@/lib/supabase';
import ExposureScreen from '@/components/ExposureScreen';
import DisclaimerModal from '@/components/DisclaimerModal';
import AuthScreen from '@/components/AuthScreen';
import SubscriptionRequiredScreen from '@/components/SubscriptionRequiredScreen';
import InstallPWA from '@/components/InstallPWA';
import { initIAP } from '@/utils/iap';

interface Track {
  id?: number;
  name: string;
  url: string;
  icon: string;
  duration: string;
}

const ICONS = ['🌊', '🌧️', '🌿', '🎵', '🔔', '🌬️', '🌙', '☀️', '🎶', '🦋'];
const ADMIN_EMAILS = ['jordi210895@gmail.com'];

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [trialStatus, setTrialStatus] = useState({ days: 3, hours: 0, expired: false });

  const [curScreen, setCurScreen] = useState('home');
  const [prevScreen, setPrevScreen] = useState('home');
  const [cbtCount, setCbtCount] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([
    { name: 'Superación Agorafobia', url: '/audio/audio1.m4a', icon: '🧘', duration: '—' },
    { name: 'Calma Profunda', url: '/audio/audio2.m4a', icon: '🌊', duration: '—' },
    { name: 'Respiración Guiada', url: '/audio/audio3.m4a', icon: '🍃', duration: '—' }
  ]);

  // Auth & Trial Logic
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id, session.user.created_at);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id, session.user.created_at);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid: string, createdAt: string) => {
    const prof = await getUserProfile(uid);
    setProfile(prof);
    setTrialStatus(calculateTrialRemaining(createdAt));
    setLoading(false);
  };

  // Load persistence
  useEffect(() => {
    if (!session) return;

    // 2. Audio Tracks from IndexedDB
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
    
    // 3. One-time notification prompt for new users
    const hasPrompted = localStorage.getItem('ansioff_notif_prompted');
    if (!hasPrompted) {
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).OneSignal) {
          const OneSignal = (window as any).OneSignal;
          if (OneSignal.Notifications) {
            OneSignal.Notifications.requestPermission();
            localStorage.setItem('ansioff_notif_prompted', 'true');
          }
        }
      }, 5000);
      return () => clearTimeout(timer);
    }

    // 4. CBT record count
    supabase.from('cbt_records').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count !== null) setCbtCount(count);
    });

    // 4. Request Persistent Storage to prevent mobile browsers from wiping LocalStorage/IndexedDB
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(isPersisted => {
        if (isPersisted) console.log("Persistent storage granted.");
      });
    }

    if (session) {
      fetchProfile(session.user.id, session.user.created_at);
      initIAP(session.user.id);
    }
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNav = (id: string) => {
    if (id === curScreen) return;
    setPrevScreen(curScreen);
    setCurScreen(id);
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
            <Header onSettings={() => handleNav('sc-settings')} />
            <HomeScreen onNav={handleNav} cbtCount={cbtCount} />
          </>
        );
      case 'sounds':
      case 'sc-audio':
        return <AudioScreen onBack={goBack} tracks={tracks} onAddTrack={addTrack} onDeleteTrack={removeTrack} trackCount={tracks.length} />;
      case 'notes':
      case 'sc-notes':
        return <NotesScreen onBack={goBack} />;
      case 'crisis':
      case 'sc-sos':
        return <SOSScreen onBack={goBack} onFinished={() => handleNav('home')} />;
      case 'breath':
      case 'sc-breath':
        return <BreathingScreen onBack={goBack} />;
      case 'progress':
      case 'sc-stats':
        return <StatsScreen onBack={goBack} />;
      // Modules / Tools Hub
      case 'sc-tools':
        return <ToolsScreen onBack={goBack} onNav={handleNav} />;
      case 'sc-games':
        return <GamesScreen onBack={goBack} />;
      case 'sc-act':
        return <ACTScreen onBack={goBack} />;
      case 'sc-cbt':
        return <CBTScreen onBack={goBack} />;
      case 'sc-eval':
        return <EvaluationScreen onBack={goBack} />;
      case 'sc-stats':
        return <StatsScreen onBack={goBack} />;
      case 'sc-support':
        return <SupportScreen onBack={goBack} />;
      case 'sc-night':
        return <NightModeScreen onBack={goBack} onNav={handleNav} />;
      case 'sc-settings':
        return <SettingsScreen onBack={goBack} profile={profile} />;
      case 'sc-exposure-why':
        return <ExposureScreen onBack={goBack} />;
      default:
        return (
          <>
            <Header onSettings={() => handleNav('sc-settings')} />
            <HomeScreen onNav={handleNav} cbtCount={cbtCount} />
          </>
        );
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#03080f]">
        <div className="w-8 h-8 border-4 border-[#5aadcf]/30 border-t-[#5aadcf] rounded-full animate-spin"></div>
    </div>
  );

  if (!session) return <AuthScreen onAuth={() => {}} />;
 
  const isPremium = profile?.is_premium || ADMIN_EMAILS.includes(session.user.email);
  const trialExpired = trialStatus.expired;

  if (trialExpired && !isPremium) {
    return <SubscriptionRequiredScreen onSubscribe={() => alert('Próximamente: Integración con Stripe')} />;
  }

  return (
    <div className="app-container">
      {!isPremium && !trialExpired && (
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 text-[10px] font-bold py-1.5 text-center border-b border-blue-500/10 backdrop-blur-md">
              TIEMPO DE PRUEBA: <span className="text-white">{trialStatus.days} días, {trialStatus.hours} horas restantes</span>
          </div>
      )}

      <main className="screen-wrapper">
        <div key={curScreen} className="screen-fade">
          {renderScreen()}
        </div>
      </main>

      <button className="sos-fab" onClick={() => handleNav('crisis')}>
        <div className="sos-fab-pulse"></div>
        <span>SOS</span>
      </button>

      <BottomNav activeScreen={curScreen} onNav={handleNav} />
      <DisclaimerModal />
      <InstallPWA />
    </div>
  );
}
