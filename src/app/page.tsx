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
import { supabase } from '@/lib/supabase';
import ExposureScreen from '@/components/ExposureScreen';
import DisclaimerModal from '@/components/DisclaimerModal';

interface Track {
  id?: number;
  name: string;
  url: string;
  icon: string;
  duration: string;
}

const ICONS = ['🌊', '🌧️', '🌿', '🎵', '🔔', '🌬️', '🌙', '☀️', '🎶', '🦋'];

export default function App() {
  const [curScreen, setCurScreen] = useState('home');
  const [prevScreen, setPrevScreen] = useState('home');
  const [cbtCount, setCbtCount] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([
    { name: 'Superación Agorafobia', url: '/audio/audio1.m4a', icon: '🧘', duration: '—' },
    { name: 'Calma Profunda', url: '/audio/audio2.m4a', icon: '🌊', duration: '—' },
    { name: 'Respiración Guiada', url: '/audio/audio3.m4a', icon: '🍃', duration: '—' }
  ]);

  // Load persistence
  useEffect(() => {
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

    // 4. Request Persistent Storage to prevent mobile browsers from wiping LocalStorage/IndexedDB
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(isPersisted => {
        if (isPersisted) console.log("Persistent storage granted.");
      });
    }

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
      case 'home':
        return <HomeScreen onNav={handleNav} cbtCount={cbtCount} />;
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
        return <SettingsScreen onBack={goBack} />;
      case 'sc-exposure-why':
        return <ExposureScreen onBack={goBack} />;
      default:
        return <HomeScreen onNav={handleNav} cbtCount={cbtCount} />;
    }
  };

  // Authentication is disabled per user request
  // if (!authChecked) return null; // Wait silently while checking session
  // if (!isLoggedIn) return <AuthScreen onAuth={() => setIsLoggedIn(true)} />;

  return (
    <div className="phone-container">
      <div className="phone">
        <div className="status-bar">
          <span>21:01</span>
          <div className="bar-r">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="white"><rect x="0" y="3" width="3" height="9" rx="1" opacity=".35" /><rect x="4.5" y="2" width="3" height="10" rx="1" opacity=".6" /><rect x="9" y="0" width="3" height="12" rx="1" /><rect x="13.5" y=".5" width="3" height="11" rx="1" stroke="white" strokeWidth="1" fill="none" /></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><path d="M8 2.4C5.6 2.4 3.4 3.4 1.8 5L0 3.2C2.1 1.2 4.9 0 8 0s5.9 1.2 8 3.2L14.2 5C12.6 3.4 10.4 2.4 8 2.4z" opacity=".4" /><path d="M8 5.6C6.4 5.6 5 6.2 3.9 7.2L2.1 5.4C3.6 4 5.7 3.2 8 3.2s4.4.8 5.9 2.2L12.1 7.2C11 6.2 9.6 5.6 8 5.6z" opacity=".7" /><path d="M8 8.8c-1 0-1.9.4-2.5 1L8 12l2.5-2.2C9.9 9.2 9 8.8 8 8.8z" /></svg>
            <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x=".5" y=".5" width="22" height="12" rx="3.5" stroke="white" strokeOpacity=".3" /><rect x="1.5" y="1.5" width="17" height="10" rx="2.5" fill="white" /><path d="M23.5 4.5v4a2 2 0 0 0 0-4z" fill="white" fillOpacity=".4" /></svg>
          </div>
        </div>

        <main className="screen-wrapper">
          {renderScreen()}
        </main>

        <BottomNav activeScreen={curScreen} onNav={handleNav} />
        <DisclaimerModal />
      </div>
    </div>
  );
}
