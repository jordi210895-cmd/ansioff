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
            <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
                <TopBar title="Anclaje Rápido" onBack={onBack} />
                <div className="flex-1 flex flex-col items-center justify-between py-8 px-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="text-center">
                        <div className="text-[10px] uppercase tracking-widest text-[#d97c6a] mb-2 font-medium flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4" /> Guía de Crisis · Paso 1 de 2
                        </div>
                        <h1 className="text-3xl text-[#ddeef5] font-serif mb-4 leading-tight italic">Sigue el ritmo</h1>
                        <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] max-w-[240px] mx-auto italic">Tu cuerpo sabe cómo encontrar la calma de nuevo.</p>
                    </div>

                    <div className="relative flex items-center justify-center w-72 h-72 my-8">
                        {/* Outer Glows */}
                        <div className="absolute inset-0 bg-[#d97c6a]/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute inset-4 bg-[#d97c6a]/5 rounded-full blur-2xl"></div>

                        {/* The Circle */}
                        <div className="relative w-56 h-56 rounded-full border border-[#d97c6a]/25 flex flex-col items-center justify-center bg-[rgba(255,255,255,0.04)] backdrop-blur-md shadow-[0_0_30px_rgba(217,124,106,0.15)]">
                            <div className="text-2xl font-light font-serif text-[#ddeef5] mb-1 italic">{BREATH_PHASES[breathPhase].t}</div>
                            <div className="text-[56px] font-light text-[#d97c6a] leading-none mb-4">{counter}</div>
                        </div>
                    </div>

                    <div className="w-full max-w-xs space-y-4">
                        <button
                            onClick={() => setMode('GROUNDING')}
                            className="w-full bg-[#d97c6a] hover:bg-[#e08c7c] text-[#03080f] font-semibold text-xs tracking-wider rounded-full py-4 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#d97c6a]/20"
                        >
                            <span>Continuar al Grounding</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setMode('GAMES_DISCLAIMER')}
                            className="w-full py-2 bg-transparent text-[rgba(200,225,235,0.38)] hover:text-[#ddeef5] text-xs font-semibold tracking-wider transition-colors flex items-center justify-center gap-2"
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
            <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
                <TopBar title="Técnica 5-4-3-2-1" onBack={() => setMode('BREATHING')} />
                <div className="flex-1 overflow-y-auto px-5 py-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="text-[10px] uppercase tracking-widest text-[#d97c6a] mb-6 font-medium">
                        Paso 2 de 2 · Sentidos
                    </div>
                    <h2 className="text-3xl font-serif text-[#ddeef5] mb-3 leading-tight italic">
                        <span dangerouslySetInnerHTML={{ __html: g.t.replace('#e07d6a', '#d97c6a') }} />
                    </h2>
                    <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] mb-8">{g.s}</p>

                    <div className="space-y-2">
                        {g.items.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => toggleGroundItem(i)}
                                className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-transform duration-200 hover:-translate-y-0.5 text-left border ${groundItemsDone.includes(i) ? 'bg-[#d97c6a]/15 border-[#d97c6a]/30' : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.06)]'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${groundItemsDone.includes(i) ? 'bg-[#d97c6a] text-[#03080f]' : 'bg-[rgba(255,255,255,0.05)] text-[rgba(200,225,235,0.38)]'}`}>
                                    {groundItemsDone.includes(i) ? '✓' : i + 1}
                                </div>
                                <div className={`font-sans font-medium text-[15px] transition-colors ${groundItemsDone.includes(i) ? 'text-[#ddeef5]' : 'text-[rgba(200,225,235,0.38)] italic font-light'}`}>
                                    {groundItemsDone.includes(i) ? item : 'Identifica algo...'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-5 bg-[#03080f]/95 backdrop-blur-3xl border-t border-[rgba(255,255,255,0.06)]">
                    <button
                        className="w-full bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f] font-semibold text-xs tracking-wider rounded-full py-4 transition-colors shadow-lg"
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
            <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
                <TopBar title="Anclaje Mental" onBack={() => setMode('GAMES_DISCLAIMER')} />
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-[#0e1d2e] border border-[rgba(255,255,255,0.07)] flex items-center gap-4 p-5 rounded-2xl mb-6">
                        <Sparkles className="w-6 h-6 text-[#c9a96e]" />
                        <p className="font-sans font-light text-sm text-[#ddeef5] leading-relaxed">Activa tu mente analítica para silenciar la ansiedad.</p>
                    </div>

                    <button
                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] p-5 rounded-2xl text-left transition-transform duration-200 hover:-translate-y-0.5 group"
                        onClick={() => setMode('GAME_TETRIS')}
                    >
                        <div className="w-14 h-14 bg-[#5aadcf]/20 rounded-full flex items-center justify-center mb-4 text-[24px]">🧩</div>
                        <h3 className="text-xl font-serif text-[#ddeef5] italic mb-1">Tetris Mindful</h3>
                        <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)]">Anclaje visual y rítmico.</p>
                    </button>

                    <button
                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] p-5 rounded-2xl text-left transition-transform duration-200 hover:-translate-y-0.5 group"
                        onClick={() => setMode('GAME_SUBTRACTION')}
                    >
                        <div className="w-14 h-14 bg-[#c9a96e]/20 rounded-full flex items-center justify-center mb-4 text-[24px]">🔢</div>
                        <h3 className="text-xl font-serif text-[#ddeef5] italic mb-1">Restas en Cascada</h3>
                        <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)]">Activa la corteza prefrontal.</p>
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
