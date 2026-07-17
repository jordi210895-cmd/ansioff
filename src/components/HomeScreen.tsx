'use client';

import {
    AlertTriangle,
    BookOpen,
    ChevronRight,
    Clock,
    Gamepad2,
    GraduationCap,
    User,
    Volume2,
    Wind,
} from 'lucide-react';

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
                    padding-left:max(18px,calc(env(safe-area-inset-left,0px) + 14px));
                    padding-right:max(18px,calc(env(safe-area-inset-right,0px) + 14px));
                }
                .home-safe-header{
                    padding-top:max(56px,calc(var(--safe-top,0px) + 14px));
                    padding-bottom:14px;
                }
                .home-greeting{margin-top:0;margin-bottom:11px;}
                .home-stack{gap:15px;}
                .home-sos{border-radius:24px;}
                .home-sos-inner{border-radius:23px;padding:9px 14px;}
                .home-sos-icon{width:38px;height:38px;}
                .home-sos-title{font-size:16px;line-height:1.2;}
                .home-sos-copy{font-size:12px;line-height:1.3;}
                .home-section-title{font-size:20px;}
                .home-section-head{margin-bottom:9px;}
                .breath-card{border-radius:24px;padding:9px 13px;gap:6px;}
                .breath-bg{border-radius:24px;}
                .breath-title{font-size:23px;line-height:1.04;}
                .tools-title{margin-bottom:7px;}
                .tools-grid{gap:10px;}
                .tool-card{border-radius:22px;min-height:78px;padding:6px 8px 7px;}
                .tool-icon{width:38px;height:38px;border-radius:13px;margin-bottom:4px;}
                .tool-name{font-size:15px;line-height:1.1;}
                .tool-copy{font-size:11px;line-height:1.2;margin-top:3px;}
                .home-quote-section{margin-bottom:4px;}
                .home-quote{border-radius:22px;padding:10px 16px;}
                .home-quote-text{font-size:14px;line-height:1.32;}
                @media(max-width:390px){
                    .home-content{
                        padding-left:max(16px,calc(env(safe-area-inset-left,0px) + 12px));
                        padding-right:max(16px,calc(env(safe-area-inset-right,0px) + 12px));
                    }
                    .home-safe-header{padding-top:max(54px,calc(var(--safe-top,0px) + 12px));padding-bottom:11px;}
                    .home-greeting{margin-bottom:9px;}
                    .home-stack{gap:13px;}
                    .home-sos-inner{padding:8px 12px;}
                    .home-sos-icon{width:36px;height:36px;}
                    .home-sos-title{font-size:15.5px;}
                    .home-section-title{font-size:20px;}
                    .breath-card{padding:8px 12px;gap:5px;}
                    .breath-title{font-size:22px;}
                    .tools-grid{gap:9px;}
                    .tool-card{min-height:74px;padding:5px 7px 6px;}
                    .tool-icon{width:36px;height:36px;margin-bottom:3px;}
                    .home-quote{padding:9px 15px;}
                    .home-quote-text{font-size:13.5px;}
                }
                @media(max-height:760px){
                    .home-safe-header{padding-top:max(50px,calc(var(--safe-top,0px) + 10px));padding-bottom:10px;}
                    .home-greeting{margin-bottom:8px;}
                    .home-stack{gap:11px;}
                    .home-sos-inner{padding:7px 11px;}
                    .home-sos-icon{width:34px;height:34px;}
                    .home-section-head{margin-bottom:6px;}
                    .breath-card{padding:7px 11px;gap:4px;}
                    .breath-title{font-size:21px;}
                    .tools-title{margin-bottom:6px;}
                    .tool-card{min-height:70px;padding:4px 6px 5px;}
                    .tool-icon{width:34px;height:34px;margin-bottom:3px;}
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

                    {/* 1. Compact SOS area */}
                    <section className="text-left">
                        <button
                            onClick={() => onNav('sc-pause')}
                            className="home-sos w-full group relative overflow-hidden p-px bg-gradient-to-r from-red-500/30 via-rose-500/10 to-red-500/30 transition-all active:scale-[0.98]"
                        >
                            <div className="home-sos-inner relative bg-[#03080f]/80 backdrop-blur-md flex items-center justify-between border border-red-500/20">
                                <div className="flex items-center gap-3.5 z-10 text-left min-w-0">
                                    <div className="home-sos-icon rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-950/20">
                                        <AlertTriangle className="w-6 h-6" strokeWidth={2} />
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h3 className="home-sos-title font-bold text-[#ddeef5] mb-1">Necesito ayuda ahora</h3>
                                        <p className="home-sos-copy text-[rgba(200,225,235,0.55)] font-medium">Asistencia de crisis inmediata</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-[rgba(200,225,235,0.38)] group-hover:text-[#ddeef5] transition-colors shrink-0" size={20} />

                                {/* Decorative background glow */}
                                <div className="absolute -right-4 -top-4 w-32 h-32 bg-red-600/10 blur-3xl rounded-full pointer-events-none"></div>
                            </div>
                        </button>
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

                            <div className="flex flex-col gap-1.5 relative z-10">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#5aadcf]/20 text-[#5aadcf] text-[10px] font-bold uppercase tracking-wider w-fit border border-[#5aadcf]/20">
                                    Patrón 4-2-6
                                </span>
                                <h3 className="breath-title font-light text-[#ddeef5] leading-tight font-serif italic">
                                    Alivio del estrés <br /><span className="font-bold tracking-tight not-italic font-sans text-sky-200">Profundo</span>
                                </h3>
                            </div>

                            <div className="flex items-center justify-between relative z-10 mt-1">
                                <div className="flex items-center gap-2 text-[rgba(200,225,235,0.6)]">
                                    <Clock size={16} className="text-[#5aadcf]/70" />
                                    <span className="text-sm font-medium">5 min</span>
                                </div>
                                <button
                                    onClick={() => onNav('sc-breath-426')}
                                    className="bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f] rounded-full py-1.5 px-5 font-bold text-xs tracking-wider transition-all shadow-lg shadow-[#5aadcf]/20 active:scale-[0.98]"
                                >
                                    COMENZAR
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 3. Tools grid */}
                    <section>
                        <div className="tools-title px-1">
                            <h2 className="text-[11px] font-bold text-[rgba(200,225,235,0.38)] tracking-[0.2em] uppercase">Herramientas</h2>
                        </div>

                        <div className="tools-grid grid grid-cols-2">
                            <button
                                onClick={() => onNav('sc-audio')}
                                className="tool-card bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center text-center hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.98] transition-all group overflow-hidden relative shadow-lg"
                            >
                                <div className="tool-icon bg-[#5aadcf]/10 border border-[#5aadcf]/25 flex items-center justify-center text-[#5aadcf] group-hover:scale-105 group-hover:bg-[#5aadcf]/25 transition-all duration-300">
                                    <Volume2 size={24} strokeWidth={2} />
                                </div>
                                <h4 className="tool-name font-semibold text-[#ddeef5] font-serif italic">Audios</h4>
                            </button>

                            <button
                                onClick={() => onNav('sc-notes')}
                                className="tool-card bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center text-center hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.98] transition-all group overflow-hidden relative shadow-lg"
                            >
                                <div className="tool-icon bg-[#6bbf8e]/10 border border-[#6bbf8e]/25 flex items-center justify-center text-[#6bbf8e] group-hover:scale-105 group-hover:bg-[#6bbf8e]/25 transition-all duration-300">
                                    <BookOpen size={24} strokeWidth={2} />
                                </div>
                                <h4 className="tool-name font-semibold text-[#ddeef5] font-serif italic">Diario</h4>
                                <p className="tool-copy text-[rgba(200,225,235,0.38)] font-medium truncate w-full px-1">Reflexión diaria</p>
                            </button>

                            <button
                                onClick={() => onNav('sc-games')}
                                className="tool-card bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center text-center hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.98] transition-all group overflow-hidden relative shadow-lg"
                            >
                                <div className="tool-icon bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 group-hover:scale-105 group-hover:bg-orange-500/25 transition-all duration-300">
                                    <Gamepad2 size={24} strokeWidth={2} />
                                </div>
                                <h4 className="tool-name font-semibold text-[#ddeef5] font-serif italic">Juegos</h4>
                                <p className="tool-copy text-[rgba(200,225,235,0.38)] font-medium truncate w-full px-1">Distracción sana</p>
                            </button>

                            <button
                                onClick={() => onNav('sc-tools')}
                                className="tool-card bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center text-center hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.98] transition-all group overflow-hidden relative shadow-lg"
                            >
                                <div className="tool-icon bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-500/25 transition-all duration-300">
                                    <GraduationCap size={24} strokeWidth={2} />
                                </div>
                                <h4 className="tool-name font-semibold text-[#ddeef5] font-serif italic">Módulos</h4>
                                <p className="tool-copy text-[rgba(200,225,235,0.38)] font-medium truncate w-full px-1">Aprende y practica</p>
                            </button>
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
