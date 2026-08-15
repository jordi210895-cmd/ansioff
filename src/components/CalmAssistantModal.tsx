'use client';

import { useState } from 'react';
import { Sparkles, Wind, Brain, Stethoscope, Headphones, ArrowRight, X, Clock } from 'lucide-react';

interface CalmAssistantModalProps {
    onBack: () => void;
    onNav: (screen: string) => void;
}

const FEELINGS = [
    {
        id: 'panic',
        icon: <Wind className="w-5 h-5" />,
        title: 'Falta de aire, taquicardia o pánico',
        sub: 'Necesito calmar mi cuerpo inmediatamente',
        color: '#ef4444',
        targetScreen: 'breath', // or 'sc-sos'
    },
    {
        id: 'thoughts',
        icon: <Brain className="w-5 h-5" />,
        title: 'Pensamientos en bucle o agobio mental',
        sub: 'No puedo dejar de darle vueltas a las cosas',
        color: '#38bdf8',
        targetScreen: 'sc-cbt',
    },
    {
        id: 'body',
        icon: <Stethoscope className="w-5 h-5" />,
        title: 'Opresión en el pecho, nudo o tensión',
        sub: 'Siento molestias físicas causadas por la ansiedad',
        color: '#818cf8',
        targetScreen: 'sc-bodymap',
    },
    {
        id: 'sleep',
        icon: <Headphones className="w-5 h-5" />,
        title: 'No puedo dormir o desconectar',
        sub: 'Busco relajarme antes de descansar',
        color: '#c084fc',
        targetScreen: 'sounds',
    },
];

const DURATIONS = [
    { id: '1m', label: '1 minuto (Rápido)', desc: 'Un alivio expres para momentos de prisas' },
    { id: '3m', label: '3-5 minutos (Recomendado)', desc: 'La duración ideal para cambiar tu estado' },
    { id: '10m', label: '10+ minutos (Profundo)', desc: 'Sesión completa de inmersión y descanso' },
];

export default function CalmAssistantModal({ onBack, onNav }: CalmAssistantModalProps) {
    const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<string>('3m');

    const activeItem = FEELINGS.find((f) => f.id === selectedFeeling);

    const handleStart = () => {
        if (!activeItem) return;
        onNav(activeItem.targetScreen);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <style jsx>{`
                .assistant-card {
                    background: linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(8, 14, 26, 0.98));
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    border-radius: 28px;
                    width: 100%;
                    max-width: 480px;
                    padding: 24px;
                    color: #e2e8f0;
                    position: relative;
                    overflow: hidden;
                }
                .feeling-btn {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 16px;
                    border-radius: 18px;
                    background: rgba(255, 255, 255, 0.035);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    text-align: left;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                    width: 100%;
                }
                .feeling-btn:hover, .feeling-btn.selected {
                    background: rgba(56, 189, 248, 0.12);
                    border-color: rgba(56, 189, 248, 0.5);
                    transform: translateY(-2px);
                }
                .feeling-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    background: rgba(255, 255, 255, 0.06);
                }
                .duration-btn {
                    padding: 10px 14px;
                    border-radius: 14px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    font-size: 13px;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s ease;
                }
                .duration-btn.selected {
                    background: rgba(56, 189, 248, 0.16);
                    border-color: #38bdf8;
                    color: #7dd3fc;
                }
                .start-btn {
                    width: 100%;
                    padding: 14px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #0ea5e9, #0284c7);
                    color: white;
                    font-weight: 700;
                    font-size: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 10px 30px rgba(14, 165, 233, 0.35);
                    transition: all 0.2s ease;
                    border: none;
                    cursor: pointer;
                }
                .start-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    box-shadow: none;
                }
            `}</style>

            <div className="assistant-card">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-100 leading-tight">Asistente de Calma</h2>
                            <p className="text-xs text-slate-400">Te guiamos paso a paso sin rodeos</p>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-white/5 transition-colors"
                        aria-label="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Step 1: Feeling selection */}
                <div className="mb-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-sky-400/80 mb-3">
                        1. ¿Qué estás sintiendo en este momento?
                    </label>
                    <div className="space-y-2.5">
                        {FEELINGS.map((f) => {
                            const isSelected = selectedFeeling === f.id;
                            return (
                                <button
                                    key={f.id}
                                    className={`feeling-btn ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedFeeling(f.id)}
                                >
                                    <div className="feeling-icon" style={{ color: f.color }}>
                                        {f.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-slate-100 leading-snug">{f.title}</div>
                                        <div className="text-xs text-slate-400 truncate">{f.sub}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Step 2: Duration selection */}
                <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-sky-400/80 mb-2.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> 2. ¿De cuánto tiempo dispones?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {DURATIONS.map((d) => (
                            <button
                                key={d.id}
                                className={`duration-btn ${selectedDuration === d.id ? 'selected' : ''}`}
                                onClick={() => setSelectedDuration(d.id)}
                            >
                                <div className="font-semibold text-xs text-slate-200">{d.label.split(' ')[0]} {d.label.split(' ')[1]}</div>
                                <div className="text-[10px] text-slate-400">{d.label.split('(')[1]?.replace(')', '')}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action button */}
                <button
                    className="start-btn"
                    disabled={!selectedFeeling}
                    onClick={handleStart}
                >
                    <span>Ir a mi ejercicio guiado</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
