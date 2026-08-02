'use client';

import { BookOpen, Headphones, Mail, ShieldCheck } from 'lucide-react';
import TopBar from './TopBar';

interface SupportScreenProps {
    onBack: () => void;
}

export default function SupportScreen({ onBack }: SupportScreenProps) {
    return (
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Ayuda y soporte" onBack={onBack} />

            <div className="flex-1 overflow-y-auto px-5 pb-24">
                <div className="mt-5 mb-7">
                    <div className="font-sans font-bold text-[10px] text-[#5aadcf] uppercase tracking-widest mb-3">
                        ANSIOFF
                    </div>
                    <h2 className="text-3xl font-light font-serif italic text-[#ddeef5] mb-3">
                        Soporte para tu cuenta y tus herramientas
                    </h2>
                    <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.68)] leading-relaxed">
                        Aquí tienes información para usar el diario, los sonidos, el Kit SOS y la configuración de la app.
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl shadow-sm">
                        <BookOpen className="text-[#5aadcf] mb-3" size={24} />
                        <h4 className="font-serif italic text-lg text-[#ddeef5] mb-2 font-light">Diario y reflexión</h4>
                        <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.8)] leading-relaxed">
                            Usa el diario para escribir notas privadas y revisar temas que se repiten. La reflexión con IA solo se activa si tú la solicitas.
                        </p>
                    </div>

                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl shadow-sm">
                        <Headphones className="text-[#5aadcf] mb-3" size={24} />
                        <h4 className="font-serif italic text-lg text-[#ddeef5] mb-2 font-light">Sonidos y Kit SOS</h4>
                        <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.8)] leading-relaxed">
                            Los audios, juegos de atención y ritmos guiados están pensados para crear pequeños espacios de foco durante el día.
                        </p>
                    </div>

                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl shadow-sm">
                        <ShieldCheck className="text-[#5aadcf] mb-3" size={24} />
                        <h4 className="font-serif italic text-lg text-[#ddeef5] mb-2 font-light">Privacidad</h4>
                        <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.8)] leading-relaxed">
                            Tus notas y ajustes personales se guardan en el dispositivo salvo que actives una función que indique expresamente que enviará información.
                        </p>
                    </div>

                    <a
                        href="mailto:soporte@ansioff.com"
                        className="flex items-center justify-between p-5 bg-[#0e1d2e] border border-[rgba(255,255,255,0.07)] rounded-2xl text-[#ddeef5] shadow-sm"
                    >
                        <div>
                            <h4 className="font-serif italic text-lg text-[#ddeef5] mb-1 font-light">Contactar soporte</h4>
                            <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.65)]">soporte@ansioff.com</p>
                        </div>
                        <Mail className="text-[#5aadcf]" size={22} />
                    </a>
                </div>
            </div>
        </div>
    );
}
