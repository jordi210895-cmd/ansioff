'use client';

import { Wind, Volume2, BookOpen, Gamepad2, GraduationCap, AlertCircle, Sparkles } from 'lucide-react';

interface HomeScreenProps {
    onNav: (screen: string) => void;
    noteCount?: number;
    trackCount?: number;
    cbtCount?: number;
    userName?: string;
}

export default function HomeScreen({ onNav, noteCount = 0, trackCount = 0, cbtCount = 0, userName = "Amigo" }: HomeScreenProps) {
    return (
        <div className="min-h-full bg-slate-950 text-white overflow-y-auto scrollbar-hide">
            {/* Header with time */}
            <div className="px-6 pt-8 pb-6">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <div className="text-sm text-blue-400">12:58</div>
                    <Sparkles className="w-5 h-5 text-blue-500" strokeWidth={2} />
                </div>
            </div>

            {/* Main Content */}
            <main className="px-6 pb-12 max-w-xl mx-auto">

                {/* Brand */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl mb-3 tracking-tight" style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}>
                        <span className="text-white">Hola, </span><span className="text-blue-500">{userName}</span>
                    </h1>
                    <p className="text-base text-blue-400">Tu espacio seguro</p>
                </div>

                {/* Emergency Button - Large & Bold */}
                <div className="mb-12">
                    <button
                        onClick={() => onNav('sc-sos')}
                        className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-3xl p-10 transition-all duration-300 shadow-2xl shadow-blue-500/50 hover:shadow-blue-400/60 hover:scale-[1.02]"
                    >
                        <div className="flex items-center justify-center gap-5">
                            <AlertCircle className="w-9 h-9" strokeWidth={2.5} />
                            <div className="text-left">
                                <div className="text-2xl font-medium mb-1">Necesito ayuda ahora</div>
                                <div className="text-base text-blue-50">Guía de crisis inmediata</div>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Main Feature Card - Bigger */}
                <div className="mb-10">
                    <button
                        onClick={() => onNav('sc-breath')}
                        className="w-full bg-gradient-to-br from-blue-900 to-blue-950 border-2 border-blue-500 hover:border-blue-400 rounded-3xl p-10 transition-all duration-300 text-left hover:scale-[1.02] shadow-xl shadow-blue-900/50"
                    >
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/50">
                                <Wind className="w-10 h-10 text-white" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl text-white mb-3 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                                    Respiración guiada
                                </h2>
                                <p className="text-base text-blue-300">
                                    5 minutos • Patrón 4-2-6
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Tools Section */}
                <div className="space-y-4">
                    <h3 className="text-sm uppercase tracking-widest text-blue-400 mb-6 px-2 font-semibold">
                        Herramientas disponibles
                    </h3>

                    {[
                        { icon: Volume2, label: 'Audios', detail: trackCount > 0 ? `${trackCount} pistas disponibles` : 'De tu psicólogo y recordatorios', color: 'from-cyan-500 to-blue-500', screen: 'sc-audio' },
                        { icon: BookOpen, label: 'Diario personal', detail: noteCount > 0 ? `${noteCount} entradas` : 'Sin entradas', color: 'from-blue-500 to-indigo-500', screen: 'sc-notes' },
                        { icon: Gamepad2, label: 'Ejercicios', detail: 'Distracción cognitiva', color: 'from-indigo-500 to-purple-500', screen: 'sc-games' },
                        { icon: GraduationCap, label: 'Aprender más', detail: 'Psicoeducación', color: 'from-purple-500 to-blue-500', screen: 'sc-tools' }
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => onNav(item.screen)}
                            className="w-full bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 text-left group hover:scale-[1.02] shadow-lg shadow-slate-900/50"
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                    <item.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-lg text-white font-medium mb-1">{item.label}</div>
                                    <div className="text-sm text-blue-400">{item.detail}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}

