'use client';

import { useState, useEffect } from 'react';
import { Phone, X } from 'lucide-react';
import { EmergencyContact, getEmergencyContacts } from '../utils/contacts';
import { getNeuroSettings } from '../utils/neuroux';

interface HomeScreenProps {
    onNav: (screen: string) => void;
    cbtCount?: number;
}

export default function HomeScreen({ onNav, cbtCount = 0 }: HomeScreenProps) {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [showContactsModal, setShowContactsModal] = useState(false);
    const [reduceAnimations, setReduceAnimations] = useState(false);

    useEffect(() => {
        setContacts(getEmergencyContacts());
        const settings = getNeuroSettings();
        setReduceAnimations(settings.reduceAnimations);
    }, []);

    return (
        <div className="w-full flex flex-col min-h-screen relative overflow-hidden text-white" style={{ backgroundColor: '#0e1520', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

                .noise-overlay {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
                    opacity: 0.025;
                    pointer-events: none;
                    z-index: 10;
                }

                @keyframes ambientPulse {
                    0%, 100% { opacity: 0.7; transform: translate(-50%, -55%) scale(1); }
                    50% { opacity: 1; transform: translate(-50%, -55%) scale(1.08); }
                }

                @keyframes sosGlow {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.08); }
                }

                @keyframes sosPulse {
                    0%, 100% { box-shadow: 0 0 0 3px rgba(220,60,60,0.3), 0 0 30px rgba(200,30,30,0.6), 0 6px 30px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,120,120,0.25), inset 0 -4px 12px rgba(80,0,0,0.4); }
                    50% { box-shadow: 0 0 0 6px rgba(220,60,60,0.2), 0 0 55px rgba(200,30,30,0.8), 0 6px 30px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,120,120,0.25), inset 0 -4px 12px rgba(80,0,0,0.4); }
                }

                .quick-circle::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 50%;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent);
                    border-radius: 50% 50% 0 0;
                }
            `}</style>

            {/* Texture overlay */}
            <div className="absolute inset-0 noise-overlay"></div>

            <div className="flex-1 w-full flex flex-col z-20 relative pt-12 pb-[120px]">
                {/* App header */}
                <div className="flex justify-between items-center px-[30px] pt-[8px] pb-[14px] border-b border-[rgba(255,255,255,0.06)] relative z-20">
                    <div className="w-[30px]" /> {/* Spacer left */}
                    <div className="text-center">
                        <div className="text-[17px] font-bold text-white tracking-[0.08em]">ANSIOFF</div>
                        <div className="text-[11px] font-medium text-[#4d9ec4] tracking-[0.18em] mt-[3px]">TU ESPACIO SEGURO</div>
                    </div>
                    <button onClick={() => onNav('sc-settings')} className="bg-transparent border-none text-[rgba(255,255,255,0.6)] hover:text-white cursor-pointer p-1 flex flex-col gap-[5px]" aria-label="Ajustes">
                        <span className="block w-[22px] h-[1.5px] bg-current rounded-[2px] transition-colors"></span>
                        <span className="block w-[22px] h-[1.5px] bg-current rounded-[2px] transition-colors"></span>
                        <span className="block w-[22px] h-[1.5px] bg-current rounded-[2px] transition-colors"></span>
                    </button>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col items-center justify-center px-[30px] relative mt-[20px] z-20">

                    {/* Ambient background glow behind everything */}
                    <div className="absolute top-[40%] left-1/2 w-[320px] h-[320px] pointer-events-none -z-10"
                        style={{
                            background: 'radial-gradient(circle, rgba(180,30,30,0.18) 0%, transparent 65%)',
                            animation: reduceAnimations ? 'none' : 'ambientPulse 3s ease-in-out infinite'
                        }}>
                    </div>

                    <div className="text-[32px] font-light text-white text-center leading-[1.25] mb-[36px] tracking-[-0.01em]">
                        ¿Necesitas ayuda<br />ahora?
                    </div>

                    {/* SOS Button */}
                    <div
                        className="relative w-[168px] h-[168px] flex items-center justify-center mb-[44px] cursor-pointer group active:scale-[0.97] transition-transform duration-200"
                        onClick={() => onNav('sc-sos')}
                    >
                        {/* Outermost glow layer */}
                        <div className="absolute -inset-[30px] rounded-full group-active:opacity-100 opacity-60 transition-opacity"
                            style={{
                                background: 'radial-gradient(circle, rgba(220,50,50,0.22) 0%, transparent 70%)',
                                animation: reduceAnimations ? 'none' : 'sosGlow 2.5s ease-in-out infinite'
                            }}>
                        </div>

                        {/* Mid glow ring */}
                        <div className="absolute -inset-[10px] rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(200,40,40,0.35) 0%, rgba(160,20,20,0.1) 55%, transparent 70%)',
                                animation: reduceAnimations ? 'none' : 'sosGlow 2.5s ease-in-out infinite',
                                animationDelay: '0.3s'
                            }}>
                        </div>

                        {/* Main circle */}
                        <div className="absolute inset-0 rounded-full transition-transform duration-200 group-active:scale-[0.95]"
                            style={{
                                background: 'radial-gradient(circle at 40% 30%, #e84040, #c42020 45%, #991010 100%)',
                                animation: reduceAnimations ? 'none' : 'sosPulse 2.5s ease-in-out infinite'
                            }}>
                        </div>

                        {/* SOS label */}
                        <div className="relative z-10 flex flex-col items-center gap-[6px] pointer-events-none">
                            <span className="text-[34px] font-[800] text-white tracking-[0.06em] leading-none" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>SOS</span>
                            <span className="text-[22px] leading-none">🛟</span>
                            <span className="text-[11px] font-medium text-[rgba(255,255,255,0.7)] tracking-[0.03em] text-center mt-[2px]">Guía de anclaje rápido</span>
                        </div>
                    </div>

                    {/* Quick access */}
                    <div className="flex gap-[22px] mb-[28px] justify-center w-full">
                        <div className="flex flex-col items-center gap-[10px] cursor-pointer group" onClick={() => onNav('sc-breath')}>
                            <div className="quick-circle w-[70px] h-[70px] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-[rgba(77,158,196,0.5)] group-active:scale-[0.93] border border-[rgba(77,158,196,0.2)]"
                                style={{ background: 'radial-gradient(circle at 40% 35%, #1e2d3e, #141e2c)', boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7eb8d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6c0 0-2-2-5-1S3 9 3 12s1 5 4 6c1.5.5 3 .2 4-.5" /><path d="M12 6c0 0 2-2 5-1s4 4 4 7-1 5-4 6c-1.5.5-3 .2-4-.5" /><path d="M12 6v12" /></svg>
                            </div>
                            <div className="text-[12px] text-[#c8d8e8] font-normal tracking-[0.01em]">Respiración</div>
                        </div>

                        <div className="flex flex-col items-center gap-[10px] cursor-pointer group" onClick={() => onNav('sc-audio')}>
                            <div className="quick-circle w-[70px] h-[70px] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-[rgba(77,158,196,0.5)] group-active:scale-[0.93] border border-[rgba(77,158,196,0.2)]"
                                style={{ background: 'radial-gradient(circle at 40% 35%, #1e2d3e, #141e2c)', boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7eb8d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3v-6z" /><path d="M21 14h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v-6z" /><path d="M5 14V9a7 7 0 0 1 14 0v5" /></svg>
                            </div>
                            <div className="text-[12px] text-[#c8d8e8] font-normal tracking-[0.01em]">Sonidos</div>
                        </div>

                        <div className="flex flex-col items-center gap-[10px] cursor-pointer group" onClick={() => onNav('sc-notes')}>
                            <div className="quick-circle w-[70px] h-[70px] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-[rgba(77,158,196,0.5)] group-active:scale-[0.93] border border-[rgba(77,158,196,0.2)]"
                                style={{ background: 'radial-gradient(circle at 40% 35%, #1e2d3e, #141e2c)', boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7eb8d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></svg>
                            </div>
                            <div className="text-[12px] text-[#c8d8e8] font-normal tracking-[0.01em]">Notas</div>
                        </div>

                        <div className="flex flex-col items-center gap-[10px] cursor-pointer group" onClick={() => onNav('sc-games')}>
                            <div className="quick-circle w-[70px] h-[70px] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-[rgba(77,158,196,0.5)] group-active:scale-[0.93] border border-[rgba(77,158,196,0.2)]"
                                style={{ background: 'radial-gradient(circle at 40% 35%, #1e2d3e, #141e2c)', boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7eb8d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18-.894-.527-.967 1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.69a.979.979 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.402 2.402 0 0 1 1.705-.707 2.402 2.402 0 0 1 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z" /></svg>
                            </div>
                            <div className="text-[12px] text-[#c8d8e8] font-normal tracking-[0.01em]">Juegos</div>
                        </div>
                    </div>

                    {/* Emergency Contacts Button (Only show if there are contacts) */}
                    {contacts.length > 0 ? (
                        <button
                            onClick={() => setShowContactsModal(true)}
                            className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-6 py-3 mt-4 flex items-center justify-center gap-3 w-full max-w-[280px] hover:bg-[rgba(255,255,255,0.08)] transition-all active:scale-95"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#5aadcf]/20 flex items-center justify-center text-[#5aadcf]">
                                <Phone size={16} />
                            </div>
                            <div className="text-left flex-1">
                                <div className="text-[14px] font-medium text-white">Llamada de Emergencia</div>
                            </div>
                        </button>
                    ) : (
                        <div className="text-[14px] text-[#5a7a94] text-center leading-[1.6] font-normal mt-2">
                            Guía inmediata para crisis de pánico.<br />Acceso rápido.
                        </div>
                    )}
                </div>
            </div>

            {/* Contacts Modal Bottom Sheet */}
            {showContactsModal && (
                <div className="absolute inset-0 z-50 bg-[#000000bb] backdrop-blur-sm flex flex-col justify-end">
                    <div className="bg-[#121b29] border-t border-[rgba(255,255,255,0.08)] rounded-t-[32px] p-6 pb-12 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-white tracking-[-0.01em]">¿A quién necesitas llamar?</h3>
                            <button onClick={() => setShowContactsModal(false)} className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.1)]">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {contacts.map(c => (
                                <a
                                    key={c.id}
                                    href={`tel:${c.phone}`}
                                    className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-4 rounded-[20px] flex items-center gap-4 hover:bg-[rgba(90,173,207,0.1)] hover:border-[rgba(90,173,207,0.3)] transition-all active:scale-[0.98]"
                                >
                                    <div className="w-12 h-12 rounded-full bg-[#5aadcf] flex items-center justify-center text-[#0e1520] shadow-lg shadow-[#5aadcf]/20">
                                        <Phone size={22} fill="currentColor" />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-medium text-white shadow-sm">{c.name}</div>
                                        {c.role && <div className="text-[13px] font-medium text-[#5aadcf] mt-0.5">{c.role}</div>}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
