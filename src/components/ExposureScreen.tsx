'use client';

import { useState, useEffect } from 'react';
import { Target, Save, CheckCircle2, AlertCircle, Plus, Trash2, Activity, Clock, Flame } from 'lucide-react';
import TopBar from './TopBar';

interface ExposureLog {
    id: string;
    created_at: string;
    situation: string;
    initial_discomfort: number;
    max_discomfort: number;
    final_discomfort: number;
    duration_mins: number;
    notes: string;
}

interface ExposureScreenProps {
    onBack: () => void;
}

export default function ExposureScreen({ onBack }: ExposureScreenProps) {
    const [reason, setReason] = useState('');
    const [savedReason, setSavedReason] = useState(false);
    const [logs, setLogs] = useState<ExposureLog[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Form state for new exposure session
    const [showForm, setShowForm] = useState(false);
    const [situation, setSituation] = useState('');
    const [initialDiscomfort, setInitialDiscomfort] = useState(5);
    const [maxDiscomfort, setMaxDiscomfort] = useState(7);
    const [finalDiscomfort, setFinalDiscomfort] = useState(3);
    const [durationMins, setDurationMins] = useState(15);
    const [notes, setNotes] = useState('');
    const [savedLog, setSavedLog] = useState(false);

    useEffect(() => {
        const storedReason = localStorage.getItem('ansioff_exposure_reason');
        if (storedReason) {
            setReason(storedReason);
        }

        const storedLogs = localStorage.getItem('ansioff_exposure_logs') || localStorage.getItem('ansioff_exposure_records');
        if (storedLogs) {
            try {
                setLogs(JSON.parse(storedLogs));
            } catch (e) {
                console.error("Error parsing stored exposure logs", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const handleSaveReason = () => {
        if (!reason.trim()) return;
        localStorage.setItem('ansioff_exposure_reason', reason.trim());
        setSavedReason(true);
        setTimeout(() => setSavedReason(false), 2000);
    };

    const handleSaveLog = () => {
        if (!situation.trim()) return;

        const newLog: ExposureLog = {
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            situation: situation.trim(),
            initial_discomfort: Number(initialDiscomfort),
            max_discomfort: Number(maxDiscomfort),
            final_discomfort: Number(finalDiscomfort),
            duration_mins: Number(durationMins),
            notes: notes.trim()
        };

        const updated = [newLog, ...logs];
        setLogs(updated);
        localStorage.setItem('ansioff_exposure_logs', JSON.stringify(updated));

        setSavedLog(true);
        setTimeout(() => {
            setSavedLog(false);
            setShowForm(false);
            setSituation('');
            setNotes('');
            setInitialDiscomfort(5);
            setMaxDiscomfort(7);
            setFinalDiscomfort(3);
            setDurationMins(15);
        }, 1200);
    };

    const handleDeleteLog = (id: string) => {
        const updated = logs.filter(l => l.id !== id);
        setLogs(updated);
        localStorage.setItem('ansioff_exposure_logs', JSON.stringify(updated));
    };

    if (!isLoaded) return null;

    return (
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Exposición Gradual" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-5 pb-28 scrollbar-hide animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* --- HEADER --- */}
                <div className="mt-6 mb-6 text-center">
                    <div className="w-16 h-16 bg-[#5aadcf]/5 border border-[#5aadcf]/10 rounded-full flex items-center justify-center text-[#5aadcf] mx-auto mb-4 shadow-[0_0_20px_rgba(90,173,207,0.1)]">
                        <Target size={28} className="stroke-[1.5]" />
                    </div>
                    <h2 className="text-3xl font-light text-[#ddeef5] mb-2 font-serif italic pl-1">Exposición y <span className="font-semibold text-[#5aadcf]">Progreso</span></h2>
                    <p className="font-sans font-light text-[13px] text-[rgba(200,225,235,0.8)] leading-relaxed px-2 max-w-[300px] mx-auto">
                        Registra tus pasos de exposición, niveles de ansiedad en cada momento y observaciones para tu informe clínico.
                    </p>
                </div>

                {/* --- SECCIÓN: MOTOR PERSONAL --- */}
                <div className="bg-[#0e1d2e]/50 border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 mb-8 shadow-sm">
                    <h3 className="font-sans font-medium text-sm text-[#ddeef5] mb-2 flex items-center gap-2">
                        <Target size={16} className="text-[#5aadcf]" /> Mi objetivo / Motor principal
                    </h3>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ej: Lo hago para poder viajar a ver a mi familia, para recuperar margen, porque quiero construir una rutina más libre..."
                        className="w-full bg-transparent p-3 text-[#ddeef5] placeholder:text-[rgba(200,225,235,0.38)] outline-none resize-none min-h-[90px] font-sans font-light text-[14px] leading-relaxed border border-[rgba(255,255,255,0.07)] rounded-xl mb-3"
                    />
                    <button
                        onClick={handleSaveReason}
                        disabled={!reason.trim()}
                        className={`w-full py-3 rounded-xl font-sans font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${reason.trim()
                            ? savedReason
                                ? 'bg-[#6bbf8e] text-[#03080f]'
                                : 'bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f]'
                            : 'bg-[rgba(255,255,255,0.04)] text-[rgba(200,225,235,0.38)] cursor-not-allowed border border-[rgba(255,255,255,0.07)]'
                            }`}
                    >
                        {savedReason ? <><CheckCircle2 size={16} /> Guardado</> : <><Save size={16} /> Guardar objetivo</>}
                    </button>
                </div>

                {/* --- BOTÓN NUEVO REGISTRO DE EXPOSICIÓN --- */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sans font-bold text-[11px] uppercase tracking-widest text-[#5aadcf]/80">
                        Sesiones de Exposición
                    </h3>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5aadcf]/10 border border-[#5aadcf]/20 text-[#5aadcf] font-sans font-semibold text-xs hover:bg-[#5aadcf]/20 transition-colors"
                    >
                        <Plus size={14} /> {showForm ? 'Cancelar' : 'Añadir exposición'}
                    </button>
                </div>

                {/* --- FORMULARIO NUEVA SESIÓN DE EXPOSICIÓN --- */}
                {showForm && (
                    <div className="bg-[#0e1d2e] border border-[#5aadcf]/30 rounded-2xl p-5 mb-8 animate-in fade-in zoom-in-95 duration-200">
                        <h4 className="font-sans font-semibold text-sm text-[#ddeef5] mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-[#5aadcf]" /> Registrar nueva prueba de exposición
                        </h4>

                        <div className="space-y-4 font-sans text-xs">
                            <div>
                                <label className="block text-[rgba(200,225,235,0.7)] mb-1 font-medium">Situación / Escalón afrontado:</label>
                                <input
                                    type="text"
                                    value={situation}
                                    onChange={(e) => setSituation(e.target.value)}
                                    placeholder="Ej: Ir en autobús 2 paradas / Estar en el centro comercial 15 min"
                                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.09)] rounded-xl p-3 text-sm text-[#ddeef5] placeholder:text-[rgba(200,225,235,0.3)] outline-none focus:border-[#5aadcf]"
                                />
                            </div>

                            {/* Niveles de malestar */}
                            <div className="grid grid-cols-3 gap-2 bg-[rgba(255,255,255,0.02)] p-3 rounded-xl border border-[rgba(255,255,255,0.05)]">
                                <div>
                                    <label className="block text-[10px] text-amber-300 font-bold mb-1">Inicial (0-10):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={initialDiscomfort}
                                        onChange={(e) => setInitialDiscomfort(Math.min(10, Math.max(0, Number(e.target.value))))}
                                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-2 text-center text-sm font-bold text-[#ddeef5]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-rose-400 font-bold mb-1">Máximo Pico:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={maxDiscomfort}
                                        onChange={(e) => setMaxDiscomfort(Math.min(10, Math.max(0, Number(e.target.value))))}
                                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-2 text-center text-sm font-bold text-[#ddeef5]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-emerald-400 font-bold mb-1">Final (Habituación):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={finalDiscomfort}
                                        onChange={(e) => setFinalDiscomfort(Math.min(10, Math.max(0, Number(e.target.value))))}
                                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-2 text-center text-sm font-bold text-[#ddeef5]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock size={16} className="text-[#5aadcf] shrink-0" />
                                <div className="flex-1">
                                    <label className="block text-[rgba(200,225,235,0.7)] text-[11px] font-medium mb-1">Duración de la prueba (minutos):</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="300"
                                        value={durationMins}
                                        onChange={(e) => setDurationMins(Math.max(1, Number(e.target.value)))}
                                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.09)] rounded-xl p-2.5 text-sm text-[#ddeef5]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[rgba(200,225,235,0.7)] mb-1 font-medium">Notas y sensaciones durante la exposición:</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Ej: Al principio sentí taquicardia (7/10), pero a los 8 min la curva bajó a 3/10 al respirar profundo. Pude mantenerme en la situación."
                                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.09)] rounded-xl p-3 text-xs text-[#ddeef5] placeholder:text-[rgba(200,225,235,0.3)] outline-none min-h-[75px]"
                                />
                            </div>

                            <button
                                onClick={handleSaveLog}
                                disabled={!situation.trim()}
                                className={`w-full py-3 rounded-xl font-sans font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${situation.trim()
                                    ? savedLog
                                        ? 'bg-[#6bbf8e] text-[#03080f]'
                                        : 'bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f]'
                                    : 'bg-[rgba(255,255,255,0.04)] text-[rgba(200,225,235,0.38)] cursor-not-allowed border border-[rgba(255,255,255,0.07)]'
                                    }`}
                            >
                                {savedLog ? <><CheckCircle2 size={16} /> Registrado</> : <><Save size={16} /> Guardar registro de exposición</>}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- LISTA DE EXPOSICIONES REGISTRADAS --- */}
                {logs.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl">
                        <Flame className="w-8 h-8 text-[rgba(200,225,235,0.2)] mx-auto mb-2" />
                        <p className="font-sans font-light text-xs text-[rgba(200,225,235,0.5)] leading-relaxed">
                            Aún no has registrado sesiones de exposición. Haz clic en <b className="text-[#5aadcf]">"Añadir exposición"</b> para registrar tu primera prueba y generar un informe completo.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {logs.map((log) => (
                            <div key={log.id} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-4 relative group">
                                <div className="flex justify-between items-start mb-2 pr-6">
                                    <div>
                                        <h4 className="font-sans font-medium text-[14px] text-[#ddeef5] leading-snug">{log.situation}</h4>
                                        <span className="text-[10px] text-[rgba(200,225,235,0.4)]">
                                            {new Date(log.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {log.duration_mins} min
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteLog(log.id)}
                                        className="text-[rgba(200,225,235,0.3)] hover:text-rose-400 p-1 transition-colors"
                                        title="Eliminar registro"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2 my-2 py-2 px-3 bg-[rgba(0,0,0,0.2)] rounded-xl border border-[rgba(255,255,255,0.04)] text-center text-[11px]">
                                    <div>
                                        <span className="block text-[9px] text-amber-300 font-bold uppercase">Inicial</span>
                                        <span className="font-bold text-[#ddeef5]">{log.initial_discomfort}/10</span>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] text-rose-400 font-bold uppercase">Pico Máx</span>
                                        <span className="font-bold text-[#ddeef5]">{log.max_discomfort}/10</span>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] text-emerald-400 font-bold uppercase">Final</span>
                                        <span className="font-bold text-[#ddeef5]">{log.final_discomfort}/10</span>
                                    </div>
                                </div>

                                {log.notes && (
                                    <p className="font-sans font-light text-xs text-[rgba(200,225,235,0.7)] mt-2 leading-relaxed bg-[rgba(255,255,255,0.02)] p-2.5 rounded-lg border border-[rgba(255,255,255,0.03)]">
                                        "{log.notes}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 bg-[#5aadcf]/5 border border-[#5aadcf]/10 rounded-2xl p-5 flex gap-4 items-start relative overflow-hidden group">
                    <AlertCircle className="text-[#5aadcf] shrink-0 stroke-[1.5]" size={20} />
                    <div className="relative z-10">
                        <h4 className="font-sans font-medium text-[#ddeef5] text-sm mb-1">Informe descargable para terapia</h4>
                        <p className="font-sans font-light text-[rgba(200,225,235,0.8)] text-xs leading-relaxed">
                            Todos tus registros de exposición y notas se exportan automáticamente en tu <b>Informe PDF Clínico</b> desde Ajustes para compartir con tu psicólogo.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
