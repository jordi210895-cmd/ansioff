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
import SupportScreen from '@/components/SupportScreen';
import NightModeScreen from '@/components/NightModeScreen';
import * as db from '@/lib/db';
import { supabase } from '@/lib/supabase';
import AuthScreen from '@/components/AuthScreen';

interface Track {
  id?: number;
  name: string;
  url: string;
  icon: string;
  duration: string;
}

const ICONS = ['🌊', '🌧️', '🌿', '🎵', '🔔', '🌬️', '🌙', '☀️', '🎶', '🦋'];

export default function App() {
  const [curScreen, setCurScreen] = useState('sc-home');
  const [prevScreen, setPrevScreen] = useState('sc-home');
  const [cbtCount, setCbtCount] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([
    { name: 'Superación Agorafobia', url: '/audio/audio1.m4a', icon: '🧘', duration: '—' },
    { name: 'Calma Profunda', url: '/audio/audio2.m4a', icon: '🌊', duration: '—' },
    { name: 'Respiración Guiada', url: '/audio/audio3.m4a', icon: '🍃', duration: '—' }
  ]);

  // Load persistence
  useEffect(() => {
    // 0. Check auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setAuthChecked(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

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

    // 3. CBT record count
    supabase.from('cbt_records').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count !== null) setCbtCount(count);
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      case 'sc-home':
        return <HomeScreen onNav={handleNav} cbtCount={cbtCount} />;
      case 'sc-audio':
        return <AudioScreen onBack={goBack} tracks={tracks} onAddTrack={addTrack} onDeleteTrack={removeTrack} trackCount={tracks.length} />;
      case 'sc-notes':
        return <NotesScreen onBack={goBack} />;
      case 'sc-sos':
        return <SOSScreen onBack={goBack} onFinished={() => handleNav('sc-home')} />;
      case 'sc-breath':
        return <BreathingScreen onBack={goBack} />;
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
      case 'sc-support':
        return <SupportScreen onBack={goBack} />;
      case 'sc-night':
        return <NightModeScreen onBack={goBack} />;
      default:
        return <HomeScreen onNav={handleNav} cbtCount={cbtCount} />;
    }
  };

  if (!authChecked) return null; // Wait silently while checking session
  if (!isLoggedIn) return <AuthScreen onAuth={() => setIsLoggedIn(true)} />;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
      {curScreen !== 'sc-home' && <Header onLogout={() => { supabase.auth.signOut().then(() => setIsLoggedIn(false)); }} />}

      <main className="flex-1 w-full max-w-md mx-auto relative">
        {renderScreen()}
      </main>

      <BottomNav activeScreen={curScreen} onNav={handleNav} />
    </div>
  );
}
