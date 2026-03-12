'use client';

import { useState, useEffect } from 'react';

interface BreathingScreenProps {
    onBack: () => void;
}

const phases = [
    { n: 'Inhala', d: 4, c: 'var(--c2)' },
    { n: 'Aguanta', d: 2, c: 'var(--c3)' },
    { n: 'Exhala', d: 6, c: 'var(--p2)' }
];

export default function BreathingScreen({ onBack }: BreathingScreenProps) {
    const [running, setRunning] = useState(false);
    const [pi, setPi] = useState(0);
    const [cnt, setCnt] = useState(phases[0].d);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (running) {
            timer = setTimeout(() => {
                if (cnt > 1) {
                    setCnt(cnt - 1);
                } else {
                    const nextPi = (pi + 1) % phases.length;
                    setPi(nextPi);
                    setCnt(phases[nextPi].d);
                }
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [running, cnt, pi]);

    const toggleBreath = () => setRunning(!running);

    return (
        <div id="breath" className="screen active">
            <style jsx>{`
                .screen{position:absolute;inset:0;display:flex;flex-direction:column;overflow-y:auto;padding-bottom:96px;}
                .screen::-webkit-scrollbar{display:none;}
                
                #breath .aurora-1{background:radial-gradient(circle,rgba(6,182,212,0.55),transparent 70%);top:-80px;left:-60px;}
                #breath .aurora-2{background:radial-gradient(circle,rgba(124,58,237,0.4),transparent 70%);bottom:100px;right:-80px;}
                #breath .aurora-3{background:radial-gradient(circle,rgba(16,185,129,0.2),transparent 70%);bottom:200px;left:60px;}

                .br-hd{width:100%;padding:18px 24px 0;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:5;}
                .br-back{width:36px;height:36px;border-radius:12px;background:var(--glass);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text2);font-size:16px;transition:var(--t);}
                .br-back:hover{border-color:var(--border2);color:var(--text);}
                .br-hd-title{font-size:13px;font-weight:700;color:var(--text2);letter-spacing:.06em;}

                .br-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 26px;text-align:center;position:relative;z-index:5;}
                .br-name{font-size:22px;font-weight:800;color:var(--text);letter-spacing:-.02em;margin-bottom:4px;}
                .br-meta{font-size:11px;color:var(--text2);margin-bottom:30px;letter-spacing:.03em;}

                .orb-wrap{position:relative;width:180px;height:180px;margin-bottom:26px;cursor:pointer;}
                .ow-ring{position:absolute;border-radius:50%;border:1px solid rgba(6,182,212,.09);animation:owR 5s ease-in-out infinite;}
                .ow-ring:nth-child(1){inset:0;}
                .ow-ring:nth-child(2){inset:-14px;animation-delay:1s;border-color:rgba(6,182,212,.05);}
                .ow-ring:nth-child(3){inset:-28px;animation-delay:2s;border-color:rgba(6,182,212,.03);}
                @keyframes owR{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}
                .ow-glow{position:absolute;inset:-12px;border-radius:50%;background:radial-gradient(circle,rgba(6,182,212,.1) 0%,transparent 65%);animation:owG 5s ease-in-out infinite;}
                @keyframes owG{0%,100%{opacity:.5;}50%{opacity:1;}}
                .ow-core{
                    position:absolute;inset:14px;border-radius:50%;
                    background:radial-gradient(circle at 36% 28%,rgba(210,245,255,.95),rgba(6,182,212,.7) 40%,rgba(80,20,180,.85));
                    animation:owC 5s ease-in-out infinite;
                    box-shadow:0 0 50px rgba(6,182,212,.4),0 0 100px rgba(124,58,237,.12);
                }
                @keyframes owC{
                    0%{transform:scale(.77);}45%{transform:scale(1.12);}55%{transform:scale(1.12);}100%{transform:scale(.77);}
                }
                .ow-spec{position:absolute;inset:20px;border-radius:50%;background:radial-gradient(ellipse at 30% 24%,rgba(255,255,255,.3),transparent 50%);pointer-events:none;animation:owC 5s ease-in-out infinite;}

                .br-phase{font-size:24px;font-weight:800;letter-spacing:-.01em;min-height:32px;margin-bottom:2px;}
                .br-count{font-size:68px;font-weight:800;color:var(--text);line-height:1;margin-bottom:24px;letter-spacing:-.04em;}

                .rchips{display:flex;gap:8px;margin-bottom:24px;}
                .rchip{
                    background:var(--glass);border:1px solid var(--border);
                    border-radius:var(--radp);padding:8px 15px;
                    cursor:pointer;transition:var(--t);display:flex;flex-direction:column;align-items:center;gap:2px;
                }
                .rchip.on{background:rgba(6,182,212,.12);border-color:rgba(6,182,212,.35);}
                .rchip:hover:not(.on){border-color:var(--border2);}
                .rcp-n{font-size:12px;font-weight:800;color:var(--c2);}
                .rcp-l{font-size:9px;color:var(--text2);letter-spacing:.06em;text-transform:uppercase;}

                .play-btn{
                    width:58px;height:58px;border-radius:50%;border:none;
                    background:linear-gradient(135deg,var(--c),var(--p));
                    display:flex;align-items:center;justify-content:center;cursor:pointer;
                    box-shadow:0 0 30px rgba(6,182,212,.45),0 6px 20px rgba(0,0,0,.4);
                    transition:var(--t);
                }
                .play-btn:hover{transform:scale(1.08);box-shadow:0 0 48px rgba(6,182,212,.65);}
                .play-btn:active{transform:scale(.95);}

                .bex{padding:0 24px;position:relative;z-index:5;}
                .bex-lbl{font-size:10px;font-weight:700;letter-spacing:.16em;color:var(--text3);text-transform:uppercase;margin-bottom:10px;}
                .bex-row{
                    display:flex;align-items:center;gap:12px;
                    background:var(--glass);border:1px solid var(--border);
                    border-radius:14px;padding:12px 14px;margin-bottom:8px;
                    cursor:pointer;transition:var(--t);
                }
                .bex-row:hover{border-color:var(--border2);}
                .bex-row.on{border-color:rgba(6,182,212,.3);background:rgba(6,182,212,.06);}
                .bex-orb{width:34px;height:34px;border-radius:50%;flex-shrink:0;background:radial-gradient(circle at 36% 30%,rgba(200,240,255,.75),rgba(6,182,212,.5));box-shadow:0 0 10px rgba(6,182,212,.2);}
                .bex-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:1px;}
                .bex-meta{font-size:10px;color:var(--text2);}
                .bex-nums{display:flex;gap:3px;margin-left:auto;}
                .bex-n{width:18px;height:18px;border-radius:5px;background:rgba(6,182,212,.1);border:1px solid rgba(6,182,212,.2);font-size:9px;font-weight:800;color:var(--c2);display:flex;align-items:center;justify-content:center;}
            `}</style>

            <div className="aurora"><div className="aurora-1"></div><div className="aurora-2"></div><div className="aurora-3"></div></div>
            <div className="br-hd">
                <div className="br-back" onClick={onBack}>‹</div>
                <div className="br-hd-title">Respiración</div>
                <div style={{ width: 36 }}></div>
            </div>
            <div className="br-body">
                <div className="br-name">Alivio del estrés profundo</div>
                <div className="br-meta">Técnica {phases.map(p => p.d).join(' · ')} &nbsp;·&nbsp; Principiante</div>
                <div className="orb-wrap" onClick={toggleBreath}>
                    <div className="ow-ring"></div><div className="ow-ring"></div><div className="ow-ring"></div>
                    <div className="ow-glow"></div><div className="ow-core"></div><div className="ow-spec"></div>
                </div>
                <div className="br-phase" style={{ color: phases[pi].c }}>{phases[pi].n}</div>
                <div className="br-count">{cnt}</div>
                <div className="rchips">
                    <div className="rchip on"><div className="rcp-n">4·2·6</div><div className="rcp-l">Estrés</div></div>
                    <div className="rchip"><div className="rcp-n">4·7·8</div><div className="rcp-l">Sueño</div></div>
                    <div className="rchip"><div className="rcp-n">4·4·4</div><div className="rcp-l">Box</div></div>
                </div>
                <button className="play-btn" onClick={toggleBreath}>
                    {running ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    )}
                </button>
            </div>
            <div className="bex">
                <div className="bex-lbl">Más ejercicios</div>
                <div className="bex-row on"><div className="bex-orb"></div><div><div className="bex-name">Alivio del estrés profundo</div><div className="bex-meta">5 min · Principiante</div></div><div className="bex-nums"><div className="bex-n">4</div><div className="bex-n">2</div><div className="bex-n">6</div></div></div>
                <div className="bex-row"><div className="bex-orb" style={{ background: 'radial-gradient(circle at 36% 30%,rgba(167,243,208,.75),rgba(16,185,129,.5))' }}></div><div><div className="bex-name">Respiración para el sueño</div><div className="bex-meta">8 min · Avanzado</div></div><div className="bex-nums"><div className="bex-n">4</div><div className="bex-n">7</div><div className="bex-n">8</div></div></div>
                <div className="bex-row"><div className="bex-orb" style={{ background: 'radial-gradient(circle at 36% 30%,rgba(196,181,253,.75),rgba(124,58,237,.5))' }}></div><div><div className="bex-name">Box Breathing</div><div className="bex-meta">4 min · Intermedio</div></div><div className="bex-nums"><div className="bex-n">4</div><div className="bex-n">4</div><div className="bex-n">4</div></div></div>
            </div>
        </div>
    );
}
