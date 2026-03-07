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
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
            <TopBar title="Mi Propósito" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
                <div className="mt-6 mb-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-orange-500/20">
                        <Target size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-light text-white mb-2 pl-1" style={{ fontFamily: 'Georgia, serif' }}>¿Por qué hago <span className="font-bold">exposición</span>?</h2>
                    <p className="text-sm text-slate-400 leading-relaxed px-4">
                        La exposición da miedo, pero tiene un propósito mayor. Apunta aquí por qué estás dispuesto a enfrentarte a tu ansiedad hoy.
                    </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-1 relative mb-6">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ej: Lo hago para poder viajar tranquilo a ver a mi familia, para recuperar mi libertad, porque mi vida es más grande que el pánico..."
                        className="w-full bg-transparent p-7 pl-8 text-slate-200 placeholder:text-slate-600 outline-none resize-none min-h-[220px] text-base leading-loose"
                    />
                    <div className="absolute bottom-6 right-6 text-xs font-bold tracking-widest text-slate-600">
                        TU MOTOR
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!reason.trim()}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${reason.trim()
                        ? saved
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {saved ? (
                        <>
                            <CheckCircle2 size={20} />
                            Guardado con éxito
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Guardar Propósito
                        </>
                    )}
                </button>

                <div className="mt-8 bg-orange-500/5 border border-orange-500/10 rounded-3xl p-5 flex gap-4 items-start">
                    <AlertCircle className="text-orange-400 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-semibold text-orange-200 text-sm mb-1">Recuérdalo en crisis</h4>
                        <p className="text-orange-200/60 text-xs leading-relaxed">
                            Cuando la ansiedad suba durante una exposición y quieras huir, vuelve a leer esto. El sufrimiento temporal vale la pena por recuperar tu vida.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
