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
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-8 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-slate-900 border border-blue-500/30 rounded-3xl p-8 shadow-2xl shadow-blue-600/20 animate-in zoom-in-95 fade-in duration-500 delay-100 fill-mode-both relative overflow-hidden">

                {/* Decorative Glow Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <h2 className="text-2xl font-bold text-white mb-5 relative z-10 font-sans tracking-tight">
                    Aviso Importante
                </h2>

                <p className="text-sm text-blue-100/80 leading-loose mb-8 relative z-10">
                    Ansioff es una herramienta de apoyo y no sustituye el consejo médico profesional. En caso de emergencia o pensamientos de autolesión, contacta inmediatamente con los servicios de emergencia (112 en España). Al continuar, aceptas que el uso de esta app es bajo tu propia responsabilidad.
                </p>

                <button
                    onClick={handleAccept}
                    className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-2xl py-4 flex items-center justify-center font-bold text-base transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.4)] relative z-10"
                >
                    Aceptar y Continuar
                </button>
            </div>
        </div>
    );
}
