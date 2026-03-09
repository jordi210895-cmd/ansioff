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
    { t: '5 cosas que <span className="text-blue-400">ves</span>', s: 'Mira a tu alrededor y nombra 5 cosas que puedes ver ahora mismo.', n: 5, items: ['Una silla o mueble cercano', 'La luz de la habitación', 'Tus propias manos', 'Una ventana o pared', 'El suelo o el techo'] },
    { t: '4 cosas que <span className="text-blue-400">tocas</span>', s: 'Siente 4 texturas: tu ropa, la silla, el suelo...', n: 4, items: ['Mi ropa sobre la piel', 'La silla o el suelo', 'Mi propio brazo', 'Una superficie cerca'] },
    { t: '3 sonidos que <span className="text-blue-400">oyes</span>', s: 'Cierra los ojos. ¿Qué 3 sonidos escuchas?', n: 3, items: ['El tráfico o el exterior', 'Mi propia respiración', 'Un sonido interior'] },
    { t: '2 aromas que <span className="text-blue-400">hueles</span>', s: 'Identifica 2 olores en el ambiente.', n: 2, items: ['El aire de la habitación', 'Mi ropa o colonia'] },
    { t: '1 sabor que <span className="text-blue-400">sientes</span>', s: 'Presta atención al sabor en tu boca ahora.', n: 1, items: ['El sabor en mi boca ahora'] },
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
            <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
                <TopBar title="Anclaje Rápido" onBack={onBack} />
                <div className="flex-1 flex flex-col items-center justify-between py-8 screen-px">
                    <div className="text-center">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-blue-500 mb-2 font-semibold flex items-center justify-center gap-2">
                            <Shield className="w-3 h-3" /> Guía de Crisis · Paso 1 de 2
                        </div>
                        <h1 className="text-4xl font-medium mb-4" style={{ fontFamily: 'Georgia, serif' }}>Sigue el ritmo</h1>
                        <p className="text-blue-300/60 text-sm max-w-[240px] mx-auto italic">Tu cuerpo sabe cómo encontrar la calma de nuevo.</p>
                    </div>

                    <div className="relative flex items-center justify-center w-64 h-64">
                        {/* Outer Glows */}
                        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute inset-4 bg-blue-600/5 rounded-full blur-2xl"></div>

                        {/* The Circle */}
                        <div className="relative w-48 h-48 rounded-full border border-blue-500/20 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm shadow-2xl">
                            <div className="text-2xl font-medium text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>{BREATH_PHASES[breathPhase].t}</div>
                            <div className="text-5xl font-light text-blue-400">{counter}</div>
                        </div>
                    </div>

                    <div className="w-full max-w-xs space-y-4">
                        <button
                            onClick={() => setMode('GROUNDING')}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                        >
                            <span className="font-medium">Continuar al Grounding</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setMode('GAMES_DISCLAIMER')}
                            className="w-full py-2 text-blue-400/50 text-xs hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
                        >
                            <Brain className="w-3 h-3" /> Necesito distracción (Juegos)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'GROUNDING') {
        const g = GROUNDING_DATA[groundStep];
        return (
            <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
                <TopBar title="Técnica 5-4-3-2-1" onBack={() => setMode('BREATHING')} />
                <div className="flex-1 overflow-y-auto screen-px py-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-blue-500/60 mb-6 font-semibold">
                        Paso 2 de 2 · Sentidos
                    </div>
                    <h2 className="text-4xl font-medium mb-3 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                        <span dangerouslySetInnerHTML={{ __html: g.t }} />
                    </h2>
                    <p className="text-blue-300/50 text-sm mb-8">{g.s}</p>

                    <div className="space-y-px bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-800">
                        {g.items.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => toggleGroundItem(i)}
                                className={`w-full flex items-center gap-4 p-5 transition-all text-left ${groundItemsDone.includes(i) ? 'bg-blue-600/10' : 'bg-transparent hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${groundItemsDone.includes(i)
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'border-2 border-slate-700 text-slate-500'
                                    }`}>
                                    {groundItemsDone.includes(i) ? '✓' : i + 1}
                                </div>
                                <div className={`text-base font-medium transition-all ${groundItemsDone.includes(i) ? 'text-white' : 'text-slate-500 italic'
                                    }`}>
                                    {groundItemsDone.includes(i) ? item : 'Identifica algo...'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-6 bg-slate-950/80 backdrop-blur-md">
                    <button
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-white rounded-2xl py-4 font-medium transition-all active:scale-95 shadow-xl"
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
            <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
                <TopBar title="Anclaje Mental" onBack={() => setMode('GAMES_DISCLAIMER')} />
                <div className="flex-1 overflow-y-auto p-8 space-y-4">
                    <div className="bg-blue-600 flex items-center gap-3 p-4 rounded-2xl mb-6 shadow-lg shadow-blue-600/20">
                        <Sparkles className="w-5 h-5 text-white" />
                        <p className="text-white/90 text-[13px] leading-tight">Activa tu mente analítica para silenciar la ansiedad.</p>
                    </div>

                    <button
                        className="w-full bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl text-left transition-all active:scale-[0.98]"
                        onClick={() => setMode('GAME_TETRIS')}
                    >
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/40 text-xl">🧩</div>
                        <h3 className="text-xl font-medium mb-1 text-white" style={{ fontFamily: 'Georgia, serif' }}>Tetris Mindful</h3>
                        <p className="text-blue-400 text-xs">Anclaje visual y rítmico.</p>
                    </button>

                    <button
                        className="w-full bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl text-left transition-all active:scale-[0.98]"
                        onClick={() => setMode('GAME_SUBTRACTION')}
                    >
                        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/40 text-xl">🔢</div>
                        <h3 className="text-xl font-medium mb-1 text-white" style={{ fontFamily: 'Georgia, serif' }}>Restas en Cascada</h3>
                        <p className="text-blue-400 text-xs">Activa la corteza prefrontal.</p>
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
