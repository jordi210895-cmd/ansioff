'use client';

import React from 'react';
import { Wind, Volume2, BookOpen, Gamepad2, GraduationCap, Clock, ChevronRight, AlertTriangle, LockKeyhole } from 'lucide-react';

interface HomeScreenProps {
    onNav: (screen: string) => void;
    cbtCount?: number;
    trackCount?: number;
    userName?: string;
    isPremium?: boolean;
}

export default function HomeScreen({ onNav, cbtCount = 0, trackCount = 0, userName = "Jordi", isPremium = false }: HomeScreenProps) {
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', month: 'short', day: 'numeric' });

    return (
        <div className="min-h-full bg-[#03080f] text-[#ddeef5] overflow-y-auto pb-32 font-sans relative scrollbar-hide">
            
            {/* Soft background glows (Matching the aurora of other screens) */}
            <div className="aurora">
                <div className="aurora-1" style={{ background: 'radial-gradient(circle, rgba(90, 173, 207, 0.4), transparent 70%)', top: '-100px', left: '-60px' }}></div>
                <div className="aurora-2" style={{ background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25), transparent 70%)', bottom: '100px', right: '-80px' }}></div>
            </div>

            <div className="relative z-10 px-5">
                {/* Header */}
                <div className="home-safe-header flex items-center justify-between pb-6">
                    <div className="flex items-center gap-2">
                        {/* Styled A logo aligned with the sky-blue palette */}
                        <div className="relative flex items-center justify-center">
                            <span className="text-2xl italic font-serif bg-clip-text text-transparent bg-gradient-to-br from-sky-200 to-[#5aadcf]">A</span>
                            <div className="absolute w-full h-[1px] bg-[#5aadcf] top-[45%] -rotate-12 opacity-50"></div>
                            <div className="absolute w-[60%] h-[1px] bg-[#5aadcf] top-[60%] -rotate-12 opacity-50"></div>
                        </div>
                        <span className="text-xl tracking-wide font-light text-[#ddeef5]">Ansioff</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-[13px] text-[rgba(200,225,235,0.38)] capitalize">{today}</span>
                        <button onClick={() => onNav('sc-settings')} className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-sm text-[#ddeef5] backdrop-blur-md hover:bg-[rgba(255,255,255,0.1)] active:scale-[0.95] transition-all">
                            {userName.charAt(0).toUpperCase()}
                        </button>
                    </div>
                </div>

                {/* Greeting */}
                <div className="mb-8 mt-2">
                    <h1 className="text-[28px] font-medium font-serif italic text-[#ddeef5] tracking-tight leading-tight">Hola, {userName}.</h1>
                    <p className="text-[22px] font-light text-[rgba(200,225,235,0.8)] tracking-tight mt-1">¿Cómo te sientes hoy?</p>
                </div>

                {/* Main Content Container */}
                <div className="w-full flex flex-col gap-8">

                    {/* 1. SOS Button Area */}
                    <section className="text-left">
                        <button
                            onClick={() => onNav('sc-sos')}
                            className="w-full group relative overflow-hidden rounded-[24px] p-px bg-gradient-to-r from-red-500/30 via-rose-500/10 to-red-500/30 transition-all active:scale-[0.98]"
                        >
                            <div className="relative bg-[#03080f]/80 backdrop-blur-md rounded-[23px] px-6 py-5 flex items-center justify-between border border-red-500/20">
                                <div className="flex items-center gap-4 z-10 text-left">
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-950/20">
                                        <AlertTriangle className="w-6 h-6 animate-pulse" strokeWidth={2} />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-[16px] font-bold text-[#ddeef5] leading-tight mb-1">Necesito ayuda ahora</h3>
                                        <p className="text-[rgba(200,225,235,0.55)] text-[12px] font-medium">Herramienta de anclaje inmediato</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-[rgba(200,225,235,0.38)] group-hover:text-[#ddeef5] transition-colors shrink-0" size={20} />

                                {/* Decorative background glow */}
                                <div className="absolute -right-4 -top-4 w-32 h-32 bg-red-600/10 blur-3xl rounded-full pointer-events-none"></div>
                            </div>
                        </button>
                    </section>

                    {/* 2. Featured Breathing Card */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-[20px] font-medium font-serif italic text-[#ddeef5] tracking-tight leading-none">Respiración guiada</h2>
                            <button onClick={() => onNav('sc-breath')} className="text-xs text-[#5aadcf] font-bold hover:underline transition-all">Ver todos</button>
                        </div>

                        <div className="relative group rounded-[24px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-6 flex flex-col gap-6 shadow-xl w-full">
                            {/* Abstract pattern background - contained */}
                            <div className="absolute inset-0 overflow-hidden rounded-[24px] pointer-events-none">
                                <div className="absolute -top-6 -right-6 p-4 opacity-[0.06] group-hover:rotate-12 transition-transform duration-700">
                                    <Wind className="w-40 h-40 text-[#5aadcf]" strokeWidth={1} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 relative z-10">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#5aadcf]/20 text-[#5aadcf] text-[10px] font-bold uppercase tracking-wider w-fit border border-[#5aadcf]/20">
                                    Patrón 4-2-6
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-light text-[#ddeef5] leading-tight font-serif italic">
                                    Alivio del estrés <br /><span className="font-bold tracking-tight not-italic font-sans text-sky-200">Profundo</span>
                                </h3>
                            </div>

                            <div className="flex items-center justify-between relative z-10 mt-2">
                                <div className="flex items-center gap-2 text-[rgba(200,225,235,0.6)]">
                                    <Clock size={16} className="text-[#5aadcf]/70" />
                                    <span className="text-sm font-medium">5 min</span>
                                </div>
                                <button
                                    onClick={() => onNav('sc-breath')}
                                    className="bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f] rounded-full py-2.5 px-6 font-bold text-xs tracking-wider transition-all shadow-lg shadow-[#5aadcf]/20 active:scale-[0.98]"
                                >
                                    COMENZAR
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 3. Tools Grid */}
                    <section>
                        <div className="px-1 mb-4">
                            <h2 className="text-[11px] font-bold text-[rgba(200,225,235,0.38)] tracking-[0.2em] uppercase">Herramientas</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Audio Tool */}
                            <button
                                onClick={() => onNav('sc-audio')}
                                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center text-center p-4 pb-6 rounded-[24px] hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.98] transition-all group overflow-hidden relative shadow-lg"
                            >
                                <div className="w-12 h-12 rounded-[14px] bg-[#5aadcf]/10 border border-[#5aadcf]/25 flex items-center justify-center text-[#5aadcf] mb-3 group-hover:scale-110 group-hover:bg-[#5aadcf]/25 transition-all duration-300">
                                    <Volume2 size={24} strokeWidth={2} />
                                </div>
                                <h4 className="font-semibold text-[#ddeef5] text-[15px] font-serif italic">Audios</h4>
                            </button>

                            {/* Diary Tool */}
                            <button
                                onClick={() => onNav('sc-notes')}
                                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center text-center p-4 pb-6 rounded-[24px] hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.98] transition-all group overflow-hidden relative shadow-lg"
                            >
                                {!isPremium && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#03080f]/80 px-2 py-1 text-[9px] font-bold text-[rgba(200,225,235,0.65)]"><LockKeyhole size={11} /> Premium</span>}
                                <div className="w-12 h-12 rounded-[14px] bg-[#6bbf8e]/10 border border-[#6bbf8e]/25 flex items-center justify-center text-[#6bbf8e] mb-3 group-hover:scale-110 group-hover:bg-[#6bbf8e]/25 transition-all duration-300">
                                    <BookOpen size={24} strokeWidth={2} />
                                </div>
                                <h4 className="font-semibold text-[#ddeef5] text-[15px] mb-0.5 font-serif italic">Diario</h4>
                                <p className="text-[11px] leading-tight text-[rgba(200,225,235,0.38)] font-medium truncate w-full px-1">Reflexión diaria</p>
                            </button>

                            {/* Games Tool */}
                            <button
                                onClick={() => onNav('sc-games')}
                                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center text-center p-4 pb-6 rounded-[24px] hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.98] transition-all group overflow-hidden relative shadow-lg"
                            >
                                {!isPremium && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#03080f]/80 px-2 py-1 text-[9px] font-bold text-[rgba(200,225,235,0.65)]"><LockKeyhole size={11} /> Premium</span>}
                                <div className="w-12 h-12 rounded-[14px] bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 mb-3 group-hover:scale-110 group-hover:bg-orange-500/25 transition-all duration-300">
                                    <Gamepad2 size={24} strokeWidth={2} />
                                </div>
                                <h4 className="font-semibold text-[#ddeef5] text-[15px] mb-0.5 font-serif italic">Juegos</h4>
                                <p className="text-[11px] leading-tight text-[rgba(200,225,235,0.38)] font-medium truncate w-full px-1">Distracción sana</p>
                            </button>

                            {/* Modules Tool */}
                            <button
                                onClick={() => onNav('sc-tools')}
                                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center text-center p-4 pb-6 rounded-[24px] hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.98] transition-all group overflow-hidden relative shadow-lg"
                            >
                                <div className="w-12 h-12 rounded-[14px] bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 group-hover:bg-purple-500/25 transition-all duration-300">
                                    <GraduationCap size={24} strokeWidth={2} />
                                </div>
                                <h4 className="font-semibold text-[#ddeef5] text-[15px] mb-0.5 font-serif italic">Módulos</h4>
                                <p className="text-[11px] leading-tight text-[rgba(200,225,235,0.38)] font-medium truncate w-full px-1">Aprende y practica</p>
                            </button>
                        </div>
                    </section>

                    {/* 4. Quote of the Day */}
                    <section className="mb-6">
                        <div className="bg-[#0e1d2e]/30 border border-[rgba(255,255,255,0.05)] p-6 rounded-[24px] text-center shadow-inner relative overflow-hidden">
                            {/* Decorative quotes */}
                            <div className="absolute top-2 left-4 text-[#5aadcf]/10 text-6xl font-serif">&quot;</div>
                            <p className="relative z-10 italic text-[#ddeef5]/90 text-[15px] leading-relaxed font-light font-serif">
                                Tus sentimientos son válidos, pero no son tu destino. Respira y confía en el proceso.
                            </p>
                            <div className="absolute bottom-[-1rem] right-4 text-[#5aadcf]/10 text-6xl font-serif rotate-180">&quot;</div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
