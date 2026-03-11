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
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Paisajes Sonoros" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-5 pb-48 scrollbar-hide animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mt-4 mb-6">
                    <label className="relative group cursor-pointer block">
                        <input type="file" className="hidden" accept="audio/*" multiple onChange={handleFileChange} />
                        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5 text-center">
                            <div className="w-16 h-16 bg-[#0e1d2e] rounded-full flex items-center justify-center text-[#5aadcf] mx-auto mb-4">
                                <Plus size={32} strokeWidth={2} />
                            </div>
                            <h3 className="text-2xl font-light text-[#ddeef5] mb-2 font-serif italic mb-2">Amplía tu biblioteca</h3>
                            <p className="font-sans font-light text-sm text-[#ddeef5]">Sube tus propios sonidos de calma</p>
                        </div>
                    </label>
                </div>

                <div className="flex items-center justify-between gap-4 px-1 mb-6">
                    <h3 className="text-[10px] uppercase tracking-widest text-[rgba(200,225,235,0.38)] font-medium">Colección Personal</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-[#5aadcf]/10 text-[#5aadcf] font-medium">{trackCount}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {tracks.map((t, i) => (
                        <div
                            key={i}
                            onClick={() => playTrack(i)}
                            className={`group relative flex items-center gap-5 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer bg-[rgba(255,255,255,0.04)] border-solid border ${i === currentIdx ? 'border-[#5aadcf]/50' : 'border-[rgba(255,255,255,0.07)]'}`}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${i === currentIdx ? 'bg-[#5aadcf]/20 text-[#5aadcf]' : 'bg-[#0e1d2e] text-white/50'}`}>
                                {i === currentIdx && isPlaying ? <Waves className="w-6 h-6 animate-pulse" /> : <Music className="text-xl" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-[16px] truncate font-sans font-light ${i === currentIdx ? 'text-[#ddeef5] font-semibold' : 'text-[#ddeef5]'}`}>{t.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] text-[#5aadcf] font-medium tracking-[0.05em] uppercase">Audio</span>
                                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                    <span className="text-[13px] text-[rgba(200,225,235,0.38)]">{t.duration}</span>
                                </div>
                            </div>
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${i === currentIdx ? 'bg-[#5aadcf]/20' : 'opacity-0 group-hover:opacity-100 bg-[rgba(255,255,255,0.05)]'}`}>
                                {i === currentIdx && isPlaying ? <Pause size={20} className="text-[#5aadcf]" /> : <Play size={20} className="text-[#ddeef5] ml-1" />}
                            </div>
                            {t.url.startsWith('blob:') && (
                                <button
                                    className="ml-1 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-red-400/30 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                    onClick={(e) => { e.stopPropagation(); onDeleteTrack(i); }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {tracks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-8 animate-in fade-in duration-300">
                        <div className="w-20 h-20 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-full flex items-center justify-center text-[rgba(200,225,235,0.38)] mb-6">
                            <Music size={32} />
                        </div>
                        <h4 className="text-2xl font-light text-[#ddeef5] mb-2 font-serif italic">Tu oasis sonoro está vacío</h4>
                        <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] max-w-[240px]">
                            Añade sonidos naturales o música suave para crear tu rincón de paz.
                        </p>
                    </div>
                )}
            </div>

            {/* Premium Player Bar */}
            {currentIdx >= 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#03080f]/95 backdrop-blur-3xl border-t border-[rgba(255,255,255,0.06)] pt-6 pb-12 px-5 z-50">
                    <div className="max-w-xl mx-auto">
                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-14 h-14 bg-[#0e1d2e] border border-[rgba(255,255,255,0.07)] rounded-full flex items-center justify-center">
                                <Volume2 size={24} className="text-[#5aadcf]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-light text-[#ddeef5] truncate font-serif italic">{currentTrack?.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[13px] text-[#5aadcf] font-medium">{fmt(currentTime)}</span>
                                    <span className="text-[13px] text-[rgba(200,225,235,0.38)]">/</span>
                                    <span className="text-[13px] text-[rgba(200,225,235,0.38)]">{fmt(duration)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={prevTrack} className="p-2 text-[rgba(200,225,235,0.38)] hover:text-[#ddeef5] transition-colors"><SkipBack size={22} /></button>
                                <button
                                    onClick={() => playTrack(currentIdx)}
                                    className="w-14 h-14 bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f] rounded-full flex items-center justify-center transition-colors"
                                >
                                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                </button>
                                <button onClick={nextTrack} className="p-2 text-[rgba(200,225,235,0.38)] hover:text-[#ddeef5] transition-colors"><SkipForward size={22} /></button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="group relative h-2 w-full bg-[rgba(255,255,255,0.1)] rounded-full cursor-pointer overflow-hidden mb-6" onClick={handleSeek}>
                            <div
                                className="absolute top-0 left-0 h-full bg-[#5aadcf] transition-all duration-100 rounded-full"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                        </div>

                        {/* Volume Control */}
                        <div className="flex items-center gap-4 px-1 opacity-60 hover:opacity-100 transition-opacity">
                            <Volume2 size={16} className="text-[rgba(200,225,235,0.38)]" />
                            <input
                                type="range" min="0" max="1" step="0.01"
                                className="flex-1 h-1.5 bg-[rgba(255,255,255,0.1)] accent-[#5aadcf] rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ddeef5]"
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

