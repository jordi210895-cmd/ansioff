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
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Mi Progreso" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-5 pb-32 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                {/* Main Level Card */}
                <div className="bg-[#0e1d2e] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 text-center relative overflow-hidden mb-8 shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#5aadcf]/5 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#5aadcf]/5 blur-3xl rounded-full"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#c9a96e]/10 border border-[#c9a96e]/20 rounded-full flex items-center justify-center text-[#c9a96e] mb-5 shadow-inner">
                            <Trophy size={36} strokeWidth={2} />
                        </div>

                        <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#5aadcf] mb-2">Nivel Actual</div>
                        <h2 className="text-3xl text-[#ddeef5] mb-2 font-serif italic font-light">
                            {level.title}
                        </h2>
                        <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.8)] leading-relaxed mb-8 max-w-[280px]">
                            {level.subtitle}
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full">
                            <div className="flex justify-between items-end mb-2 px-1">
                                <span className="text-2xl font-light font-serif text-[#ddeef5]">{stats.points} <span className="font-sans font-medium text-xs text-[rgba(200,225,235,0.38)]">pts</span></span>
                                <span className="font-sans font-medium text-[11px] text-[rgba(200,225,235,0.38)]">Objetivo: {level.nextThreshold}</span>
                            </div>
                            <div className="h-2 w-full bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden border border-[rgba(255,255,255,0.07)] relative">
                                <div
                                    className="absolute top-0 bottom-0 left-0 bg-[#5aadcf] rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-[rgba(200,225,235,0.38)] mb-4 px-2">Tus Logros</div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* SOS Uses */}
                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 flex flex-col items-start hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-transform duration-200 hover:-translate-y-0.5 relative overflow-hidden group shadow-sm w-full">
                        <div className="w-10 h-10 rounded-full bg-[#d97c6a]/10 border border-[#d97c6a]/20 text-[#d97c6a] flex items-center justify-center mb-5 group-hover:bg-[#d97c6a]/20 transition-colors">
                            <Shield size={20} className="stroke-[1.5]" />
                        </div>
                        <div className="flex flex-col items-start justify-end flex-1 mt-auto w-full">
                            <div className="text-3xl font-light text-[#ddeef5] mb-1 font-serif">{stats.sosUses}</div>
                            <div className="font-sans font-light text-[11px] text-[rgba(200,225,235,0.38)] leading-snug w-full">Anclajes de crisis superados</div>
                        </div>
                    </div>

                    {/* Breathing Mins */}
                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 flex flex-col items-start hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-transform duration-200 hover:-translate-y-0.5 relative overflow-hidden group shadow-sm w-full">
                        <div className="w-10 h-10 rounded-full bg-[#5aadcf]/10 border border-[#5aadcf]/20 text-[#5aadcf] flex items-center justify-center mb-5 group-hover:bg-[#5aadcf]/20 transition-colors">
                            <Wind size={20} className="stroke-[1.5]" />
                        </div>
                        <div className="flex flex-col items-start justify-end flex-1 mt-auto w-full">
                            <div className="text-3xl font-light text-[#ddeef5] mb-1 font-serif">{stats.breathMins}</div>
                            <div className="font-sans font-light text-[11px] text-[rgba(200,225,235,0.38)] leading-snug w-full">Minutos de calma y respiro</div>
                        </div>
                    </div>

                    {/* CBT Entries */}
                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 flex flex-col col-span-2 items-start hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-transform duration-200 hover:-translate-y-0.5 relative overflow-hidden group shadow-sm mt-1 w-full">
                        <div className="w-10 h-10 rounded-full bg-[#6bbf8e]/10 border border-[#6bbf8e]/20 text-[#6bbf8e] flex items-center justify-center mb-5 group-hover:bg-[#6bbf8e]/20 transition-colors z-10">
                            <PenLine size={20} className="stroke-[1.5]" />
                        </div>
                        <div className="flex flex-col items-start justify-end flex-1 mt-auto z-10 w-full">
                            <div className="text-4xl font-light text-[#ddeef5] mb-2 font-serif">{stats.cbtEntries}</div>
                            <div className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] leading-snug w-[75%]">Reflexiones y registros cognitivos</div>
                        </div>
                        <Award className="text-[rgba(255,255,255,0.03)] w-32 h-32 absolute right-[-10px] bottom-[-20px] pointer-events-none stroke-1" />
                    </div>
                </div>

            </div>
        </div>
    );
}
