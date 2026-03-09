'use client';

import { useState } from 'react';
import { Shield, Trash2, Download, ChevronRight, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import TopBar from './TopBar';
import { getStats, STATS_KEYS } from '../utils/stats';
import * as db from '../lib/db';

interface SettingsScreenProps {
    onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Calculate what we have stored
    const stats = getStats();
    const hasData = stats.points > 0 || stats.sosUses > 0 || stats.breathMins > 0 || stats.cbtEntries > 0;

    const handleDeleteAllData = async () => {
        setIsDeleting(true);
        try {
            // 1. Delete all IndexedDB Audio Tracks
            const tracks = await db.getAllTracks();
            for (const track of tracks) {
                if (track.id) await db.deleteTrack(track.id);
            }

            // 2. Clear LocalStorage stats
            Object.values(STATS_KEYS).forEach(key => localStorage.removeItem(key));

            // 3. Clear any CBT forms draft in localstorage if they existed
            localStorage.removeItem('ansioff_cbt_draft');

            // Artificial delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            window.location.reload(); // Hard reload to clear all states in App.tsx
        } catch (error) {
            console.error("Error deleting data:", error);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
            alert("Hubo un error borrando los datos. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden relative">
            <TopBar title="Ajustes y Privacidad" onBack={onBack} />

            <div className="flex-1 overflow-y-auto screen-px pb-32 pt-6">

                {/* Privacy Guarantee Header */}
                <div className="glass-primary p-6 rounded-3xl mb-8 relative overflow-hidden border border-blue-500/30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>

                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-blue-500/50">
                        <Shield size={24} strokeWidth={2.5} />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Privacidad desde el Diseño</h2>
                    <p className="text-blue-100/70 text-sm leading-relaxed mb-4">
                        Ansioff procesa tu información sensible (diarios, audios y progreso) directamente en tu dispositivo. Tu progreso se guarda localmente para garantizar la máxima confidencialidad.
                    </p>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-semibold border border-blue-500/20">
                        <ShieldAlert size={14} /> 100% Anónimo y Local
                    </div>
                </div>

                <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 px-1">Gestión de Datos</div>

                <div className="space-y-3 mb-8">
                    {/* Data Usage Info */}
                    <div className="glass p-4 rounded-3xl flex items-start gap-4 border border-slate-800/50">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                            <Info size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white mb-1">¿Qué datos guardamos?</h3>
                            <p className="text-[12px] text-slate-400 leading-relaxed">
                                Actualmente guardamos en el almacenamiento local de tu navegador:
                                <span className="text-white"> {stats.points} puntos de progreso</span> y tus audios personalizados.
                            </p>
                        </div>
                    </div>

                    {/* Export Data */}
                    <button className="w-full glass p-4 rounded-3xl flex items-center gap-4 hover:bg-slate-800/50 transition-colors border border-slate-800/50 group target:opacity-50 opacity-50 cursor-not-allowed">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                            <Download size={20} />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-sm font-semibold text-white">Exportar mi diario y datos</h3>
                            <p className="text-[11px] text-slate-500">Próximamente</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-600" />
                    </button>

                    {/* Delete Account / Data */}
                    <button
                        onClick={() => hasData ? setShowDeleteConfirm(true) : null}
                        className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all border ${hasData ? 'glass hover:bg-red-500/10 hover:border-red-500/30 border-slate-800/50 group' : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${hasData ? 'bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white' : 'bg-slate-800 text-slate-500'}`}>
                            <Trash2 size={20} />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className={`text-sm font-semibold ${hasData ? 'text-white group-hover:text-red-400' : 'text-slate-500'}`}>Borrar todos mis datos</h3>
                            <p className="text-[11px] text-slate-500">Elimina progreso, audios locales y configuración de este dispositivo</p>
                        </div>
                    </button>
                </div>

            </div>

            {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-end justify-center sm:items-center p-4 pb-8">
                    <div className="bg-slate-900 border border-red-500/20 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl shadow-red-900/20 animate-in slide-in-from-bottom-10 fade-in duration-300">

                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 ring-8 ring-red-500/5">
                            <AlertTriangle size={32} strokeWidth={2} />
                        </div>

                        <h3 className="text-xl font-bold text-white text-center mb-3">¿Estás seguro/a?</h3>
                        <p className="text-slate-400 text-sm text-center mb-8 px-2 leading-relaxed">
                            Esta acción <strong className="text-white">eliminará para siempre</strong> todo tu progreso, puntos acumulados ({stats.points} pts) y los audios que hayas subido a tu biblioteca local. No se puede deshacer.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDeleteAllData}
                                disabled={isDeleting}
                                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Borrando datos...
                                    </>
                                ) : (
                                    'Sí, borrarlo todo'
                                )}
                            </button>
                            <button
                                onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
