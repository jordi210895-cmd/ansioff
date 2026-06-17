'use client';

import React, { useState } from 'react';
import { Play, Brain, Heart, Wind, AlertCircle, ChevronRight, Menu } from 'lucide-react';

interface HomeScreenProps {
    onNav: (screen: string) => void;
    noteCount?: number;
    trackCount?: number;
    cbtCount?: number;
    userName?: string;
}

export default function HomeScreen({ onNav, noteCount = 0, trackCount = 0, cbtCount = 0, userName = "Amigo" }: HomeScreenProps) {
    const [mood, setMood] = useState<string>('Tranquilo');
    const [moodLevel, setMoodLevel] = useState<number>(6);
    const [notes, setNotes] = useState('');
    
    const moods = [
        { id: 'Feliz', emoji: '😊' },
        { id: 'Tranquilo', emoji: '😌' },
        { id: 'Ansioso', emoji: '😟' },
        { id: 'Triste', emoji: '😢' },
        { id: 'Estresado', emoji: '😫' },
    ];

    // Formatear fecha: "lunes, 28 oct" (por ejemplo)
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date().toLocaleDateString('es-ES', dateOptions);

    return (
        <div className="min-h-full bg-[#101216] text-white overflow-y-auto pb-28 font-sans scrollbar-hide">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 pt-10 pb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-teal-400 to-emerald-600 rounded-lg text-black font-bold font-serif italic text-xl">A</div>
                    <span className="text-xl font-medium tracking-wide">Ansioff</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-slate-400 capitalize">{today}</div>
                    <button onClick={() => onNav('sc-settings')} className="w-9 h-9 rounded-full bg-[#1c1f26] border border-white/10 flex items-center justify-center text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors">
                        {userName.charAt(0).toUpperCase()}
                    </button>
                </div>
            </div>

            {/* Greeting */}
            <div className="px-6 mb-8">
                <h1 className="text-3xl font-semibold mb-1 text-white">Hola, {userName}.</h1>
                <p className="text-slate-400 text-lg">¿Cómo te sientes hoy?</p>
            </div>

            {/* Daily Mood */}
            <div className="px-6 mb-8">
                <h2 className="text-[11px] font-bold tracking-widest text-slate-500 mb-3 uppercase">Estado de ánimo diario</h2>
                <div className="bg-[#1a1c23] border border-white/5 rounded-[2rem] p-5 shadow-2xl shadow-black/50 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-teal-500/10 blur-[60px] pointer-events-none"></div>
                    
                    {/* Emojis */}
                    <div className="flex justify-between items-end mb-6 relative z-10 px-1">
                        {moods.map(m => (
                            <button 
                                key={m.id} 
                                onClick={() => setMood(m.id)}
                                className={`flex flex-col items-center gap-3 transition-all duration-300 ${mood === m.id ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70'}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${mood === m.id ? 'bg-teal-500/20 border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.2)]' : 'bg-white/5 border border-transparent'}`}>
                                    {m.emoji}
                                </div>
                                <span className={`text-[10px] font-medium transition-colors ${mood === m.id ? 'text-teal-300' : 'text-slate-400'}`}>{m.id}</span>
                            </button>
                        ))}
                    </div>

                    {/* Slider & Notes */}
                    <div className="bg-black/40 rounded-3xl p-5 border border-white/5 relative z-10 backdrop-blur-sm">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-3">
                            <span>Selecciona tu nivel: 1 a 10</span>
                            <span className="text-white font-medium">Nivel <span className="text-teal-400 uppercase">{mood}</span> ({moodLevel}/10)</span>
                        </div>
                        
                        {/* Custom Slider */}
                        <div className="relative h-2 w-full mb-5">
                            <div className="absolute inset-0 bg-slate-800 rounded-full"></div>
                            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" style={{ width: `${(moodLevel / 10) * 100}%` }}></div>
                            <input 
                                type="range" min="1" max="10" 
                                value={moodLevel} onChange={(e) => setMoodLevel(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {/* Thumb handle (visual only) */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none transition-all duration-100" style={{ left: `calc(${(moodLevel / 10) * 100}% - 8px)` }}></div>
                        </div>

                        <div>
                            <input 
                                type="text" 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Añadir notas sobre cómo te sientes..." 
                                className="w-full bg-transparent border-b border-white/10 pb-2 text-[13px] text-white placeholder-slate-500 outline-none focus:border-teal-400 transition-colors" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Guided Meditation / Tools */}
            <div className="px-6 mb-6">
                <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-3">Herramientas Recomendadas</h2>

                {/* Featured Session */}
                <button onClick={() => onNav('sc-breath')} className="w-full mb-3 bg-[#1a1c23] border border-white/5 rounded-3xl p-5 flex items-center gap-5 relative overflow-hidden group text-left shadow-xl shadow-black/40">
                    <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-emerald-900/40 to-transparent pointer-events-none transition-opacity group-hover:opacity-70"></div>
                    
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0 z-10 group-hover:bg-teal-500/30 transition-colors border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                    </div>
                    <div className="z-10 flex-1">
                        <div className="text-[10px] text-teal-400 font-semibold tracking-widest mb-1 uppercase">Sesión Destacada</div>
                        <div className="text-lg font-medium text-white mb-1">Respiración Mindful</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <Wind className="w-3 h-3" /> 5 min · Alivio profundo
                        </div>
                    </div>
                </button>

                {/* 2 Small Cards (Therapies) */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <button onClick={() => onNav('sc-cbt')} className="bg-[#1a1c23] border border-white/5 rounded-3xl p-4 text-left hover:bg-white/10 transition-colors relative overflow-hidden group shadow-lg">
                        <div className="absolute top-3 right-3 opacity-40 group-hover:opacity-100 transition-opacity"><Brain className="w-4 h-4 text-indigo-400" /></div>
                        <div className="text-sm font-medium text-white mb-1 mt-2">Terapia TCC</div>
                        <div className="text-[11px] text-indigo-300 mb-2 flex items-center gap-1">
                            <div className="w-1 h-1 bg-indigo-400 rounded-full"></div> Reestructuración
                        </div>
                        <div className="text-[10px] text-slate-500 leading-relaxed pr-2">Gestiona tus pensamientos intrusivos.</div>
                    </button>
                    
                    <button onClick={() => onNav('sc-act')} className="bg-[#1a1c23] border border-white/5 rounded-3xl p-4 text-left hover:bg-white/10 transition-colors relative overflow-hidden group shadow-lg">
                        <div className="absolute top-3 right-3 opacity-40 group-hover:opacity-100 transition-opacity"><Heart className="w-4 h-4 text-rose-400" /></div>
                        <div className="text-sm font-medium text-white mb-1 mt-2">Módulo ACT</div>
                        <div className="text-[11px] text-rose-300 mb-2 flex items-center gap-1">
                            <div className="w-1 h-1 bg-rose-400 rounded-full"></div> Aceptación
                        </div>
                        <div className="text-[10px] text-slate-500 leading-relaxed pr-2">Acepta emociones y avanza hacia valores.</div>
                    </button>
                </div>
                
                {/* Additional Tools row */}
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => onNav('sc-audio')} className="bg-[#1a1c23] border border-white/5 rounded-3xl p-4 text-left hover:bg-white/10 transition-colors shadow-lg">
                        <div className="text-sm font-medium text-white mb-1">Audios</div>
                        <div className="text-[10px] text-slate-500">{trackCount} pistas · Relajación</div>
                    </button>
                    <button onClick={() => onNav('sc-games')} className="bg-[#1a1c23] border border-white/5 rounded-3xl p-4 text-left hover:bg-white/10 transition-colors shadow-lg">
                        <div className="text-sm font-medium text-white mb-1">Juegos</div>
                        <div className="text-[10px] text-slate-500">Distracción cognitiva</div>
                    </button>
                </div>
            </div>

            {/* SOS Button */}
            <div className="px-6 mt-6">
                 <button onClick={() => onNav('sc-sos')} className="w-full bg-[#1f1515] border border-red-500/20 rounded-3xl p-4 flex items-center justify-between hover:bg-red-950/40 transition-colors shadow-xl shadow-red-900/10">
                     <div className="flex items-center gap-4">
                         <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                             <AlertCircle className="w-5 h-5" />
                         </div>
                         <div className="text-left">
                             <div className="text-[13px] font-medium text-red-100">Necesito ayuda ahora</div>
                             <div className="text-[11px] text-red-400/80 mt-0.5">Asistencia de crisis inmediata</div>
                         </div>
                     </div>
                     <ChevronRight className="w-5 h-5 text-red-500/50" />
                 </button>
            </div>
        </div>
    );
}
