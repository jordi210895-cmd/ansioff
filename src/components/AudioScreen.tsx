'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
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

export default function AudioScreen({ onBack, tracks, trackCount }: AudioScreenProps) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Todos');

    const currentTrack = tracks[currentIdx] || tracks[0];

    const categories = ['Todos', 'Naturaleza', 'Meditación', 'Ruido Blanco'];

    return (
        <div id="s-sounds" className="screen active flex flex-col overflow-hidden">
            <style jsx>{`
                #s-sounds { background: var(--navy-2); min-height: 100vh; }
                
                .now-playing-head {
                    padding: 40px 28px 24px; text-align: center;
                }
                .np-label { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; color: var(--sky-1); text-transform: uppercase; margin-bottom: 12px; }
                .np-title { font-family: var(--serif); font-size: 28px; color: var(--white); margin-bottom: 4px; }
                .np-meta { font-size: 13px; color: var(--muted); }

                .waveform-wrap {
                    padding: 0 40px; height: 60px; display: flex; align-items: center; gap: 3px;
                }
                .wv-bar {
                    flex: 1; height: 30%; background: var(--navy-4); border-radius: 10px;
                    transition: all 0.3s;
                }
                .wv-bar.active { background: var(--sky-1); }
                .wv-bar.p1 { height: 40%; } .wv-bar.p2 { height: 70%; } .wv-bar.p3 { height: 100%; } .wv-bar.p4 { height: 60%; }

                .player-ctrl {
                    padding: 20px 40px 30px; display: flex; align-items: center; justify-content: space-between;
                }
                .p-btn { color: var(--muted); cursor: pointer; transition: 0.2s; }
                .p-btn:active { transform: scale(0.9); color: var(--white); }
                .p-main {
                    width: 64px; height: 64px; border-radius: 50%;
                    background: var(--sky-1); color: var(--navy-1);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 8px 24px rgba(74,168,204,0.3);
                }

                .sound-browser {
                    flex: 1; background: var(--navy-1); border-top: 1px solid rgba(255,255,255,0.05);
                    border-radius: 32px 32px 0 0; padding: 28px 28px 120px; overflow-y: auto;
                }
                .cat-scroll { display: flex; gap: 10px; overflow-x: auto; margin-bottom: 24px; scrollbar-width: none; }
                .cat-scroll::-webkit-scrollbar { display: none; }
                .c-btn {
                    padding: 8px 16px; border-radius: var(--r-pill); border: 1px solid rgba(255,255,255,0.06);
                    font-size: 12px; color: var(--muted); white-space: nowrap; cursor: pointer;
                }
                .c-btn.active { background: var(--navy-4); color: var(--white); border-color: transparent; }

                .track-card {
                    display: flex; align-items: center; gap: 16px; padding: 14px;
                    background: var(--navy-2); border-radius: 20px; margin-bottom: 12px;
                    border: 1px solid transparent; cursor: pointer; transition: 0.2s;
                }
                .track-card.active { border-color: rgba(74,168,204,0.3); background: var(--navy-3); }
                .t-ico {
                    width: 48px; height: 48px; border-radius: 14px; background: var(--navy-4);
                    display: flex; align-items: center; justify-content: center; font-size: 20px;
                }
                .t-info { flex: 1; }
                .t-name { font-size: 15px; font-weight: 500; color: var(--white); margin-bottom: 2px; }
                .t-dur { font-size: 11px; color: var(--muted); }
            `}</style>

            <TopBar title="" onBack={onBack} />

            <div className="now-playing-head">
                <div className="np-label">Reproduciendo ahora</div>
                <div className="np-title">{currentTrack?.name}</div>
                <div className="np-meta">Paisaje Sonoro · {currentTrack?.duration}</div>
            </div>

            <div className="waveform-wrap">
                {Array.from({ length: 30 }).map((_, i) => {
                    const isActive = i < 12;
                    const hClass = ['p1', 'p2', 'p3', 'p4'][Math.floor(Math.random() * 4)];
                    return <div key={i} className={`wv-bar ${isActive ? 'active' : ''} ${hClass}`}></div>;
                })}
            </div>

            <div className="player-ctrl">
                <SkipBack className="p-btn" size={24} />
                <div className="p-main" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" style={{ marginLeft: '4px' }} />}
                </div>
                <SkipForward className="p-btn" size={24} />
            </div>

            <div className="sound-browser scrollbar-hide">
                <div className="cat-scroll">
                    {categories.map(c => (
                        <div key={c} className={`c-btn ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</div>
                    ))}
                </div>

                {tracks.map((t, i) => (
                    <div key={i} className={`track-card ${currentIdx === i ? 'active' : ''}`} onClick={() => setCurrentIdx(i)}>
                        <div className="t-ico">{t.icon || '🎵'}</div>
                        <div className="t-info">
                            <div className="t-name">{t.name}</div>
                            <div className="t-dur">{t.duration}</div>
                        </div>
                        <Play size={16} color={currentIdx === i ? 'var(--sky-1)' : 'var(--muted)'} />
                    </div>
                ))}
            </div>
        </div>
    );
}

