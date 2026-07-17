'use client';

import { Wind, Clock, ChevronRight, AlertTriangle, User } from 'lucide-react';

interface HomeScreenProps {
    onNav: (screen: string) => void;
    cbtCount?: number;
    trackCount?: number;
    userName?: string;
    isPremium?: boolean;
}

export default function HomeScreen({ onNav, userName = "" }: HomeScreenProps) {
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', month: 'short', day: 'numeric' });

    return (
        <div className="min-h-full bg-[#03080f] text-[#ddeef5] overflow-y-auto pb-32 font-sans relative scrollbar-hide">
            <style jsx>{`
                .home-content{
                    padding-left:max(24px,calc(env(safe-area-inset-left,0px) + 22px));
                    padding-right:max(24px,calc(env(safe-area-inset-right,0px) + 22px));
                }
                .home-safe-header{
                    padding-top:max(56px,calc(var(--safe-top,0px) + 14px));
                    padding-bottom:12px;
                }
                .home-greeting{margin-top:0;margin-bottom:16px;}
                .home-stack{gap:23px;}
                .home-card{border-radius:26px;}
                .home-card-inner{border-radius:25px;padding:18px;gap:12px;}
                .home-sos-title{font-size:21px;line-height:1.15;}
                .home-sos-inline-icon{width:22px;height:22px;color:#f87171;filter:drop-shadow(0 0 10px rgba(248,113,113,.28));}
                .home-sos-copy{font-size:13px;line-height:1.4;}
                .home-sos-button{padding-top:9px;padding-bottom:9px;}
                .home-section-title{font-size:21px;}
                .home-section-head{margin-bottom:8px;}
                .breath-card{border-radius:26px;padding:16px 18px;gap:12px;}
                .breath-bg{border-radius:26px;}
                .breath-title{font-size:30px;}
                .breath-copy{font-size:13px;line-height:1.38;}
                .breath-button{padding-top:8px;padding-bottom:8px;}
                .home-quote-section{margin-bottom:0;}
                .home-quote{border-radius:22px;padding:10px 16px;}
                .home-quote-text{font-size:14px;line-height:1.32;}
                @media(max-width:390px){
                    .home-content{
                        padding-left:max(26px,calc(env(safe-area-inset-left,0px) + 24px));
                        padding-right:max(26px,calc(env(safe-area-inset-right,0px) + 24px));
                    }
                    .home-safe-header{padding-top:max(54px,calc(var(--safe-top,0px) + 12px));padding-bottom:11px;}
                    .home-greeting{margin-bottom:15px;}
                    .home-stack{gap:21px;}
                    .home-card-inner{padding:16px;gap:11px;}
                    .home-sos-title{font-size:20px;}
                    .home-section-title{font-size:20px;}
                    .breath-card{padding:15px 16px;gap:11px;}
                    .breath-title{font-size:29px;}
                    .home-quote{padding:9px 15px;}
                    .home-quote-text{font-size:13.5px;}
                }
                @media(max-height:760px){
                    .home-safe-header{padding-top:max(50px,calc(var(--safe-top,0px) + 10px));padding-bottom:10px;}
                    .home-greeting{margin-bottom:13px;}
                    .home-stack{gap:18px;}
                    .home-card-inner{padding:15px;gap:10px;}
                    .home-sos-title{font-size:19px;}
                    .home-sos-copy{font-size:12.5px;line-height:1.35;}
                    .home-section-head{margin-bottom:7px;}
                    .breath-card{padding:14px 15px;gap:10px;}
                    .breath-title{font-size:28px;}
                    .breath-copy{font-size:12.5px;line-height:1.34;}
                    .home-quote{padding:8px 13px;border-radius:20px;}
                    .home-quote-text{font-size:13px;line-height:1.28;}
                }
            `}</style>
            
            {/* Soft background glows (Matching the aurora of other screens) */}
            <div className="aurora">
                <div className="aurora-1" style={{ background: 'radial-gradient(circle, rgba(90, 173, 207, 0.4), transparent 70%)', top: '-100px', left: '-60px' }}></div>
                <div className="aurora-2" style={{ background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25), transparent 70%)', bottom: '100px', right: '-80px' }}></div>
            </div>

            <div className="home-content relative z-10">
                {/* Header */}
                <div className="home-safe-header flex items-center justify-between pb-6">
                    <div className="flex items-center gap-2">
                        {/* Styled A logo aligned with the sky-blue palette */}
                        <div className="relative flex items-center justify-center">
                            <span className="text-2xl italic font-serif bg-clip-text text-transparent bg-gradient-to-br from-sky-200 to-[#5aadcf]">A</span>
                            <div className="absolute w-full h-[1px] bg-[#5aadcf] top-[45%] -rotate-12 opacity-50"></div>
                            <div className="absolute w-[60%] h-[1px] bg-[#5aadcf] top-[60%] -rotate-12 opacity-50"></div>
                        </div>
                        <span className="text-xl tracking-wide font-light text-[#ddeef5]">Ansioff</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-[13px] text-[rgba(200,225,235,0.38)] capitalize">{today}</span>
                        <button onClick={() => onNav('sc-settings')} className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-sm text-[#ddeef5] backdrop-blur-md hover:bg-[rgba(255,255,255,0.1)] active:scale-[0.95] transition-all">
                            {userName ? userName.charAt(0).toUpperCase() : <User size={16} />}
                        </button>
                    </div>
                </div>

                {/* Greeting */}
                <div className="home-greeting">
                    <h1 className="text-[28px] font-medium font-serif italic text-[#ddeef5] tracking-tight leading-tight">
                        {userName ? `Hola, ${userName}.` : 'Hola.'}
                    </h1>
                    <p className="text-[22px] font-light text-[rgba(200,225,235,0.8)] tracking-tight mt-1">¿Cómo te sientes hoy?</p>
                </div>

                {/* Main Content Container */}
                <div className="home-stack w-full flex flex-col">

                    {/* 1. SOS area */}
                    <section className="text-left">
                        <div
                            className="home-card w-full relative overflow-hidden p-px bg-gradient-to-br from-red-500/30 via-rose-500/10 to-red-500/20 border border-red-500/20 shadow-2xl shadow-red-950/20"
                        >
                            <div className="home-card-inner relative bg-[#03080f]/90 backdrop-blur-md flex flex-col">
                                <div className="flex flex-col gap-2">
                                    <h3 className="home-sos-title font-bold text-[#ddeef5] tracking-tight flex items-center gap-2">
                                        <AlertTriangle className="home-sos-inline-icon shrink-0" strokeWidth={2.2} />
                                        <span>Necesito ayuda ahora</span>
                                    </h3>
                                    <p className="home-sos-copy text-[rgba(200,225,235,0.6)]">
                                        Si estás experimentando una crisis de ansiedad, pánico o sobreestimulación, activa el kit de calma inmediata.
                                    </p>
                                </div>

                                <button
                                    onClick={() => onNav('sc-pause')}
                                    className="home-sos-button w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full px-6 font-bold text-xs tracking-wider transition-all shadow-lg shadow-red-950/30 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    ACTIVAR KIT SOS <ChevronRight size={14} />
                                </button>

                                {/* Decorative background glow */}
                                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-red-600/10 blur-3xl rounded-full pointer-events-none"></div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Featured Breathing Card */}
                    <section>
                        <div className="home-section-head flex items-center justify-between px-1">
                            <h2 className="home-section-title font-medium font-serif italic text-[#ddeef5] tracking-tight leading-none">Respiración guiada</h2>
                            <button onClick={() => onNav('sc-breath')} className="text-xs text-[#5aadcf] font-bold hover:underline transition-all">Ver todos</button>
                        </div>

                        <div className="breath-card relative group bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex flex-col shadow-2xl w-full">
                            {/* Abstract pattern background - contained */}
                            <div className="breath-bg absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute -top-6 -right-6 p-4 opacity-[0.08] group-hover:rotate-12 transition-transform duration-700">
                                    <Wind className="w-48 h-48 text-[#5aadcf]" strokeWidth={1} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 relative z-10">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-[#5aadcf]/20 text-[#5aadcf] text-[11px] font-bold uppercase tracking-wider w-fit border border-[#5aadcf]/20">
                                        Patrón 4-2-6
                                    </span>
                                    <div className="flex items-center gap-2 text-[rgba(200,225,235,0.6)]">
                                        <Clock size={16} className="text-[#5aadcf]/70" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">5 minutos</span>
                                    </div>
                                </div>
                                <h3 className="breath-title font-light text-[#ddeef5] leading-tight font-serif italic">
                                    Alivio del estrés <br /><span className="font-bold tracking-tight not-italic font-sans text-sky-200">Profundo</span>
                                </h3>
                                <p className="breath-copy text-[rgba(200,225,235,0.6)]">
                                    Una sesión corta diseñada para reducir rápidamente el ritmo cardíaco y calmar la mente activa.
                                </p>
                            </div>

                            <div className="relative z-10">
                                <button
                                    onClick={() => onNav('sc-breath-426')}
                                    className="breath-button w-full bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f] rounded-full px-6 font-bold text-xs tracking-wider transition-all shadow-lg shadow-[#5aadcf]/20 active:scale-[0.98]"
                                >
                                    INICIAR SESIÓN
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 4. Quote of the Day */}
                    <section className="home-quote-section">
                        <div className="home-quote bg-[#0e1d2e]/30 border border-[rgba(255,255,255,0.05)] text-center shadow-inner relative overflow-hidden">
                            {/* Decorative quotes */}
                            <div className="absolute top-2 left-4 text-[#5aadcf]/10 text-6xl font-serif">&quot;</div>
                            <p className="home-quote-text relative z-10 italic text-[#ddeef5]/90 font-light font-serif">
                                Tus sentimientos son válidos, pero no son tu destino. Respira y confía en el proceso.
                            </p>
                            <div className="absolute bottom-[-1rem] right-4 text-[#5aadcf]/10 text-6xl font-serif rotate-180">&quot;</div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
