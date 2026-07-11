import { useState, useRef, useEffect } from 'react';
import { LockKeyhole, Trash2, Upload } from 'lucide-react';

interface Track {
    id?: number;
    name: string;
    url: string;
    icon: string;
    duration: string;
}

interface AudioScreenProps {
    onBack: () => void;
    tracks: Track[];
    onAddTrack: (file: File) => void | Promise<void>;
    onDeleteTrack: (idx: number) => void;
    trackCount: number;
    isPremium: boolean;
    onUpgrade: () => void;
    onPracticeComplete?: () => void;
}

const isFreeTrack = (track?: Track) => track?.name.trim().toLowerCase() === 'calma profunda';

export default function AudioScreen({ onBack, tracks, onAddTrack, onDeleteTrack, trackCount, isPremium, onUpgrade, onPracticeComplete }: AudioScreenProps) {
    const [curIdx, setCurIdx] = useState(() => {
        if (isPremium) return 0;
        const freeIndex = tracks.findIndex(isFreeTrack);
        return freeIndex >= 0 ? freeIndex : 0;
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [curTime, setCurTime] = useState('0:00');

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const onPracticeCompleteRef = useRef(onPracticeComplete);
    const currentTrack = tracks[curIdx] || tracks[0];

    useEffect(() => {
        onPracticeCompleteRef.current = onPracticeComplete;
    }, [onPracticeComplete]);

    useEffect(() => {
        if (isPremium || isFreeTrack(currentTrack)) return;
        const freeIndex = tracks.findIndex(isFreeTrack);
        if (freeIndex >= 0) setCurIdx(freeIndex);
    }, [currentTrack, isPremium, tracks]);

    // Initialize audio once on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && !audioRef.current) {
            audioRef.current = new Audio();
        }
        
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (!audio.duration) return;
            const p = (audio.currentTime / audio.duration) * 100;
            setProgress(isNaN(p) ? 0 : p);
            setCurTime(fmtTime(audio.currentTime));
        };

        const onEnded = () => {
            audio.currentTime = 0;
            setProgress(0);
            setCurTime('0:00');
            setIsPlaying(false);
            onPracticeCompleteRef.current?.();
        };

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        return () => {
            audio.pause();
            audio.src = ''; // Force release of the resource
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, []);

    // Handle track source changes
    useEffect(() => {
        const audio = audioRef.current;
        if (audio && currentTrack) {
            const wasPlaying = !audio.paused;
            // Only update src if it's actually different to avoid restart loops
            if (audio.src !== window.location.origin + currentTrack.url && !currentTrack.url.startsWith('blob:')) {
                 audio.src = currentTrack.url;
            } else if (currentTrack.url.startsWith('blob:') && audio.src !== currentTrack.url) {
                 audio.src = currentTrack.url;
            }

            if (wasPlaying) {
                audio.play().catch(e => {
                    if (e.name !== 'AbortError') console.error("Playback failed:", e);
                });
            }
        }
    }, [currentTrack]);

    const togglePlay = () => {
        if (!isPremium && !isFreeTrack(currentTrack)) {
            onUpgrade();
            return;
        }
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => {
                if (e.name !== 'AbortError') console.error("Playback failed:", e);
            });
        }
    };

    const handleStop = () => {
        const audio = audioRef.current;
        if (!audio) return;
        
        audio.pause();
        audio.currentTime = 0;
        setProgress(0);
        setCurTime('0:00');
        setIsPlaying(false);
    };

    const nextTrack = () => {
        const nextIndex = (curIdx + 1) % tracks.length;
        if (!isPremium && !isFreeTrack(tracks[nextIndex])) {
            onUpgrade();
            return;
        }
        setCurIdx(nextIndex);
    };

    const prevTrack = () => {
        const previousIndex = (curIdx - 1 + tracks.length) % tracks.length;
        if (!isPremium && !isFreeTrack(tracks[previousIndex])) {
            onUpgrade();
            return;
        }
        setCurIdx(previousIndex);
    };

    const handleAudioFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (!isPremium) {
            onUpgrade();
            return;
        }
        await onAddTrack(file);
    };

    const fmtTime = (s: number) => {
        if (isNaN(s) || !isFinite(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    return (
        <div id="sounds" className="screen active">
            <style jsx>{`
        .screen{position:absolute;inset:0;display:flex;flex-direction:column;overflow-y:auto;padding-bottom:120px;}
        .screen::-webkit-scrollbar{display:none;}

        #sounds .aurora-1{background:radial-gradient(circle,rgba(124,58,237,0.55),transparent 70%);top:-80px;right:-60px;}
        #sounds .aurora-2{background:radial-gradient(circle,rgba(6,182,212,0.35),transparent 70%);top:250px;left:-80px;}
        #sounds .aurora-3{background:radial-gradient(circle,rgba(244,63,94,0.2),transparent 70%);bottom:60px;right:40px;}

        .snd-hd{padding:22px 24px 16px;position:relative;z-index:5;}
        .snd-title{font-size:36px;font-weight:800;letter-spacing:-.03em;color:var(--text);margin-bottom:3px;}
        .snd-sub{font-size:12px;color:var(--text2);}

        .player{
            margin:0 22px 18px;
            background:rgba(255,255,255,0.07);
            backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
            border:1px solid rgba(255,255,255,0.15);border-radius:var(--rad);
            padding:20px 18px 24px;position:relative;z-index:10;
            isolation: isolate;
        }
        .player::before{content:'';position:absolute;top:-1px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,.5),transparent);}
        .player-glow{position:absolute;top:-20px;right:-20px;width:140px;height:140px;background:radial-gradient(circle,rgba(124,58,237,.15),transparent 65%);pointer-events:none;}
        .pl-tag{font-size:9px;font-weight:700;letter-spacing:.18em;color:var(--c2);text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:6px;}
        .pl-tag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--c2);box-shadow:0 0 8px var(--c2);animation:dotP 1.5s ease-in-out infinite;}
        .pl-row{display:flex;align-items:center;gap:14px;margin-bottom:14px;}
        .pl-art{
          width:56px;height:56px;border-radius:15px;flex-shrink:0;
          background:linear-gradient(135deg,rgba(124,58,237,.2),rgba(6,182,212,.15));
          border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;
          font-size:24px;
        }
        .pl-name{font-size:16px;font-weight:800;color:var(--text);margin-bottom:2px;}
        .pl-type{font-size:10px;color:var(--text2);letter-spacing:.04em;}
        .pl-dur{font-size:11px;font-weight:700;color:var(--c2);margin-left:auto;flex-shrink:0;}
        .wave{display:flex;align-items:center;gap:2px;height:24px;margin-bottom:12px;}
        .wb{flex:1;border-radius:2px;background:rgba(6,182,212,.2);animation:wbA 1.4s ease-in-out infinite;}
        .wb:nth-child(2n){animation-delay:.2s;}
        .wb:nth-child(3n){animation-delay:.4s;}
        @keyframes wbA{0%,100%{transform:scaleY(.3);opacity:.4;}50%{transform:scaleY(1);opacity:1;}}
        
        .prog-bar{width:100%;height:4px;background:rgba(255,255,255,.06);border-radius:3px;margin-bottom:6px;cursor:pointer;position:relative;}
        .prog-fill{height:100%;background:linear-gradient(90deg,var(--p2),var(--c2));border-radius:3px;position:relative;transition:width 0.1s linear;}
        .prog-fill::after{content:'';position:absolute;right:-4px;top:-3px;width:10px;height:10px;border-radius:50%;background:var(--c2);box-shadow:0 0 8px var(--c2);}
        .prog-times{display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-bottom:8px;}
        .ctrl-row{display:flex;align-items:center;justify-content:center;gap:32px;margin-top:20px;position:relative;z-index:20;}
        .cbtn{background:none;border:none;cursor:pointer;color:var(--text2);transition:var(--t);display:flex;padding:10px;}
        .cbtn:hover{color:var(--text);}
        .cplay{
          width:52px;height:52px;border-radius:50%;border:none;
          background:linear-gradient(135deg,var(--p),var(--c));
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          box-shadow:0 0 20px rgba(124,58,237,.4);transition:var(--t);
        }
        .cplay:hover{transform:scale(1.05);box-shadow:0 0 30px rgba(124,58,237,.6);}
        .cstop{
          width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.1);
          border:1px solid var(--border);display:flex;align-items:center;justify-content:center;
          cursor:pointer;color:white;transition:var(--t);
        }
        .cstop:hover{background:rgba(244,63,94,0.2);border-color:rgba(244,63,94,0.4);}

        .snd-cats{display:flex;gap:8px;padding:0 22px 14px;overflow-x:auto;z-index:5;position:relative;}
        .snd-cats::-webkit-scrollbar{display:none;}
        .cat-pill{
          background:var(--glass);border:1px solid var(--border);border-radius:var(--radp);
          padding:7px 14px;font-size:11px;font-weight:700;color:var(--text2);
          white-space:nowrap;cursor:pointer;transition:var(--t);
        }
        .cat-pill.on{background:rgba(124,58,237,.15);border-color:rgba(124,58,237,.35);color:var(--p3);}

        .snd-list{padding:0 22px;display:flex;flex-direction:column;gap:8px;position:relative;z-index:5;}
        .si{display:flex;align-items:center;gap:12px;background:var(--glass);border:1px solid var(--border);border-radius:15px;padding:13px 14px;cursor:pointer;transition:var(--t);}
        .si:hover{border-color:var(--border2);background:rgba(255,255,255,0.02);}
        .si.on{border-color:var(--c2);background:rgba(6,182,212,0.06);}
        .si-art{width:46px;height:46px;border-radius:13px;flex-shrink:0;background:linear-gradient(135deg,rgba(124,58,237,.15),rgba(6,182,212,.1));border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:20px;}
        .si-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px;}
        .si-meta{font-size:10px;color:var(--text2);}
        .si-dur{font-size:10px;color:var(--text3);margin-left:auto;flex-shrink:0;padding-right:8px;}
        .si-btn{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:var(--t);}
        .si.locked{opacity:.72;}
        .si-lock{margin-left:auto;color:var(--text2);display:flex;align-items:center;gap:6px;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;}
        .si-delete{width:32px;height:32px;border-radius:50%;border:1px solid rgba(244,63,94,.18);background:rgba(244,63,94,.07);color:#f38c9d;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;}
        .personal-audio{padding:16px 22px 0;position:relative;z-index:5;}
        .upload-audio{width:100%;min-height:48px;border:1px solid rgba(90,173,207,.24);background:rgba(90,173,207,.07);border-radius:14px;color:#8dd3e8;display:flex;align-items:center;justify-content:center;gap:9px;font:inherit;font-size:12px;font-weight:800;cursor:pointer;}
      `}</style>

            <div className="aurora"><div className="aurora-1"></div><div className="aurora-2"></div><div className="aurora-3"></div></div>
            <div className="snd-hd">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div className="snd-title">Sonidos</div>
                        <div className="snd-sub">Para calmar la mente y el cuerpo</div>
                    </div>
                    <div onClick={onBack} style={{ cursor: 'pointer', padding: '8px', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>‹</div>
                </div>
            </div>

            <div className="player">
                <div className="player-glow"></div>
                <div className="pl-tag">{isPlaying ? 'Reproduciendo ahora' : 'En pausa'}</div>
                <div className="pl-row">
                    <div className="pl-art">{currentTrack?.icon}</div>
                    <div><div className="pl-name">{currentTrack?.name}</div><div className="pl-type">RELAJACIÓN GUIADA</div></div>
                    <div className="pl-dur">{currentTrack?.duration}</div>
                </div>
                <div className="wave">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="wb" style={{ height: `${20 + Math.random() * 80}%`, animationPlayState: isPlaying ? 'running' : 'paused' }}></div>
                    ))}
                </div>
                <div className="prog-bar" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const p = (e.clientX - rect.left) / rect.width;
                    if (audioRef.current) audioRef.current.currentTime = p * audioRef.current.duration;
                }}>
                    <div className="prog-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="prog-times"><span>{curTime}</span><span>{currentTrack?.duration}</span></div>
                <div className="ctrl-row">
                    <button className="cbtn" onClick={prevTrack} title="Anterior"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></svg></button>
                    
                    <button className="cstop" onClick={handleStop} title="Detener">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                    </button>

                    <button className="cplay" onClick={togglePlay} title={isPlaying ? "Pausar" : "Reproducir"}>
                        {isPlaying ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        )}
                    </button>
                    
                    <button className="cbtn" onClick={nextTrack} title="Siguiente"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg></button>
                </div>
            </div>

            <div className="snd-cats">
                <div className="cat-pill on">Todos</div><div className="cat-pill">Meditación</div><div className="cat-pill">Frecuencias</div>
            </div>

            <div className="snd-list">
                {tracks.map((t, i) => (
                    <div key={i} className={`si ${curIdx === i ? 'on' : ''} ${!isPremium && !isFreeTrack(t) ? 'locked' : ''}`} onClick={() => {
                        if (!isPremium && !isFreeTrack(t)) {
                            onUpgrade();
                            return;
                        }
                        setCurIdx(i);
                        // The track source will change via useEffect, and if it was already playing, it will continue.
                        // If it wasn't playing, we start it.
                        if (!isPlaying) {
                            setIsPlaying(true);
                        }
                    }}>
                        <div className="si-art">{t.icon}</div>
                        <div>
                            <div className="si-name">{t.name}</div>
                            <div className="si-meta">Relajación · Guía</div>
                        </div>
                        {!isPremium && !isFreeTrack(t) ? (
                            <div className="si-lock"><LockKeyhole size={14} /> Premium</div>
                        ) : (
                            <div className="si-dur">{t.duration}</div>
                        )}
                        <div className="si-btn">
                            {curIdx === i && isPlaying ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--c2)"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                            ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--c2)"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            )}
                        </div>
                        {t.id !== undefined && (
                            <button className="si-delete" onClick={(event) => { event.stopPropagation(); onDeleteTrack(i); }} aria-label={`Eliminar ${t.name}`} title="Eliminar audio">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="personal-audio">
                <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleAudioFile} hidden />
                <button className="upload-audio" onClick={() => isPremium ? fileInputRef.current?.click() : onUpgrade()}>
                    {isPremium ? <Upload size={16} /> : <LockKeyhole size={15} />}
                    {isPremium ? `Añadir audio propio${trackCount > 3 ? ` · ${trackCount - 3}` : ''}` : 'Audio propio · Premium'}
                </button>
            </div>
        </div>
    );
}
