'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, Wind } from 'lucide-react';

interface AuthScreenProps {
    onAuth: () => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('¡Registro casi completo! Revisa tu email para confirmar tu cuenta.');
                setIsLogin(true);
                setLoading(false);
                return;
            }
            onAuth();
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
                .input-group input:focus + svg {
                    color: #5aadcf;
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
                .btn-primary:active {
                    transform: translateY(0);
                }
                .btn-primary:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
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
                    {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                </h2>

                <form onSubmit={handleAuth}>
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

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Lock size={18} />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg mb-6 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <span className="text-[rgba(200,225,235,0.5)]">
                        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-[#5aadcf] font-bold hover:underline transition-all"
                    >
                        {isLogin ? 'Regístrate' : 'Inicia sesión'}
                    </button>
                </div>
            </div>

            <p className="mt-12 text-[rgba(200,225,235,0.3)] text-xs text-center font-medium max-w-[280px]">
                Tus datos de salud mental están protegidos y encriptados.
            </p>
        </div>
    );
}
