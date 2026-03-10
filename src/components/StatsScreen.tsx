'use client';

import { useState, useEffect } from 'react';
import { Trophy, Wind, Shield, PenLine, ChevronRight, Award } from 'lucide-react';
import TopBar from './TopBar';
import { getStats, getLevelForPoints, UserStats } from '../utils/stats';

interface StatsScreenProps {
    onBack: () => void;
}

export default function StatsScreen({ onBack }: StatsScreenProps) {
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        setStats(getStats());
    }, []);

    if (!stats) return (
        <div className="flex flex-col h-full bg-[#06101a] text-white overflow-hidden">
            <TopBar title="Mi Progreso" onBack={onBack} />
        </div>
    ); // Avoid hydration mismatch in inner content

    const level = getLevelForPoints(stats.points);
    const progressPercent = Math.min(100, Math.max(0, ((stats.points - level.currentThreshold) / (level.nextThreshold - level.currentThreshold)) * 100));

    return (
        <div className="flex flex-col h-full bg-[#06101a] text-white overflow-hidden">
            <TopBar title="Mi Progreso" onBack={onBack} />
            <div className="flex-1 overflow-y-auto screen-px pb-32 pt-6">

                {/* Main Level Card */}
                <div className="bg-gradient-to-br from-[#1a2e42] to-[#1e3349] border border-white/5 rounded-[32px] p-8 text-center relative overflow-hidden mb-8 shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ec8e3]/10 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4fa3c8]/10 blur-3xl rounded-full"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#7ec8e3] rounded-2xl flex items-center justify-center text-[#0d1b2a] mb-5 shadow-lg shadow-[#7ec8e3]/20 transform rotate-3">
                            <Trophy size={40} strokeWidth={2.5} className="-rotate-3" />
                        </div>

                        <div className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#7ec8e3] mb-2">Nivel Actual</div>
                        <h2 className="text-[28px] text-[#e8f4f8] mb-2 font-serif">
                            {level.title}
                        </h2>
                        <p className="text-white/60 text-[14px] leading-relaxed mb-8 max-w-[280px]">
                            {level.subtitle}
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full">
                            <div className="flex justify-between items-end mb-2 px-1">
                                <span className="text-[24px] font-bold tracking-tight text-[#e8f4f8]">{stats.points} <span className="text-[13px] text-[#7ec8e3] font-medium">pts</span></span>
                                <span className="text-[12px] font-medium text-white/40">Objetivo: {level.nextThreshold}</span>
                            </div>
                            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                                <div
                                    className="h-full bg-[#7ec8e3] rounded-full transition-all duration-1000 ease-out relative"
                                    style={{ width: `${progressPercent}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-[2px] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-[13px] uppercase tracking-[0.1em] text-white/40 mb-4 px-2">Tus Logros</div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                    {/* SOS Uses */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-5 flex flex-col items-start hover:bg-white/[0.06] transition-colors relative overflow-hidden group shadow-md">
                        <div className="w-11 h-11 rounded-xl bg-[#e07d6a]/15 text-[#e07d6a] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <Shield size={22} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col items-start justify-end flex-1 mt-auto">
                            <div className="text-[32px] font-light text-[#e8f4f8] mb-1 tracking-tight leading-none font-serif">{stats.sosUses}</div>
                            <div className="text-[12px] font-medium text-white/40 leading-[1.4] max-w-[90%]">Anclajes de crisis superados</div>
                        </div>
                    </div>

                    {/* Breathing Mins */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-5 flex flex-col items-start hover:bg-white/[0.06] transition-colors relative overflow-hidden group shadow-md">
                        <div className="w-11 h-11 rounded-xl bg-[#7ec8e3]/15 text-[#7ec8e3] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <Wind size={22} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col items-start justify-end flex-1 mt-auto">
                            <div className="text-[32px] font-light text-[#e8f4f8] mb-1 tracking-tight leading-none font-serif">{stats.breathMins}</div>
                            <div className="text-[12px] font-medium text-white/40 leading-[1.4] max-w-[90%]">Minutos de calma y respiro</div>
                        </div>
                    </div>

                    {/* CBT Entries */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 flex flex-col col-span-2 items-start hover:bg-white/[0.06] transition-colors relative overflow-hidden group shadow-md mt-2">
                        <div className="w-12 h-12 rounded-xl bg-[#78b478]/15 text-[#78b478] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform z-10">
                            <PenLine size={24} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col items-start justify-end flex-1 mt-auto z-10">
                            <div className="text-[36px] font-light text-[#e8f4f8] mb-1 tracking-tight leading-none font-serif">{stats.cbtEntries}</div>
                            <div className="text-[14px] text-white/40 leading-[1.4] w-[60%]">Reflexiones y registros cognitivos</div>
                        </div>
                        <Award className="text-[#78b478]/5 w-40 h-40 absolute right-[-20px] bottom-[-30px] rotate-[-10deg] pointer-events-none" />
                    </div>
                </div>

            </div>
        </div>
    );
}
