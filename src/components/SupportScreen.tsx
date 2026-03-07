'use client';

import { useState } from 'react';
import { Leaf, Pill, Phone, ShieldAlert, Heart, Activity, ExternalLink, Info } from 'lucide-react';
import TopBar from './TopBar';

interface SupportScreenProps {
    onBack: () => void;
}

export default function SupportScreen({ onBack }: SupportScreenProps) {
    const [activeCat, setActiveCat] = useState<'info' | 'emergency'>('info');

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
            <TopBar title="Apoyo y Recursos" onBack={onBack} />

            <div className="flex px-6 py-4 gap-2">
                <button
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeCat === 'info' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-slate-500 border-2 border-slate-800'
                        }`}
                    onClick={() => setActiveCat('info')}
                >
                    Información
                </button>
                <button
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeCat === 'emergency' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-slate-900 text-slate-500 border-2 border-slate-800'
                        }`}
                    onClick={() => setActiveCat('emergency')}
                >
                    Ayuda Urgente
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24">
                {activeCat === 'info' ? (
                    <div className="flex flex-col gap-8 mt-4 animate-in fade-in slide-in-from-left-4 duration-500">
                        <section>
                            <div className="text-blue-500 text-[10px] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                                <Leaf size={14} /> Fitoterapia y Natural
                            </div>
                            <div className="space-y-3">
                                <div className="glass p-6 rounded-[2rem] hover:scale-[1.01] transition-transform">
                                    <h4 className="text-white text-base font-medium mb-2">Valeriana & Pasiflora</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">Ayudan a relajar el sistema nervioso central en estados de ansiedad leve o moderada.</p>
                                </div>
                                <div className="glass p-6 rounded-[2rem] hover:scale-[1.01] transition-transform">
                                    <h4 className="text-white text-base font-medium mb-2">Aceite de Lavanda</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">La inhalación de esencia de lavanda de grado médico puede reducir picos de cortisol rápidamente.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="text-blue-500 text-[10px] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                                <Pill size={14} /> Orientación Médica
                            </div>
                            <div className="space-y-3">
                                <div className="glass border-blue-500/20 p-6 rounded-[2rem] hover:scale-[1.01] transition-transform">
                                    <h4 className="text-blue-400 text-base font-medium mb-2">Ansiolíticos (Benzodiacepinas)</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">Efecto rápido. Deben usarse solo bajo prescripción médica estricta por riesgo de dependencia.</p>
                                    <div className="text-xs text-blue-300/60 font-medium italic flex items-center gap-1.5">
                                        <Info size={14} /> Consulte siempre con su psiquiatra.
                                    </div>
                                </div>
                                <div className="glass border-blue-500/20 p-6 rounded-[2rem] hover:scale-[1.01] transition-transform">
                                    <h4 className="text-blue-400 text-base font-medium mb-2">Antidepresivos (ISRS)</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">Tratamiento de fondo para el trastorno de pánico. Tardan de 2 a 4 semanas en hacer efecto completo.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 mt-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="glass bg-red-950/20 border-red-500/30 p-8 rounded-[2.5rem] shadow-xl shadow-red-900/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                                    <Heart size={20} fill="currentColor" />
                                </div>
                                <h3 className="text-red-400 text-2xl font-light" style={{ fontFamily: 'Georgia, serif' }}>No estás solo/a</h3>
                            </div>
                            <p className="text-red-200/60 text-sm leading-relaxed mb-8">
                                Si sientes que no puedes más o estás en una crisis profunda, por favor, contacta con estos servicios gratuitos y anónimos.
                            </p>

                            <div className="space-y-4">
                                <a href="tel:024" className="flex items-center justify-between p-6 bg-red-600 hover:bg-red-500 rounded-3xl transition-all active:scale-95 shadow-lg shadow-red-600/30 group">
                                    <div>
                                        <div className="text-white font-bold text-xl mb-1">Línea 024</div>
                                        <div className="text-red-100/80 text-[10px] uppercase tracking-widest font-bold">Prevención del suicidio</div>
                                    </div>
                                    <Phone className="text-white group-hover:scale-110 transition-transform" />
                                </a>
                                <a href="tel:717003717" className="flex items-center justify-between p-6 glass hover:bg-slate-800 rounded-3xl transition-all active:scale-95 group">
                                    <div>
                                        <div className="text-white font-bold text-xl mb-1">717 003 717</div>
                                        <div className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Teléfono de la Esperanza</div>
                                    </div>
                                    <Phone className="text-red-400 group-hover:scale-110 transition-transform" />
                                </a>
                            </div>
                        </div>

                        <div className="p-8 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                            <Activity className="text-white/40 mb-4" size={32} />
                            <h3 className="text-2xl font-medium mb-2" style={{ fontFamily: 'Georgia, serif' }}>Emergencias 112</h3>
                            <p className="text-white/70 text-sm leading-relaxed mb-6">
                                Ante una emergencia médica inmediata o peligro inminente, llama directamente al número de emergencias.
                            </p>
                            <a href="tel:112" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">
                                Llamar ahora <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

