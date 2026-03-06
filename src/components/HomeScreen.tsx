'use client';

import { Wind, Volume2, BookOpen, Gamepad2, GraduationCap, AlertCircle, Sparkles } from 'lucide-react';

interface HomeScreenProps {
    onNav: (screen: string) => void;
    noteCount: number;
    trackCount: number;
}

export default function HomeScreen({ onNav, noteCount, trackCount }: HomeScreenProps) {
    return (
        <div className="h-full bg-slate-950 text-white overflow-hidden flex flex-col pt-4 pb-12 px-6 justify-between">
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Top Bar - Very Compact */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-bold text-blue-500/50 uppercase tracking-[0.2em]">Ansioff • Premium</div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium tracking-tighter">12:58</span>
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                </div>
            </div>

            {/* Brand - Centered */}
            <div className="flex-none flex flex-col items-center pt-2 pb-2">
                <img
                    src="/logo.png"
                    alt="Ansioff Logo"
                    className="h-24 w-auto object-contain mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                />
                <p className="text-[10px] text-blue-400/80 font-bold tracking-[0.3em] uppercase">Tu espacio seguro</p>
            </div>

            <div className="flex-grow"></div>

            {/* Emergency Button */}
            <div className="flex-none">
                <button
                    onClick={() => onNav('sc-sos')}
                    className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-[2rem] p-9 transition-all duration-300 shadow-2xl shadow-blue-500/40 active:scale-[0.98]"
                >
                    <div className="flex items-center justify-center gap-6">
                        <AlertCircle className="w-9 h-9" strokeWidth={2.5} />
                        <div className="text-left">
                            <div className="text-2xl font-semibold mb-0.5">Necesito ayuda ahora</div>
                            <div className="text-xs text-blue-100/90 uppercase tracking-widest">Guía de crisis inmediata</div>
                        </div>
                    </div>
                </button>
            </div>

            <div className="flex-grow"></div>

            {/* Main Feature */}
            <div className="flex-none">
                <button
                    onClick={() => onNav('sc-breath')}
                    className="w-full bg-gradient-to-br from-blue-900 to-blue-950 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-[2rem] p-8 transition-all active:scale-[0.98] shadow-xl shadow-blue-950/50"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                            <Wind className="w-8 h-8 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl text-white font-medium mb-1" style={{ fontFamily: 'Georgia, serif' }}>Respiración guiada</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-blue-300 font-bold uppercase tracking-widest">Patrón 4-2-6</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                <span className="text-xs text-slate-400">5 min</span>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <div className="flex-grow"></div>

            {/* Tools Grid - Using 2x2 for extreme vertical efficiency */}
            <div className="flex-none">
                <div className="flex justify-between items-center px-1 mb-3">
                    <h3 className="text-[9px] uppercase tracking-[0.25em] text-slate-500 font-bold">Herramientas</h3>
                    <div className="h-[1px] flex-1 bg-slate-900 ml-4"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { icon: Volume2, label: 'Audios', screen: 'sc-audio', color: 'from-blue-500 to-indigo-600' },
                        { icon: BookOpen, label: 'Diario', screen: 'sc-notes', color: 'from-indigo-500 to-purple-600' },
                        { icon: Gamepad2, label: 'Juegos', screen: 'sc-games', color: 'from-purple-500 to-pink-600' },
                        { icon: GraduationCap, label: 'Módulos', screen: 'sc-tools', color: 'from-blue-600 to-cyan-600' }
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => onNav(item.screen)}
                            className="bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/40 rounded-2xl p-4 flex items-center gap-4 active:scale-[0.96] transition-all shadow-lg"
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                <item.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-sm font-semibold text-slate-100">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

