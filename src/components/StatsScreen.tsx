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
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
            <TopBar title="Mi Progreso" onBack={onBack} />
        </div>
    ); // Avoid hydration mismatch in inner content

    const level = getLevelForPoints(stats.points);
    const progressPercent = Math.min(100, Math.max(0, ((stats.points - level.currentThreshold) / (level.nextThreshold - level.currentThreshold)) * 100));

    return (
        <div className="flex flex-col h-full bg-[#080A12] text-white overflow-hidden">
            <TopBar title="Mi Progreso" onBack={onBack} />
            <div className="flex-1 overflow-y-auto screen-px pb-32 pt-6">

                {/* Main Level Card */}
                <div className="glass-primary rounded-3xl p-8 text-center relative overflow-hidden mb-6 shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-blue-500/30 transform rotate-3">
                            <Trophy size={40} strokeWidth={2} className="-rotate-3" />
                        </div>

                        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400 mb-2">Nivel Actual</div>
                        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                            {level.title}
                        </h2>
                        <p className="text-blue-100/70 text-sm font-medium mb-8">
                            {level.subtitle}
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full">
                            <div className="flex justify-between items-end mb-2 px-1">
                                <span className="text-2xl font-bold tracking-tight">{stats.points} <span className="text-sm text-blue-300 font-medium">pts</span></span>
                                <span className="text-xs font-semibold text-slate-400">Objetivo: {level.nextThreshold}</span>
                            </div>
                            <div className="h-3 w-full bg-slate-900/50 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out relative"
                                    style={{ width: `${progressPercent}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 blur-[2px] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 px-1">Tus Logros</div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* SOS Uses */}
                    <div className="glass rounded-3xl p-5 flex flex-col items-start hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
                        <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <Shield size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col items-start justify-end flex-1 mt-auto">
                            <div className="text-4xl font-bold text-white mb-2 tracking-tight leading-none">{stats.sosUses}</div>
                            <div className="text-xs font-medium text-slate-400 leading-relaxed max-w-[90%]">Anclajes de crisis superados</div>
                        </div>
                    </div>

                    {/* Breathing Mins */}
                    <div className="glass rounded-3xl p-5 flex flex-col items-start hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <Wind size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col items-start justify-end flex-1 mt-auto">
                            <div className="text-4xl font-bold text-white mb-2 tracking-tight leading-none">{stats.breathMins}</div>
                            <div className="text-xs font-medium text-slate-400 leading-relaxed max-w-[90%]">Minutos de calma y respiro</div>
                        </div>
                    </div>

                    {/* CBT Entries */}
                    <div className="glass rounded-3xl p-5 flex flex-col col-span-2 items-start hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform z-10">
                            <PenLine size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col items-start justify-end flex-1 mt-auto z-10">
                            <div className="text-4xl font-bold text-white mb-2 tracking-tight leading-none">{stats.cbtEntries}</div>
                            <div className="text-xs font-medium text-slate-400 leading-relaxed w-[60%]">Reflexiones y registros cognitivos</div>
                        </div>
                        <Award className="text-emerald-500/10 w-32 h-32 absolute right-[-10px] bottom-[-20px] rotate-[-10deg] pointer-events-none" />
                    </div>
                </div>

            </div>
        </div>
    );
}
