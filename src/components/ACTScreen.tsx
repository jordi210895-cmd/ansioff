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
        desc: 'Haz una pausa y observa lo que ocurre sin intentar resolverlo todo a la vez.',
        long: 'Practica quedarte unos instantes y observar con curiosidad. El objetivo es crear margen antes de continuar.'
    },
    {
        t: 'Aceptar',
        icon: <Info className="w-6 h-6" />,
        desc: 'Deja que lo que aparece esté ahí unos segundos. No tienes que juzgarlo ni empujarlo.',
        long: 'Aceptar aquí significa notar lo que ocurre sin juzgarlo. Es un ejercicio personal de atención.'
    },
    {
        t: 'Flotar',
        icon: <Wind className="w-6 h-6" />,
        desc: 'Imagínate flotando sobre una ola. No remes contra ella: acompaña el movimiento y vuelve poco a poco.',
        long: 'Usa la imagen de una ola como metáfora de atención. Puedes repetirlo cuando quieras hacer una pausa.'
    },
    {
        t: 'Dejar pasar',
        icon: <Clock className="w-6 h-6" />,
        desc: 'Sé paciente. Deja que el tiempo pase sin mirar el reloj y continúa cuando estés listo.',
        long: 'Date tiempo y reduce la exigencia. Esta práctica solo busca ayudarte a organizar una pausa.'
    }
];

export default function ACTScreen({ onBack }: ACTScreenProps) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Aceptación" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-5 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-6 mt-4">
                    {/* Claire Weekes Attribution Card */}
                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 mb-2 shadow-sm">
                        <div className="text-[rgba(200,225,235,0.38)] text-[10px] uppercase tracking-widest font-bold mb-1">Ejercicio inspirado en</div>
                        <div className="text-[#ddeef5] text-2xl font-light font-serif italic mb-1">Aceptación y atención plena</div>
                        <div className="text-[#5aadcf]/70 text-[11px] mb-4">Recurso educativo de atención</div>
                        <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] leading-relaxed">
                            Estos pasos son una práctica de observación para crear una pausa y volver a lo que estabas haciendo.
                        </p>
                    </div>
                </div>

                {/* Step Selector */}
                <div className="flex justify-between gap-2 mb-6 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-2 rounded-2xl">
                    {STEPS.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-colors ${activeTab === i
                                ? 'bg-[#5aadcf] text-[#03080f] shadow-lg shadow-[#5aadcf]/20'
                                : 'text-[rgba(200,225,235,0.38)] hover:text-[#ddeef5] hover:bg-[rgba(255,255,255,0.05)]'
                                }`}
                        >
                            <div className="mb-1">{s.icon}</div>
                            <div className={`text-[9px] uppercase font-bold tracking-widest ${activeTab === i ? 'text-[#03080f]' : 'text-[rgba(200,225,235,0.38)]'}`}>Paso {i + 1}</div>
                        </button>
                    ))}
                </div>

                {/* Active Content */}
                <div className="bg-[#0e1d2e] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 shadow-sm">
                    <div className="w-14 h-14 bg-[#5aadcf]/20 rounded-full flex items-center justify-center text-[#5aadcf] mb-6">
                        {STEPS[activeTab].icon}
                    </div>
                    <h2 className="text-3xl font-light mb-4 text-[#ddeef5] font-serif italic">{STEPS[activeTab].t}</h2>
                    <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] leading-relaxed mb-6">
                        {STEPS[activeTab].desc}
                    </p>
                    <div className="p-4 bg-[rgba(255,255,255,0.04)] rounded-2xl border border-[rgba(255,255,255,0.07)]">
                        <p className="font-sans font-light text-[13px] text-[#5aadcf] leading-relaxed italic">
                            "{STEPS[activeTab].long}"
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[rgba(200,225,235,0.38)] text-[10px] uppercase tracking-widest">
                    Toca los pasos de arriba para explorar cada uno
                </div>
            </div>
        </div>
    );
}
