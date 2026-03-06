'use client';

import { useState } from 'react';
import { Moon, Sparkles, Wind, Sun, ArrowLeft, Shield } from 'lucide-react';
import TopBar from './TopBar';

interface NightModeScreenProps {
    onBack: () => void;
}

export default function NightModeScreen({ onBack }: NightModeScreenProps) {
    const [activeRescue, setActiveRescue] = useState<'none' | 'ground' | 'light'>('none');

    return (
        <div className="flex flex-col h-full bg-slate-950 text-blue-100/80 overflow-hidden">
            <TopBar title="Rescate Nocturno" onBack={onBack} />

            <div className="flex-1 overflow-y-auto px-6 flex flex-col items-center justify-center text-center pb-24">

                {activeRescue === 'none' && (
                    <div className="animate-in fade-in zoom-in-95 duration-1000">
                        <div className="w-24 h-24 rounded-full bg-blue-500/5 flex items-center justify-center text-blue-400 mb-10 shadow-[0_0_50px_rgba(59,130,246,0.1)] border border-blue-500/10">
                            <Moon size={40} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-medium text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>¿Te has despertado con miedo?</h2>
                        <p className="text-blue-300/40 text-sm leading-relaxed mb-12 max-w-xs mx-auto italic">
                            Es natural. Por la noche el miedo parece más grande, pero sigues a salvo hoy. No enciendas luces fuertes.
                        </p>

                        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                            <button
                                className="bg-slate-900 py-5 rounded-2xl border-2 border-slate-800 hover:border-blue-500/50 text-white font-medium hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/50"
                                onClick={() => setActiveRescue('ground')}
                            >
                                Técnica de la mecedora
                            </button>
                            <button
                                className="bg-slate-900 py-4 rounded-2xl border-2 border-slate-800 text-blue-400/60 hover:text-blue-400 hover:border-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                onClick={() => setActiveRescue('light')}
                            >
                                <Sun size={16} /> Luz de compañía suave
                            </button>
                        </div>
                    </div>
                )}

                {activeRescue === 'ground' && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mx-auto mb-8 animate-bounce">
                            <Wind size={32} />
                        </div>
                        <h2 className="text-3xl font-medium text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>Mécete suavemente</h2>
                        <p className="text-blue-200/60 text-base leading-relaxed mb-10">
                            Siéntate o quédate en la cama. Balancea tu torso muy despacio de izquierda a derecha.
                            Siente el peso de tu cuerpo apoyado y seguro.
                        </p>
                        <div className="bg-blue-500/5 p-8 rounded-[32px] border border-blue-500/10 italic text-sm text-blue-300/40 leading-relaxed mb-12 max-w-sm">
                            "Mi cuerpo sabe descansar. Estas sensaciones son solo restos de adrenalina. Mi cama es un lugar de paz."
                        </div>
                        <button
                            className="flex items-center gap-2 text-blue-500/60 text-xs hover:text-blue-400 transition-colors mx-auto"
                            onClick={() => setActiveRescue('none')}
                        >
                            <ArrowLeft size={14} /> Volver
                        </button>
                    </div>
                )}

                {activeRescue === 'light' && (
                    <div className="animate-in fade-in duration-1000 fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1205]">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                            <div className="w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-[100px] absolute top-1/3 left-1/3 animate-pulse delay-700"></div>
                        </div>

                        <div className="relative z-10 text-center p-8">
                            <div className="flex items-center justify-center gap-2 text-orange-200/40 font-medium italic text-sm mb-4">
                                <Sparkles size={16} />
                                Luz cálida para calmar...
                            </div>
                            <div className="text-orange-200/20 text-[10px] uppercase tracking-widest font-bold">Inhala y exhala con la luz</div>

                            <button
                                className="mt-48 px-10 py-4 rounded-2xl border border-orange-200/20 text-orange-200/40 text-xs hover:text-orange-200 hover:border-orange-200/40 active:scale-95 transition-all"
                                onClick={() => setActiveRescue('none')}
                            >
                                Apagar luz
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

