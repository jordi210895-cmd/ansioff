'use client';

import { useState, useEffect } from 'react';
import { Wind, Volume2, BookOpen, Gamepad2, GraduationCap, Clock, ChevronRight, AlertTriangle, Menu, Moon } from 'lucide-react';

interface HomeScreenProps {
    onNav: (screen: string) => void;
    cbtCount?: number;
}

export default function HomeScreen({ onNav, cbtCount = 0 }: HomeScreenProps) {
    const [isNightTime, setIsNightTime] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        setIsNightTime(hour >= 22 || hour < 6);
    }, []);

    return (
        <div
            className="flex-1 w-full bg-[#080A12] flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide pb-24"
        >
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Custom Header for Home Screen */}
            <header className="sticky top-0 z-50 glass px-6 pt-12 pb-6 flex flex-col items-center justify-center border-b border-white/5 mb-4 bg-[#080A12]/95 backdrop-blur-xl">
                <div className="flex items-center justify-between w-full max-w-md min-h-[44px] relative">
                    <div className="flex items-center justify-start w-12 z-10">
                        <button
                            onClick={() => onNav('sc-settings')}
                            title="Ajustes y Privacidad"
                            className="p-2 -ml-2 rounded-full hover:bg-slate-800/50 transition-colors"
                        >
                            <Menu className="text-slate-400" size={24} />
                        </button>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
                        <h1 className="text-2xl font-bold tracking-tighter text-white leading-none">ANSIOFF</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-bold leading-none mt-1">Tu Espacio Seguro</p>
                    </div>

                    <div className="flex items-center justify-end w-12 z-10">
                        {/* Hidden bell for future use */}
                    </div>
                </div>
            </header>

            {/* Main Content Container */}
            <div className="w-full flex flex-col gap-8 px-5">

                {/* 1. SOS Button Area */}
                <section className="mt-2 text-left">
                    <button
                        onClick={() => onNav('sc-sos')}
                        className="w-full group relative overflow-hidden rounded-3xl p-px bg-gradient-to-r from-red-500/50 via-blue-500/50 to-red-500/50 shadow-2xl shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="relative bg-slate-950 rounded-[23px] px-8 py-6 flex items-center justify-between overflow-hidden">
                            <div className="flex items-center gap-5 z-10 text-left">
                                <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center text-red-500 ring-4 ring-red-500/10 shrink-0">
                                    <AlertTriangle className="w-7 h-7" strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-[1.15rem] font-bold text-white leading-tight mb-1">Necesito ayuda ahora</h3>
                                    <p className="text-slate-400 text-[13px] font-medium">Asistencia de crisis inmediata</p>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-600 group-hover:text-white transition-colors shrink-0" size={24} />

                            {/* Decorative background glow */}
                            <div className="absolute -right-4 -top-4 w-32 h-32 bg-red-600/15 blur-3xl rounded-full pointer-events-none"></div>
                        </div>
                    </button>
                </section>

                {/* --- SMART NIGHT TRIGGER (Shows after 22:00) --- */}
                {isNightTime && (
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <button
                            onClick={() => onNav('sc-night')}
                            className="w-full group rounded-3xl p-5 bg-[#131628] border border-indigo-900/50 flex items-center gap-4 transition-all hover:bg-[#1a1e36] hover:border-indigo-500/30 shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
                        >
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                                <Moon size={22} fill="currentColor" className="opacity-80" />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="font-semibold text-indigo-100 text-[15px] mb-0.5">Es hora de desconectar</h3>
                                <p className="text-xs text-indigo-300/60 leading-tight">Prepara tu entorno y mente para dormir bien.</p>
                            </div>
                            <ChevronRight size={18} className="text-indigo-500/50 group-hover:text-indigo-400 transition-colors" />
                        </button>
                    </section>
                )}

                {/* 2. Featured Breathing Card */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg font-bold text-white tracking-tight">Respiración guiada</h2>
                        <button onClick={() => onNav('sc-breath')} className="text-xs text-blue-500 font-bold hover:underline transition-all">Ver todos</button>
                    </div>

                    <div className="relative group rounded-3xl glass p-7 border border-white/5 flex flex-col gap-6 shadow-xl w-full">
                        {/* Abstract pattern background - contained */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                            <div className="absolute -top-6 -right-6 p-4 opacity-[0.15] group-hover:rotate-12 transition-transform duration-700">
                                <Wind className="w-40 h-40 text-blue-500" strokeWidth={1} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 relative z-10">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider w-fit border border-blue-500/20">
                                Patrón 4-2-6
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-light text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                                Alivio del estrés <br /><span className="font-bold tracking-tight">Profundo</span>
                            </h3>
                        </div>

                        <div className="flex items-center justify-between relative z-10 mt-2">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Clock size={16} className="text-blue-500/70" />
                                <span className="text-sm font-medium">5 min</span>
                            </div>
                            <button
                                onClick={() => onNav('sc-breath')}
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-full py-2.5 px-7 font-bold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95"
                            >
                                COMENZAR
                            </button>
                        </div>
                    </div>
                </section>

                {/* 3. Tools Grid */}
                <section>
                    <div className="px-1 mb-4">
                        <h2 className="text-[11px] font-bold text-slate-500 tracking-[0.2em] uppercase">Herramientas</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Audio Tool */}
                        <button
                            onClick={() => onNav('sc-audio')}
                            className="glass flex flex-col items-center justify-center text-center p-4 pb-6 rounded-3xl hover:bg-white/5 active:scale-95 transition-all group overflow-hidden relative shadow-lg"
                        >
                            <div className="w-12 h-12 rounded-[14px] bg-indigo-500/15 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 group-hover:bg-indigo-500/25 transition-all duration-300">
                                <Volume2 size={24} strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-white text-[15px]">Audios</h4>
                        </button>

                        {/* Diary Tool */}
                        <button
                            onClick={() => onNav('sc-notes')}
                            className="glass flex flex-col items-center justify-center text-center p-4 pb-6 rounded-3xl hover:bg-white/5 active:scale-95 transition-all group overflow-hidden relative shadow-lg"
                        >
                            <div className="w-12 h-12 rounded-[14px] bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 group-hover:bg-emerald-500/25 transition-all duration-300">
                                <BookOpen size={24} strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-white text-[15px] mb-1">Diario</h4>
                            <p className="text-[11px] leading-tight text-slate-400 font-medium truncate w-full px-1">Reflexión diaria</p>
                        </button>

                        {/* Games Tool */}
                        <button
                            onClick={() => onNav('sc-games')}
                            className="glass flex flex-col items-center justify-center text-center p-4 pb-6 rounded-3xl hover:bg-white/5 active:scale-95 transition-all group overflow-hidden relative shadow-lg"
                        >
                            <div className="w-12 h-12 rounded-[14px] bg-orange-500/15 flex items-center justify-center text-orange-400 mb-3 group-hover:scale-110 group-hover:bg-orange-500/25 transition-all duration-300">
                                <Gamepad2 size={24} strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-white text-[15px] mb-1">Juegos</h4>
                            <p className="text-[11px] leading-tight text-slate-400 font-medium truncate w-full px-1">Distracción sana</p>
                        </button>

                        {/* Modules Tool */}
                        <button
                            onClick={() => onNav('sc-tools')}
                            className="glass flex flex-col items-center justify-center text-center p-4 pb-6 rounded-3xl hover:bg-white/5 active:scale-95 transition-all group overflow-hidden relative shadow-lg"
                        >
                            <div className="w-12 h-12 rounded-[14px] bg-blue-500/15 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 group-hover:bg-blue-500/25 transition-all duration-300">
                                <GraduationCap size={24} strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-white text-[15px] mb-1">Módulos</h4>
                            <p className="text-[11px] leading-tight text-slate-400 font-medium truncate w-full px-1">Aprende y sana</p>
                        </button>
                    </div>
                </section>

                {/* 4. Quote of the Day */}
                <section className="mb-6">
                    <div className="glass-primary p-7 rounded-[2rem] text-center shadow-inner relative overflow-hidden">
                        {/* Decorative quotes */}
                        <div className="absolute top-2 left-4 text-blue-500/20 text-6xl font-serif">&quot;</div>
                        <p className="relative z-10 italic text-blue-100/90 text-[15px] leading-relaxed font-light" style={{ fontFamily: 'Georgia, serif' }}>
                            Tus sentimientos son válidos, pero no son tu destino. Respira y confía en el proceso.
                        </p>
                        <div className="absolute bottom-[-1rem] right-4 text-blue-500/20 text-6xl font-serif rotate-180">&quot;</div>
                    </div>
                </section>

            </div>
        </div>
    );
}
