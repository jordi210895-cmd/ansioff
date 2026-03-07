'use client';

import { useState } from 'react';
import { BarChart3, CheckCircle2, RotateCcw, ArrowRight, ClipboardCheck } from 'lucide-react';
import TopBar from './TopBar';

interface EvaluationScreenProps {
    onBack: () => void;
}

const QUESTIONS = [
    'Sensación de hormigueo o entumecimiento',
    'Sensación de calor / sofocos',
    'Temblor en las piernas',
    'Incapacidad para relajarse',
    'Miedo a que ocurra lo peor',
    'Sensación de mareo o inestabilidad',
    'Palpitaciones o taquicardia',
    'Nerviosismo excesivo',
    'Sensación de ahogo o dificultad para respirar',
    'Miedo a perder el control'
];

export default function EvaluationScreen({ onBack }: EvaluationScreenProps) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleAnswer = (score: number) => {
        const nextScore = totalScore + score;
        if (currentIdx < QUESTIONS.length - 1) {
            setTotalScore(nextScore);
            setCurrentIdx(currentIdx + 1);
        } else {
            setTotalScore(nextScore);
            setIsFinished(true);
        }
    };

    const getResult = () => {
        if (totalScore <= 10) return {
            t: 'Ansiedad Mínima',
            c: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            d: 'Tus niveles de ansiedad están dentro de lo normal. Sigue practicando la respiración para mantener este equilibrio.'
        };
        if (totalScore <= 20) return {
            t: 'Ansiedad Moderada',
            c: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            d: 'Estás experimentando una ansiedad significativa. Te recomendamos usar el apartado de Técnicas TCC a diario.'
        };
        return {
            t: 'Ansiedad Severa',
            c: 'text-rose-400',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            d: 'Tus niveles son altos. Es importante que consultes con un profesional y uses el módulo SOS cuando lo necesites.'
        };
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
            <TopBar title="Evaluación" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-8 pb-24">

                {!isFinished ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <ClipboardCheck size={14} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">Test de Síntomas</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">{currentIdx + 1} / {QUESTIONS.length}</span>
                        </div>

                        <div className="h-1.5 bg-slate-900 rounded-full mb-12 overflow-hidden border-2 border-slate-800">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                            ></div>
                        </div>

                        <h2 className="text-3xl font-medium mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                            En la última semana, ¿cuánto te ha molestado esto?<br />
                            <span className="text-blue-400 mt-6 block italic">"{QUESTIONS[currentIdx]}"</span>
                        </h2>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { l: 'Nada en absoluto', s: 0 },
                                { l: 'Ligeramente', s: 1 },
                                { l: 'Moderadamente', s: 2 },
                                { l: 'Severamente', s: 3 }
                            ].map((opt) => (
                                <button
                                    key={opt.s}
                                    onClick={() => handleAnswer(opt.s)}
                                    className="w-full p-5 bg-slate-900 border-2 border-slate-800 rounded-2xl text-left text-slate-300 text-sm font-medium hover:border-blue-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] group shadow-lg shadow-slate-900/50"
                                >
                                    <span className="group-hover:text-white transition-colors">{opt.l}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in zoom-in-95 duration-700 text-center py-12">
                        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/5">
                            <BarChart3 className="w-10 h-10 text-blue-500" />
                        </div>
                        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Resultado del Análisis</h2>
                        <div className={`text-4xl font-medium mb-8 ${getResult().c}`} style={{ fontFamily: 'Georgia, serif' }}>{getResult().t}</div>

                        <div className="relative inline-block mb-12">
                            <div className="text-7xl font-light text-white">{totalScore}</div>
                            <div className="absolute -right-8 bottom-2 text-xs text-slate-500 font-bold uppercase tracking-widest">Puntos</div>
                        </div>

                        <div className={`${getResult().bg} ${getResult().border} border-2 p-8 rounded-[40px] mb-12 relative overflow-hidden text-left shadow-2xl`}>
                            <CheckCircle2 className={`${getResult().c} mb-4`} size={24} />
                            <p className="text-slate-200 text-base leading-relaxed">
                                {getResult().d}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                                onClick={onBack}
                            >
                                Volver a Módulos
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 text-slate-500 text-xs hover:text-white transition-colors py-2"
                                onClick={() => { setIsFinished(false); setCurrentIdx(0); setTotalScore(0); }}
                            >
                                <RotateCcw size={14} /> Repetir test
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

