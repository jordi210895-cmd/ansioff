'use client';

import { useState, useEffect } from 'react';
import { Shield, ArrowRight, Brain, Sparkles } from 'lucide-react';
import { addSosUse } from '../utils/stats';
import TopBar from './TopBar';
import SOSDisclaimer from './SOSGames/SOSDisclaimer';
import MindfulTetris from './SOSGames/MindfulTetris';
import CognitiveSubtraction from './SOSGames/CognitiveSubtraction';

interface SOSScreenProps {
    onBack: () => void;
    onFinished: () => void;
}

const BREATH_PHASES = [
    { t: 'Inhala', n: 4, ms: 4000 },
    { t: 'Mantén', n: 2, ms: 2000 },
    { t: 'Exhala', n: 6, ms: 6000 }
];

const GROUNDING_DATA = [
    { t: '5 cosas que <span className="text-[#e07d6a]">ves</span>', s: 'Mira a tu alrededor y nombra 5 cosas que puedes ver ahora mismo.', n: 5, items: ['Una silla o mueble cercano', 'La luz de la habitación', 'Tus propias manos', 'Una ventana o pared', 'El suelo o el techo'] },
    { t: '4 cosas que <span className="text-[#e07d6a]">tocas</span>', s: 'Siente 4 texturas: tu ropa, la silla, el suelo...', n: 4, items: ['Mi ropa sobre la piel', 'La silla o el suelo', 'Mi propio brazo', 'Una superficie cerca'] },
    { t: '3 sonidos que <span className="text-[#e07d6a]">oyes</span>', s: 'Cierra los ojos. ¿Qué 3 sonidos escuchas?', n: 3, items: ['El tráfico o el exterior', 'Mi propia respiración', 'Un sonido interior'] },
    { t: '2 aromas que <span className="text-[#e07d6a]">hueles</span>', s: 'Identifica 2 olores en el ambiente.', n: 2, items: ['El aire de la habitación', 'Mi ropa o colonia'] },
    { t: '1 sabor que <span className="text-[#e07d6a]">sientes</span>', s: 'Presta atención al sabor en tu boca ahora.', n: 1, items: ['El sabor en mi boca ahora'] },
];

type SOSMode = 'BREATHING' | 'GROUNDING' | 'GAMES_DISCLAIMER' | 'GAMES_MENU' | 'GAME_TETRIS' | 'GAME_SUBTRACTION';

export default function SOSScreen({ onBack, onFinished }: SOSScreenProps) {
    const [mode, setMode] = useState<SOSMode>('BREATHING');
    const [breathPhase, setBreathPhase] = useState(0);
    const [counter, setCounter] = useState(BREATH_PHASES[0].n);
    const [groundStep, setGroundStep] = useState(0);
    const [groundItemsDone, setGroundItemsDone] = useState<number[]>([]);

    useEffect(() => {
        if (mode !== 'BREATHING') return;

        let timer: NodeJS.Timeout;
        let countTimer: NodeJS.Timeout;

        const run = (idx: number) => {
            const p = BREATH_PHASES[idx];
            setCounter(p.n);
            countTimer = setInterval(() => {
                setCounter(c => c > 1 ? c - 1 : p.n);
            }, 1000);

            timer = setTimeout(() => {
                clearInterval(countTimer);
                const nxt = (idx + 1) % BREATH_PHASES.length;
                setBreathPhase(nxt);
                run(nxt);
            }, p.ms);
        };

        run(0);
        return () => { clearTimeout(timer); clearInterval(countTimer); };
    }, [mode]);

    const handleNextGround = () => {
        if (groundStep < 4) {
            setGroundStep(s => s + 1);
            setGroundItemsDone([]);
        } else {
            addSosUse(); // Gamification tracking for completing a crisis grounding session
            onFinished(); // Navigate back to home
            setMode('GAMES_DISCLAIMER'); // Prep state just in case
        }
    };

    const toggleGroundItem = (idx: number) => {
        setGroundItemsDone(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    if (mode === 'BREATHING') {
        return (
            <div className="flex flex-col h-full bg-[#06101a] text-white overflow-hidden">
                <TopBar title="Anclaje Rápido" onBack={onBack} />
                <div className="flex-1 flex flex-col items-center justify-between py-8 screen-px">
                    <div className="text-center">
                        <div className="text-[11px] uppercase tracking-[0.15em] text-[#e07d6a] mb-2 font-medium flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4" /> Guía de Crisis · Paso 1 de 2
                        </div>
                        <h1 className="text-[32px] text-[#e8f4f8] font-serif mb-4 leading-tight">Sigue el ritmo</h1>
                        <p className="text-[#f0a898]/70 text-[14px] max-w-[240px] mx-auto italic font-serif">Tu cuerpo sabe cómo encontrar la calma de nuevo.</p>
                    </div>

                    <div className="relative flex items-center justify-center w-72 h-72">
                        {/* Outer Glows */}
                        <div className="absolute inset-0 bg-[#e07d6a]/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute inset-4 bg-[#e07d6a]/5 rounded-full blur-2xl"></div>

                        {/* The Circle */}
                        <div className="relative w-56 h-56 rounded-full border border-[#e07d6a]/25 flex flex-col items-center justify-center bg-[#1a2e42]/40 backdrop-blur-md shadow-[0_0_30px_rgba(224,125,106,0.15)]">
                            <div className="text-[22px] font-serif text-[#e8f4f8] mb-1">{BREATH_PHASES[breathPhase].t}</div>
                            <div className="text-[56px] font-light text-[#e07d6a] leading-none">{counter}</div>
                        </div>
                    </div>

                    <div className="w-full max-w-xs space-y-4">
                        <button
                            onClick={() => setMode('GROUNDING')}
                            className="w-full bg-[#e07d6a] hover:bg-[#c26a58] text-[#0d1b2a] rounded-[20px] py-4 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#e07d6a]/20"
                        >
                            <span className="font-semibold text-[15px]">Continuar al Grounding</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setMode('GAMES_DISCLAIMER')}
                            className="w-full py-2 text-white/30 text-[13px] hover:text-white/60 transition-colors flex items-center justify-center gap-2"
                        >
                            <Brain className="w-4 h-4" /> Necesito distracción (Juegos)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'GROUNDING') {
        const g = GROUNDING_DATA[groundStep];
        return (
            <div className="flex flex-col h-full bg-[#06101a] text-white overflow-hidden">
                <TopBar title="Técnica 5-4-3-2-1" onBack={() => setMode('BREATHING')} />
                <div className="flex-1 overflow-y-auto screen-px py-4">
                    <div className="text-[11px] uppercase tracking-[0.15em] text-[#e07d6a]/80 mb-6 font-medium">
                        Paso 2 de 2 · Sentidos
                    </div>
                    <h2 className="text-[32px] font-serif text-[#e8f4f8] mb-3 leading-tight">
                        <span dangerouslySetInnerHTML={{ __html: g.t }} />
                    </h2>
                    <p className="text-white/50 text-[14px] mb-8">{g.s}</p>

                    <div className="space-y-px bg-white/[0.02] rounded-[24px] overflow-hidden border border-white/5">
                        {g.items.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => toggleGroundItem(i)}
                                className={`w-full flex items-center gap-4 p-5 transition-all text-left ${groundItemsDone.includes(i) ? 'bg-[#e07d6a]/15' : 'bg-transparent hover:bg-white/[0.04]'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${groundItemsDone.includes(i)
                                    ? 'bg-[#e07d6a] text-[#0d1b2a] shadow-lg shadow-[#e07d6a]/30'
                                    : 'border border-white/20 text-white/30'
                                    }`}>
                                    {groundItemsDone.includes(i) ? '✓' : i + 1}
                                </div>
                                <div className={`text-[15px] font-medium transition-all ${groundItemsDone.includes(i) ? 'text-[#e8f4f8]' : 'text-white/40 italic'
                                    }`}>
                                    {groundItemsDone.includes(i) ? item : 'Identifica algo...'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-6 bg-[#0d1b2a]/95 backdrop-blur-xl border-t border-white/5">
                    <button
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e07d6a]/50 text-[#e8f4f8] rounded-[20px] py-4 font-medium transition-all active:scale-95 shadow-xl"
                        onClick={handleNextGround}
                    >
                        {groundStep < 4 ? 'Siguiente sentido →' : 'Finalizar sesión'}
                    </button>
                </div>
            </div>
        );
    }

    if (mode === 'GAMES_DISCLAIMER') {
        return <SOSDisclaimer onAccept={() => setMode('GAMES_MENU')} onCancel={() => setMode('BREATHING')} />;
    }

    if (mode === 'GAMES_MENU') {
        return (
            <div className="flex flex-col h-full bg-[#06101a] text-white overflow-hidden">
                <TopBar title="Anclaje Mental" onBack={() => setMode('GAMES_DISCLAIMER')} />
                <div className="flex-1 overflow-y-auto p-8 space-y-5">
                    <div className="bg-gradient-to-r from-[#1a2e42] to-[#1e3349] border border-[#7ec8e3]/30 flex items-center gap-4 p-5 rounded-[24px] mb-8 shadow-lg">
                        <Sparkles className="w-6 h-6 text-[#7ec8e3]" />
                        <p className="text-[#e8f4f8]/90 text-[14px] leading-relaxed">Activa tu mente analítica para silenciar la ansiedad.</p>
                    </div>

                    <button
                        className="w-full bg-white/[0.03] border border-white/5 hover:border-[#7ec8e3]/40 hover:bg-white/[0.06] p-6 rounded-[28px] text-left transition-all active:scale-[0.98] group shadow-md"
                        onClick={() => setMode('GAME_TETRIS')}
                    >
                        <div className="w-14 h-14 bg-[#7ec8e3] rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-[#7ec8e3]/20 text-[24px] transform group-hover:scale-110 transition-transform">🧩</div>
                        <h3 className="text-[20px] font-serif mb-1 text-[#e8f4f8]">Tetris Mindful</h3>
                        <p className="text-white/50 text-[13px]">Anclaje visual y rítmico.</p>
                    </button>

                    <button
                        className="w-full bg-white/[0.03] border border-white/5 hover:border-[#b48cdc]/40 hover:bg-white/[0.06] p-6 rounded-[28px] text-left transition-all active:scale-[0.98] group shadow-md"
                        onClick={() => setMode('GAME_SUBTRACTION')}
                    >
                        <div className="w-14 h-14 bg-[#b48cdc] rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-[#b48cdc]/20 text-[24px] transform group-hover:scale-110 transition-transform">🔢</div>
                        <h3 className="text-[20px] font-serif mb-1 text-[#e8f4f8]">Restas en Cascada</h3>
                        <p className="text-white/50 text-[13px]">Activa la corteza prefrontal.</p>
                    </button>
                </div>
            </div>
        );
    }

    if (mode === 'GAME_TETRIS') {
        return <MindfulTetris onBack={() => setMode('GAMES_MENU')} />;
    }

    if (mode === 'GAME_SUBTRACTION') {
        return <CognitiveSubtraction onBack={() => setMode('GAMES_MENU')} />;
    }

    return null;
}
