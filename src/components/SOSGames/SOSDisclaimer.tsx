'use client';

import { Anchor } from 'lucide-react';

interface SOSDisclaimerProps {
    onAccept: () => void;
    onCancel: () => void;
}

export default function SOSDisclaimer({ onAccept, onCancel }: SOSDisclaimerProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-[#06101a] min-h-full">
            <div className="w-24 h-24 mb-8 rounded-[32px] bg-[#e07d6a]/15 flex items-center justify-center text-[#e07d6a] shadow-xl shadow-[#e07d6a]/10">
                <Anchor className="w-12 h-12" strokeWidth={2} />
            </div>
            <h2 className="text-[32px] font-serif text-[#e8f4f8] mb-4">Anclaje al Presente</h2>
            <p className="text-white/50 text-[15px] leading-relaxed mb-12 max-w-xs">
                La ansiedad es una falsa alarma de tu cuerpo. Inténtalo: respira profundo y siente tu peso sobre la silla.
                <br /><br />
                Usa estos ejercicios como un anclaje extra para interrumpir pensamientos intrusivos.
            </p>
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button
                    className="w-full bg-[#e07d6a] hover:bg-[#c26a58] text-[#0d1b2a] rounded-[24px] py-4 font-semibold transition-all active:scale-95 shadow-lg shadow-[#e07d6a]/20"
                    onClick={onAccept}
                >
                    Entendido, empezar
                </button>
                <button
                    className="text-white/30 text-[14px] py-2 hover:text-white/50 transition-colors"
                    onClick={onCancel}
                >
                    Volver atrás
                </button>
            </div>
        </div>
    );
}

