'use client';

import { useState, useEffect } from 'react';
import { getNeuroSettings } from '../utils/neuroux';

interface HomeScreenProps {
    onNav: (screen: string) => void;
    cbtCount?: number;
}

export default function HomeScreen({ onNav, cbtCount = 0 }: HomeScreenProps) {
    const [reduceAnimations, setReduceAnimations] = useState(false);

    useEffect(() => {
        const settings = getNeuroSettings();
        setReduceAnimations(settings.reduceAnimations);
    }, []);

    return (
        <div id="s-home" className="screen active flex flex-col overflow-y-auto pb-[130px] scrollbar-hide">
            <style jsx>{`
                #s-home {
                    background: linear-gradient(180deg, #070f1e 0%, var(--navy-2) 60%);
                    min-height: 100vh;
                }
                #s-home::before {
                    content: '';
                    position: fixed;
                    top: 60px; left: 50%; transform: translateX(-50%);
                    width: 300px; height: 220px;
                    background: radial-gradient(ellipse, rgba(74,168,204,0.08) 0%, transparent 70%);
                    pointer-events: none;
                }
                .home-head { padding: 42px 28px 0; }
                .home-label {
                    font-size: 10px; font-weight: 600; letter-spacing: 0.2em;
                    color: var(--muted); text-transform: uppercase; margin-bottom: 6px;
                }
                .home-greeting {
                    font-family: var(--serif); font-size: 44px; font-weight: 300;
                    line-height: 1.05; color: var(--white); letter-spacing: -0.02em;
                }
                .home-greeting em { font-style: italic; color: var(--sky-2); }
                .home-tagline { font-size: 12px; color: var(--muted); margin-top: 8px; letter-spacing: 0.06em; }

                .sos-strip {
                    margin: 22px 28px 0;
                    background: linear-gradient(135deg, rgba(217,64,64,0.08), rgba(217,64,64,0.04));
                    border: 1px solid rgba(217,64,64,0.2);
                    border-radius: var(--r-card);
                    padding: 16px 18px;
                    display: flex; align-items: center; gap: 16px;
                    cursor: pointer; transition: all 0.2s var(--ease);
                    position: relative; overflow: hidden;
                }
                .sos-strip::before {
                    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
                    width: 3px; background: var(--red); border-radius: 3px 0 0 3px;
                }
                .sos-strip:active { transform: scale(0.98); }

                .sos-dot {
                    width: 42px; height: 42px; background: var(--red);
                    border-radius: 12px; display: flex; align-items: center; justify-content: center;
                    font-size: 13px; font-weight: 800; color: white;
                    letter-spacing: 0.05em; flex-shrink: 0;
                    box-shadow: 0 0 16px rgba(217,64,64,0.45);
                    animation: ${reduceAnimations ? 'none' : 'sosDot 2.5s ease-in-out infinite'};
                }
                .sos-strip-text { flex: 1; }
                .sos-strip-title { font-size: 15px; font-weight: 600; color: #f08080; margin-bottom: 2px; }
                .sos-strip-sub { font-size: 11px; color: rgba(240,128,128,0.5); }
                .sos-strip-arrow { color: rgba(240,128,128,0.4); font-size: 20px; }

                .sec { padding: 26px 28px 0; }
                .sec-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
                .sec-label {
                    font-size: 10px; font-weight: 600; letter-spacing: 0.18em;
                    color: var(--muted); text-transform: uppercase;
                }
                .sec-link { font-size: 11px; color: var(--sky-1); font-weight: 500; cursor: pointer; opacity: 0.8; }

                .breath-card {
                    background: var(--navy-3); border: 1px solid rgba(255,255,255,0.05);
                    border-radius: var(--r-card); padding: 18px 20px;
                    display: flex; align-items: center; gap: 18px;
                    cursor: pointer; transition: all 0.2s var(--ease);
                }
                .breath-card:active { transform: scale(0.98); background: var(--navy-4); }

                .orb-wrap { width: 52px; height: 52px; position: relative; flex-shrink: 0; }
                .orb-ring {
                    position: absolute; inset: 0; border-radius: 50%;
                    border: 1px solid rgba(74,168,204,0.18);
                    animation: ${reduceAnimations ? 'none' : 'orbRing 4s ease-in-out infinite'};
                }
                .orb-ring.r2 { inset: -9px; animation-delay: 1.3s; }
                .orb {
                    position: absolute; inset: 10px; border-radius: 50%;
                    background: radial-gradient(circle at 38% 32%, #a8dff0, #4aaac8 55%, #1e6a8a);
                    animation: ${reduceAnimations ? 'none' : 'orbPulse 4s ease-in-out infinite'};
                    box-shadow: 0 0 14px rgba(74,168,204,0.35);
                }

                .rhythm { display: flex; gap: 5px; margin-bottom: 5px; }
                .rn {
                    width: 22px; height: 22px; background: var(--navy-4);
                    border: 1px solid rgba(255,255,255,0.07); border-radius: 7px;
                    font-size: 11px; font-weight: 600; color: var(--sky-1);
                    display: flex; align-items: center; justify-content: center;
                }
                .bc-name { font-size: 15px; font-weight: 500; color: var(--white); margin-bottom: 4px; }
                .bc-meta { font-size: 11px; color: var(--muted); }
                .bc-cta {
                    background: var(--sky-1); color: var(--navy-1);
                    font-size: 12px; font-weight: 700; padding: 8px 14px;
                    border-radius: var(--r-pill); border: none; cursor: pointer;
                    white-space: nowrap; transition: all 0.2s; flex-shrink: 0;
                }

                .tools { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .tool-card {
                    background: var(--navy-3); border: 1px solid rgba(255,255,255,0.05);
                    border-radius: var(--r-card); padding: 18px; cursor: pointer;
                    position: relative; transition: all 0.2s var(--ease);
                    min-height: 108px; display: flex; flex-direction: column; justify-content: flex-end;
                    overflow: hidden;
                }
                .tool-card:active { transform: scale(0.96); background: var(--navy-4); }
                .tool-ico {
                    width: 36px; height: 36px; border-radius: 11px;
                    background: rgba(74,168,204,0.08); display: flex;
                    align-items: center; justify-content: center; margin-bottom: 12px;
                }
                .tool-arr { position: absolute; top: 14px; right: 14px; opacity: 0.3; }
                .tool-name { font-size: 14px; font-weight: 600; color: var(--white); margin-bottom: 3px; }
                .tool-desc { font-size: 11px; color: var(--muted); line-height: 1.4; }

                .reflection {
                    margin: 0 28px; background: var(--navy-3);
                    border: 1px solid rgba(255,255,255,0.05); border-radius: var(--r-card);
                    padding: 22px; position: relative; overflow: hidden;
                }
                .reflection::before {
                    content: '"'; position: absolute; top: -18px; left: 14px;
                    font-family: var(--serif); font-size: 110px;
                    color: rgba(74,168,204,0.05); line-height: 1; pointer-events: none;
                }
                .refl-text {
                    font-family: var(--serif); font-style: italic; font-size: 16px;
                    line-height: 1.65; color: rgba(232,242,248,0.85); margin-bottom: 14px;
                }
                .refl-meta { font-size: 10px; letter-spacing: 0.14em; color: var(--muted); text-transform: uppercase; }
            `}</style>

            <div className="home-head">
                <div className="home-label">Tu espacio seguro</div>
                <div className="home-greeting">Buenos días,<br /><em>Jordi</em></div>
                <div className="home-tagline">Calma · Respira · Vive</div>
            </div>

            <div className="sos-strip" onClick={() => onNav('sc-sos')}>
                <div className="sos-dot">SOS</div>
                <div className="sos-strip-text">
                    <div className="sos-strip-title">Necesito ayuda ahora</div>
                    <div className="sos-strip-sub">Asistencia de crisis inmediata</div>
                </div>
                <div className="sos-strip-arrow">›</div>
            </div>

            <div className="sec">
                <div className="sec-head">
                    <div className="sec-label">Respiración Guiada</div>
                    <div className="sec-link" onClick={() => onNav('sc-breath')}>Ver todos →</div>
                </div>
                <div className="breath-card" onClick={() => onNav('sc-breath')}>
                    <div className="orb-wrap">
                        <div className="orb-ring"></div>
                        <div className="orb-ring r2"></div>
                        <div className="orb"></div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="rhythm"><div className="rn">4</div><div className="rn">2</div><div className="rn">6</div></div>
                        <div className="bc-name">Alivio del estrés profundo</div>
                        <div className="bc-meta">⏱ 5 min</div>
                    </div>
                    <button className="bc-cta">▶ Comenzar</button>
                </div>
            </div>

            <div className="sec">
                <div className="sec-head"><div className="sec-label">Herramientas</div></div>
                <div className="tools">
                    <div className="tool-card" onClick={() => onNav('sc-audio')}>
                        <div className="tool-ico">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4aa8cc" strokeWidth="1.6" strokeLinecap="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                        </div>
                        <div className="tool-arr"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M7 7h10v10" /></svg></div>
                        <div className="tool-name">Audios</div>
                        <div className="tool-desc">Sonidos y meditaciones guiadas</div>
                    </div>
                    <div className="tool-card" onClick={() => onNav('sc-notes')}>
                        <div className="tool-ico">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4aa8cc" strokeWidth="1.6" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></svg>
                        </div>
                        <div className="tool-arr"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M7 7h10v10" /></svg></div>
                        <div className="tool-name">Diario</div>
                        <div className="tool-desc">Reflexión diaria consciente</div>
                    </div>
                    <div className="tool-card" onClick={() => onNav('sc-games')}>
                        <div className="tool-ico">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4aa8cc" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                        </div>
                        <div className="tool-arr"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M7 7h10v10" /></svg></div>
                        <div className="tool-name">Juegos</div>
                        <div className="tool-desc">Distracción sana y terapéutica</div>
                    </div>
                    <div className="tool-card" onClick={() => onNav('sc-tools')}>
                        <div className="tool-ico">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4aa8cc" strokeWidth="1.6" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                        </div>
                        <div className="tool-arr"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M7 7h10v10" /></svg></div>
                        <div className="tool-name">Módulos</div>
                        <div className="tool-desc">TCC · ACT · Weekes</div>
                    </div>
                </div>
            </div>

            <div className="sec" style={{ paddingBottom: 0 }}>
                <div className="reflection">
                    <div className="refl-text">Tus sentimientos son válidos, pero no son tu destino. Respira y confía en el proceso.</div>
                    <div className="refl-meta">ANSIOFF · Reflexión de hoy</div>
                </div>
            </div>
        </div>
    );
}
