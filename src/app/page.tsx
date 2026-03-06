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

interface Note {
  id: number;
  text: string;
  date: string;
}

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
  const [notes, setNotes] = useState<Note[]>([]);
  const [tracks, setTracks] = useState<Track[]>([
    { name: 'Superación Agorafobia', url: '/audio/audio1.m4a', icon: '🧘', duration: '—' },
    { name: 'Calma Profunda', url: '/audio/audio2.m4a', icon: '🌊', duration: '—' },
    { name: 'Respiración Guiada', url: '/audio/audio3.m4a', icon: '🍃', duration: '—' }
  ]);

  // Load persistence
  useEffect(() => {
    // 1. Notes
    const savedNotes = localStorage.getItem('ansioff_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) { console.error("Error loading notes", e); }
    }

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
          // Keep defaults if they are not already there
          const defaults = prev.filter(t => t.url.startsWith('/audio'));
          return [...defaults, ...loadedTracks];
        });

        // Get durations for defaults
        tracks.forEach((track, idx) => {
          if (track.duration === '—') {
            const audio = new Audio(track.url);
            audio.addEventListener('loadedmetadata', () => {
              setTracks(prev => prev.map((t, i) =>
                t.url === track.url ? { ...t, duration: fmt(audio.duration) } : t
              ));
            });
          }
        });

        // Get durations for loaded tracks
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

    loadTracks();
  }, []);

  const handleNav = (id: string) => {
    if (id === curScreen) return;
    setPrevScreen(curScreen);
    setCurScreen(id);
  };

  const goBack = () => {
    setCurScreen(prevScreen);
  };

  // Notes Logic
  const saveNote = (text: string) => {
    const now = new Date();
    const newNote = {
      id: Date.now(),
      text,
      date: now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' +
        now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Audio Logic
  const addTrack = async (file: File) => {
    const name = file.name.replace(/\.[^/.]+$/, '');
    const icon = ICONS[tracks.length % ICONS.length];

    try {
      // Save to IndexedDB
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
        return <HomeScreen onNav={handleNav} noteCount={notes.length} trackCount={tracks.length} />;
      case 'sc-audio':
        return <AudioScreen onBack={goBack} tracks={tracks} onAddTrack={addTrack} onDeleteTrack={removeTrack} trackCount={tracks.length} />;
      case 'sc-notes':
        return <NotesScreen onBack={goBack} notes={notes} onSave={saveNote} onDelete={deleteNote} />;
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
        return <HomeScreen onNav={handleNav} noteCount={notes.length} trackCount={tracks.length} />;
    }
  };

  return (
    <div className="app bg-slate-950">
      {curScreen !== 'sc-home' && <Header />}

      <div className="screens">
        <div className={`screen active`}>
          {renderScreen()}
        </div>
      </div>

      <BottomNav activeScreen={curScreen} onNav={handleNav} />
    </div>
  );
}
