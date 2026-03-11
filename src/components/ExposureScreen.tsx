'use client';

import { useState, useEffect } from 'react';
import { Target, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import TopBar from './TopBar';

interface ExposureScreenProps {
    onBack: () => void;
}

export default function ExposureScreen({ onBack }: ExposureScreenProps) {
    const [reason, setReason] = useState('');
    const [saved, setSaved] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('ansioff_exposure_reason');
        if (stored) {
            setReason(stored);
        }
        setIsLoaded(true);
    }, []);

    const handleSave = () => {
        if (!reason.trim()) return;
        localStorage.setItem('ansioff_exposure_reason', reason.trim());
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!isLoaded) return null;

    return (
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Mi Propósito" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mt-6 mb-8 text-center">
                    <div className="w-16 h-16 bg-[#5aadcf]/5 border border-[#5aadcf]/10 rounded-full flex items-center justify-center text-[#5aadcf] mx-auto mb-4 shadow-[0_0_20px_rgba(90,173,207,0.1)]">
                        <Target size={28} className="stroke-[1.5]" />
                    </div>
                    <h2 className="text-3xl font-light text-[#ddeef5] mb-2 font-serif italic pl-1">¿Por qué hago <span className="font-semibold text-[#5aadcf]">exposición</span>?</h2>
                    <p className="font-sans font-light text-[13px] text-[rgba(200,225,235,0.8)] leading-relaxed px-2 max-w-[280px] mx-auto">
                        La exposición da miedo, pero tiene un propósito mayor. Apunta aquí por qué estás dispuesto a enfrentarte a tu ansiedad hoy.
                    </p>
                </div>

                <div className="bg-[#0e1d2e]/50 border border-[rgba(255,255,255,0.07)] rounded-2xl p-1 relative mb-6 shadow-sm focus-within:border-[#5aadcf]/50 transition-colors">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ej: Lo hago para poder viajar tranquilo a ver a mi familia, para recuperar mi libertad, porque mi vida es más grande que el pánico..."
                        className="w-full bg-transparent p-6 text-[#ddeef5] placeholder:text-[rgba(200,225,235,0.38)] outline-none resize-none min-h-[200px] font-sans font-light text-[15px] leading-relaxed"
                    />
                    <div className="absolute bottom-5 right-5 text-[10px] font-bold tracking-widest text-[rgba(200,225,235,0.38)] uppercase">
                        TU MOTOR
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!reason.trim()}
                    className={`w-full py-4 rounded-full font-sans font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${reason.trim()
                        ? saved
                            ? 'bg-[#6bbf8e] text-[#03080f]'
                            : 'bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f]'
                        : 'bg-[rgba(255,255,255,0.04)] text-[rgba(200,225,235,0.38)] cursor-not-allowed border border-[rgba(255,255,255,0.07)]'
                        }`}
                >
                    {saved ? (
                        <>
                            <CheckCircle2 size={18} className="stroke-[2]" />
                            Guardado con éxito
                        </>
                    ) : (
                        <>
                            <Save size={18} className="stroke-[2]" />
                            Guardar Propósito
                        </>
                    )}
                </button>

                <div className="mt-8 bg-[#5aadcf]/5 border border-[#5aadcf]/10 rounded-2xl p-5 flex gap-4 items-start relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#5aadcf]/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                    <AlertCircle className="text-[#5aadcf] shrink-0 stroke-[1.5]" size={20} />
                    <div className="relative z-10">
                        <h4 className="font-sans font-medium text-[#ddeef5] text-sm mb-1">Recuérdalo en crisis</h4>
                        <p className="font-sans font-light text-[rgba(200,225,235,0.8)] text-xs leading-relaxed">
                            Cuando la ansiedad suba durante una exposición y quieras huir, vuelve a leer esto. El sufrimiento temporal vale la pena por recuperar tu vida.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
