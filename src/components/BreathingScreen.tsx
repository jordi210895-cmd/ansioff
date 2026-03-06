'use client';

import { useState, useEffect } from 'react';
import { Wind, ChevronRight, Check } from 'lucide-react';
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
        { t: 'Exhala', n: 6, ms: 6000 },
        { t: 'Pausa', n: 2, ms: 2000 }
    ],
    '4-6-7': [
        { t: 'Inhala', n: 4, ms: 4000 },
        { t: 'Mantén', n: 6, ms: 6000 },
        { t: 'Exhala', n: 7, ms: 7000 },
        { t: 'Pausa', n: 1, ms: 1000 }
    ]
};

export default function BreathingScreen({ onBack }: BreathingScreenProps) {
    const [selectedPattern, setSelectedPattern] = useState<'4-2-6' | '4-6-7'>('4-2-6');
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [counter, setCounter] = useState(PATTERNS['4-2-6'][0].n);

    const currentPhases = PATTERNS[selectedPattern];
    const currentPhase = currentPhases[phaseIndex];

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

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
            <TopBar title="Respiración Guiada" onBack={onBack} />
            <div className="flex-1 flex flex-col items-center justify-between py-8 px-6 overflow-y-auto">
                <div className="text-center w-full">
                    <h2 className="text-3xl font-medium mb-3 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                        Calma tu sistema nervioso
                    </h2>
                    <p className="text-blue-300/50 text-sm mb-10">Sigue el ritmo del círculo para reducir el cortisol.</p>

                    {/* Pattern Selector */}
                    <div className="flex justify-center gap-3 mb-12">
                        {(['4-2-6', '4-6-7'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setSelectedPattern(p)}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-medium transition-all flex items-center gap-2 ${selectedPattern === p
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'bg-slate-900 text-blue-400 border border-slate-800'
                                    }`}
                            >
                                {selectedPattern === p && <Check className="w-3 h-3" />}
                                Patrón {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative flex items-center justify-center w-64 h-64">
                    {/* Outer Glows */}
                    <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>

                    {/* Breathing Animation Wrapper */}
                    <div className="relative w-56 h-56 rounded-full border border-blue-500/10 flex flex-col items-center justify-center bg-slate-900/30 backdrop-blur-sm shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/5 animate-[pulse_4s_ease-in-out_infinite]"></div>
                        <div className="relative z-10 text-xl font-medium text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>{currentPhase.t}</div>
                        <div className="relative z-10 text-5xl font-light text-blue-400">{counter}</div>
                    </div>
                </div>

                <div className="w-full max-w-xs space-y-10 mt-8">
                    {/* Visual Progress */}
                    <div className="flex justify-center gap-2">
                        {currentPhases.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-500 ${i === phaseIndex ? 'w-8 bg-blue-500 shadow-sm shadow-blue-500/50' : 'w-4 bg-slate-800'
                                    }`}
                            ></div>
                        ))}
                    </div>

                    {/* Pattern Description */}
                    <div className="flex justify-between p-4 bg-slate-900/40 rounded-3xl border border-slate-800/50">
                        {currentPhases.slice(0, 3).map((p, i) => (
                            <div key={i} className="text-center px-2">
                                <div className="text-xl font-medium text-white" style={{ fontFamily: 'Georgia, serif' }}>{p.n}s</div>
                                <div className="text-[10px] text-blue-400 uppercase tracking-widest">{p.t}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full mt-12 mb-4">
                    <button
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-white rounded-2xl py-4 font-medium transition-all active:scale-95"
                        onClick={onBack}
                    >
                        Finalizar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

