'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Hash, Info } from 'lucide-react';

interface CognitiveSubtractionProps {
    onBack: () => void;
}

export default function CognitiveSubtraction({ onBack }: CognitiveSubtractionProps) {
    const [currentNumber, setCurrentNumber] = useState(200);
    const [options, setOptions] = useState<number[]>([]);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        generateOptions(currentNumber);
    }, [currentNumber]);

    const generateOptions = (num: number) => {
        const correct = num - 8;
        // Generate two incorrect options nearby
        const wrong1 = correct + (Math.random() > 0.5 ? 2 : -2);
        const wrong2 = correct + (Math.random() > 0.5 ? 10 : -10);

        // Shuffle options
        const newOptions = [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);
        setOptions(newOptions);
    };

    const handleChoice = (choice: number) => {
        if (choice === currentNumber - 8) {
            setIsError(false);
            setCurrentNumber(choice);
        } else {
            setIsError(true);
            setTimeout(() => setIsError(false), 500);
        }
    };

    return (
        <div className="flex flex-col items-center justify-between p-6 min-h-full bg-slate-950 text-white relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <div className="w-[80vw] h-[80vw] rounded-full border border-blue-500 animate-[pulse_8s_infinite]"></div>
            </div>

            <div className="z-10 w-full">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors py-2"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Volver</span>
                </button>
            </div>

            <div className="z-10 text-center animate-in fade-in zoom-in-95 duration-700">
                <div className="flex items-center justify-center gap-2 text-blue-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">
                    <Hash size={12} /> Anclaje Numérico
                </div>
                <div className="text-8xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>{currentNumber}</div>
                <div className="text-2xl text-blue-400 font-medium" style={{ fontFamily: 'Georgia, serif' }}>- 8</div>
            </div>

            <div className={`z-10 w-full max-w-xs flex flex-col gap-4 mb-20 transition-all ${isError ? 'animate-shake' : ''}`}>
                {options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleChoice(opt)}
                        className="w-full py-5 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:border-blue-500/50 text-white text-2xl font-medium hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/50"
                    >
                        {opt}
                    </button>
                ))}

                <div className="min-h-[20px] mt-4">
                    {isError && (
                        <p className="text-rose-500 text-center text-xs italic animate-in fade-in duration-300">
                            Tómate tu tiempo, respira y vuelve a intentarlo
                        </p>
                    )}
                </div>
            </div>

            <div className="z-10 bg-slate-900 border-2 border-blue-500/20 p-4 rounded-2xl flex gap-3 max-w-xs shadow-2xl shadow-blue-900/20">
                <Info size={16} className="text-blue-500 shrink-0" />
                <p className="text-[10px] text-blue-300/40 leading-relaxed italic">
                    Esta tarea activa tu corteza prefrontal, reduciendo la actividad de la amígdala (el centro del miedo).
                </p>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-8px); }
                    80% { transform: translateX(8px); }
                }
                .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
}

