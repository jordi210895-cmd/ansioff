'use client';

import { useState, useEffect } from 'react';
import { Brain, ArrowRight, CheckCircle2, Quote, Clock, ChevronDown, ChevronUp, Trash2, BookOpen } from 'lucide-react';
import TopBar from './TopBar';
import { supabase } from '@/lib/supabase';
import { addCbtEntry } from '../utils/stats'; // Added this import

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
        addCbtEntry(); // Gamification tracking
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
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Técnicas TCC" onBack={onBack} />

            {/* Tab Toggle */}
            <div className="flex px-5 gap-2 mt-4 mb-2">
                <button
                    onClick={() => setView('form')}
                    className={`flex-1 py-3 rounded-2xl font-sans font-semibold text-xs tracking-wider transition-colors ${view === 'form' ? 'bg-[#5aadcf] text-[#03080f]' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(200,225,235,0.38)] hover:text-[#ddeef5] border border-[rgba(255,255,255,0.07)]'}`}
                >
                    Nuevo Registro
                </button>
                <button
                    onClick={() => { setView('history'); loadHistory(); }}
                    className={`flex-1 py-3 rounded-2xl font-sans font-semibold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 ${view === 'history' ? 'bg-[#5aadcf] text-[#03080f]' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(200,225,235,0.38)] hover:text-[#ddeef5] border border-[rgba(255,255,255,0.07)]'}`}
                >
                    <BookOpen size={14} />
                    Historial {records.length > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${view === 'history' ? 'bg-[#03080f]/20' : 'bg-[rgba(255,255,255,0.1)]'}`}>{records.length}</span>}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-24">

                {/* ── FORM VIEW ── */}
                {view === 'form' && (
                    <>
                        <div className="text-[rgba(200,225,235,0.38)] text-[10px] uppercase tracking-widest font-bold mt-6 mb-6">Registro de Pensamientos</div>

                        {step === 0 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-3xl font-light mb-4 pl-1 font-serif italic text-[#ddeef5]">¿Qué estás pensando ahora?</h2>
                                <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] mb-8 leading-relaxed px-1">
                                    Escribe ese pensamiento negativo que te está generando ansiedad. Intenta ser muy concreto.
                                </p>
                                <textarea
                                    className="w-full bg-[#0e1d2e]/50 backdrop-blur-sm border border-[rgba(255,255,255,0.07)] focus:border-[#5aadcf]/50 rounded-[24px] p-6 text-[#ddeef5] font-sans text-[15px] min-h-[160px] outline-none transition-colors placeholder:text-[rgba(200,225,235,0.2)] shadow-inner leading-relaxed"
                                    placeholder="Ej: Siento que me voy a desmayar y nadie me va a ayudar..."
                                    value={thought}
                                    onChange={(e) => setThought(e.target.value)}
                                />
                                <button
                                    disabled={!thought}
                                    className="w-full bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f] font-sans font-semibold text-xs tracking-wider rounded-full py-4 flex items-center justify-center gap-2 mt-8 transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-lg"
                                    onClick={next}
                                >
                                    <span>Identificar distorsión</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-3xl font-light mb-4 pl-1 font-serif italic text-[#ddeef5]">Cuestiona la lógica</h2>
                                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-6 rounded-2xl mb-8 flex gap-3">
                                    <Quote className="text-[#5aadcf]/50 shrink-0" size={20} />
                                    <p className="font-sans text-[rgba(200,225,235,0.8)] text-[15px] italic leading-relaxed">&quot;{thought}&quot;</p>
                                </div>
                                <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] mb-6 leading-relaxed px-1">
                                    ¿Qué error de razonamiento detectas en este pensamiento?
                                </p>
                                <div className="grid grid-cols-1 gap-3">
                                    {DISTORTIONS.map((d) => (
                                        <button
                                            key={d.t}
                                            className="w-full p-5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl text-left hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-transform duration-200 hover:-translate-y-0.5 group shadow-sm"
                                            onClick={() => selectDistortion(d.t)}
                                        >
                                            <div className="font-sans font-medium text-[15px] text-[#ddeef5] mb-1 group-hover:text-[#89cee4] transition-colors">{d.t}</div>
                                            <div className="font-sans font-light text-xs text-[rgba(200,225,235,0.38)]">{d.d}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-3xl font-light mb-4 pl-1 font-serif italic text-[#ddeef5]">Evidencia en contra</h2>
                                <div className="bg-[#5aadcf]/10 border border-[#5aadcf]/20 p-5 rounded-2xl mb-6 flex gap-2 items-center">
                                    <span className="font-sans font-medium text-xs text-[#5aadcf]">Distorsión detectada:</span>
                                    <span className="font-sans font-medium text-[11px] text-[#03080f] bg-[#5aadcf] px-2.5 py-1 rounded-full">{distortion}</span>
                                </div>
                                <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] mb-8 leading-relaxed px-1">
                                    ¿Cuántas veces has pensado eso y cuántas se ha cumplido de verdad? Busca pruebas reales de que NO va a pasar.
                                </p>
                                <textarea
                                    className="w-full bg-[#0e1d2e]/50 backdrop-blur-sm border border-[rgba(255,255,255,0.07)] focus:border-[#5aadcf]/50 rounded-[24px] p-6 text-[#ddeef5] font-sans text-[15px] min-h-[160px] outline-none transition-colors placeholder:text-[rgba(200,225,235,0.2)] shadow-inner leading-relaxed"
                                    placeholder="Ej: He sentido esto muchas veces y NUNCA ha ocurrido nada malo. Mi cuerpo es fuerte..."
                                    value={evidence}
                                    onChange={(e) => setEvidence(e.target.value)}
                                />
                                <button
                                    disabled={!evidence || saving}
                                    className="w-full bg-[#5aadcf] hover:bg-[#89cee4] text-[#03080f] font-sans font-semibold text-xs tracking-wider rounded-full py-4 flex items-center justify-center gap-2 mt-8 transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-lg"
                                    onClick={handleFinish}
                                >
                                    <span>{saving ? 'Guardando...' : 'Crear pensamiento sano'}</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-[#6bbf8e]/10 border border-[#6bbf8e]/20 p-8 rounded-3xl mb-8 relative overflow-hidden text-center">
                                    <CheckCircle2 className="text-[#6bbf8e] mx-auto mb-6" size={32} />
                                    <h2 className="text-3xl font-light mb-6 text-[#ddeef5] font-serif italic">Pensamiento Sano</h2>
                                    <p className="font-sans font-light text-[15px] text-[rgba(200,225,235,0.8)] leading-relaxed italic mb-8 px-2">
                                        &quot;{alternative}&quot;
                                    </p>
                                    <div className="h-px bg-[rgba(255,255,255,0.07)] w-full mb-4"></div>
                                    <div className="flex items-center justify-center gap-2 text-[#6bbf8e]/80 text-[11px] uppercase tracking-widest font-bold">
                                        <CheckCircle2 size={12} />
                                        <span>Registro guardado en tu historial</span>
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.07)] text-[#ddeef5] rounded-full py-4 font-sans font-semibold text-xs tracking-wider transition-colors mb-3"
                                    onClick={reset}
                                >
                                    Nuevo registro
                                </button>
                                <button
                                    className="w-full bg-transparent border border-transparent hover:border-[rgba(255,255,255,0.1)] text-[#5aadcf] rounded-full py-4 font-sans font-semibold text-xs tracking-wider transition-colors flex items-center justify-center gap-2"
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
                    <div className="mt-6">
                        {loadingHistory ? (
                            <div className="text-center text-[rgba(200,225,235,0.38)] py-16 text-[13px] font-sans font-light">Cargando...</div>
                        ) : records.length === 0 ? (
                            <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <Brain className="mx-auto text-[rgba(200,225,235,0.2)] mb-6" size={48} />
                                <p className="font-sans font-light text-[15px] text-[#ddeef5] mb-2">Aún no hay registros.</p>
                                <p className="font-sans font-light text-[13px] text-[rgba(200,225,235,0.38)]">Completa tu primer ejercicio TCC.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {records.map((r, i) => (
                                    <div
                                        key={r.id}
                                        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden"
                                    >
                                        {/* Header */}
                                        <button
                                            className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                                            onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock size={12} className="text-[#5aadcf]/60 shrink-0" />
                                                    <span className="font-sans font-medium text-[10px] text-[rgba(200,225,235,0.38)] uppercase tracking-wider">{formatDate(r.created_at)}</span>
                                                    {r.distortion && (
                                                        <span className="font-sans font-semibold text-[9px] bg-[#5aadcf]/15 text-[#5aadcf] px-2 py-0.5 rounded-full">{r.distortion}</span>
                                                    )}
                                                </div>
                                                <p className="font-sans font-light text-[15px] text-[#ddeef5] truncate italic">"{r.thought}"</p>
                                            </div>
                                            <div className="shrink-0 text-[rgba(200,225,235,0.38)] mt-1">
                                                {expandedId === r.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </button>

                                        {/* Expanded */}
                                        {expandedId === r.id && (
                                            <div className="px-5 pb-5 border-t border-[rgba(255,255,255,0.07)] pt-5 space-y-5 bg-[rgba(255,255,255,0.02)] animate-in fade-in duration-200">
                                                <div>
                                                    <div className="font-sans font-bold text-[9px] text-[#5aadcf]/80 uppercase tracking-widest mb-1.5">Evidencia en contra</div>
                                                    <p className="font-sans font-light text-[14px] text-[rgba(200,225,235,0.8)] leading-relaxed">{r.evidence}</p>
                                                </div>
                                                <div className="p-4 bg-[rgba(255,255,255,0.03)] rounded-2xl border border-[rgba(255,255,255,0.05)]">
                                                    <div className="font-sans font-bold text-[9px] text-[#6bbf8e]/80 uppercase tracking-widest mb-1.5">Pensamiento alternativo</div>
                                                    <p className="font-sans font-light text-[14px] text-[#ddeef5] italic leading-relaxed">"{r.alternative}"</p>
                                                </div>
                                                <button
                                                    className="flex items-center gap-1.5 text-[#d97c6a]/60 hover:text-[#d97c6a] font-sans font-semibold text-[11px] uppercase tracking-widest transition-colors mt-2"
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
