'use client';

import { supabase, getCurrentUser } from '@/lib/supabase';
import { ShieldCheck, Zap, Clock, CreditCard, Wind, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionRequiredScreenProps {
    onSubscribe: () => void;
}

export default function SubscriptionRequiredScreen({ onSubscribe }: SubscriptionRequiredScreenProps) {
    const [loading, setLoading] = useState(false);
    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const user = await getCurrentUser();
            if (!user) return;

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, email: user.email }),
            });

            const { url, error } = await res.json();
            if (error) throw new Error(error);
            if (url) window.location.href = url;
        } catch (err: any) {
            alert('Error al iniciar la suscripción: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#03080f] text-[#ddeef5] flex flex-col items-center p-6 selection:bg-[#5aadcf]/30">
            <style jsx>{`
                .hero-card {
                    width: 100%;
                    max-width: 500px;
                    background: linear-gradient(135deg, rgba(90, 173, 207, 0.1), rgba(59, 130, 246, 0.05));
                    border: 1px solid rgba(90, 173, 207, 0.2);
                    border-radius: 32px;
                    padding: 40px 24px;
                    margin-top: 40px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
                }
                .hero-card::before {
                    content: '';
                    position: absolute;
                    top: -100px;
                    right: -100px;
                    width: 250px;
                    height: 250px;
                    background: radial-gradient(circle, rgba(90, 173, 207, 0.15), transparent 70%);
                    pointer-events: none;
                }
                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.2s;
                }
                .feature-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(90, 173, 207, 0.3);
                    transform: translateX(4px);
                }
                .price-badge {
                    background: #5aadcf;
                    color: #03080f;
                    font-weight: 800;
                    padding: 4px 12px;
                    border-radius: 99px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .btn-subscribe {
                    width: 100%;
                    background: linear-gradient(135deg, #5aadcf, #3b82f6);
                    color: #03080f;
                    font-weight: 800;
                    padding: 18px;
                    border-radius: 20px;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s;
                    font-size: 18px;
                    margin-top: 10px;
                    box-shadow: 0 15px 30px -5px rgba(90, 173, 207, 0.3);
                }
                .btn-subscribe:hover {
                    transform: scale(1.02) translateY(-4px);
                    box-shadow: 0 20px 40px -8px rgba(90, 173, 207, 0.5);
                }
            `}</style>

            <div className="text-center mt-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg">
                    <Wind size={32} className="text-[#5aadcf]" />
                </div>
                <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Tu prueba gratuita ha finalizado</h1>
                <p className="text-[rgba(200,225,235,0.6)] font-medium px-4">Suscríbete para continuar recuperando tu calma.</p>
            </div>

            <div className="hero-card animate-in fade-in zoom-in-95 duration-500 delay-200">
                <div className="flex justify-between items-center mb-8">
                    <div className="price-badge">Plan Ilimitado</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">Próximamente</span>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    <div className="feature-item">
                        <div className="w-10 h-10 bg-[#5aadcf]/10 rounded-xl flex items-center justify-center text-[#5aadcf]">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm">Privacidad Total</h3>
                            <p className="text-[11px] text-[rgba(200,225,235,0.5)]">Tus datos nunca salen de tu control.</p>
                        </div>
                        <CheckCircle2 size={16} className="text-[#5aadcf]/40" />
                    </div>

                    <div className="feature-item">
                        <div className="w-10 h-10 bg-[#5aadcf]/10 rounded-xl flex items-center justify-center text-[#5aadcf]">
                            <Zap size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm">Acceso a Módulos Pro</h3>
                            <p className="text-[11px] text-[rgba(200,225,235,0.5)]">ACT, CBT y herramientas de evaluación.</p>
                        </div>
                        <CheckCircle2 size={16} className="text-[#5aadcf]/40" />
                    </div>

                    <div className="feature-item">
                        <div className="w-10 h-10 bg-[#5aadcf]/10 rounded-xl flex items-center justify-center text-[#5aadcf]">
                            <Clock size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm">Biblioteca de Audios</h3>
                            <p className="text-[11px] text-[rgba(200,225,235,0.5)]">Sube tus propios sonidos de calma sin límite.</p>
                        </div>
                        <CheckCircle2 size={16} className="text-[#5aadcf]/40" />
                    </div>
                </div>

                <button onClick={handleSubscribe} className="btn-subscribe text-black" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Comenzar suscripción'} <ChevronRight size={20} />
                </button>

                <p className="text-[10px] text-center mt-6 text-[rgba(200,225,235,0.3)] font-medium leading-relaxed italic">
                    "Invierte en tu bienestar. Ansioff está diseñado para ser tu acompañante en los momentos más difíciles."
                </p>
            </div>

            <button
                onClick={handleLogout}
                className="mt-12 text-[rgba(200,225,235,0.4)] text-sm font-semibold hover:text-[#5aadcf] transition-colors"
            >
                Cerrar Sesión
            </button>
        </div>
    );
}
