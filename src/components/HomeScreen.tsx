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
        <div className="w-full flex flex-col min-h-screen text-white overflow-hidden pb-24 relative" style={{ backgroundColor: '#03080f' }}>
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .animate-breathe { animation: breathe 8s infinite ease-in-out; }
                @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.15); opacity: 0.8; }
                }
            `}</style>

            {/* Global background gradient / Aurora */}
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute rounded-full blur-[60px] w-[280px] h-[280px] -top-[80px] -right-[60px] bg-[radial-gradient(circle,rgba(89,174,210,0.18)_0%,transparent_70%)]"></div>
                <div className="absolute rounded-full blur-[60px] w-[220px] h-[220px] top-[120px] -left-[80px] bg-[radial-gradient(circle,rgba(107,191,142,0.10)_0%,transparent_70%)]"></div>
            </div>

            {/* Main Content Container matching previous configured padding */}
            <div className="w-full flex flex-col pb-24 pt-8 z-10 relative">

                {/* Hero / Header Section */}
                <div className="flex items-start justify-between relative mt-4 px-5 mb-5">
                    <div className="flex flex-col">
                        <span className="text-[10px] tracking-[0.18em] uppercase mb-2.5 flex items-center gap-2 text-[rgba(200,225,235,0.35)]">
                            <span className="w-[18px] h-[1px] bg-[#89cee4] opacity-50 block"></span>
                            Tu espacio seguro
                        </span>
                        <h1 className="text-[36px] font-serif font-light text-[#ddeef5] leading-[1.1] mb-2">
                            {greeting},<br />
                            <em className="text-[#89cee4] italic font-light">Jordi</em>
                        </h1>
                        <p className="text-[12px] text-[rgba(200,225,235,0.35)] font-light mt-2 tracking-[0.03em]">Calma · Respira · Vive</p>
                    </div>
                    <button onClick={() => onNav('sc-settings')} className="p-3 -mr-3 rounded-full hover:bg-white/5 transition-colors mt-2">
                        <Menu className="text-[rgba(200,225,235,0.35)]" size={24} />
                    </button>
                </div>

                {/* 1. SOS Button Area (Soft Terracotta) */}
                <section className="text-left mx-5 mb-[22px]">
                    <button
                        onClick={() => onNav('sc-sos')}
                        className="w-full relative overflow-hidden bg-[rgba(217,124,106,0.09)] border border-[rgba(217,124,106,0.22)] rounded-[22px] p-[20px] flex items-center gap-5 transition-all hover:bg-[rgba(217,124,106,0.15)] hover:border-[rgba(217,124,106,0.38)] active:scale-[0.98] text-left"
                    >
                        {/* Left solid border */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d97c6a] rounded-l-[3px]"></div>

                        <div className="w-[40px] h-[40px] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(217,124,106,0.6),rgba(200,90,80,0.3))] shadow-[0_0_20px_rgba(217,124,106,0.25)] flex items-center justify-center text-[18px] shrink-0">
                            🆘
                        </div>

                        <div className="flex flex-col flex-1">
                            <span className="text-[13px] font-medium text-[#f0a898]">Necesito ayuda ahora</span>
                            <span className="text-[10.5px] text-[rgba(200,225,235,0.35)] mt-[1px]">Asistencia de crisis inmediata</span>
                        </div>

                        <div className="w-[28px] h-[28px] rounded-full bg-[rgba(217,124,106,0.15)] flex items-center justify-center text-[#f0a898] shrink-0">
                            <ChevronRight size={14} />
                        </div>
                    </button>
                </section>

                {/* --- SMART NIGHT TRIGGER --- */}
                {isNightTime && (
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 text-left">
                        <button
                            onClick={() => onNav('sc-night')}
                            className="w-full relative overflow-hidden bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 border border-indigo-500/30 rounded-[20px] p-5 flex items-center gap-4 transition-all active:scale-[0.98] text-left"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-indigo-500 rounded-l-[3px]"></div>

                            <div className="w-[44px] h-[44px] rounded-full bg-indigo-500/20 flex items-center justify-center text-[22px] shrink-0">
                                🌙
                            </div>

                            <div className="flex flex-col flex-1">
                                <span className="text-[16px] font-medium text-indigo-300">Es hora de desconectar</span>
                                <span className="text-[13px] text-white/40 mt-[2px]">Prepara tu mente para dormir bien</span>
                            </div>

                            <div className="w-[32px] h-[32px] rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
                                <ChevronRight size={18} />
                            </div>
                        </button>
                    </section>
                )}

                {/* 2. Featured Breathing Card */}
                <section className="mb-[22px]">
                    <div className="flex items-baseline justify-between px-5 pb-[10px]">
                        <h2 className="text-[11px] font-medium text-[rgba(200,225,235,0.35)] tracking-[0.1em] uppercase">Respiración guiada</h2>
                        <button onClick={() => onNav('sc-breath')} className="text-[11px] text-[#89cee4] opacity-75 hover:opacity-100 transition-opacity">
                            Ver todos →
                        </button>
                    </div>

                    <div className="mx-5 relative rounded-[26px] bg-[linear-gradient(145deg,rgba(18,33,50,0.9),rgba(14,29,46,0.95))] border border-[rgba(255,255,255,0.07)] border-t-[rgba(255,255,255,0.10)] p-[24px_22px] flex items-center gap-6 overflow-hidden">
                        {/* Abstract pattern background - contained */}
                        <div className="absolute -right-[30px] -top-[30px] w-[130px] h-[130px] bg-[radial-gradient(circle,rgba(89,174,210,0.09),transparent_70%)] pointer-events-none"></div>

                        {/* Animated rings */}
                        <div className="w-[80px] h-[80px] shrink-0 relative flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border border-[rgba(89,174,210,0.2)] animate-breathe"></div>
                            <div className="absolute inset-0 rounded-full border border-[rgba(89,174,210,0.35)] animate-breathe" style={{ animationDelay: '1s', transform: 'scale(0.75)' }}></div>
                            <div className="w-[26px] h-[26px] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(160,220,240,0.95),rgba(89,174,210,0.7))] shadow-[0_0_12px_rgba(89,174,210,0.6),0_0_30px_rgba(89,174,210,0.25)] relative z-10 animate-pulse"></div>
                        </div>

                        <div className="flex flex-col flex-1 relative z-10 min-w-0">
                            <div className="flex gap-[5px] mb-[8px]">
                                <span className="text-[11px] font-medium bg-[rgba(89,174,210,0.12)] border border-[rgba(89,174,210,0.2)] text-[#89cee4] rounded-[6px] px-[7px] py-[2px]">4</span>
                                <span className="text-[11px] font-medium bg-[rgba(89,174,210,0.12)] border border-[rgba(89,174,210,0.2)] text-[#89cee4] rounded-[6px] px-[7px] py-[2px]">2</span>
                                <span className="text-[11px] font-medium bg-[rgba(89,174,210,0.12)] border border-[rgba(89,174,210,0.2)] text-[#89cee4] rounded-[6px] px-[7px] py-[2px]">6</span>
                            </div>
                            <h3 className="text-[15px] font-medium text-[#ddeef5] leading-[1.3] mb-[12px]">
                                Alivio del estrés profundo
                            </h3>

                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[rgba(200,225,235,0.35)]">⏱ 5 min</span>
                                <button
                                    onClick={() => onNav('sc-breath')}
                                    className="bg-[linear-gradient(135deg,#5aadcf,#89cee4)] text-[#080f1a] text-[11px] font-semibold px-[16px] py-[8px] rounded-[30px] shadow-[0_4px_18px_rgba(89,174,210,0.3)] hover:scale-[1.04] transition-all tracking-[0.05em]"
                                >
                                    ▶ Comenzar
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Tools Grid (2x2) */}
                <section className="mb-[24px]">
                    <div className="px-5 pb-[10px]">
                        <h2 className="text-[11px] font-medium text-[rgba(200,225,235,0.35)] tracking-[0.1em] uppercase">Herramientas</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 px-5">
                        {/* Audio Tool */}
                        <button
                            onClick={() => onNav('sc-audio')}
                            className="bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] flex flex-col p-[20px] rounded-[22px] hover:-translate-y-[2px] transition-all relative overflow-hidden text-left"
                        >
                            <span className="absolute top-[16px] right-[16px] text-[13px] text-[rgba(200,225,235,0.35)]">↗</span>
                            <div className="absolute -bottom-[20px] -right-[20px] w-[70px] h-[70px] rounded-full bg-[#89cee4] opacity-[0.07] pointer-events-none"></div>

                            <div className="w-[40px] h-[40px] rounded-[14px] bg-[rgba(89,174,210,0.15)] flex items-center justify-center text-[20px] mb-[12px]">
                                🎵
                            </div>
                            <h4 className="font-medium text-[#ddeef5] text-[14px] mb-[3px]">Audios</h4>
                            <p className="text-[11px] leading-[1.4] text-[rgba(200,225,235,0.35)] max-w-[90%]">Sonidos y meditaciones guiadas</p>
                        </button>

                        {/* Diary Tool */}
                        <button
                            onClick={() => onNav('sc-notes')}
                            className="bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] flex flex-col p-[20px] rounded-[22px] hover:-translate-y-[2px] transition-all relative overflow-hidden text-left"
                        >
                            <span className="absolute top-[16px] right-[16px] text-[13px] text-[rgba(200,225,235,0.35)]">↗</span>
                            <div className="absolute -bottom-[20px] -right-[20px] w-[70px] h-[70px] rounded-full bg-[#6bbf8e] opacity-[0.07] pointer-events-none"></div>

                            <div className="w-[40px] h-[40px] rounded-[14px] bg-[rgba(107,191,142,0.15)] flex items-center justify-center text-[20px] mb-[12px]">
                                📓
                            </div>
                            <h4 className="font-medium text-[#ddeef5] text-[14px] mb-[3px]">Diario</h4>
                            <p className="text-[11px] leading-[1.4] text-[rgba(200,225,235,0.35)] max-w-[90%]">Reflexión diaria consciente</p>
                        </button>

                        {/* Games Tool */}
                        <button
                            onClick={() => onNav('sc-games')}
                            className="bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] flex flex-col p-[20px] rounded-[22px] hover:-translate-y-[2px] transition-all relative overflow-hidden text-left"
                        >
                            <span className="absolute top-[16px] right-[16px] text-[13px] text-[rgba(200,225,235,0.35)]">↗</span>
                            <div className="absolute -bottom-[20px] -right-[20px] w-[70px] h-[70px] rounded-full bg-[#b09de0] opacity-[0.07] pointer-events-none"></div>

                            <div className="w-[40px] h-[40px] rounded-[14px] bg-[rgba(176,157,224,0.15)] flex items-center justify-center text-[20px] mb-[12px]">
                                🧩
                            </div>
                            <h4 className="font-medium text-[#ddeef5] text-[14px] mb-[3px]">Juegos</h4>
                            <p className="text-[11px] leading-[1.4] text-[rgba(200,225,235,0.35)] max-w-[90%]">Distracción sana y terapéutica</p>
                        </button>

                        {/* Modules Tool */}
                        <button
                            onClick={() => onNav('sc-tools')}
                            className="bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] flex flex-col p-[20px] rounded-[22px] hover:-translate-y-[2px] transition-all relative overflow-hidden text-left"
                        >
                            <span className="absolute top-[16px] right-[16px] text-[13px] text-[rgba(200,225,235,0.35)]">↗</span>
                            <div className="absolute -bottom-[20px] -right-[20px] w-[70px] h-[70px] rounded-full bg-[#c9a96e] opacity-[0.07] pointer-events-none"></div>

                            <div className="w-[40px] h-[40px] rounded-[14px] bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-[20px] mb-[12px]">
                                📚
                            </div>
                            <h4 className="font-medium text-[#ddeef5] text-[14px] mb-[3px]">Módulos</h4>
                            <p className="text-[11px] leading-[1.4] text-[rgba(200,225,235,0.35)] max-w-[90%]">TCC · ACT · Weekes</p>
                        </button>
                    </div>
                </section>

                {/* 4. Quote Border Left */}
                <section className="mb-[24px]">
                    <div className="mx-5 p-[18px_20px] bg-[linear-gradient(135deg,rgba(89,174,210,0.06),rgba(89,174,210,0.02))] border border-[rgba(89,174,210,0.12)] rounded-[20px] relative">
                        <span className="font-serif text-[52px] leading-[0.5] text-[rgba(89,174,210,0.2)] mb-[8px] block">"</span>
                        <div className="font-serif italic font-light text-[17px] text-[#ddeef5] leading-[1.8]">
                            Tus sentimientos son válidos, pero no son tu destino. Respira y confía en el proceso.
                        </div>
                        <div className="mt-[10px] text-[10px] tracking-[0.12em] uppercase text-[rgba(200,225,235,0.35)]">
                            — ANSIOFF · Reflexión de hoy
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
