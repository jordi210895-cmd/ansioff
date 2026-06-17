'use client';

import React, { useState } from 'react';
import { Play, Moon, Heart, Brain, Search } from 'lucide-react';

interface HomeScreenProps {
    onNav: (screen: string) => void;
    noteCount?: number;
    trackCount?: number;
    cbtCount?: number;
    userName?: string;
}

export default function HomeScreen({ onNav, noteCount = 0, trackCount = 0, cbtCount = 0, userName = "Jordi" }: HomeScreenProps) {
    const [mood, setMood] = useState<string>('Calma');
    const [moodLevel, setMoodLevel] = useState<number>(6);
    const [notes, setNotes] = useState('');
    
    const moods = [
        { id: 'Feliz', emoji: '😊' },
        { id: 'Calma', emoji: '😌' },
        { id: 'Ansioso', emoji: '😟' },
        { id: 'Triste', emoji: '😢' },
        { id: 'Estrés', emoji: '😫' },
    ];

    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', month: 'short', day: 'numeric' });

    return (
        <div className="min-h-full bg-[#111316] text-white overflow-y-auto pb-32 font-sans relative scrollbar-hide">
            
            {/* Soft background glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-teal-500/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-12 pb-6">
                    <div className="flex items-center gap-2">
                        {/* Styled A logo from image */}
                        <div className="relative flex items-center justify-center">
                            <span className="text-2xl italic font-serif bg-clip-text text-transparent bg-gradient-to-br from-teal-200 to-teal-600">A</span>
                            <div className="absolute w-full h-[1px] bg-teal-400 top-[45%] -rotate-12 opacity-50"></div>
                            <div className="absolute w-[60%] h-[1px] bg-teal-400 top-[60%] -rotate-12 opacity-50"></div>
                        </div>
                        <span className="text-xl tracking-wide font-light text-slate-100">Ansioff</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-[13px] text-slate-300 capitalize">{today}</span>
                        <button onClick={() => onNav('sc-settings')} className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-sm text-slate-200 backdrop-blur-md">
                            {userName.charAt(0).toUpperCase()}
                        </button>
                    </div>
                </div>

                {/* Greeting */}
                <div className="px-6 mb-8 mt-2">
                    <h1 className="text-[28px] font-semibold text-teal-50 tracking-tight leading-tight">Hola, {userName}.</h1>
                    <p className="text-[22px] font-light text-slate-200 tracking-tight mt-1">¿Cómo te sientes hoy?</p>
                </div>

                {/* Daily Mood */}
                <div className="px-6 mb-8">
                    <h2 className="text-[11px] font-bold tracking-[0.15em] text-slate-400 mb-4 uppercase">ESTADO DE ÁNIMO</h2>
                    
                    {/* Emojis row */}
                    <div className="flex justify-between items-center mb-5 px-1">
                        {moods.map(m => {
                            const isSelected = mood === m.id;
                            return (
                                <button 
                                    key={m.id} 
                                    onClick={() => setMood(m.id)}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div className={`w-[3.2rem] h-[3.2rem] rounded-[1.1rem] flex items-center justify-center text-[22px] transition-all duration-300 ${
                                        isSelected 
                                        ? 'bg-gradient-to-b from-teal-400/30 to-teal-500/10 border-2 border-teal-400/50 shadow-[0_0_15px_rgba(45,212,191,0.2)] scale-105' 
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10 opacity-70'
                                    }`}>
                                        <span className={isSelected ? 'drop-shadow-lg' : ''}>{m.emoji}</span>
                                    </div>
                                    <span className={`text-[10px] font-medium ${isSelected ? 'text-teal-50' : 'text-slate-400'}`}>{m.id}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Level & Notes Glass Panel */}
                    <div className="bg-white/[0.04] backdrop-blur-[20px] rounded-[1.5rem] p-5 border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                        <div className="flex justify-between items-center text-[11px] mb-4">
                            <span className="text-slate-400 font-medium tracking-wide">Selecciona tu nivel: 1 a 10</span>
                            <span className="text-slate-200 font-medium tracking-wide">Sintiendo <span className="text-teal-300 uppercase font-bold">{mood}</span> ({moodLevel}/10)</span>
                        </div>
                        
                        {/* Custom Slider that matches the image */}
                        <div className="relative h-1.5 w-full mb-6 mt-2">
                            {/* Track background */}
                            <div className="absolute inset-0 bg-slate-700/50 rounded-full"></div>
                            {/* Filled track */}
                            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400/80 to-teal-300 rounded-full" style={{ width: `${(moodLevel / 10) * 100}%` }}></div>
                            {/* Thumb glow */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-teal-200/20 rounded-full blur-md pointer-events-none transition-all duration-100" style={{ left: `calc(${(moodLevel / 10) * 100}% - 16px)` }}></div>
                            {/* Thumb */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none transition-all duration-100 border-2 border-teal-100" style={{ left: `calc(${(moodLevel / 10) * 100}% - 7px)` }}></div>
                            
                            {/* Hidden actual input */}
                            <input 
                                type="range" min="1" max="10" 
                                value={moodLevel} onChange={(e) => setMoodLevel(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        </div>

                        {/* Notes Input */}
                        <div className="relative">
                            <input 
                                type="text" 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Añadir notas..." 
                                className="w-full bg-black/20 border border-white/[0.05] rounded-xl px-4 py-3 text-[13px] text-white placeholder-slate-500 outline-none focus:border-white/20 transition-colors shadow-inner" 
                            />
                        </div>
                    </div>
                </div>

                {/* Guided Meditation */}
                <div className="px-6 mb-6">
                    <h2 className="text-[11px] font-bold tracking-[0.15em] text-slate-400 mb-4 uppercase">MEDITACIÓN GUIADA</h2>

                    {/* Featured Session (Nature Image Card) */}
                    <button 
                        onClick={() => onNav('sc-breath')} 
                        className="w-full mb-4 rounded-[1.5rem] relative overflow-hidden group text-left h-[140px] shadow-2xl shadow-black/50 border border-white/10"
                    >
                        {/* Background Image from unsplash (nature/meditation vibe) */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' }}
                        ></div>
                        
                        {/* Gradient overlay to ensure text is readable */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                        <div className="absolute inset-0 p-5 flex items-end justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                                    <Play className="w-4 h-4 text-white ml-1" fill="currentColor" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-teal-50/80 font-medium mb-1">Sesión Destacada:</div>
                                    <div className="text-lg font-semibold text-white leading-tight">Respiración Mindful</div>
                                    <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-2">
                                        <div className="w-[14px] h-[14px] rounded-full border border-white/40 flex items-center justify-center">
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                        </div>
                                        15 min · con Ansioff
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>

                    {/* 2 Small Cards below (Therapies as requested) */}
                    <div className="grid grid-cols-2 gap-3 pb-4">
                        <button onClick={() => onNav('sc-cbt')} className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-[1.5rem] p-4 text-left hover:bg-white/10 transition-colors shadow-lg relative h-[110px]">
                            <div className="absolute top-4 right-4 text-slate-400">
                                <Brain className="w-[18px] h-[18px]" />
                            </div>
                            <div className="text-[13px] font-semibold text-white mb-1 pr-6 leading-tight">Terapia TCC</div>
                            <div className="text-[10px] text-slate-400 mb-2 flex items-center gap-1.5">
                                <div className="w-[10px] h-[10px] rounded-full border border-slate-500 flex items-center justify-center">
                                    <div className="w-[3px] h-[3px] bg-slate-400 rounded-full"></div>
                                </div>
                                10 min · Mente
                            </div>
                            <div className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                                Reestructuración para pensamientos intrusivos.
                            </div>
                        </button>
                        
                        <button onClick={() => onNav('sc-act')} className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-[1.5rem] p-4 text-left hover:bg-white/10 transition-colors shadow-lg relative h-[110px]">
                            <div className="absolute top-4 right-4 text-slate-400">
                                <Moon className="w-[18px] h-[18px]" />
                            </div>
                            <div className="text-[13px] font-semibold text-white mb-1 pr-6 leading-tight">Módulo ACT</div>
                            <div className="text-[10px] text-slate-400 mb-2 flex items-center gap-1.5">
                                <div className="w-[10px] h-[10px] rounded-full border border-slate-500 flex items-center justify-center">
                                    <div className="w-[3px] h-[3px] bg-slate-400 rounded-full"></div>
                                </div>
                                20 min · Aceptación
                            </div>
                            <div className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                                Sesiones de aceptación emocional y calma.
                            </div>
                        </button>
                    </div>
                    
                    {/* Extra row for original elements so we don't lose navigation */}
                    <div className="grid grid-cols-2 gap-3 mt-1">
                         <button onClick={() => onNav('sc-audio')} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 text-left flex items-center justify-between hover:bg-white/[0.05]">
                             <span className="text-[12px] text-slate-300">Mis Audios</span>
                         </button>
                         <button onClick={() => onNav('sc-sos')} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-left flex items-center justify-between hover:bg-red-500/20">
                             <span className="text-[12px] text-red-300 font-medium">Boton SOS</span>
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
