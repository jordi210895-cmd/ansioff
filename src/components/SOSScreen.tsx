'use client';

import { useState, useEffect } from 'react';
import { getNeuroSettings } from '../utils/neuroux';
import TopBar from './TopBar';

interface SOSScreenProps {
    onBack: () => void;
    onFinished: () => void;
}

export default function SOSScreen({ onBack, onFinished }: SOSScreenProps) {
    const [reduceAnimations, setReduceAnimations] = useState(false);

    useEffect(() => {
        const settings = getNeuroSettings();
        setReduceAnimations(settings.reduceAnimations);
    }, []);

    return (
        <div id="s-crisis" className="screen active flex flex-col items-center">
            <style jsx>{`
                #s-crisis {
                    background: var(--navy-2);
                    min-height: 100vh;
                    overflow: hidden;
                    position: relative;
                }
                .crisis-glow {
                    position: absolute;
                    top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(217,64,64,0.12) 0%, transparent 70%);
                    pointer-events: none;
                    animation: ${reduceAnimations ? 'none' : 'crisisGlow 4s ease-in-out infinite'};
                }
                .crisis-head {
                    padding: 60px 40px 0; text-align: center; z-index: 2;
                }
                .crisis-title {
                    font-family: var(--serif); font-size: 38px; font-weight: 300;
                    color: var(--white); line-height: 1.15; margin-bottom: 12px;
                }
                .crisis-title em { font-style: italic; color: #f08080; }
                .crisis-desc { font-size: 14px; color: var(--muted); max-width: 240px; margin: 0 auto; line-height: 1.5; }

                .sos-btn-wrap {
                    flex: 1; display: flex; align-items: center; justify-content: center;
                    position: relative; z-index: 2; width: 100%;
                }
                .sos-big {
                    width: 210px; height: 210px; border-radius: 50%;
                    background: radial-gradient(circle at 35% 30%, #ff5e5e, #d94040 50%, #9e2a2a);
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    cursor: pointer; box-shadow: 0 0 50px rgba(217,64,64,0.4), inset 0 4px 12px rgba(255,255,255,0.3);
                    transition: all 0.2s var(--ease); position: relative;
                    animation: ${reduceAnimations ? 'none' : 'sosDot 3s ease-in-out infinite'};
                }
                .sos-big:active { transform: scale(0.94); box-shadow: 0 0 20px rgba(217,64,64,0.3); }
                .sos-big::after {
                    content: ''; position: absolute; inset: -15px; border-radius: 50%;
                    border: 1px solid rgba(217,64,64,0.2);
                    animation: ${reduceAnimations ? 'none' : 'orbRing 3s ease-in-out infinite'};
                }
                .sos-t-1 { font-size: 42px; font-weight: 900; color: white; line-height: 1; letter-spacing: 0.04em; }
                .sos-t-2 { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

                .crisis-nav {
                    padding: 0 28px 60px; display: flex; flex-direction: column; gap: 12px;
                    width: 100%; z-index: 2;
                }
                .cpill {
                    background: var(--navy-3); border: 1px solid rgba(255,255,255,0.06);
                    border-radius: var(--r-pill); padding: 18px 24px;
                    display: flex; align-items: center; gap: 16px;
                    cursor: pointer; transition: all 0.2s;
                }
                .cpill:active { transform: scale(0.98); background: var(--navy-4); }
                .cp-ico { font-size: 20px; }
                .cp-txt { font-size: 14px; font-weight: 600; color: var(--white); flex: 1; }
                .cp-arr { color: var(--muted); font-size: 18px; }
            `}</style>

            <TopBar title="" onBack={onBack} />

            <div className="crisis-glow"></div>

            <div className="crisis-head">
                <div className="crisis-title">Manten la calma, <em>estás a salvo</em></div>
                <div className="crisis-desc">Pulsa el botón para iniciar la guía de anclaje rápido.</div>
            </div>

            <div className="sos-btn-wrap">
                <div className="sos-big" onClick={onFinished}>
                    <div className="sos-t-1">SOS</div>
                    <div className="sos-t-2">Comenzar</div>
                </div>
            </div>

            <div className="crisis-nav">
                <div className="cpill" onClick={onFinished}>
                    <div className="cp-ico">🫁</div>
                    <div className="cp-txt">Respiración de emergencia</div>
                    <div className="cp-arr">›</div>
                </div>
                <div className="cpill" onClick={onFinished}>
                    <div className="cp-ico">🧩</div>
                    <div className="cp-txt">Distracción cognitiva</div>
                    <div className="cp-arr">›</div>
                </div>
                <div className="cpill" onClick={onFinished}>
                    <div className="cp-ico">📞</div>
                    <div className="cp-txt">Llamar a un contacto</div>
                    <div className="cp-arr">›</div>
                </div>
            </div>
        </div>
    );
}
