'use client';

import { useState, useEffect } from 'react';
import { Share, Download, X, MoreVertical, Smartphone } from 'lucide-react';

export default function InstallPWA() {
    const [show, setShow] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'android' | 'other' | null>(null);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const checkStandalone = () => {
            const isS = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
            setIsStandalone(!!isS);
        };

        const detectPlatform = () => {
            const ua = window.navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) return 'ios';
            if (/android/.test(ua)) return 'android';
            return 'other';
        };

        checkStandalone();
        setPlatform(detectPlatform());

        // Show banner after 3 seconds if not standalone
        const timer = setTimeout(() => {
            if (!isStandalone) {
                const hasClosed = localStorage.getItem('pwa_install_closed');
                if (!hasClosed) setShow(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [isStandalone]);

    const handleClose = () => {
        setShow(false);
        localStorage.setItem('pwa_install_closed', 'true');
    };

    if (!show || isStandalone) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={18} className="text-slate-400" />
                </button>

                <div className="flex items-start gap-4 pr-6">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Smartphone className="text-blue-400" size={24} />
                    </div>
                    
                    <div>
                        <h3 className="text-white font-bold text-base mb-1">Instala Ansioff en tu móvil</h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-4">
                            Úsala como una app nativa con mejor rendimiento y notificaciones.
                        </p>

                        <div className="space-y-3">
                            {platform === 'ios' ? (
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                                        <Share size={16} className="text-blue-400" />
                                    </div>
                                    <p className="text-xs text-white">
                                        Pulsa <span className="font-bold text-blue-400">Compartir</span> y selecciona <br />
                                        <span className="font-bold">"Añadir a pantalla de inicio"</span>
                                    </p>
                                </div>
                            ) : platform === 'android' ? (
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                                        <MoreVertical size={16} className="text-blue-400" />
                                    </div>
                                    <p className="text-xs text-white">
                                        Pulsa los <span className="font-bold text-blue-400">tres puntos</span> y selecciona <br />
                                        <span className="font-bold">"Instalar aplicación"</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                                        <Download size={16} className="text-blue-400" />
                                    </div>
                                    <p className="text-xs text-white">
                                        Búscalo en el menú de tu navegador como <br />
                                        <span className="font-bold">"Añadir a escritorio"</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
