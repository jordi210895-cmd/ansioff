'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, Wind } from 'lucide-react';

interface AuthScreenProps {
    onAuth: () => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Detect recovery link
    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.includes('type=recovery')) {
            setMode('reset');
        }
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onAuth();
            } else if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('¡Registro casi completo! Revisa tu email para confirmar tu cuenta.');
                setMode('login');
            } else if (mode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin,
                });
                if (error) throw error;
                setMessage('¡Email enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.');
            } else if (mode === 'reset') {
                const { error } = await supabase.auth.updateUser({ password });
                if (error) throw error;
                setMessage('¡Contraseña actualizada! Ya puedes iniciar sesión.');
                setMode('login');
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#03080f] text-[#ddeef5] selection:bg-[#5aadcf]/30">
            <style jsx>{`
                .auth-card {
                    width: 100%;
                    max-width: 400px;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 40px 32px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .input-group {
                    position: relative;
                    margin-bottom: 20px;
                }
                .input-group input {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 14px 14px 14px 44px;
                    font-size: 15px;
                    color: white;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-group input:focus {
                    border-color: #5aadcf;
                    background: rgba(0, 0, 0, 0.4);
                    box-shadow: 0 0 0 4px rgba(90, 173, 207, 0.1);
                }
                .input-group svg {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.4);
                    transition: all 0.2s;
                }
                .btn-primary {
                    width: 100%;
                    background: linear-gradient(135deg, #5aadcf, #3b82f6);
                    color: #03080f;
                    font-weight: 700;
                    padding: 14px;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                    font-size: 16px;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -5px rgba(90, 173, 207, 0.4);
                }
                .btn-primary:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            `}</style>

            <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="w-20 h-20 bg-gradient-to-br from-[#5aadcf] to-[#3b82f6] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Wind size={40} className="text-[#03080f]" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Ansioff</h1>
                <p className="text-[rgba(200,225,235,0.6)] font-medium">Tu espacio de calma personal</p>
            </div>

            <div className="auth-card animate-in fade-in zoom-in-95 duration-500 delay-200">
                <h2 className="text-2xl font-bold mb-8 text-center">
                    {mode === 'login' ? 'Bienvenido de nuevo' : mode === 'signup' ? 'Crea tu cuenta' : mode === 'forgot' ? 'Recuperar acceso' : 'Nueva contraseña'}
                </h2>

                <form onSubmit={handleAuth}>
                    {mode !== 'reset' && (
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail size={18} />
                        </div>
                    )}

                    {mode !== 'forgot' && (
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder={mode === 'reset' ? 'Nueva Contraseña' : 'Contraseña'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock size={18} />
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg mb-6 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-[#5aadcf]/10 border border-[#5aadcf]/20 p-3 rounded-lg mb-6 text-[#5aadcf] text-sm font-medium">
                            {message}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                {mode === 'login' ? <LogIn size={20} /> : mode === 'signup' ? <UserPlus size={20} /> : <Mail size={20} />}
                                {mode === 'login' ? 'Iniciar Sesión' : mode === 'signup' ? 'Registrarse' : mode === 'forgot' ? 'Enviar enlace' : 'Actualizar contraseña'}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm space-y-3">
                    {mode === 'login' && (
                        <button
                            onClick={() => setMode('forgot')}
                            className="block w-full text-[rgba(200,225,235,0.4)] hover:text-[#5aadcf] transition-all"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    )}

                    {mode !== 'reset' && (
                        <div className="pt-2">
                            <span className="text-[rgba(200,225,235,0.5)]">
                                {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                            </span>
                            <button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="ml-2 text-[#5aadcf] font-bold hover:underline transition-all"
                            >
                                {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
                            </button>
                        </div>
                    )}

                    {mode === 'forgot' && (
                        <button
                            onClick={() => setMode('login')}
                            className="block w-full text-[#5aadcf] font-bold hover:underline transition-all"
                        >
                            Volver al login
                        </button>
                    )}
                </div>
            </div>

            <p className="mt-12 text-[rgba(200,225,235,0.3)] text-xs text-center font-medium max-w-[280px]">
                Tus datos de salud mental están protegidos y encriptados.
            </p>
        </div>
    );
}
