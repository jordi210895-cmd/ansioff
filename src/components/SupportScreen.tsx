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
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Apoyo y Recursos" onBack={onBack} />

            <div className="flex px-5 py-4 gap-2">
                <button
                    className={`flex-1 py-3 rounded-full font-sans font-semibold text-xs tracking-wider transition-colors border border-[rgba(255,255,255,0.07)] ${activeCat === 'info' ? 'bg-[#5aadcf] text-[#03080f] shadow-lg border-transparent' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(200,225,235,0.38)] hover:text-[#ddeef5]'
                        }`}
                    onClick={() => setActiveCat('info')}
                >
                    Información
                </button>
                <button
                    className={`flex-1 py-3 rounded-full font-sans font-semibold text-xs tracking-wider transition-colors border border-[rgba(255,255,255,0.07)] ${activeCat === 'emergency' ? 'bg-[#d97c6a] text-[#03080f] shadow-lg border-transparent' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(200,225,235,0.38)] hover:text-[#ddeef5]'
                        }`}
                    onClick={() => setActiveCat('emergency')}
                >
                    Ayuda Urgente
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-24">
                {activeCat === 'info' ? (
                    <div className="flex flex-col gap-6 mt-2 animate-in fade-in slide-in-from-left-4 duration-300">
                        <section>
                            <div className="font-sans font-bold text-[10px] text-[#5aadcf] uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
                                <Leaf size={14} /> Fitoterapia y Natural
                            </div>
                            <div className="space-y-3">
                                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl hover:-translate-y-0.5 transition-transform shadow-sm">
                                    <h4 className="font-serif italic text-lg text-[#ddeef5] mb-2 font-light">Valeriana & Pasiflora</h4>
                                    <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.8)] leading-relaxed">Ayudan a relajar el sistema nervioso central en estados de ansiedad leve o moderada.</p>
                                </div>
                                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl hover:-translate-y-0.5 transition-transform shadow-sm">
                                    <h4 className="font-serif italic text-lg text-[#ddeef5] mb-2 font-light">Aceite de Lavanda</h4>
                                    <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.8)] leading-relaxed">La inhalación de esencia de lavanda de grado médico puede reducir picos de cortisol rápidamente.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="font-sans font-bold text-[10px] text-[#5aadcf] uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
                                <Pill size={14} /> Orientación Médica
                            </div>
                            <div className="space-y-3">
                                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl hover:-translate-y-0.5 transition-transform shadow-sm">
                                    <h4 className="font-serif italic text-lg text-[#ddeef5] mb-2 font-light">Ansiolíticos (Benzodiacepinas)</h4>
                                    <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.8)] leading-relaxed mb-4">Efecto rápido. Deben usarse solo bajo prescripción médica estricta por riesgo de dependencia.</p>
                                    <div className="font-sans font-medium text-xs text-[#5aadcf]/80 italic flex items-center gap-1.5 bg-[#5aadcf]/5 border border-[#5aadcf]/10 p-3 rounded-xl">
                                        <Info size={14} className="shrink-0" /> Consulte siempre con su psiquiatra.
                                    </div>
                                </div>
                                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl hover:-translate-y-0.5 transition-transform shadow-sm">
                                    <h4 className="font-serif italic text-lg text-[#ddeef5] mb-2 font-light">Antidepresivos (ISRS)</h4>
                                    <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.8)] leading-relaxed">Tratamiento de fondo para el trastorno de pánico. Tardan de 2 a 4 semanas en hacer efecto completo.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 mt-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#d97c6a]/10 border border-[#d97c6a]/20 flex items-center justify-center text-[#d97c6a]">
                                    <Heart size={20} fill="currentColor" />
                                </div>
                                <h3 className="text-[#d97c6a] text-2xl font-light font-serif italic">No estás solo/a</h3>
                            </div>
                            <p className="font-sans font-light text-[rgba(200,225,235,0.8)] text-sm leading-relaxed mb-6">
                                Si sientes que no puedes más o estás en una crisis profunda, por favor, contacta con estos servicios gratuitos y anónimos.
                            </p>

                            <div className="space-y-3">
                                <a href="tel:024" className="flex items-center justify-between p-5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[#d97c6a]/30 rounded-2xl transition-all group">
                                    <div>
                                        <div className="text-[#ddeef5] font-sans font-medium text-lg mb-1">Línea 024</div>
                                        <div className="text-[#d97c6a]/80 text-[9px] uppercase tracking-widest font-bold">Prevención del suicidio</div>
                                    </div>
                                    <Phone className="text-[#d97c6a] group-hover:scale-110 transition-transform" size={20} />
                                </a>
                                <a href="tel:717003717" className="flex items-center justify-between p-5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[#d97c6a]/30 rounded-2xl transition-all group">
                                    <div>
                                        <div className="text-[#ddeef5] font-sans font-medium text-lg mb-1">717 003 717</div>
                                        <div className="text-[rgba(200,225,235,0.6)] text-[9px] uppercase tracking-widest font-bold">Teléfono de la Esperanza</div>
                                    </div>
                                    <Phone className="text-[rgba(200,225,235,0.6)] group-hover:scale-110 transition-transform" size={20} />
                                </a>
                            </div>
                        </div>

                        <div className="p-6 bg-[#0e1d2e] border border-[rgba(255,255,255,0.07)] rounded-2xl text-[#ddeef5] shadow-sm relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5aadcf]/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                            <Activity className="text-[#5aadcf] mb-3" size={28} />
                            <h3 className="text-2xl font-light mb-2 font-serif italic text-[#ddeef5]">Emergencias 112</h3>
                            <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.8)] leading-relaxed mb-6">
                                Ante una emergencia médica inmediata o peligro inminente, llama directamente al número de emergencias.
                            </p>
                            <a href="tel:112" className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:bg-[#5aadcf] hover:text-[#03080f] hover:border-transparent text-[#ddeef5] px-5 py-3 rounded-full font-sans font-semibold text-xs tracking-wider transition-colors shadow-sm">
                                Llamar ahora <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

