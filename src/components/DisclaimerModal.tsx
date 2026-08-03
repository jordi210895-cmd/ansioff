'use client';

import { useState, useEffect } from 'react';

export default function DisclaimerModal() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem('ansioff_disclaimer_accepted');
        if (!hasAccepted) {
            setShow(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('ansioff_disclaimer_accepted', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#03080f]/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-[#0a1625] border border-[#5aadcf]/30 rounded-3xl p-6 shadow-2xl shadow-[#5aadcf]/10 animate-in zoom-in-95 fade-in duration-300 relative overflow-hidden text-[#ddeef5]">

                {/* Decorative Glow Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#5aadcf]/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#5aadcf]/10 rounded-full blur-3xl pointer-events-none"></div>

                <h2 className="text-xl font-bold text-[#ddeef5] mb-3 relative z-10 font-sans tracking-tight">
                    Aviso Importante
                </h2>

                <p className="text-xs text-[rgba(200,225,235,0.8)] leading-relaxed mb-6 relative z-10">
                    Ansioff es una herramienta de apoyo y no sustituye el consejo médico o psicológico profesional. En caso de emergencia o crisis, contacta inmediatamente con el 112 o servicios de urgencia. Al continuar, aceptas que el uso de esta app es bajo tu propia responsabilidad.
                </p>

                <button
                    onClick={handleAccept}
                    className="w-full bg-[#5aadcf] hover:bg-[#4a9dbf] text-[#03080f] font-bold rounded-2xl py-3 flex items-center justify-center text-sm transition-all shadow-md relative z-10 active:scale-95"
                >
                    Entendido y Aceptar
                </button>
            </div>
        </div>
    );
}
