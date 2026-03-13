import { useState, useRef, useEffect } from 'react';

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
    onAddTrack: (file: File) => void;
    onDeleteTrack: (idx: number) => void;
    trackCount: number;
}

export default function AudioScreen({ onBack, tracks }: AudioScreenProps) {
    const [curIdx, setCurIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [curTime, setCurTime] = useState('0:00');

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentTrack = tracks[curIdx] || tracks[0];

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;

        const updateProgress = () => {
            const p = (audio.currentTime / audio.duration) * 100;
            setProgress(isNaN(p) ? 0 : p);
            setCurTime(fmtTime(audio.currentTime));
        };

        const onEnded = () => {
            nextTrack();
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', onEnded);
        };
    }, [curIdx]);

    useEffect(() => {
        if (audioRef.current && currentTrack) {
            const wasPlaying = isPlaying;
            audioRef.current.src = currentTrack.url;
            if (wasPlaying) audioRef.current.play().catch(e => console.error(e));
        }
    }, [currentTrack]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error(e));
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        setCurIdx((curIdx + 1) % tracks.length);
    };

    const prevTrack = () => {
        setCurIdx((curIdx - 1 + tracks.length) % tracks.length);
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
            backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
            border:1px solid rgba(255,255,255,0.12);border-radius:var(--rad);
            padding:18px;position:relative;overflow:hidden;z-index:5;
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
        .prog-times{display:flex;justify-content:space-between;font-size:10px;color:var(--text3);}
        .ctrl-row{display:flex;align-items:center;justify-content:center;gap:28px;margin-top:14px;}
        .cbtn{background:none;border:none;cursor:pointer;color:var(--text2);transition:var(--t);display:flex;padding:10px;}
        .cbtn:hover{color:var(--text);}
        .cplay{
          width:52px;height:52px;border-radius:50%;border:none;
          background:linear-gradient(135deg,var(--p),var(--c));
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          box-shadow:0 0 20px rgba(124,58,237,.4);transition:var(--t);
        }
        .cplay:hover{transform:scale(1.05);box-shadow:0 0 30px rgba(124,58,237,.6);}

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
                    <button className="cbtn" onClick={prevTrack}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></svg></button>
                    <button className="cplay" onClick={togglePlay}>
                        {isPlaying ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        )}
                    </button>
                    <button className="cbtn" onClick={nextTrack}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg></button>
                </div>
            </div>

            <div className="snd-cats">
                <div className="cat-pill on">Todos</div><div className="cat-pill">Meditación</div><div className="cat-pill">Frecuencias</div>
            </div>

            <div className="snd-list">
                {tracks.map((t, i) => (
                    <div key={i} className={`si ${curIdx === i ? 'on' : ''}`} onClick={() => {
                        setCurIdx(i);
                        setIsPlaying(true);
                        if (audioRef.current) {
                            audioRef.current.src = t.url;
                            audioRef.current.play().catch(e => console.error(e));
                        }
                    }}>
                        <div className="si-art">{t.icon}</div>
                        <div>
                            <div className="si-name">{t.name}</div>
                            <div className="si-meta">Relajación · Guía</div>
                        </div>
                        <div className="si-dur">{t.duration}</div>
                        <div className="si-btn">
                            {curIdx === i && isPlaying ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--c2)"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                            ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--c2)"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
