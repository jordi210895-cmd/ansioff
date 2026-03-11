'use client';

import { useState, useEffect } from 'react';
import { Shield, ArrowRight, Brain, Sparkles, ChevronLeft } from 'lucide-react';
import { addSosUse } from '../utils/stats';
import TopBar from './TopBar';
import SOSDisclaimer from './SOSGames/SOSDisclaimer';
import MindfulTetris from './SOSGames/MindfulTetris';
import CognitiveSubtraction from './SOSGames/CognitiveSubtraction';

interface SOSScreenProps {
    onBack: () => void;
    onFinished: () => void;
    onNav?: (screen: string) => void;
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

type SOSMode = 'HUB' | 'BREATHING' | 'GROUNDING' | 'GAMES_DISCLAIMER' | 'GAMES_MENU' | 'GAME_TETRIS' | 'GAME_SUBTRACTION';

export default function SOSScreen({ onBack, onFinished, onNav }: SOSScreenProps) {
    const [mode, setMode] = useState<SOSMode>('HUB');
    const [breathPhase, setBreathPhase] = useState(0);
    const [counter, setCounter] = useState(BREATH_PHASES[0].n);
    const [groundStep, setGroundStep] = useState(0);
    const [groundTexts, setGroundTexts] = useState<string[]>([]);

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
            setGroundTexts([]);
        } else {
            addSosUse(); // Gamification tracking for completing a crisis grounding session
            onFinished(); // Navigate back to home
            setMode('GAMES_DISCLAIMER'); // Prep state just in case
        }
    };

    const handleGroundTextChange = (idx: number, val: string) => {
        setGroundTexts(prev => {
            const next = [...prev];
            next[idx] = val;
            return next;
        });
    };

    if (mode === 'HUB') {
        return (
            <div className="flex flex-col h-full bg-[#111927] text-white relative overflow-hidden" style={{ minHeight: '100vh' }}>
                <style jsx>{`
                    .noise-overlay {
                        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
                        opacity: 0.025;
                        pointer-events: none;
                        z-index: 10;
                    }

                    @keyframes ambientPulse {
                        0%, 100% { opacity: 0.7; transform: translate(-50%, -55%) scale(1); }
                        50% { opacity: 1; transform: translate(-50%, -55%) scale(1.08); }
                    }

                    @keyframes sosGlow {
                        0%, 100% { opacity: 0.6; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.08); }
                    }

                    @keyframes sosPulse {
                        0%, 100% { box-shadow: 0 0 0 3px rgba(220,60,60,0.3), 0 0 30px rgba(200,30,30,0.6), 0 6px 30px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,120,120,0.25), inset 0 -4px 12px rgba(80,0,0,0.4); }
                        50% { box-shadow: 0 0 0 6px rgba(220,60,60,0.2), 0 0 55px rgba(200,30,30,0.8), 0 6px 30px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,120,120,0.25), inset 0 -4px 12px rgba(80,0,0,0.4); }
                    }

                    .quick-circle::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0;
                        height: 50%;
                        background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent);
                        border-radius: 50% 50% 0 0;
                    }
                `}</style>

                {/* Texture overlay */}
                <div className="absolute inset-0 noise-overlay"></div>

                {/* Custom App header with Back Button */}
                <div className="text-center pt-[18px] pb-[14px] border-b border-[rgba(255,255,255,0.06)] relative z-20">
                    <button onClick={onBack} className="absolute left-4 top-[22px] p-2 text-white/70 hover:text-white transition-opacity z-50">
                        <ChevronLeft size={28} className="stroke-[1.5]" />
                    </button>
                    <div className="text-[17px] font-bold text-white tracking-[0.08em]">ANSIOFF</div>
                    <div className="text-[11px] font-medium text-[#4d9ec4] tracking-[0.18em] mt-[3px]">TU ESPACIO SEGURO</div>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col items-center justify-center px-[30px] relative z-20">

                    {/* Ambient background glow behind everything */}
                    <div className="absolute top-1/2 left-1/2 w-[320px] h-[320px] pointer-events-none -z-10"
                        style={{
                            background: 'radial-gradient(circle, rgba(180,30,30,0.18) 0%, transparent 65%)',
                            animation: 'ambientPulse 3s ease-in-out infinite'
                        }}>
                    </div>

                    <div className="text-[32px] font-light text-white text-center leading-[1.25] mb-[36px] tracking-[-0.01em]">
                        ¿Necesitas ayuda<br />ahora?
                    </div>

                    {/* SOS Button */}
                    <div
                        className="relative w-[168px] h-[168px] flex items-center justify-center mb-[44px] cursor-pointer group active:scale-95 transition-transform duration-200"
                        onClick={() => setMode('BREATHING')}
                    >
                        {/* Outermost glow layer */}
                        <div className="absolute -inset-[30px] rounded-full group-active:opacity-100 opacity-60 transition-opacity"
                            style={{
                                background: 'radial-gradient(circle, rgba(220,50,50,0.22) 0%, transparent 70%)',
                                animation: 'sosGlow 2.5s ease-in-out infinite'
                            }}>
                        </div>

                        {/* Mid glow ring */}
                        <div className="absolute -inset-[10px] rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(200,40,40,0.35) 0%, rgba(160,20,20,0.1) 55%, transparent 70%)',
                                animation: 'sosGlow 2.5s ease-in-out infinite',
                                animationDelay: '0.3s'
                            }}>
                        </div>

                        {/* Main circle */}
                        <div className="absolute inset-0 rounded-full transition-transform duration-200 group-active:scale-95"
                            style={{
                                background: 'radial-gradient(circle at 40% 30%, #e84040, #c42020 45%, #991010 100%)',
                                animation: 'sosPulse 2.5s ease-in-out infinite'
                            }}>
                        </div>

                        {/* SOS label */}
                        <div className="relative z-10 flex flex-col items-center gap-[6px] pointer-events-none">
                            <span className="text-[34px] font-[800] text-white tracking-[0.06em] leading-none" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>SOS</span>
                            <span className="text-[22px] leading-none">🛟</span>
                            <span className="text-[11px] font-medium text-[rgba(255,255,255,0.7)] tracking-[0.03em] text-center mt-[2px]">Guía de anclaje rápido</span>
                        </div>
                    </div>

                    {/* Quick access */}
                    <div className="flex gap-[22px] mb-[28px]">
                        <div className="flex flex-col items-center gap-[10px] cursor-pointer group" onClick={() => onNav && onNav('sc-breath')}>
                            <div className="quick-circle w-[70px] h-[70px] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-[rgba(77,158,196,0.5)] group-active:scale-[0.93] border border-[rgba(77,158,196,0.2)]"
                                style={{ background: 'radial-gradient(circle at 40% 35%, #1e2d3e, #141e2c)', boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7eb8d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6c0 0-2-2-5-1S3 9 3 12s1 5 4 6c1.5.5 3 .2 4-.5" /><path d="M12 6c0 0 2-2 5-1s4 4 4 7-1 5-4 6c-1.5.5-3 .2-4-.5" /><path d="M12 6v12" /></svg>
                            </div>
                            <div className="text-[12px] text-[#c8d8e8] font-normal tracking-[0.01em]">Respiración</div>
                        </div>

                        <div className="flex flex-col items-center gap-[10px] cursor-pointer group" onClick={() => onNav && onNav('sc-audio')}>
                            <div className="quick-circle w-[70px] h-[70px] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-[rgba(77,158,196,0.5)] group-active:scale-[0.93] border border-[rgba(77,158,196,0.2)]"
                                style={{ background: 'radial-gradient(circle at 40% 35%, #1e2d3e, #141e2c)', boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7eb8d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3v-6z" /><path d="M21 14h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v-6z" /><path d="M5 14V9a7 7 0 0 1 14 0v5" /></svg>
                            </div>
                            <div className="text-[12px] text-[#c8d8e8] font-normal tracking-[0.01em]">Sonidos</div>
                        </div>

                        <div className="flex flex-col items-center gap-[10px] cursor-pointer group" onClick={() => onNav && onNav('sc-notes')}>
                            <div className="quick-circle w-[70px] h-[70px] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-[rgba(77,158,196,0.5)] group-active:scale-[0.93] border border-[rgba(77,158,196,0.2)]"
                                style={{ background: 'radial-gradient(circle at 40% 35%, #1e2d3e, #141e2c)', boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7eb8d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></svg>
                            </div>
                            <div className="text-[12px] text-[#c8d8e8] font-normal tracking-[0.01em]">Notas</div>
                        </div>

                        <div className="flex flex-col items-center gap-[10px] cursor-pointer group" onClick={() => onNav && onNav('sc-games')}>
                            <div className="quick-circle w-[70px] h-[70px] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-[rgba(77,158,196,0.5)] group-active:scale-[0.93] border border-[rgba(77,158,196,0.2)]"
                                style={{ background: 'radial-gradient(circle at 40% 35%, #1e2d3e, #141e2c)', boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7eb8d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527-.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.69a.979.979 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.402 2.402 0 0 1 1.705-.707 2.402 2.402 0 0 1 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z" /></svg>
                            </div>
                            <div className="text-[12px] text-[#c8d8e8] font-normal tracking-[0.01em]">Juegos</div>
                        </div>
                    </div>

                    <div className="text-[14px] text-[#5a7a94] text-center leading-[1.6] font-normal">
                        Guía inmediata para crisis de pánico.<br />Acceso rápido.
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'BREATHING') {
        return (
            <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
                <TopBar title="Anclaje Rápido" onBack={() => setMode('HUB')} />
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

                    <div className="space-y-3">
                        {Array.from({ length: g.n }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${groundTexts[i]?.trim() ? 'bg-[#d97c6a] text-[#03080f]' : 'bg-[rgba(255,255,255,0.05)] text-[rgba(200,225,235,0.38)]'}`}>
                                    {groundTexts[i]?.trim() ? '✓' : i + 1}
                                </div>
                                <input
                                    type="text"
                                    value={groundTexts[i] || ''}
                                    onChange={(e) => handleGroundTextChange(i, e.target.value)}
                                    placeholder={g.items[i] ? `Ej: ${g.items[i]}` : 'Escribe...'}
                                    className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl px-4 py-4 text-[#ddeef5] placeholder-[rgba(200,225,235,0.3)] focus:outline-none focus:border-[#d97c6a]/50 focus:bg-[#d97c6a]/5 transition-all text-sm font-light font-sans shadow-sm"
                                />
                            </div>
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
