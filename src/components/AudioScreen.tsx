'use client';

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
    return (
        <div id="sounds" className="screen active">
            <style jsx>{`
        .screen{position:absolute;inset:0;display:flex;flex-direction:column;overflow-y:auto;padding-bottom:96px;}
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
        }
        .pl-name{font-size:16px;font-weight:800;color:var(--text);margin-bottom:2px;}
        .pl-type{font-size:10px;color:var(--text2);letter-spacing:.04em;}
        .pl-dur{font-size:11px;font-weight:700;color:var(--c2);margin-left:auto;flex-shrink:0;}
        .wave{display:flex;align-items:center;gap:2px;height:28px;margin-bottom:12px;}
        .wb{flex:1;border-radius:2px;background:rgba(6,182,212,.2);animation:wbA 1.4s ease-in-out infinite;}
        @keyframes wbA{0%,100%{transform:scaleY(.22);background:rgba(6,182,212,.12);}50%{transform:scaleY(1);background:rgba(6,182,212,.65);}}
        .wb:nth-child(1){height:55%;animation-delay:0s}.wb:nth-child(2){height:80%;animation-delay:.1s}.wb:nth-child(3){height:45%;animation-delay:.2s}
        .wb:nth-child(4){height:95%;animation-delay:.15s}.wb:nth-child(5){height:65%;animation-delay:.3s}
        
        .prog-bar{width:100%;height:3px;background:rgba(255,255,255,.06);border-radius:3px;margin-bottom:5px;cursor:pointer;}
        .prog-fill{width:38%;height:100%;background:linear-gradient(90deg,var(--p2),var(--c2));border-radius:3px;position:relative;}
        .prog-fill::after{content:'';position:absolute;right:-5px;top:-4px;width:11px;height:11px;border-radius:50%;background:var(--c2);box-shadow:0 0 8px var(--c2);}
        .prog-times{display:flex;justify-content:space-between;font-size:10px;color:var(--text3);}
        .ctrl-row{display:flex;align-items:center;justify-content:center;gap:28px;margin-top:14px;}
        .cbtn{background:none;border:none;cursor:pointer;color:var(--text2);transition:var(--t);display:flex;}
        .cplay{
          width:48px;height:48px;border-radius:50%;border:none;
          background:linear-gradient(135deg,var(--p),var(--c));
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          box-shadow:0 0 20px rgba(124,58,237,.4);transition:var(--t);
        }

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
        .si:hover{border-color:var(--border2);}
        .si.on{border-color:rgba(6,182,212,.25);background:rgba(6,182,212,.05);}
        .si-art{width:46px;height:46px;border-radius:13px;flex-shrink:0;background:linear-gradient(135deg,rgba(124,58,237,.15),rgba(6,182,212,.1));border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;}
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
                <div className="pl-tag">Reproduciendo ahora</div>
                <div className="pl-row">
                    <div className="pl-art"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--c2)" strokeWidth="1.4" strokeLinecap="round"><path d="M3 9l4-4 4 4 4-4 4 4" /><path d="M3 15l4-4 4 4 4-4 4 4" /></svg></div>
                    <div><div className="pl-name">Lluvia suave</div><div className="pl-type">NATURALEZA · RELAJACIÓN</div></div>
                    <div className="pl-dur">18:24</div>
                </div>
                <div className="wave"><div className="wb"></div><div className="wb"></div><div className="wb"></div><div className="wb"></div><div className="wb"></div></div>
                <div className="prog-bar"><div className="prog-fill"></div></div>
                <div className="prog-times"><span>7:02</span><span>18:24</span></div>
                <div className="ctrl-row">
                    <button className="cbtn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></svg></button>
                    <button className="cplay"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg></button>
                    <button className="cbtn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg></button>
                </div>
            </div>

            <div className="snd-cats">
                <div className="cat-pill on">Todos</div><div className="cat-pill">Naturaleza</div><div className="cat-pill">Meditación</div><div className="cat-pill">Frecuencias</div>
            </div>

            <div className="snd-list">
                {tracks.map((t, i) => (
                    <div key={i} className="si">
                        <div className="si-art">{t.icon}</div>
                        <div>
                            <div className="si-name">{t.name}</div>
                            <div className="si-meta">Relax · Guía</div>
                        </div>
                        <div className="si-dur">{t.duration}</div>
                        <div className="si-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="var(--c2)"><polygon points="5 3 19 12 5 21 5 3" /></svg></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
