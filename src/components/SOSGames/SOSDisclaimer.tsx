'use client';

import { Anchor } from 'lucide-react';

interface SOSDisclaimerProps {
    onAccept: () => void;
    onCancel: () => void;
}

export default function SOSDisclaimer({ onAccept, onCancel }: SOSDisclaimerProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-950 min-h-full">
            <div className="w-20 h-20 mb-8 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/5">
                <Anchor className="w-10 h-10" strokeWidth={2} />
            </div>
            <h2 className="text-3xl font-medium text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Anclaje al Presente</h2>
            <p className="text-blue-300/50 text-base leading-relaxed mb-12 max-w-xs">
                La ansiedad es una falsa alarma de tu cuerpo. Inténtalo: respira profundo y siente tu peso sobre la silla.
                <br /><br />
                Usa estos ejercicios como un anclaje extra para interrumpir pensamientos intrusivos.
            </p>
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 font-medium transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                    onClick={onAccept}
                >
                    Entendido, empezar
                </button>
                <button
                    className="text-blue-400/40 text-sm py-2 hover:text-blue-400/60 transition-colors"
                    onClick={onCancel}
                >
                    Volver atrás
                </button>
            </div>
        </div>
    );
}

