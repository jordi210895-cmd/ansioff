'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, X, User } from 'lucide-react';

interface AuthScreenProps {
    onAuth: (session?: any, profile?: any) => void;
    onTrialSignup?: (userId: string) => void;
    onCancel?: () => void;
    trialOffer?: boolean;
}

const DEMO_EMAIL = 'smitsolutionshelp@gmail.com';
const DEMO_PASSWORD = 'Zxcv@1234';
const DEMO_USER_ID = 'app-review-demo';

export default function AuthScreen({ onAuth, onTrialSignup, onCancel, trialOffer = false }: AuthScreenProps) {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(trialOffer ? 'signup' : 'login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isStandalone, setIsStandalone] = useState(true);
    const [isNativeApp, setIsNativeApp] = useState(false);

    useEffect(() => {
        const checkStandalone = () => {
            const isS = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
            setIsStandalone(!!isS);
        };
        setIsNativeApp(Capacitor.isNativePlatform());
        checkStandalone();
    }, []);

    useEffect(() => {
        if (trialOffer) setMode('signup');
    }, [trialOffer]);

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
                if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
                    onAuth(
                        {
                            user: {
                                id: DEMO_USER_ID,
                                email: DEMO_EMAIL,
                            },
                        },
                        {
                            id: DEMO_USER_ID,
                            name: 'Apple Review',
                            is_premium: true,
                        }
                    );
                    return;
                }

                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onAuth();
            } else if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { name: name.trim() } },
                });
                if (error) throw error;
                if (data.session) {
                    onAuth();
                    return;
                }
                if (trialOffer && data.user && onTrialSignup) {
                    onTrialSignup(data.user.id);
                    return;
                }
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
        <div className={`auth-root ${isNativeApp ? 'native-auth' : ''} ${trialOffer ? 'trial-auth' : ''} bg-[#03080f] text-[#ddeef5] selection:bg-[#5aadcf]/30`}>
            <style jsx>{`
                .auth-root {
                    position: fixed;
                    inset: 0;
                    width: 100%;
                    min-height: 100vh;
                    min-height: 100svh;
                    overflow-y: auto;
                    overflow-x: hidden;
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior: contain;
                }
                .auth-shell {
                    min-height: 100vh;
                    min-height: 100svh;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    padding: calc(env(safe-area-inset-top, 0px) + 14px) 18px calc(env(safe-area-inset-bottom, 0px) + 18px);
                }
                .auth-close {
                    position: fixed;
                    z-index: 10;
                    top: calc(env(safe-area-inset-top, 0px) + 12px);
                    right: 16px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,.12);
                    background: rgba(14,29,46,.9);
                    color: #ddeef5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .auth-card {
                    width: 100%;
                    max-width: 360px;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 24px 20px;
                    box-shadow: 0 20px 42px -18px rgba(0, 0, 0, 0.58);
                }
                .auth-card h2 {
                    font-size: clamp(24px, 6.2vw, 29px);
                    line-height: 1.08;
                    margin-bottom: 22px;
                }
                .input-group {
                    position: relative;
                    margin-bottom: 14px;
                }
                .input-group input {
                    width: 100%;
                    height: 54px;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 0 15px 0 48px;
                    font-size: 16px;
                    line-height: 54px;
                    color: white;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-group input:focus {
                    border-color: #5aadcf;
                    background: rgba(0, 0, 0, 0.4);
                    box-shadow: 0 0 0 4px rgba(90, 173, 207, 0.1);
                }
                :global(.auth-input-icon) {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.4);
                    transition: all 0.2s;
                    pointer-events: none;
                }
                .btn-primary {
                    width: 100%;
                    background: linear-gradient(135deg, #5aadcf, #3b82f6);
                    color: #03080f;
                    font-weight: 700;
                    min-height: 54px;
                    padding: 0 16px;
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
                .install-banner {
                    width: 100%;
                    max-width: 400px;
                    background: rgba(90, 173, 207, 0.1);
                    border: 1px dashed rgba(90, 173, 207, 0.3);
                    border-radius: 20px;
                    padding: 16px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .install-step {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    background: #5aadcf;
                    color: #03080f;
                    border-radius: 50%;
                    font-size: 12px;
                    font-weight: 800;
                    flex-shrink: 0;
                }
                .auth-brand {
                    width: 100%;
                    max-width: 400px;
                    margin-bottom: 18px;
                    text-align: center;
                }
                .auth-logo {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 12px;
                    overflow: hidden;
                }
                .auth-logo-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .auth-footer {
                    width: 100%;
                    max-width: 280px;
                    margin-top: 16px;
                    padding-bottom: 0;
                    line-height: 1.35;
                }
                .native-auth .auth-shell {
                    padding-top: max(12px, calc(env(safe-area-inset-top, 0px) - 18px));
                    padding-bottom: max(12px, calc(env(safe-area-inset-bottom, 0px) - 6px));
                }
                .trial-auth .auth-shell {
                    padding-top: max(44px, calc(env(safe-area-inset-top, 0px) + 18px));
                }
                .native-auth .auth-brand {
                    margin-bottom: 14px;
                }
                .trial-auth .auth-brand {
                    margin-bottom: 30px;
                }
                .trial-auth .trial-heading {
                    margin-top: 28px;
                }
                .trial-auth .trial-subtitle {
                    margin-top: 14px;
                    color: #ffffff;
                }
                .native-auth .auth-logo {
                    width: 60px;
                    height: 60px;
                    margin-bottom: 10px;
                }
                .native-auth .auth-title {
                    font-size: 32px;
                    line-height: 1.05;
                }
                .native-auth .auth-subtitle {
                    font-size: 14px;
                }
                @media (max-height: 700px) {
                    .auth-shell {
                        padding-top: calc(env(safe-area-inset-top, 0px) + 8px);
                        padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
                    }
                    .auth-brand {
                        margin-bottom: 12px;
                    }
                    .auth-logo {
                        width: 54px;
                        height: 54px;
                        margin-bottom: 10px;
                        border-radius: 16px;
                    }
                    .auth-title {
                        font-size: 30px;
                        line-height: 1.05;
                    }
                    .auth-subtitle {
                        font-size: 14px;
                    }
                    .auth-card {
                        padding: 20px 18px;
                    }
                    .auth-card h2 {
                        margin-bottom: 18px;
                    }
                    .input-group {
                        margin-bottom: 12px;
                    }
                    .input-group input,
                    .btn-primary {
                        height: 50px;
                        min-height: 50px;
                        line-height: 50px;
                    }
                    .auth-footer {
                        margin-top: 12px;
                    }
                }
                @media (min-height: 760px) {
                    .auth-shell {
                        padding-top: calc(env(safe-area-inset-top, 0px) + clamp(20px, 5vh, 42px));
                    }
                }
            `}</style>

            {onCancel && <button type="button" className="auth-close" onClick={onCancel} aria-label="Cerrar"><X size={20} /></button>}
            <div className="auth-shell">
            <div className="auth-brand animate-in fade-in slide-in-from-top-4 duration-700">
                {!isStandalone && !isNativeApp && (
                    <div className="install-banner animate-in fade-in zoom-in-95 duration-500 delay-500 mx-auto">
                        <div className="install-step">!</div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-[#5aadcf]">Instala Ansioff para mejor experiencia</p>
                            <p className="text-[11px] text-[rgba(200,225,235,0.6)] leading-tight mt-0.5">
                                Pulsa compartir <span className="inline-block px-1 bg-white/10 rounded">⎋</span> y luego <b>'Añadir a pantalla de inicio'</b>.
                            </p>
                        </div>
                    </div>
                )}
                
                <div className="auth-logo rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Image className="auth-logo-img" src="/logo.png" alt="ANSIOFF" width={64} height={64} priority />
                </div>
                <h1 className="auth-title text-4xl font-extrabold tracking-tight mb-2">Ansioff</h1>
                {trialOffer && (
                    <div className="trial-heading max-w-[340px] text-center">
                        <p className="text-2xl font-bold leading-tight text-[#e5f2f7]">{mode === 'login' ? 'Inicia sesión en ANSIOFF' : 'Regístrate y te regalamos 7 días gratis'}</p>
                        {mode !== 'login' && <p className="trial-subtitle text-sm font-semibold">Sin tarjeta ni renovaciones automáticas</p>}
                    </div>
                )}
            </div>

            <div className="auth-card animate-in fade-in zoom-in-95 duration-500 delay-200">
                {!trialOffer && <h2 className="text-2xl font-bold mb-8 text-center">
                    {mode === 'login' ? 'Bienvenido de nuevo' : mode === 'signup' ? 'Crea tu cuenta' : mode === 'forgot' ? 'Recuperar acceso' : 'Nueva contraseña'}
                </h2>}

                <form onSubmit={handleAuth}>
                    {mode === 'signup' && (
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                            <User size={19} className="auth-input-icon" />
                        </div>
                    )}

                    {mode !== 'reset' && (
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail size={19} className="auth-input-icon" />
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
                            <Lock size={19} className="auth-input-icon" />
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
                                {mode === 'login' ? 'Iniciar sesión' : mode === 'signup' ? (trialOffer ? 'Crear cuenta' : 'Registrarse') : mode === 'forgot' ? 'Enviar enlace' : 'Actualizar contraseña'}
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

            {!trialOffer && <p className="auth-footer text-[rgba(200,225,235,0.3)] text-xs text-center font-medium">
                Tus datos personales están protegidos y encriptados.
            </p>}
            </div>
        </div>
    );
}
