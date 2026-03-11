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
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title={view === 'menu' ? "Descanso" : "Modo Noche"} onBack={view === 'menu' ? onBack : () => setView('menu')} />

            <div className="flex-1 overflow-y-auto px-5 pb-24 pt-4">

                {/* --- MAIN MENU --- */}
                {view === 'menu' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="text-center mb-8 mt-4">
                            <div className="w-16 h-16 rounded-full bg-[#5aadcf]/5 flex items-center justify-center text-[#5aadcf] mx-auto mb-4 border border-[#5aadcf]/10 shadow-[0_0_20px_rgba(90,173,207,0.1)]">
                                <Moon size={28} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-3xl font-light text-[#ddeef5] mb-2 font-serif italic">Buenas noches</h2>
                            <p className="font-sans font-light text-[rgba(200,225,235,0.38)] text-sm max-w-[200px] mx-auto leading-relaxed">
                                Prepara tu cuerpo y mente para un descanso profundo.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#5aadcf]/60 ml-2 mb-2">Micro-Hábitos de Sueño</div>

                            <button
                                className="w-full bg-[rgba(255,255,255,0.04)] p-5 rounded-2xl border border-[rgba(255,255,255,0.07)] text-left hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-transform duration-200 hover:-translate-y-0.5 group flex items-start gap-4 shadow-sm"
                                onClick={() => handleStartRoutine('routine_relax')}
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#5aadcf]/10 flex items-center justify-center text-[#5aadcf] shrink-0 group-hover:scale-110 transition-transform">
                                    <Bed size={22} className="stroke-[1.5]" />
                                </div>
                                <div>
                                    <h3 className="font-sans font-medium text-[15px] text-[#ddeef5] mb-1">Relajación Física</h3>
                                    <p className="font-sans font-light text-xs text-[rgba(200,225,235,0.38)] leading-relaxed">3 min. Respiración 4-2-6 y escaneo corporal para aflojar la tensión.</p>
                                </div>
                            </button>

                            <button
                                className="w-full bg-[rgba(255,255,255,0.04)] p-5 rounded-2xl border border-[rgba(255,255,255,0.07)] text-left hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-transform duration-200 hover:-translate-y-0.5 group flex items-start gap-4 shadow-sm"
                                onClick={() => handleStartRoutine('routine_unload')}
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#6bbf8e]/10 flex items-center justify-center text-[#6bbf8e] shrink-0 group-hover:scale-110 transition-transform">
                                    <PenLine size={22} className="stroke-[1.5]" />
                                </div>
                                <div>
                                    <h3 className="font-sans font-medium text-[15px] text-[#ddeef5] mb-1">Vaciado Mental</h3>
                                    <p className="font-sans font-light text-xs text-[rgba(200,225,235,0.38)] leading-relaxed">3 min. Anota 3 cosas para mañana y libera tu cerebro de preocupaciones.</p>
                                </div>
                            </button>

                            {onNav && (
                                <button
                                    className="w-full bg-[rgba(255,255,255,0.04)] p-5 rounded-2xl border border-[rgba(255,255,255,0.07)] text-left hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-transform duration-200 hover:-translate-y-0.5 group flex items-start gap-4 mt-2 shadow-sm"
                                    onClick={() => onNav('sc-audio')}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] shrink-0 group-hover:scale-110 transition-transform">
                                        <Headphones size={22} className="stroke-[1.5]" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-sans font-medium text-[15px] text-[#ddeef5] mb-1">Historias y Sonidos</h3>
                                        <p className="font-sans font-light text-xs text-[rgba(200,225,235,0.38)] leading-relaxed">Escucha frecuencias bajas y ruido blanco para conciliar el sueño.</p>
                                    </div>
                                </button>
                            )}

                            <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.07)]">
                                <button
                                    className="w-full bg-[#d97c6a]/10 p-5 rounded-2xl border border-[#d97c6a]/20 text-left hover:bg-[#d97c6a]/15 hover:border-[#d97c6a]/30 transition-transform duration-200 hover:-translate-y-0.5 group flex items-center gap-4 shadow-sm"
                                    onClick={() => setView('panic_menu')}
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#d97c6a]/20 flex items-center justify-center text-[#d97c6a] shrink-0">
                                        <ShieldAlert size={20} className="stroke-[1.5]" />
                                    </div>
                                    <div>
                                        <h3 className="font-sans font-semibold text-[13px] text-[#d97c6a] mb-0.5">Crisis Nocturna</h3>
                                        <p className="font-sans font-light text-[11px] text-[#d97c6a]/70">Si te has despertado con pánico</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* --- HYGIENE ALERT MODAL --- */}
                {view === 'hygiene_alert' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center text-center h-full min-h-[60vh]">
                        <div className="w-20 h-20 bg-[#5aadcf]/5 rounded-full flex items-center justify-center text-[#5aadcf] mb-8 overflow-hidden relative border border-[#5aadcf]/10">
                            <div className="absolute inset-0 bg-[#5aadcf]/10 blur-xl animate-pulse"></div>
                            <Moon size={32} className="relative z-10 stroke-[1.5]" />
                        </div>

                        <h2 className="text-3xl font-light text-[#ddeef5] mb-6 font-serif italic">Preparando el entorno</h2>

                        <ul className="text-left space-y-4 mb-12 font-sans font-light text-[15px] text-[rgba(200,225,235,0.8)] max-w-[260px] mx-auto">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#5aadcf]"></div> Bajar el brillo de la pantalla
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#5aadcf]"></div> Activar "No Molestar"
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#5aadcf]"></div> Estar ya en la cama
                            </li>
                        </ul>

                        <button
                            className="w-full max-w-[260px] py-4 rounded-full bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f] font-sans font-semibold text-xs tracking-wider transition-colors shadow-lg mx-auto"
                            onClick={confirmHygiene}
                        >
                            Listo, empezar rutina
                        </button>
                    </div>
                )}


                {/* --- ROUTINE 1: RELAXATION --- */}
                {view === 'routine_relax' && (
                    <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[70vh] text-center">
                        <div className="relative w-48 h-48 flex items-center justify-center mb-12">
                            {/* Dark breathing circles */}
                            <div className="absolute inset-0 bg-[#5aadcf]/5 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                            <div className="absolute inset-4 bg-[#5aadcf]/10 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-1000"></div>
                            <div className="w-24 h-24 bg-[#0e1d2e] rounded-full z-10 flex items-center justify-center border border-[#5aadcf]/20 shadow-sm">
                                <Wind size={32} className="text-[#5aadcf] opacity-80 stroke-[1.5]" />
                            </div>
                        </div>

                        <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#5aadcf]/80 mb-4">Respiración 4 - 2 - 6</div>
                        <h2 className="text-3xl font-light text-[#ddeef5] mb-4 leading-relaxed font-serif italic">
                            Inhala suavemente,<br />exhala la tensión.
                        </h2>

                        <p className="font-sans font-light text-[13px] text-[rgba(200,225,235,0.38)] leading-relaxed max-w-[250px] mx-auto mt-8 border-t border-[rgba(255,255,255,0.07)] pt-8">
                            <b className="font-medium text-[rgba(200,225,235,0.8)]">Paso 2:</b> Cuando termines, escanea tu cuerpo desde los pies hasta la mandíbula. Imagina que cada músculo se derrite sobre el colchón.
                        </p>
                    </div>
                )}


                {/* --- ROUTINE 2: MENTAL UNLOAD --- */}
                {view === 'routine_unload' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[70vh] flex flex-col">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-light text-[#ddeef5] mb-2 font-serif italic">Vaciado Mental</h2>
                            <p className="font-sans font-light text-[13px] text-[rgba(200,225,235,0.38)] px-4 max-w-[280px] mx-auto leading-relaxed">
                                Tu cerebro no necesita recordar esto mientras duermes. Anótalo aquí y mañana nos ocupamos.
                            </p>
                        </div>

                        {!isSaved ? (
                            <div className="space-y-4 max-w-sm mx-auto w-full">
                                {tasks.map((task, index) => (
                                    <div key={task.id} className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 font-sans font-medium text-xs text-[#5aadcf]/40">
                                            {index + 1}.
                                        </div>
                                        <input
                                            type="text"
                                            value={task.text}
                                            onChange={(e) => handleTaskChange(task.id, e.target.value)}
                                            placeholder="Pendiente para mañana..."
                                            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl py-4 pl-10 pr-4 font-sans font-light text-sm text-[#ddeef5] placeholder:text-[rgba(200,225,235,0.2)] focus:outline-none focus:border-[#5aadcf]/50 transition-colors shadow-sm"
                                        />
                                    </div>
                                ))}

                                <button
                                    onClick={saveTasks}
                                    className="w-full mt-6 py-4 rounded-full bg-transparent hover:border-[#5aadcf] border border-[rgba(255,255,255,0.07)] text-[#5aadcf] font-sans font-semibold text-xs tracking-wider transition-colors"
                                >
                                    Guardar y apagar mi mente
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
                                <div className="w-16 h-16 bg-[#6bbf8e]/10 border border-[#6bbf8e]/20 rounded-full flex items-center justify-center text-[#6bbf8e] mb-6 shadow-sm">
                                    <CheckCircle2 size={32} className="stroke-[1.5]" />
                                </div>
                                <h3 className="text-2xl text-[#ddeef5] mb-2 font-serif italic font-light">Guardado en tu caja fuerte.</h3>
                                <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)]">Ya puedes descansar tranquilo.</p>
                            </div>
                        )}
                    </div>
                )}


                {/* --- ORIGINAL PANIC RESCUES --- */}
                {view === 'panic_menu' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center justify-center text-center min-h-[60vh]">
                        <h2 className="text-3xl font-light text-[#ddeef5] mb-4 font-serif italic">¿Te has despertado con pánico?</h2>
                        <p className="font-sans font-light text-[13px] text-[rgba(200,225,235,0.38)] leading-relaxed mb-10 max-w-xs mx-auto">
                            Es natural. Por la noche el miedo parece más grande, pero sigues a salvo hoy. No enciendas luces fuertes.
                        </p>

                        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                            <button
                                className="bg-[rgba(255,255,255,0.04)] py-5 rounded-2xl border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[#d97c6a]/30 text-[#ddeef5] font-sans font-medium text-[15px] transition-colors shadow-sm"
                                onClick={() => setView('ground')}
                            >
                                Técnica de la mecedora
                            </button>
                            <button
                                className="bg-[rgba(255,255,255,0.04)] py-5 rounded-2xl border border-[rgba(255,255,255,0.07)] text-[#c9a96e] hover:bg-[rgba(255,255,255,0.06)] hover:border-[#c9a96e]/30 transition-colors flex items-center justify-center gap-2 font-sans font-medium text-[15px] shadow-sm"
                                onClick={() => setView('light')}
                            >
                                <Sun size={18} className="stroke-[1.5]" /> Luz de compañía
                            </button>
                        </div>
                    </div>
                )}

                {view === 'ground' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center min-h-[70vh] text-center">
                        <div className="w-16 h-16 bg-[#5aadcf]/10 border border-[#5aadcf]/20 rounded-full flex items-center justify-center text-[#5aadcf] mx-auto mb-8 animate-[bounce_3s_infinite] shadow-sm">
                            <Wind size={28} className="stroke-[1.5]" />
                        </div>
                        <h2 className="text-3xl font-light text-[#ddeef5] mb-6 font-serif italic">Mécete suavemente</h2>
                        <p className="font-sans font-light text-[15px] text-[rgba(200,225,235,0.8)] leading-relaxed mb-10">
                            Siéntate o quédate en la cama. Balancea tu torso muy despacio de izquierda a derecha.
                            Siente el peso de tu cuerpo apoyado y seguro.
                        </p>
                        <div className="bg-[rgba(255,255,255,0.04)] p-8 rounded-2xl border border-[rgba(255,255,255,0.07)] font-sans font-light italic text-sm text-[rgba(200,225,235,0.8)] leading-relaxed mb-6 max-w-sm mx-auto shadow-sm">
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

