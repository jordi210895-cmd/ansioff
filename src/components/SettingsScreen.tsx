'use client';

import { useState } from 'react';
import { Shield, Trash2, Download, ChevronRight, AlertTriangle, Info, ShieldAlert, Bell } from 'lucide-react';
import TopBar from './TopBar';
import { getStats, STATS_KEYS } from '../utils/stats';
import { exportClinicalDiaryPDF } from '../utils/exportUtils';
import * as db from '../lib/db';

interface SettingsScreenProps {
    onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(false);

    useEffect(() => {
        // Check if OneSignal is loaded and get subscription status
        const checkPushStatus = async () => {
            if (typeof window !== 'undefined' && (window as any).OneSignal) {
                const OneSignal = (window as any).OneSignal;
                if (OneSignal.Notifications) {
                    const hasPerms = await OneSignal.Notifications.permission;
                    setPushEnabled(hasPerms === 'granted');
                }
            }
        };
        // Small delay to ensure OneSignal script is loaded
        setTimeout(checkPushStatus, 1500);
    }, []);

    // Calculate what we have stored
    const stats = getStats();
    const hasData = stats.points > 0 || stats.sosUses > 0 || stats.breathMins > 0 || stats.cbtEntries > 0;

    const handleEnablePush = async () => {
        if (typeof window !== 'undefined' && (window as any).OneSignal) {
            const OneSignal = (window as any).OneSignal;
            await OneSignal.Slidedown.promptPush();
            const hasPerms = await OneSignal.Notifications.permission;
            setPushEnabled(hasPerms === 'granted');
        } else {
            alert("El servicio de notificaciones se está cargando o tu navegador no es compatible.");
        }
    };

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
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden relative">
            <TopBar title="Ajustes y Privacidad" onBack={onBack} />

            <div className="flex-1 overflow-y-auto px-5 pb-32 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                {/* Privacy Guarantee Header */}
                <div className="bg-[#0e1d2e] p-6 rounded-2xl mb-8 relative overflow-hidden border border-[rgba(255,255,255,0.07)] shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#5aadcf]/5 blur-3xl rounded-full"></div>

                    <div className="w-12 h-12 bg-[#5aadcf]/10 text-[#5aadcf] rounded-2xl flex items-center justify-center mb-4 ring-1 ring-[#5aadcf]/20">
                        <Shield size={24} className="stroke-[1.5]" />
                    </div>

                    <h2 className="text-2xl font-light text-[#ddeef5] mb-2 font-serif italic">Privacidad desde el Diseño</h2>
                    <p className="font-sans font-light text-[rgba(200,225,235,0.8)] text-sm leading-relaxed mb-4">
                        Ansioff procesa tu información sensible (diarios, audios y progreso) directamente en tu dispositivo. Tu progreso se guarda localmente para garantizar la máxima confidencialidad.
                    </p>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5aadcf]/10 text-[#5aadcf] rounded-xl text-xs font-sans font-semibold border border-[#5aadcf]/20">
                        <ShieldAlert size={14} /> 100% Anónimo y Local
                    </div>
                </div>

                <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-[rgba(200,225,235,0.38)] mb-4 px-1">Gestión de Datos</div>

                <div className="space-y-3 mb-8">
                    {/* Data Usage Info */}
                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[rgba(200,225,235,0.6)] shrink-0">
                            <Info size={20} className="stroke-[1.5]" />
                        </div>
                        <div>
                            <h3 className="font-sans font-medium text-sm text-[#ddeef5] mb-1">¿Qué datos guardamos?</h3>
                            <p className="font-sans font-light text-[12px] text-[rgba(200,225,235,0.8)] leading-relaxed">
                                Actualmente guardamos en el almacenamiento local de tu navegador:
                                <span className="font-medium text-[#5aadcf]"> {stats.points} puntos de progreso</span> y tus audios personalizados.
                            </p>
                        </div>
                    </div>

                    {/* Enable Push Notifications */}
                    <button
                        onClick={handleEnablePush}
                        className="w-full bg-[rgba(255,255,255,0.04)] p-5 rounded-2xl flex items-center gap-4 border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[#c9a96e]/30 transition-all duration-200 hover:-translate-y-0.5 group shadow-sm"
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${pushEnabled ? 'bg-[#c9a96e]/10 border-[#c9a96e]/20 text-[#c9a96e]' : 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.1)] text-[#ddeef5]'}`}>
                            <Bell size={20} className="stroke-[1.5]" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-sans font-medium text-sm text-[#ddeef5] group-hover:text-[#c9a96e] mb-1 transition-colors">
                                {pushEnabled ? 'Notificaciones Activadas' : 'Habilitar Notificaciones'}
                            </h3>
                            <p className="font-sans font-light text-[11px] text-[rgba(200,225,235,0.5)]">
                                {pushEnabled ? 'Recibirás consejos push' : 'Recibe recordatorios zen en tu dispositivo'}
                            </p>
                        </div>
                        <ChevronRight size={18} className="text-[rgba(200,225,235,0.6)] group-hover:text-[#c9a96e] transition-colors" />
                    </button>

                    {/* Export Data */}
                    <button
                        onClick={() => exportClinicalDiaryPDF()}
                        className="w-full bg-[rgba(255,255,255,0.04)] p-5 rounded-2xl flex items-center gap-4 border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[#5aadcf]/30 transition-all duration-200 hover:-translate-y-0.5 group shadow-sm"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#5aadcf]/10 border border-[#5aadcf]/20 flex items-center justify-center text-[#5aadcf] transition-colors group-hover:bg-[#5aadcf] group-hover:text-[#03080f]">
                            <Download size={20} className="stroke-[1.5] group-hover:stroke-current" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-sans font-medium text-sm text-[#ddeef5] group-hover:text-[#5aadcf] mb-1 transition-colors">Exportar mi diario y datos</h3>
                            <p className="font-sans font-light text-[11px] text-[rgba(200,225,235,0.5)]">Descarga un PDF clínico para tu terapeuta</p>
                        </div>
                        <ChevronRight size={18} className="text-[rgba(200,225,235,0.6)] group-hover:text-[#5aadcf] transition-colors" />
                    </button>

                    {/* Delete Account / Data */}
                    <button
                        onClick={() => hasData ? setShowDeleteConfirm(true) : null}
                        className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-transform duration-200 border shadow-sm ${hasData ? 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[#d97c6a]/30 hover:-translate-y-0.5 group' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.04)] opacity-50 cursor-not-allowed'}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${hasData ? 'bg-[#d97c6a]/10 text-[#d97c6a] border-[#d97c6a]/20 group-hover:bg-[#d97c6a] group-hover:text-[#03080f]' : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-[rgba(200,225,235,0.38)]'}`}>
                            <Trash2 size={20} className={hasData ? 'stroke-current' : 'stroke-[1.5]'} />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className={`font-sans font-medium text-sm mb-1 ${hasData ? 'text-[#ddeef5] group-hover:text-[#d97c6a]' : 'text-[rgba(200,225,235,0.38)]'}`}>Borrar todos mis datos</h3>
                            <p className="font-sans font-light text-[11px] text-[rgba(200,225,235,0.38)]">Elimina progreso, audios locales y configuración de este dispositivo</p>
                        </div>
                    </button>
                </div>

            </div>

            {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 z-[100] bg-[#03080f]/90 backdrop-blur-md flex items-end justify-center sm:items-center p-5 pb-8 animate-in fade-in duration-300">
                    <div className="bg-[#0e1d2e] border border-[#d97c6a]/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 relative overflow-hidden">

                        <div className="w-16 h-16 bg-[#d97c6a]/10 border border-[#d97c6a]/20 rounded-full flex items-center justify-center text-[#d97c6a] mx-auto mb-6 shadow-inner relative z-10">
                            <AlertTriangle size={32} className="stroke-[1.5]" />
                        </div>

                        <h3 className="text-3xl font-light text-[#ddeef5] text-center mb-4 font-serif italic relative z-10">¿Estás seguro/a?</h3>
                        <p className="font-sans font-light text-[rgba(200,225,235,0.8)] text-sm text-center mb-8 px-2 leading-relaxed relative z-10">
                            Esta acción <strong className="text-[#d97c6a] font-medium">eliminará para siempre</strong> todo tu progreso, puntos acumulados ({stats.points} pts) y los audios que hayas subido a tu biblioteca local. No se puede deshacer.
                        </p>

                        <div className="flex flex-col gap-3 relative z-10">
                            <button
                                onClick={handleDeleteAllData}
                                disabled={isDeleting}
                                className="w-full py-4 rounded-full bg-[#d97c6a] hover:bg-[#c66c5c] text-[#03080f] font-sans font-semibold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait shadow-sm"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-[#03080f]/30 border-t-[#03080f] rounded-full animate-spin"></div>
                                        Borrando datos...
                                    </>
                                ) : (
                                    'Sí, borrarlo todo'
                                )}
                            </button>
                            <button
                                onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="w-full py-4 rounded-full bg-transparent border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.04)] text-[#ddeef5] font-sans font-semibold text-xs tracking-wider transition-colors disabled:opacity-50 shadow-sm"
                            >
                                Cancelar
                            </button>
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#d97c6a]/5 blur-3xl rounded-full pointer-events-none z-0"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
