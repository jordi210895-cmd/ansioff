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
        <div className="w-full flex flex-col min-h-screen text-[#e8eaf0] overflow-hidden pb-10 relative" style={{ backgroundColor: '#0b0d14' }}>
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes sosPulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }

                @keyframes pingRing {
                    0% { transform: scale(1); opacity: 0.6; }
                    70% { transform: scale(1.25); opacity: 0; }
                    100% { transform: scale(1.25); opacity: 0; }
                }

                @keyframes breathRing {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.15); opacity: 0.8; }
                }

                @keyframes breathOrb {
                    0%, 100% { transform: scale(0.85); }
                    50% { transform: scale(1.1); }
                }

                .animate-fade-up {
                    animation: fadeUp 0.5s ease both;
                }
            `}</style>

            {/* Ambient background glow */}
            <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-[radial-gradient(circle,rgba(126,184,212,0.07)_0%,transparent_70%)] pointer-events-none z-0"></div>

            <div className="flex-1 w-full flex flex-col z-10 relative scrollbar-hide">

                {/* Top bar */}
                <div className="pt-[52px] px-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-[10px] font-medium tracking-[0.18em] text-[#5a6080] uppercase mb-1">Tu espacio seguro</div>
                            <div className="font-serif text-[40px] leading-[1.05] tracking-[-0.02em] text-[#e8eaf0]">
                                {greeting},<br /><em className="italic text-[#7eb8d4] font-light">Jordi</em>
                            </div>
                            <div className="text-[12px] text-[#5a6080] mt-1.5 tracking-[0.04em]">Calma · Respira · Vive</div>
                        </div>
                        <button onClick={() => onNav('sc-settings')} className="bg-transparent border-none text-[#5a6080] cursor-pointer p-1 mt-1 flex flex-col gap-[5px]" aria-label="Menú">
                            <span className="block w-[22px] h-[1.5px] bg-[#5a6080] rounded-[2px]"></span>
                            <span className="block w-[22px] h-[1.5px] bg-[#5a6080] rounded-[2px]"></span>
                            <span className="block w-[22px] h-[1.5px] bg-[#5a6080] rounded-[2px]"></span>
                        </button>
                    </div>
                </div>

                {/* SOS */}
                <div className="pt-[22px] px-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    <button
                        onClick={() => onNav('sc-sos')}
                        className="w-full bg-[linear-gradient(135deg,#1a0808_0%,#200c0c_100%)] border-[1.5px] border-[rgba(255,59,59,0.35)] rounded-[20px] p-[20px_22px] flex items-center gap-[18px] cursor-pointer relative overflow-hidden transition-all duration-150 hover:-translate-y-[2px] hover:shadow-[0_0_60px_rgba(255,59,59,0.22),inset_0_1px_0_rgba(255,255,255,0.04)] active:scale-[0.98] shadow-[0_0_40px_rgba(255,59,59,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,59,59,0.1)_0%,transparent_60%)]" style={{ animation: 'sosPulse 2.5s ease-in-out infinite' }}></div>

                        <div className="bg-[#ff3b3b] text-white text-[15px] font-[800] tracking-[0.05em] w-[54px] h-[54px] rounded-[14px] flex items-center justify-center shrink-0 relative shadow-[0_0_20px_rgba(255,59,59,0.5)] z-10">
                            SOS
                            <div className="absolute -inset-[6px] border-[1.5px] border-[rgba(255,59,59,0.4)] rounded-[20px]" style={{ animation: 'pingRing 2s ease-in-out infinite' }}></div>
                        </div>

                        <div className="flex-1 text-left z-10">
                            <div className="text-[17px] font-semibold text-[#ff7070] mb-[3px]">Necesito ayuda ahora</div>
                            <div className="text-[12px] text-[rgba(255,112,112,0.6)] font-normal">Asistencia de crisis inmediata</div>
                        </div>
                        <div className="text-[rgba(255,112,112,0.5)] text-[20px] transition-transform duration-200 z-10 group-hover:translate-x-[3px]">›</div>
                    </button>
                </div>

                {/* --- SMART NIGHT TRIGGER --- */}
                {isNightTime && (
                    <div className="pt-[14px] px-6 animate-fade-up" style={{ animationDelay: '0.15s' }}>
                        <button
                            onClick={() => onNav('sc-night')}
                            className="w-full relative overflow-hidden bg-[linear-gradient(135deg,rgba(79,70,229,0.15)_0%,rgba(79,70,229,0.05)_100%)] border border-[rgba(79,70,229,0.3)] rounded-[20px] p-[20px_22px] flex items-center gap-[18px] transition-all hover:bg-[rgba(79,70,229,0.2)] active:scale-[0.98] text-left"
                        >
                            <div className="w-[44px] h-[44px] rounded-[14px] bg-[rgba(79,70,229,0.2)] flex items-center justify-center text-[22px] shrink-0">
                                🌙
                            </div>

                            <div className="flex flex-col flex-1">
                                <span className="text-[16px] font-semibold text-indigo-300 mb-[3px]">Es hora de desconectar</span>
                                <span className="text-[12px] text-[rgba(165,180,252,0.6)] mt-[1px]">Prepara tu mente para dormir bien</span>
                            </div>

                            <div className="text-indigo-400 text-[20px] transition-transform duration-200 z-10">›</div>
                        </button>
                    </div>
                )}

                {/* Respiración guiada */}
                <div className="pt-[26px] px-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-between items-center mb-[14px]">
                        <div className="text-[10px] font-semibold tracking-[0.15em] text-[#5a6080] uppercase">Respiración Guiada</div>
                        <div className="text-[11px] text-[#7eb8d4] font-medium cursor-pointer opacity-80" onClick={() => onNav('sc-breath')}>Ver todos →</div>
                    </div>

                    <div className="bg-[#131620] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-[18px_20px] flex items-center gap-[18px] cursor-pointer transition-all duration-200 hover:bg-[#181c2a] hover:border-[rgba(126,184,212,0.2)]" onClick={() => onNav('sc-breath')}>
                        <div className="relative w-[56px] h-[56px] shrink-0">
                            <div className="absolute inset-0 rounded-full border border-[rgba(126,184,212,0.2)]" style={{ animation: 'breathRing 4s ease-in-out infinite' }}></div>
                            <div className="absolute -inset-[8px] rounded-full border border-[rgba(126,184,212,0.2)]" style={{ animation: 'breathRing 4s ease-in-out infinite', animationDelay: '1.3s' }}></div>
                            <div className="absolute inset-[10px] rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(180,220,240,0.9),rgba(100,170,210,0.6))] shadow-[0_0_16px_rgba(126,184,212,0.4)]" style={{ animation: 'breathOrb 4s ease-in-out infinite' }}></div>
                        </div>

                        <div className="flex-1">
                            <div className="flex gap-[6px] mb-[6px]">
                                <div className="bg-[#181c2a] border border-[rgba(255,255,255,0.06)] w-[22px] h-[22px] rounded-[6px] text-[11px] font-semibold text-[#7eb8d4] flex items-center justify-center">4</div>
                                <div className="bg-[#181c2a] border border-[rgba(255,255,255,0.06)] w-[22px] h-[22px] rounded-[6px] text-[11px] font-semibold text-[#7eb8d4] flex items-center justify-center">2</div>
                                <div className="bg-[#181c2a] border border-[rgba(255,255,255,0.06)] w-[22px] h-[22px] rounded-[6px] text-[11px] font-semibold text-[#7eb8d4] flex items-center justify-center">6</div>
                            </div>
                            <div className="text-[15px] font-semibold text-[#e8eaf0] mb-[4px]">Alivio del estrés profundo</div>
                            <div className="text-[11px] text-[#5a6080]">⏱ 5 min</div>
                        </div>

                        <button className="bg-[#7eb8d4] text-[#0b0d14] text-[12px] font-bold py-[8px] px-[14px] rounded-[20px] border-none cursor-pointer whitespace-nowrap transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_16px_rgba(126,184,212,0.4)]">
                            ▶ Comenzar
                        </button>
                    </div>
                </div>

                {/* Herramientas */}
                <div className="pt-[26px] px-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                    <div className="flex justify-between items-center mb-[14px]">
                        <div className="text-[10px] font-semibold tracking-[0.15em] text-[#5a6080] uppercase">Herramientas</div>
                    </div>

                    <div className="grid grid-cols-2 gap-[10px]">
                        <button onClick={() => onNav('sc-audio')} className="bg-[#131620] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-[18px] cursor-pointer relative transition-all duration-200 overflow-hidden min-h-[110px] flex flex-col justify-end text-left hover:bg-[#181c2a] hover:border-[rgba(255,255,255,0.1)] hover:-translate-y-[2px]">
                            <div className="w-[38px] h-[38px] rounded-[12px] flex items-center justify-center text-[18px] mb-[10px] bg-[rgba(126,184,212,0.12)]">🎵</div>
                            <div className="absolute top-[14px] right-[14px] text-[14px] text-[#5a6080] opacity-50">↗</div>
                            <div className="text-[14px] font-semibold text-[#e8eaf0] mb-[3px]">Audios</div>
                            <div className="text-[11px] text-[#5a6080] leading-[1.4]">Sonidos y meditaciones guiadas</div>
                        </button>

                        <button onClick={() => onNav('sc-notes')} className="bg-[#131620] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-[18px] cursor-pointer relative transition-all duration-200 overflow-hidden min-h-[110px] flex flex-col justify-end text-left hover:bg-[#181c2a] hover:border-[rgba(255,255,255,0.1)] hover:-translate-y-[2px]">
                            <div className="w-[38px] h-[38px] rounded-[12px] flex items-center justify-center text-[18px] mb-[10px] bg-[rgba(160,200,140,0.12)]">📓</div>
                            <div className="absolute top-[14px] right-[14px] text-[14px] text-[#5a6080] opacity-50">↗</div>
                            <div className="text-[14px] font-semibold text-[#e8eaf0] mb-[3px]">Diario</div>
                            <div className="text-[11px] text-[#5a6080] leading-[1.4]">Reflexión diaria consciente</div>
                        </button>

                        <button onClick={() => onNav('sc-games')} className="bg-[#131620] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-[18px] cursor-pointer relative transition-all duration-200 overflow-hidden min-h-[110px] flex flex-col justify-end text-left hover:bg-[#181c2a] hover:border-[rgba(255,255,255,0.1)] hover:-translate-y-[2px]">
                            <div className="w-[38px] h-[38px] rounded-[12px] flex items-center justify-center text-[18px] mb-[10px] bg-[rgba(220,180,100,0.12)]">🧩</div>
                            <div className="absolute top-[14px] right-[14px] text-[14px] text-[#5a6080] opacity-50">↗</div>
                            <div className="text-[14px] font-semibold text-[#e8eaf0] mb-[3px]">Juegos</div>
                            <div className="text-[11px] text-[#5a6080] leading-[1.4]">Distracción sana y terapéutica</div>
                        </button>

                        <button onClick={() => onNav('sc-tools')} className="bg-[#131620] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-[18px] cursor-pointer relative transition-all duration-200 overflow-hidden min-h-[110px] flex flex-col justify-end text-left hover:bg-[#181c2a] hover:border-[rgba(255,255,255,0.1)] hover:-translate-y-[2px]">
                            <div className="w-[38px] h-[38px] rounded-[12px] flex items-center justify-center text-[18px] mb-[10px] bg-[rgba(180,140,220,0.12)]">📚</div>
                            <div className="absolute top-[14px] right-[14px] text-[14px] text-[#5a6080] opacity-50">↗</div>
                            <div className="text-[14px] font-semibold text-[#e8eaf0] mb-[3px]">Módulos</div>
                            <div className="text-[11px] text-[#5a6080] leading-[1.4]">TCC · ACT · Weekes</div>
                        </button>
                    </div>
                </div>

                {/* Reflexión del día */}
                <div className="pt-[26px] px-6 pb-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-[#131620] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-[22px_22px_20px] relative overflow-hidden">
                        <div className="absolute top-[-10px] left-[12px] font-serif text-[100px] text-[rgba(126,184,212,0.06)] leading-[1] pointer-events-none">"</div>
                        <div className="font-serif italic text-[17px] leading-[1.6] text-[rgba(232,234,240,0.9)] mb-[14px] relative z-10">
                            Tus sentimientos son válidos, pero no son tu destino. Respira y confía en el proceso.
                        </div>
                        <div className="text-[10px] tracking-[0.14em] text-[#5a6080] uppercase font-medium">ANSIOFF · Reflexión de hoy</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
