'use client';

import { useState } from 'react';
import { Moon, Sparkles, Wind, Sun, ArrowLeft, Bed, PenLine, Headphones, ShieldAlert, CheckCircle2 } from 'lucide-react';
import TopBar from './TopBar';

interface NightModeScreenProps {
    onBack: () => void;
    onNav?: (screen: string) => void;
}

type NightState = 'menu' | 'panic_menu' | 'ground' | 'light' | 'routine_relax' | 'routine_unload' | 'hygiene_alert';

export default function NightModeScreen({ onBack, onNav }: NightModeScreenProps) {
    const [view, setView] = useState<NightState>('menu');
    const [pendingRoutine, setPendingRoutine] = useState<'routine_relax' | 'routine_unload' | null>(null);

    // Mental Unloading State
    const [tasks, setTasks] = useState<{ id: number, text: string, done: boolean }[]>([
        { id: 1, text: '', done: false },
        { id: 2, text: '', done: false },
        { id: 3, text: '', done: false },
    ]);
    const [isSaved, setIsSaved] = useState(false);

    const handleStartRoutine = (routine: 'routine_relax' | 'routine_unload') => {
        setPendingRoutine(routine);
        setView('hygiene_alert');
    };

    const confirmHygiene = () => {
        if (pendingRoutine) {
            setView(pendingRoutine);
            setPendingRoutine(null);
        }
    };

    const handleTaskChange = (id: number, text: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, text } : t));
    };

    const saveTasks = () => {
        setIsSaved(true);
        setTimeout(() => {
            setView('menu');
            setIsSaved(false);
            setTasks([{ id: 1, text: '', done: false }, { id: 2, text: '', done: false }, { id: 3, text: '', done: false }]);
        }, 3000);
    };

    return (
        <div className="flex flex-col h-full bg-[#0B0D17] text-indigo-100/80 overflow-hidden">
            <TopBar title={view === 'menu' ? "Descanso" : "Modo Noche"} onBack={view === 'menu' ? onBack : () => setView('menu')} />

            <div className="flex-1 overflow-y-auto screen-px pb-24 pt-4">

                {/* --- MAIN MENU --- */}
                {view === 'menu' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="text-center mb-8 mt-2">
                            <div className="w-20 h-20 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-300 mx-auto mb-4 shadow-[0_0_30px_rgba(99,102,241,0.15)] border border-indigo-500/10">
                                <Moon size={32} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl font-medium text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Buenas noches</h2>
                            <p className="text-indigo-300/50 text-xs max-w-[200px] mx-auto">
                                Prepara tu cuerpo y mente para un descanso profundo.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-indigo-500/60 font-bold ml-2 mb-2">Micro-Hábitos de Sueño</div>

                            <button
                                className="w-full bg-[#131628] p-5 rounded-3xl border border-indigo-900/40 text-left hover:border-indigo-500/30 transition-all group flex items-start gap-4"
                                onClick={() => handleStartRoutine('routine_relax')}
                            >
                                <div className="w-12 h-12 rounded-[14px] bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <Bed size={22} />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-semibold text-white mb-1">Relajación Física</h3>
                                    <p className="text-xs text-indigo-200/50 leading-relaxed">3 min. Respiración 4-2-6 y escaneo corporal para aflojar la tensión.</p>
                                </div>
                            </button>

                            <button
                                className="w-full bg-[#131628] p-5 rounded-3xl border border-indigo-900/40 text-left hover:border-indigo-500/30 transition-all group flex items-start gap-4"
                                onClick={() => handleStartRoutine('routine_unload')}
                            >
                                <div className="w-12 h-12 rounded-[14px] bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <PenLine size={22} />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-semibold text-white mb-1">Vaciado Mental</h3>
                                    <p className="text-xs text-indigo-200/50 leading-relaxed">3 min. Anota 3 cosas para mañana y libera tu cerebro de preocupaciones.</p>
                                </div>
                            </button>

                            {onNav && (
                                <button
                                    className="w-full bg-[#131628] p-5 rounded-3xl border border-indigo-900/40 text-left hover:border-indigo-500/30 transition-all group flex items-start gap-4 mt-2"
                                    onClick={() => onNav('sc-audio')}
                                >
                                    <div className="w-12 h-12 rounded-[14px] bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                                        <Headphones size={22} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[15px] font-semibold text-white mb-1">Historias y Sonidos</h3>
                                        <p className="text-xs text-indigo-200/50 leading-relaxed">Escucha frecuencias bajas y ruido blanco para conciliar el sueño.</p>
                                    </div>
                                </button>
                            )}

                            <div className="mt-8 pt-6 border-t border-indigo-900/30">
                                <button
                                    className="w-full bg-red-950/20 p-5 rounded-3xl border border-red-900/30 text-left hover:border-red-500/30 transition-all group flex items-center gap-4"
                                    onClick={() => setView('panic_menu')}
                                >
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-red-200 mb-0.5">Crisis Nocturna</h3>
                                        <p className="text-[11px] text-red-300/50">Si te has despertado con pánico</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* --- HYGIENE ALERT MODAL --- */}
                {view === 'hygiene_alert' && (
                    <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center h-full min-h-[60vh]">
                        <div className="w-20 h-20 bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-300 mb-8 overflow-hidden relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl animate-pulse"></div>
                            <Moon size={32} className="relative z-10" />
                        </div>

                        <h2 className="text-2xl font-medium text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>Preparando el entorno</h2>

                        <ul className="text-left space-y-4 mb-12 text-sm text-indigo-200/70 max-w-[260px] mx-auto">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Bajar el brillo de la pantalla
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Activar "No Molestar"
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Estar ya en la cama
                            </li>
                        </ul>

                        <button
                            className="w-full max-w-[260px] py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-900/40 active:scale-95 mx-auto"
                            onClick={confirmHygiene}
                        >
                            Listo, empezar rutina
                        </button>
                    </div>
                )}


                {/* --- ROUTINE 1: RELAXATION --- */}
                {view === 'routine_relax' && (
                    <div className="animate-in fade-in duration-1000 flex flex-col items-center justify-center min-h-[70vh] text-center">
                        <div className="relative w-48 h-48 flex items-center justify-center mb-12">
                            {/* Dark breathing circles */}
                            <div className="absolute inset-0 bg-indigo-900/20 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                            <div className="absolute inset-4 bg-indigo-800/20 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-1000"></div>
                            <div className="w-24 h-24 bg-[#1a1e36] rounded-full z-10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                                <Wind size={32} className="text-indigo-400 opacity-50" />
                            </div>
                        </div>

                        <div className="text-[10px] uppercase tracking-[0.3em] text-indigo-500 mb-4 font-bold">Respiración 4 - 2 - 6</div>
                        <h2 className="text-2xl font-medium text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                            Inhala suavemente,<br />exhala la tensión.
                        </h2>

                        <p className="text-indigo-200/40 text-xs leading-relaxed max-w-[250px] mx-auto mt-8 border-t border-indigo-900/30 pt-8">
                            <b>Paso 2:</b> Cuando termines, escanea tu cuerpo desde los pies hasta la mandíbula. Imagina que cada músculo se derrite sobre el colchón.
                        </p>
                    </div>
                )}


                {/* --- ROUTINE 2: MENTAL UNLOAD --- */}
                {view === 'routine_unload' && (
                    <div className="animate-in fade-in duration-500 min-h-[70vh] flex flex-col">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-medium text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Vaciado Mental</h2>
                            <p className="text-indigo-200/50 text-xs px-4">
                                Tu cerebro no necesita recordar esto mientras duermes. Anótalo aquí y mañana nos ocupamos.
                            </p>
                        </div>

                        {!isSaved ? (
                            <div className="space-y-4 max-w-sm mx-auto w-full">
                                {tasks.map((task, index) => (
                                    <div key={task.id} className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500/40 font-bold text-xs">
                                            {index + 1}.
                                        </div>
                                        <input
                                            type="text"
                                            value={task.text}
                                            onChange={(e) => handleTaskChange(task.id, e.target.value)}
                                            placeholder="Pendiente para mañana..."
                                            className="w-full bg-[#131628] border border-indigo-900/50 rounded-2xl py-4 pl-10 pr-4 text-sm text-indigo-100 placeholder:text-indigo-800 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                        />
                                    </div>
                                ))}

                                <button
                                    onClick={saveTasks}
                                    className="w-full mt-6 py-4 rounded-2xl bg-indigo-900/30 hover:bg-indigo-800/40 border border-indigo-500/20 text-indigo-300 font-medium text-sm transition-all"
                                >
                                    Guardar y apagar mi mente
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-6">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Guardado en tu caja fuerte.</h3>
                                <p className="text-indigo-200/40 text-sm">Ya puedes descansar tranquilo.</p>
                            </div>
                        )}
                    </div>
                )}


                {/* --- ORIGINAL PANIC RESCUES --- */}
                {view === 'panic_menu' && (
                    <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center text-center min-h-[60vh]">
                        <h2 className="text-2xl font-medium text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>¿Te has despertado con pánico?</h2>
                        <p className="text-indigo-300/40 text-sm leading-relaxed mb-10 max-w-xs mx-auto italic">
                            Es natural. Por la noche el miedo parece más grande, pero sigues a salvo hoy. No enciendas luces fuertes.
                        </p>

                        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                            <button
                                className="bg-[#131628] py-5 rounded-2xl border border-indigo-900/50 hover:border-indigo-500/50 text-white text-sm font-medium hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                                onClick={() => setView('ground')}
                            >
                                Técnica de la mecedora
                            </button>
                            <button
                                className="bg-[#131628] py-4 rounded-2xl border border-indigo-900/50 text-orange-200/60 hover:text-orange-200 hover:border-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                                onClick={() => setView('light')}
                            >
                                <Sun size={16} /> Luz de compañía
                            </button>
                        </div>
                    </div>
                )}

                {view === 'ground' && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col items-center justify-center min-h-[70vh] text-center">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mx-auto mb-8 animate-[bounce_3s_infinite]">
                            <Wind size={32} />
                        </div>
                        <h2 className="text-3xl font-medium text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>Mécete suavemente</h2>
                        <p className="text-indigo-200/60 text-base leading-relaxed mb-10">
                            Siéntate o quédate en la cama. Balancea tu torso muy despacio de izquierda a derecha.
                            Siente el peso de tu cuerpo apoyado y seguro.
                        </p>
                        <div className="bg-[#131628] p-8 rounded-[32px] border border-indigo-900/50 italic text-sm text-indigo-300/50 leading-relaxed mb-6 max-w-sm mx-auto">
                            &quot;Mi cuerpo sabe descansar. Estas sensaciones son solo restos de adrenalina. Mi cama es un lugar de paz.&quot;
                        </div>
                    </div>
                )}

                {view === 'light' && (
                    <div className="animate-in fade-in duration-1000 fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1205]">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                            <div className="w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-[100px] absolute top-1/3 left-1/3 animate-[pulse_4s_infinite] delay-700"></div>
                        </div>

                        <div className="relative z-10 text-center p-8">
                            <div className="flex items-center justify-center gap-2 text-orange-200/40 font-medium italic text-sm mb-4">
                                <Sparkles size={16} />
                                Luz cálida para calmar...
                            </div>
                            <div className="text-orange-200/20 text-[10px] uppercase tracking-widest font-bold">Inhala y exhala con la luz</div>

                            <button
                                className="mt-48 px-10 py-4 rounded-2xl border border-orange-200/20 text-orange-200/40 text-xs hover:text-orange-200 hover:border-orange-200/40 active:scale-95 transition-all"
                                onClick={() => setView('menu')}
                            >
                                Apagar luz
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

