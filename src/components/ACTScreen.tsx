'use client';

import { useState } from 'react';
import { Shield, Forward, Wind, Clock, Info } from 'lucide-react';
import TopBar from './TopBar';

interface ACTScreenProps {
    onBack: () => void;
}

const STEPS = [
    {
        t: 'Afrontar',
        icon: <Shield className="w-6 h-6" />,
        desc: 'No huyas de las sensaciones. Quédate en el lugar donde estás y observa lo que ocurre en tu cuerpo sin intentar evitarlo.',
        long: 'Huir refuerza el miedo. Al quedarte, le estás diciendo a tu cerebro que la sensación no es peligrosa, solo incómoda.'
    },
    {
        t: 'Aceptar',
        icon: <Info className="w-6 h-6" />,
        desc: 'Deja que las sensaciones fluyan. No luches contra ellas. Acéptalas como si fueran una lluvia intensa que te está mojando.',
        long: 'Aceptar significa no poner tensión. Si tu corazón late rápido, dite a ti mismo: "Vale, está latiendo rápido. Lo acepto".'
    },
    {
        t: 'Flotar',
        icon: <Wind className="w-6 h-6" />,
        desc: 'Imagínate flotando sobre las olas del pánico. No remes contra ellas, deja que te lleven mientras tú mantienes tu cuerpo relajado.',
        long: 'El pánico es como una ola. Si nadas contra ella, te agotas. Si flotas, la ola pasará y tú seguirás en la superficie.'
    },
    {
        t: 'Dejar pasar',
        icon: <Clock className="w-6 h-6" />,
        desc: 'Sé paciente. La adrenalina tarda unos minutos en disolverse. Deja que el tiempo pase sin mirar el reloj con ansiedad.',
        long: 'No esperes que el miedo se vaya "ya mismo". Dale permiso para estar el tiempo que necesite. Eventualmente, se cansará.'
    }
];

export default function ACTScreen({ onBack }: ACTScreenProps) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
            <TopBar title="Sin Miedo" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-6 pb-24">
                <div className="mb-8 mt-4">
                    {/* Claire Weekes Attribution Card */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-950/50 border border-blue-500/20 rounded-2xl p-5 mb-2">
                        <div className="text-blue-500 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Método creado por</div>
                        <div className="text-white text-lg font-medium" style={{ fontFamily: 'Georgia, serif' }}>Dra. Claire Weekes</div>
                        <div className="text-blue-300/50 text-[10px] mt-1 mb-3">Psiquiatra y pionera en el tratamiento del pánico · 1962</div>
                        <p className="text-blue-200/60 text-xs leading-relaxed">
                            La Dra. Weekes descubrió que el pánico se alimenta de la lucha y la huida. Sus 4 pasos — Afrontar, Aceptar, Flotar y Dejar pasar — rompen ese ciclo de raíz.
                        </p>
                    </div>
                </div>

                {/* Step Selector */}
                <div className="flex justify-between gap-2 mb-8 bg-slate-900 p-1.5 rounded-2xl border-2 border-slate-800">
                    {STEPS.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${activeTab === i
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <div className="mb-1">{s.icon}</div>
                            <div className={`text-[8px] uppercase font-bold tracking-widest ${activeTab === i ? 'text-white' : 'text-slate-600'}`}>Paso {i + 1}</div>
                        </button>
                    ))}
                </div>

                {/* Active Content */}
                <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8">
                        {STEPS[activeTab].icon}
                    </div>
                    <h2 className="text-4xl font-medium mb-6" style={{ fontFamily: 'Georgia, serif' }}>{STEPS[activeTab].t}</h2>
                    <p className="text-blue-100/80 text-base leading-relaxed mb-8">
                        {STEPS[activeTab].desc}
                    </p>
                    <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                        <p className="text-blue-300/50 text-xs leading-relaxed italic">
                            "{STEPS[activeTab].long}"
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em]">
                    Toca los pasos de arriba para explorar cada uno
                </div>
            </div>
        </div>
    );
}

