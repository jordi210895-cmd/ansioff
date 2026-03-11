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
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Evaluación" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-5 pb-24">

                {!isFinished ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <ClipboardCheck size={14} className="text-[#5aadcf]" />
                                <span className="font-sans font-bold text-[10px] text-[#5aadcf] tracking-widest uppercase">Test de Síntomas</span>
                            </div>
                            <span className="font-sans font-medium text-[10px] text-[rgba(200,225,235,0.38)]">{currentIdx + 1} / {QUESTIONS.length}</span>
                        </div>

                        <div className="h-1.5 bg-[rgba(255,255,255,0.04)] rounded-full mb-10 overflow-hidden border border-[rgba(255,255,255,0.07)]">
                            <div
                                className="h-full bg-[#5aadcf] transition-all duration-300 shadow-[0_0_10px_rgba(90,173,207,0.5)]"
                                style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                            ></div>
                        </div>

                        <h2 className="text-2xl font-light mb-10 leading-relaxed font-serif text-[#ddeef5]">
                            En la última semana, ¿cuánto te ha molestado esto?<br />
                            <span className="text-[#5aadcf] mt-6 block italic">"{QUESTIONS[currentIdx]}"</span>
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
                                    className="w-full p-5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] rounded-2xl text-left text-[rgba(200,225,235,0.8)] font-sans font-medium text-[15px] transition-transform duration-200 hover:-translate-y-0.5 group shadow-sm"
                                >
                                    <span className="group-hover:text-[#ddeef5] transition-colors">{opt.l}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-center py-10">
                        <div className="w-20 h-20 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <BarChart3 className="w-8 h-8 text-[#5aadcf]" />
                        </div>
                        <h2 className="font-sans font-bold text-[10px] text-[rgba(200,225,235,0.38)] uppercase tracking-widest mb-2">Resultado del Análisis</h2>
                        <div className={`text-3xl font-light font-serif italic mb-8 ${getResult().c}`} >{getResult().t}</div>

                        <div className="relative inline-block mb-10">
                            <div className="text-6xl font-light text-[#ddeef5]">{totalScore}</div>
                            <div className="absolute -right-8 bottom-2 font-sans font-bold text-[9px] text-[rgba(200,225,235,0.38)] uppercase tracking-widest">Puntos</div>
                        </div>

                        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-8 rounded-2xl mb-10 relative overflow-hidden text-left shadow-sm">
                            <CheckCircle2 className={`${getResult().c} mb-4`} size={24} />
                            <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.8)] leading-relaxed">
                                {getResult().d}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                className="w-full bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f] font-sans font-semibold text-xs tracking-wider rounded-full py-4 transition-colors shadow-lg"
                                onClick={onBack}
                            >
                                Volver a Módulos
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 font-sans font-semibold text-xs tracking-wider text-[rgba(200,225,235,0.38)] hover:text-[#ddeef5] transition-colors py-2"
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

