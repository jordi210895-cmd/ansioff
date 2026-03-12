'use client';

import { useState, useEffect } from 'react';
import { getNeuroSettings } from '../utils/neuroux';
import TopBar from './TopBar';

interface BreathingScreenProps {
    onBack: () => void;
}

interface Phase {
    t: string;
    n: number;
    ms: number;
}

const PATTERNS: Record<string, Phase[]> = {
    '4-2-6': [
        { t: 'Inhala', n: 4, ms: 4000 },
        { t: 'Mantén', n: 2, ms: 2000 },
        { t: 'Exhala', n: 6, ms: 6000 }
    ],
    '4-4-4': [
        { t: 'Inhala', n: 4, ms: 4000 },
        { t: 'Mantén', n: 4, ms: 4000 },
        { t: 'Exhala', n: 4, ms: 4000 },
        { t: 'Mantén', n: 4, ms: 4000 }
    ]
};

export default function BreathingScreen({ onBack }: BreathingScreenProps) {
    const [selectedPattern, setSelectedPattern] = useState<'4-2-6' | '4-4-4'>('4-2-6');
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [counter, setCounter] = useState(PATTERNS['4-2-6'][0].n);
    const [reduceAnimations, setReduceAnimations] = useState(false);

    useEffect(() => {
        const settings = getNeuroSettings();
        setReduceAnimations(settings.reduceAnimations);
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let countTimer: NodeJS.Timeout;

        const startPhase = (index: number) => {
            const phases = PATTERNS[selectedPattern];
            const phase = phases[index];
            setCounter(phase.n);

            countTimer = setInterval(() => {
                setCounter((prev) => (prev > 1 ? prev - 1 : phase.n));
            }, 1000);

            timer = setTimeout(() => {
                clearInterval(countTimer);
                const nextIndex = (index + 1) % phases.length;
                setPhaseIndex(nextIndex);
                startPhase(nextIndex);
            }, phase.ms);
        };

        setPhaseIndex(0);
        startPhase(0);

        return () => {
            clearTimeout(timer);
            clearInterval(countTimer);
        };
    }, [selectedPattern]);

    const currentPhases = PATTERNS[selectedPattern];
    const currentPhase = currentPhases[phaseIndex];

    return (
        <div id="s-breath" className="screen active flex flex-col items-center overflow-hidden">
            <style jsx>{`
                #s-breath {
                    background: var(--navy-2);
                    min-height: 100vh;
                    position: relative;
                }
                .breath-head { padding: 40px 28px 0; text-align: center; }
                .br-title {
                    font-family: var(--serif); font-size: 34px; font-weight: 300;
                    color: var(--white); margin-bottom: 10px;
                }
                .br-desc { font-size: 13px; color: var(--muted); max-width: 250px; margin: 0 auto; line-height: 1.5; }

                .rhythm-chips {
                    display: flex; gap: 8px; justify-content: center; margin-top: 24px;
                }
                .chip {
                    padding: 10px 18px; border-radius: var(--r-pill);
                    background: var(--navy-3); border: 1px solid rgba(255,255,255,0.06);
                    font-size: 11px; font-weight: 600; color: var(--muted); cursor: pointer;
                    transition: all 0.2s;
                }
                .chip.active {
                    background: var(--sky-1); color: var(--navy-1); border-color: var(--sky-1);
                }

                .orb-stage {
                    flex: 1; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; width: 100%;
                }
                .big-orb {
                    width: 180px; height: 180px; border-radius: 50%;
                    background: radial-gradient(circle at 35% 30%, #a8dff0, #4aaac8 60%, #1e6a8a);
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    box-shadow: 0 0 40px rgba(74,168,204,0.3);
                    animation: ${reduceAnimations ? 'none' : 'bigOrbBreath 12s ease-in-out infinite'};
                    /* Note: The 12s cycle should ideally match total sequence duration, 
                       but for simplicity we use a generic slow pulse or will need dynamic injection */
                }
                .orb-t1 { font-family: var(--serif); font-style: italic; font-size: 20px; color: var(--white); opacity: 0.9; margin-bottom: 2px; }
                .orb-t2 { font-size: 48px; font-weight: 300; color: var(--white); line-height: 1; }

                .phases-list {
                    width: 100%; padding: 0 28px 40px;
                }
                .ph-item {
                    display: flex; align-items: center; gap: 14px; padding: 12px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.04); opacity: 0.3; transition: all 0.4s;
                }
                .ph-item.active { opacity: 1; transform: translateX(4px); }
                .ph-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); }
                .ph-item.active .ph-dot { background: var(--sky-1); box-shadow: 0 0 10px var(--sky-1); }
                .ph-name { font-size: 14px; color: var(--white); font-weight: 500; flex: 1; }
                .ph-time { font-size: 12px; font-weight: 700; color: var(--sky-1); }
            `}</style>

            <TopBar title="" onBack={onBack} />

            <div className="breath-head">
                <div className="br-title">Respira profundamente</div>
                <div className="br-desc">Sincroniza tu ritmo con el orbe para calmar tu mente.</div>

                <div className="rhythm-chips">
                    <div className={`chip ${selectedPattern === '4-2-6' ? 'active' : ''}`} onClick={() => setSelectedPattern('4-2-6')}>Relajación 4-2-6</div>
                    <div className={`chip ${selectedPattern === '4-4-4' ? 'active' : ''}`} onClick={() => setSelectedPattern('4-4-4')}>Cuadrada 4-4-4</div>
                </div>
            </div>

            <div className="orb-stage">
                <div className="big-orb">
                    <div className="orb-t1">{currentPhase.t}</div>
                    <div className="orb-t2">{counter}</div>
                </div>
            </div>

            <div className="phases-list">
                {currentPhases.map((p, i) => (
                    <div key={i} className={`ph-item ${i === phaseIndex ? 'active' : ''}`}>
                        <div className="ph-dot"></div>
                        <div className="ph-name">{p.t}</div>
                        <div className="ph-time">{p.n}s</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

