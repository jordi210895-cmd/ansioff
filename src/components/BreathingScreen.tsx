'use client';

import { useState, useEffect } from 'react';
import { Wind, ChevronRight, Check } from 'lucide-react';
import { addBreathMins } from '../utils/stats';
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
    const [startTime] = useState<number>(Date.now());

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
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Respiración Guiada" onBack={onBack} />
            <div className="flex-1 flex flex-col items-center justify-between py-8 px-5 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="text-center w-full">
                    <h2 className="text-3xl font-light mb-3 leading-tight font-serif italic text-[#ddeef5]">
                        Calma tu sistema nervioso
                    </h2>
                    <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] mb-10">Sigue el ritmo del círculo para reducir el cortisol.</p>

                    {/* Pattern Selector */}
                    <div className="flex justify-center gap-3 mb-12">
                        {(['4-2-6', '4-6-7'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setSelectedPattern(p)}
                                className={`px-5 py-2.5 rounded-full text-xs tracking-wider font-semibold transition-colors flex items-center gap-2 ${selectedPattern === p
                                    ? 'bg-[#5aadcf] text-[#03080f]'
                                    : 'bg-transparent text-slate-300 border border-white/10 hover:bg-[rgba(255,255,255,0.05)]'
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
                    <div className="absolute inset-0 bg-[#5aadcf]/10 rounded-full blur-3xl animate-pulse"></div>

                    {/* Breathing Animation Wrapper */}
                    <div className="relative w-56 h-56 rounded-full border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center bg-[rgba(255,255,255,0.04)] backdrop-blur-sm shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-[#5aadcf]/5 animate-[pulse_4s_ease-in-out_infinite]"></div>
                        <div className="relative z-10 text-xl font-light text-[#ddeef5] mb-1 font-serif italic">{currentPhase.t}</div>
                        <div className="relative z-10 text-5xl font-light text-[#5aadcf]">{counter}</div>
                    </div>
                </div>

                <div className="w-full max-w-xs space-y-10 mt-8">
                    {/* Visual Progress */}
                    <div className="flex justify-center gap-2">
                        {currentPhases.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-500 ${i === phaseIndex ? 'w-8 bg-[#5aadcf] shadow-sm shadow-[#5aadcf]/50' : 'w-4 bg-[rgba(255,255,255,0.1)]'
                                    }`}
                            ></div>
                        ))}
                    </div>

                    {/* Pattern Description */}
                    <div className="flex justify-between p-4 bg-[rgba(255,255,255,0.04)] rounded-2xl border border-[rgba(255,255,255,0.07)]">
                        {currentPhases.slice(0, 3).map((p, i) => (
                            <div key={i} className="text-center px-2">
                                <div className="text-xl font-light text-[#ddeef5] font-serif">{p.n}s</div>
                                <div className="text-[10px] text-[rgba(200,225,235,0.38)] uppercase tracking-widest font-medium mt-1">{p.t}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full mt-12 mb-4">
                    <button
                        className="w-full bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.07)] text-[#ddeef5] rounded-2xl py-4 font-sans font-semibold text-xs tracking-wider transition-all duration-200 active:scale-95"
                        onClick={() => {
                            const minutes = Math.floor((Date.now() - startTime) / 60000);
                            if (minutes > 0) addBreathMins(minutes);
                            onBack();
                        }}
                    >
                        Finalizar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

