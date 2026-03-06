'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface AuthScreenProps {
    onAuth: () => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Por favor, rellena todos los campos.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');

        if (mode === 'register') {
            const { error: err } = await supabase.auth.signUp({ email, password });
            if (err) {
                setError(err.message);
            } else {
                setSuccess('¡Cuenta creada! Revisa tu email para confirmar y luego inicia sesión.');
                setMode('login');
            }
        } else {
            const { error: err } = await supabase.auth.signInWithPassword({ email, password });
            if (err) {
                setError('Email o contraseña incorrectos.');
            } else {
                onAuth();
            }
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center px-6 overflow-hidden">
            {/* Background breathe circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-96 rounded-full bg-blue-500/5 animate-breathe" />
            </div>

            {/* Logo */}
            <div className="flex-none flex flex-col items-center mb-10 relative z-10">
                <img
                    src="/logo.png"
                    alt="ANSIOFF Logo"
                    className="h-20 w-auto object-contain mb-3 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                />
                <p className="text-[10px] text-blue-400/80 font-bold tracking-[0.3em] uppercase">Tu espacio seguro</p>
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-sm bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
                {/* Tabs */}
                <div className="flex bg-slate-800/60 rounded-2xl p-1 mb-8 gap-1">
                    {(['login', 'register'] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${mode === m
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                        </button>
                    ))}
                </div>

                {/* Fields */}
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            placeholder="tu@email.com"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors placeholder-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-2">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                placeholder="••••••••"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500 transition-colors placeholder-slate-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error / Success */}
                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-xs text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-900/30 border border-green-500/30 rounded-xl text-green-300 text-xs text-center">
                        {success}
                    </div>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-sm transition-all active:scale-98 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
                </button>
            </div>

            <p className="relative z-10 mt-6 text-slate-600 text-[10px] text-center">
                Tus datos son privados y seguros
            </p>
        </div>
    );
}
