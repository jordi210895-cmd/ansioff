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
        <div className="flex flex-col items-center justify-between p-6 min-h-full bg-[#06101a] text-white relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <div className="w-[80vw] h-[80vw] rounded-full border border-[#b48cdc] animate-[pulse_8s_infinite]"></div>
            </div>

            <div className="z-10 w-full">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors py-2"
                >
                    <ArrowLeft size={20} />
                    <span className="text-[14px] font-medium">Volver</span>
                </button>
            </div>

            <div className="z-10 text-center animate-in fade-in zoom-in-95 duration-700">
                <div className="flex items-center justify-center gap-2 text-[#b48cdc] text-[11px] uppercase tracking-[0.2em] font-medium mb-4">
                    <Hash size={14} /> Anclaje Numérico
                </div>
                <div className="text-[80px] font-serif text-[#e8f4f8] mb-4 leading-none">{currentNumber}</div>
                <div className="text-[28px] text-[#b48cdc] font-serif">- 8</div>
            </div>

            <div className={`z-10 w-full max-w-xs flex flex-col gap-4 mb-20 transition-all ${isError ? 'animate-shake' : ''}`}>
                {options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleChoice(opt)}
                        className="w-full py-5 rounded-[24px] bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-[#b48cdc]/40 text-[#e8f4f8] text-[24px] font-serif hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                    >
                        {opt}
                    </button>
                ))}

                <div className="min-h-[20px] mt-4">
                    {isError && (
                        <p className="text-[#e07d6a] text-center text-[13px] italic font-serif animate-in fade-in duration-300">
                            Tómate tu tiempo, respira y vuelve a intentarlo.
                        </p>
                    )}
                </div>
            </div>

            <div className="z-10 bg-white/[0.02] border border-[#b48cdc]/20 p-5 rounded-[24px] flex gap-3 max-w-xs shadow-lg">
                <Info size={18} className="text-[#b48cdc] shrink-0" />
                <p className="text-[12px] text-[#e8f4f8]/50 leading-relaxed italic pr-1">
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

