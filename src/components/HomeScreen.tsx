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

    const greeting = isNightTime ? "Buenas noches" : "Buenos días";

    return (
        <div className="flex-1 w-full bg-[#06101a] flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide pb-24">
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                
                .font-serif { font-family: var(--font-serif), serif; }
            `}</style>

            {/* Hero Section */}
            <div className="px-6 pt-12 pb-6 relative">
                {/* Subtle radial gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_20%,rgba(126,200,227,0.14)_0%,transparent_70%),radial-gradient(ellipse_50%_60%_at_10%_80%,rgba(79,163,200,0.08)_0%,transparent_70%)] pointer-events-none"></div>

                <div className="flex items-start justify-between relative z-10">
                    <div className="flex flex-col">
                        <span className="text-[12px] tracking-[0.12em] uppercase text-white/40 mb-1.5">{greeting}, Jordi</span>
                        <h1 className="text-[28px] font-serif text-[#e8f4f8] leading-[1.2] mb-1">
                            Tu espacio<br />
                            <em className="text-[#7ec8e3] italic">seguro</em>
                        </h1>
                        <p className="text-[13px] text-white/40 font-light mt-1">ANSIOFF · Respira con calma</p>
                    </div>
                    <button onClick={() => onNav('sc-settings')} className="p-3 -mr-3 rounded-full hover:bg-white/5 transition-colors mt-2">
                        <Menu className="text-white/60" size={24} />
                    </button>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="w-full flex flex-col px-5">

                {/* 1. SOS Button Area (Soft Terracotta) */}
                <section className="mb-6">
                    <button
                        onClick={() => onNav('sc-sos')}
                        className="w-full relative overflow-hidden bg-gradient-to-br from-[#e07d6a]/20 to-[#e07d6a]/10 border border-[#e07d6a]/30 rounded-[20px] p-4 flex items-center gap-3.5 transition-all active:scale-[0.98] text-left"
                    >
                        {/* Left solid border */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e07d6a] rounded-l-[3px]"></div>

                        <div className="w-[38px] h-[38px] rounded-full bg-[#e07d6a]/20 flex items-center justify-center text-[17px] shrink-0">
                            🆘
                        </div>

                        <div className="flex flex-col flex-1">
                            <span className="text-[13px] font-medium text-[#f0a898]">Necesito ayuda ahora</span>
                            <span className="text-[11px] text-white/40 mt-[2px]">Asistencia de crisis inmediata</span>
                        </div>

                        <div className="w-[28px] h-[28px] rounded-full bg-[#e07d6a]/20 flex items-center justify-center text-[#f0a898] shrink-0">
                            <ChevronRight size={16} />
                        </div>
                    </button>
                </section>

                {/* --- SMART NIGHT TRIGGER --- */}
                {isNightTime && (
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 mb-6">
                        <button
                            onClick={() => onNav('sc-night')}
                            className="w-full relative overflow-hidden bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 border border-indigo-500/30 rounded-[20px] p-4 flex items-center gap-3.5 transition-all active:scale-[0.98] text-left"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 rounded-l-[3px]"></div>

                            <div className="w-[38px] h-[38px] rounded-full bg-indigo-500/20 flex items-center justify-center text-[17px] shrink-0">
                                🌙
                            </div>

                            <div className="flex flex-col flex-1">
                                <span className="text-[13px] font-medium text-indigo-300">Es hora de desconectar</span>
                                <span className="text-[11px] text-white/40 mt-[2px]">Prepara tu mente para dormir bien</span>
                            </div>

                            <div className="w-[28px] h-[28px] rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
                                <ChevronRight size={16} />
                            </div>
                        </button>
                    </section>
                )}

                {/* 2. Featured Breathing Card */}
                <section className="mb-6">
                    <div className="flex items-baseline justify-between px-1 mb-3">
                        <h2 className="text-[13px] font-medium text-[#e8f4f8] tracking-[0.01em]">Respiración guiada</h2>
                        <button onClick={() => onNav('sc-breath')} className="text-[11px] text-[#7ec8e3]/80 hover:text-[#7ec8e3] transition-colors">
                            Ver todos →
                        </button>
                    </div>

                    <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2e42] to-[#1e3349] border border-white/5 p-5 flex items-center gap-4 overflow-hidden">
                        {/* Background glow right */}
                        <div className="absolute -right-5 -top-5 w-[100px] h-[100px] bg-[radial-gradient(circle,rgba(126,200,227,0.10),transparent_70%)] pointer-events-none"></div>

                        {/* Animated rings */}
                        <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[1.5px] border-[#7ec8e3]/25 animate-breathe"></div>
                            <div className="absolute inset-0 rounded-full border-[1.5px] border-[#7ec8e3]/40 animate-breathe" style={{ animationDelay: '1.5s', transform: 'scale(0.75)' }}></div>
                            <div className="w-7 h-7 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(126,200,227,0.9),rgba(79,163,200,0.6))] shadow-[0_0_14px_rgba(126,200,227,0.4)] relative z-10 animate-pulse"></div>
                        </div>

                        <div className="flex flex-col flex-1 relative z-10">
                            <span className="inline-block w-fit text-[10px] bg-[#7ec8e3]/10 text-[#7ec8e3] rounded-full px-2.5 py-0.5 mb-2">
                                4 · 2 · 6
                            </span>
                            <h3 className="text-[14px] font-medium text-[#e8f4f8] mb-1">Alivio del estrés profundo</h3>

                            <button
                                onClick={() => onNav('sc-breath')}
                                className="mt-2 inline-flex items-center gap-1.5 w-fit bg-[#4fa3c8] text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full tracking-[0.04em] active:scale-95 transition-transform"
                            >
                                ▶ Comenzar · 5 min
                            </button>
                        </div>
                    </div>
                </section>

                {/* 3. Tools Grid (2x2) */}
                <section className="mb-8">
                    <div className="px-1 mb-3">
                        <h2 className="text-[13px] font-medium text-[#e8f4f8] tracking-[0.01em]">Herramientas</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        {/* Audio Tool */}
                        <button
                            onClick={() => onNav('sc-audio')}
                            className="bg-white/[0.06] border border-white/5 flex flex-col gap-2.5 p-4 rounded-[20px] hover:bg-white/10 active:scale-95 transition-all text-left"
                        >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] bg-[#7ec8e3]/15">
                                🎵
                            </div>
                            <div>
                                <h4 className="font-medium text-[#e8f4f8] text-[13px]">Audios</h4>
                                <p className="text-[11px] leading-[1.4] text-white/40 mt-0.5">Meditaciones <br /> y sonidos</p>
                            </div>
                        </button>

                        {/* Diary Tool */}
                        <button
                            onClick={() => onNav('sc-notes')}
                            className="bg-white/[0.06] border border-white/5 flex flex-col gap-2.5 p-4 rounded-[20px] hover:bg-white/10 active:scale-95 transition-all text-left"
                        >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] bg-[#78b478]/15">
                                📓
                            </div>
                            <div>
                                <h4 className="font-medium text-[#e8f4f8] text-[13px]">Diario</h4>
                                <p className="text-[11px] leading-[1.4] text-white/40 mt-0.5">Reflexión <br /> diaria</p>
                            </div>
                        </button>

                        {/* Games Tool */}
                        <button
                            onClick={() => onNav('sc-games')}
                            className="bg-white/[0.06] border border-white/5 flex flex-col gap-2.5 p-4 rounded-[20px] hover:bg-white/10 active:scale-95 transition-all text-left"
                        >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] bg-[#e07d6a]/15">
                                🎮
                            </div>
                            <div>
                                <h4 className="font-medium text-[#e8f4f8] text-[13px]">Juegos</h4>
                                <p className="text-[11px] leading-[1.4] text-white/40 mt-0.5">Distracción <br /> sana</p>
                            </div>
                        </button>

                        {/* Modules Tool */}
                        <button
                            onClick={() => onNav('sc-tools')}
                            className="bg-white/[0.06] border border-white/5 flex flex-col gap-2.5 p-4 rounded-[20px] hover:bg-white/10 active:scale-95 transition-all text-left"
                        >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] bg-[#b48cdc]/15">
                                📚
                            </div>
                            <div>
                                <h4 className="font-medium text-[#e8f4f8] text-[13px]">Módulos</h4>
                                <p className="text-[11px] leading-[1.4] text-white/40 mt-0.5">Aprende <br /> y sana</p>
                            </div>
                        </button>
                    </div>
                </section>

                {/* 4. Quote Border Left */}
                <section className="mb-6">
                    <div className="border-l-[2px] border-[#7ec8e3]/35 py-3 px-4 ml-1">
                        <p className="font-serif italic text-[14px] text-[#e8f4f8] leading-[1.6]">
                            "Tus sentimientos son válidos, pero no son tu destino. Respira y confía en el proceso."
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
}
