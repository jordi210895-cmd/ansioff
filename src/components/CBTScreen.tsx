'use client';

import { useState, useEffect } from 'react';
import { Brain, ArrowRight, CheckCircle2, Quote, Clock, ChevronDown, ChevronUp, Trash2, BookOpen } from 'lucide-react';
import TopBar from './TopBar';
import { supabase } from '@/lib/supabase';

interface CBTScreenProps {
    onBack: () => void;
}

interface CBTRecord {
    id: number;
    thought: string;
    distortion: string | null;
    evidence: string;
    alternative: string;
    created_at: string;
}

const DISTORTIONS = [
    { t: 'Catastrofismo', d: 'Imaginar el peor escenario posible' },
    { t: 'Clarividencia', d: 'Creer que sabes el futuro' },
    { t: 'Todo o Nada', d: 'Ver las cosas en blanco o negro' },
    { t: 'Personalización', d: 'Atribuirse culpas sin pruebas' },
];

function generateAlternative(thought: string, evidence: string, distortion: string): string {
    return `He identificado que este pensamiento ("${thought.slice(0, 60)}${thought.length > 60 ? '...' : ''}") cae en un patrón de ${distortion}. Sin embargo, la evidencia me dice: ${evidence.slice(0, 100)}${evidence.length > 100 ? '...' : ''}. Esta sensación es real pero no refleja la realidad objetiva. Puedo manejarlo.`;
}

export default function CBTScreen({ onBack }: CBTScreenProps) {
    const [view, setView] = useState<'form' | 'history'>('form');
    const [step, setStep] = useState(0);
    const [thought, setThought] = useState('');
    const [distortion, setDistortion] = useState('');
    const [evidence, setEvidence] = useState('');
    const [alternative, setAlternative] = useState('');
    const [saving, setSaving] = useState(false);
    const [records, setRecords] = useState<CBTRecord[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const loadHistory = async () => {
        setLoadingHistory(true);
        const { data, error } = await supabase
            .from('cbt_records')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);
        if (!error && data) setRecords(data);
        setLoadingHistory(false);
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const next = () => setStep(s => s + 1);

    const selectDistortion = (d: string) => {
        setDistortion(d);
        next();
    };

    const handleFinish = async () => {
        const alt = generateAlternative(thought, evidence, distortion);
        setAlternative(alt);
        setSaving(true);

        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('cbt_records').insert({
            thought,
            distortion,
            evidence,
            alternative: alt,
            user_id: user?.id,
        });

        setSaving(false);
        loadHistory();
        next();
    };

    const handleDelete = async (id: number) => {
        await supabase.from('cbt_records').delete().eq('id', id);
        setRecords(prev => prev.filter(r => r.id !== id));
    };

    const reset = () => {
        setStep(0);
        setThought('');
        setDistortion('');
        setEvidence('');
        setAlternative('');
        setView('form');
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
            + ' · ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
            <TopBar title="Técnicas TCC" onBack={onBack} />

            {/* Tab Toggle */}
            <div className="flex px-6 gap-2 mt-4 mb-2">
                <button
                    onClick={() => setView('form')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${view === 'form' ? 'bg-blue-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                    Nuevo Registro
                </button>
                <button
                    onClick={() => { setView('history'); loadHistory(); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${view === 'history' ? 'bg-blue-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                    <BookOpen size={14} />
                    Historial {records.length > 0 && <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full">{records.length}</span>}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24">

                {/* ── FORM VIEW ── */}
                {view === 'form' && (
                    <>
                        <div className="text-blue-500 text-[10px] uppercase tracking-widest font-bold mt-4 mb-6">Registro de Pensamientos</div>

                        {step === 0 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-3xl font-medium mb-4" style={{ fontFamily: 'Georgia, serif' }}>¿Qué estás pensando ahora?</h2>
                                <p className="text-blue-300/60 text-sm mb-8 leading-relaxed">
                                    Escribe ese pensamiento negativo que te está generando ansiedad. Intenta ser muy concreto.
                                </p>
                                <textarea
                                    className="w-full bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 focus:border-blue-500/30 rounded-3xl p-6 text-white text-base min-h-[160px] outline-none transition-all placeholder:text-slate-600 shadow-inner"
                                    placeholder="Ej: Siento que me voy a desmayar y nadie me va a ayudar..."
                                    value={thought}
                                    onChange={(e) => setThought(e.target.value)}
                                />
                                <button
                                    disabled={!thought}
                                    className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-2xl py-4 flex items-center justify-center gap-2 mt-8 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-20 disabled:grayscale shadow-lg shadow-blue-600/20"
                                    onClick={next}
                                >
                                    <span className="font-medium">Identificar distorsión</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-3xl font-medium mb-4" style={{ fontFamily: 'Georgia, serif' }}>Cuestiona la lógica</h2>
                                <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl mb-8 flex gap-3">
                                    <Quote className="text-blue-500/30 shrink-0" size={20} />
                                    <p className="text-blue-100/70 text-sm italic">&quot;{thought}&quot;</p>
                                </div>
                                <p className="text-blue-300/60 text-sm mb-6 leading-relaxed">
                                    ¿Qué error de razonamiento detectas en este pensamiento?
                                </p>
                                <div className="grid grid-cols-1 gap-3">
                                    {DISTORTIONS.map((d) => (
                                        <button
                                            key={d.t}
                                            className="w-full p-5 bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl text-left hover:border-blue-500/30 transition-all hover:translate-y-[-2px] group shadow-sm"
                                            onClick={() => selectDistortion(d.t)}
                                        >
                                            <div className="text-sm font-medium text-white mb-1 group-hover:text-blue-400">{d.t}</div>
                                            <div className="text-[11px] text-slate-500">{d.d}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-3xl font-medium mb-4" style={{ fontFamily: 'Georgia, serif' }}>Evidencia en contra</h2>
                                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl mb-6 flex gap-2 items-center">
                                    <span className="text-xs text-blue-400 font-medium">Distorsión detectada:</span>
                                    <span className="text-xs text-white bg-blue-500/20 px-2 py-0.5 rounded-full">{distortion}</span>
                                </div>
                                <p className="text-blue-300/60 text-sm mb-8 leading-relaxed">
                                    ¿Cuántas veces has pensado eso y cuántas se ha cumplido de verdad? Busca pruebas reales de que NO va a pasar.
                                </p>
                                <textarea
                                    className="w-full bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 focus:border-blue-500/30 rounded-3xl p-6 text-white text-base min-h-[160px] outline-none transition-all placeholder:text-slate-600 shadow-inner"
                                    placeholder="Ej: He sentido esto muchas veces y NUNCA ha ocurrido nada malo. Mi cuerpo es fuerte..."
                                    value={evidence}
                                    onChange={(e) => setEvidence(e.target.value)}
                                />
                                <button
                                    disabled={!evidence || saving}
                                    className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-2xl py-4 flex items-center justify-center gap-2 mt-8 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-20 disabled:grayscale shadow-lg shadow-blue-600/20"
                                    onClick={handleFinish}
                                >
                                    <span className="font-medium">{saving ? 'Guardando...' : 'Crear pensamiento sano'}</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="glass-primary p-8 rounded-[40px] mb-8 relative overflow-hidden text-center">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                                    <CheckCircle2 className="text-white mx-auto mb-6" size={32} />
                                    <h2 className="text-3xl font-medium mb-6 text-white" style={{ fontFamily: 'Georgia, serif' }}>Pensamiento Sano</h2>
                                    <p className="text-white/90 text-base italic leading-relaxed mb-8">
                                        &quot;{alternative}&quot;
                                    </p>
                                    <div className="h-px bg-slate-800 w-full mb-4"></div>
                                    <div className="flex items-center gap-2 text-green-400/70 text-xs">
                                        <CheckCircle2 size={12} />
                                        <span>Registro guardado en tu historial</span>
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-2xl py-4 font-medium transition-all active:scale-95 mb-3"
                                    onClick={reset}
                                >
                                    Nuevo registro
                                </button>
                                <button
                                    className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-2xl py-4 font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
                                    onClick={() => { setView('history'); setStep(0); }}
                                >
                                    <BookOpen size={16} />
                                    Ver historial
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* ── HISTORY VIEW ── */}
                {view === 'history' && (
                    <div className="mt-4">
                        {loadingHistory ? (
                            <div className="text-center text-slate-500 py-16 text-sm">Cargando...</div>
                        ) : records.length === 0 ? (
                            <div className="text-center py-16">
                                <Brain className="mx-auto text-slate-700 mb-4" size={40} />
                                <p className="text-slate-500 text-sm">Aún no hay registros.</p>
                                <p className="text-slate-600 text-xs mt-1">Completa tu primer ejercicio TCC.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {records.map((r) => (
                                    <div
                                        key={r.id}
                                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
                                    >
                                        {/* Header */}
                                        <button
                                            className="w-full p-4 text-left flex items-start justify-between gap-3"
                                            onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Clock size={11} className="text-blue-500/60 shrink-0" />
                                                    <span className="text-[10px] text-slate-500">{formatDate(r.created_at)}</span>
                                                    {r.distortion && (
                                                        <span className="text-[9px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded-full">{r.distortion}</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-300 truncate">"{r.thought}"</p>
                                            </div>
                                            <div className="shrink-0 text-slate-600 mt-1">
                                                {expandedId === r.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </div>
                                        </button>

                                        {/* Expanded */}
                                        {expandedId === r.id && (
                                            <div className="px-4 pb-4 border-t border-slate-800/60 pt-4 space-y-4 animate-in fade-in duration-200">
                                                <div>
                                                    <div className="text-[10px] text-blue-500/60 uppercase tracking-wider mb-1">Evidencia en contra</div>
                                                    <p className="text-sm text-slate-300 leading-relaxed">{r.evidence}</p>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-green-500/60 uppercase tracking-wider mb-1">Pensamiento alternativo</div>
                                                    <p className="text-sm text-slate-200 italic leading-relaxed">"{r.alternative}"</p>
                                                </div>
                                                <button
                                                    className="flex items-center gap-1.5 text-red-400/60 hover:text-red-400 text-xs transition-colors"
                                                    onClick={() => handleDelete(r.id)}
                                                >
                                                    <Trash2 size={12} />
                                                    Eliminar registro
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
