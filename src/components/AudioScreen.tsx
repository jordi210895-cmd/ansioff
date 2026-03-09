'use client';

import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Trash2, Plus, Waves } from 'lucide-react';
import TopBar from './TopBar';

interface Track {
    name: string;
    url: string;
    icon: string;
    duration: string;
}

interface AudioScreenProps {
    onBack: () => void;
    tracks: Track[];
    onAddTrack: (file: File) => void;
    onDeleteTrack: (idx: number) => void;
    trackCount: number;
}

export default function AudioScreen({ onBack, tracks, onAddTrack, onDeleteTrack, trackCount }: AudioScreenProps) {
    const [currentIdx, setCurrentIdx] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio();
        const audio = audioRef.current;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onEnded = () => nextTrack();

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
            audio.pause();
        };
    }, []);

    const playTrack = (idx: number) => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        if (idx === currentIdx) {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play().catch(() => { });
                setIsPlaying(true);
            }
            return;
        }

        audio.pause();
        setCurrentIdx(idx);
        audio.src = tracks[idx].url;
        audio.volume = volume;
        audio.play().then(() => {
            setIsPlaying(true);
        }).catch(() => { });
    };

    const nextTrack = () => {
        if (tracks.length === 0) return;
        const nxt = (currentIdx + 1) % tracks.length;
        playTrack(nxt);
    };

    const prevTrack = () => {
        if (tracks.length === 0) return;
        const prev = (currentIdx - 1 + tracks.length) % tracks.length;
        playTrack(prev);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = x / rect.width;
        audioRef.current.currentTime = pct * duration;
    };

    const fmt = (s: number) => {
        if (isNaN(s) || !isFinite(s)) return '0:00';
        return Math.floor(s / 60) + ':' + (Math.floor(s % 60) < 10 ? '0' : '') + Math.floor(s % 60);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(onAddTrack);
        }
    };

    const currentTrack = currentIdx >= 0 ? tracks[currentIdx] : null;

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
            <TopBar title="Paisajes Sonoros" onBack={onBack} />
            <div className="flex-1 overflow-y-auto screen-px pb-48 scrollbar-hide">
                <div className="mt-6 mb-10">
                    <label className="relative group cursor-pointer block">
                        <input type="file" className="hidden" accept="audio/*" multiple onChange={handleFileChange} />
                        <div className="border-2 border-dashed border-blue-500/20 group-hover:border-blue-500/50 bg-blue-500/5 rounded-[2rem] p-10 transition-all text-center hover:bg-blue-500/10">
                            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                <Plus size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Amplía tu biblioteca</h3>
                            <p className="text-blue-300/60 text-sm">Sube tus propios sonidos de calma</p>
                        </div>
                    </label>
                </div>

                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-blue-500/60 font-bold">Colección Personal</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">{trackCount}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {tracks.map((t, i) => (
                        <div
                            key={i}
                            onClick={() => playTrack(i)}
                            className={`group relative flex items-center gap-5 p-5 rounded-[1.5rem] transition-all cursor-pointer active:scale-[0.98] ${i === currentIdx ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border-2 border-blue-500/40 shadow-lg shadow-blue-500/10' : 'bg-slate-900/40 border-2 border-slate-800/50 hover:border-blue-500/30'
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${i === currentIdx ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40 scale-105' : 'bg-slate-800/80 text-blue-400'
                                }`}>
                                {i === currentIdx && isPlaying ? <Waves className="w-6 h-6 animate-pulse" /> : <Music className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-base font-semibold truncate ${i === currentIdx ? 'text-white' : 'text-slate-200'}`} style={{ fontFamily: i === currentIdx ? 'Georgia, serif' : 'inherit' }}>{t.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-blue-400/80 font-bold tracking-widest uppercase">Audio</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                    <span className="text-xs text-slate-500">{t.duration}</span>
                                </div>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${i === currentIdx ? 'bg-blue-500/20' : 'opacity-0 group-hover:opacity-100'}`}>
                                {i === currentIdx && isPlaying ? <Pause size={20} className="text-blue-400" /> : <Play size={20} className="text-blue-400" />}
                            </div>
                            {t.url.startsWith('blob:') && (
                                <button
                                    className="ml-1 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-red-400/30 hover:text-red-400 transition-all"
                                    onClick={(e) => { e.stopPropagation(); onDeleteTrack(i); }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {tracks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700 mb-6 shadow-inner">
                            <Music size={40} />
                        </div>
                        <h4 className="text-lg text-slate-400 font-medium mb-2">Tu oasis sonoro está vacío</h4>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">
                            Añade sonidos naturales o música suave para crear tu rincón de paz.
                        </p>
                    </div>
                )}
            </div>

            {/* Premium Player Bar */}
            {currentIdx >= 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-2xl border-t border-blue-500/10 pt-6 pb-12 px-8 shadow-[0_-15px_30px_rgba(0,0,0,0.5)] z-50">
                    <div className="max-w-xl mx-auto">
                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                                <Volume2 size={24} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-white truncate" style={{ fontFamily: 'Georgia, serif' }}>{currentTrack?.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-blue-400 font-bold">{fmt(currentTime)}</span>
                                    <span className="text-xs text-slate-600">/</span>
                                    <span className="text-xs text-slate-500">{fmt(duration)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={prevTrack} className="p-2 text-slate-500 hover:text-white transition-colors"><SkipBack size={24} /></button>
                                <button
                                    onClick={() => playTrack(currentIdx)}
                                    className="w-14 h-14 bg-white text-slate-950 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10"
                                >
                                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                                </button>
                                <button onClick={nextTrack} className="p-2 text-slate-500 hover:text-white transition-colors"><SkipForward size={24} /></button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="group relative h-2 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden mb-6" onClick={handleSeek}>
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-100 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                        </div>

                        {/* Volume Control */}
                        <div className="flex items-center gap-4 px-1 opacity-50 hover:opacity-100 transition-opacity">
                            <Volume2 size={16} className="text-slate-400" />
                            <input
                                type="range" min="0" max="1" step="0.01"
                                className="flex-1 h-1.5 bg-slate-800 accent-blue-500 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white shadow-sm"
                                value={volume}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setVolume(val);
                                    if (audioRef.current) audioRef.current.volume = val;
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

