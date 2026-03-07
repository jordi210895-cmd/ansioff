'use client';

import { useState, useEffect } from 'react';
import { PenLine, Trash2, Calendar, Loader2, Sparkles, AlertCircle, BrainCircuit } from 'lucide-react';
import TopBar from './TopBar';

interface Note {
    id: number;
    text: string;
    created_at: string;
}

interface AIResult {
    triggers: string[];
    emotion_summary: string;
    recommendation: string;
}

interface NotesScreenProps {
    onBack: () => void;
}

export default function NotesScreen({ onBack }: NotesScreenProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [inputText, setInputText] = useState('');
    const [saving, setSaving] = useState(false);

    // AI State
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState<AIResult | null>(null);
    const [aiError, setAiError] = useState('');

    const loadNotes = () => {
        setLoading(true);
        try {
            const stored = localStorage.getItem('ansioff_notes');
            if (stored) {
                const parsed = JSON.parse(stored);
                setNotes(parsed.sort((a: Note, b: Note) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
            }
        } catch (e) {
            console.error('Error loading notes from localStorage', e);
        }
        setLoading(false);
    };

    useEffect(() => { loadNotes(); }, []);

    const handleSave = () => {
        if (!inputText.trim()) return;
        setSaving(true);

        try {
            const newNote: Note = {
                id: Date.now(),
                text: inputText.trim(),
                created_at: new Date().toISOString()
            };

            const updatedNotes = [newNote, ...notes];
            localStorage.setItem('ansioff_notes', JSON.stringify(updatedNotes));
            setNotes(updatedNotes);
            setInputText('');
            setShowEditor(false);
        } catch (e) {
            console.error('Error saving note', e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id: number) => {
        const updatedNotes = notes.filter(n => n.id !== id);
        localStorage.setItem('ansioff_notes', JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
    };

    const fmtDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) +
            ' · ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    };

    const handleAnalyze = async () => {
        if (notes.length === 0) return;
        setAiLoading(true);
        setAiError('');
        setAiResult(null);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes })
            });
            const data = await res.json();

            if (!res.ok) {
                setAiError(data.error || 'No se pudo completar el análisis.');
            } else {
                setAiResult(data);
            }
        } catch (err) {
            setAiError('Error de conexión con el Asistente Clínico.');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
            <TopBar title="Diario de Calma" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
                <div className="mt-6 mb-10">
                    <button
                        onClick={() => setShowEditor(true)}
                        className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-[2rem] py-6 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/20"
                    >
                        <PenLine size={24} strokeWidth={2.5} />
                        <span className="text-lg font-semibold">Escribir nueva nota</span>
                    </button>
                </div>

                {showEditor && (
                    <div className="mb-10 p-8 bg-slate-900/60 backdrop-blur-xl border-2 border-blue-500/30 rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-500 shadow-2xl">
                        <div className="flex items-center gap-3 text-blue-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Calendar size={14} />
                            </div>
                            {fmtDate(new Date().toISOString())}
                        </div>
                        <textarea
                            className="w-full bg-transparent text-white placeholder-slate-600 border-none outline-none resize-none text-lg leading-relaxed mb-6 min-h-[160px]"
                            style={{ fontFamily: 'Georgia, serif' }}
                            placeholder="¿Cómo te sientes en este momento? No sientas presión, solo deja fluir tus pensamientos..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowEditor(false)}
                                className="px-6 py-3 text-slate-500 text-sm font-semibold hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-10 py-3 bg-white text-slate-950 text-sm font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-60"
                            >
                                {saving && <Loader2 size={14} className="animate-spin" />}
                                Guardar nota
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 size={28} className="animate-spin text-blue-500/40" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {notes.length > 0 && (
                            <div className="mb-10">
                                {!aiResult && !aiLoading && !aiError && (
                                    <button
                                        onClick={handleAnalyze}
                                        className="w-full glass p-5 rounded-3xl flex items-center justify-between group hover:border-indigo-500/40 transition-all active:scale-[0.98] shadow-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                <Sparkles size={24} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-white font-medium text-base mb-1" style={{ fontFamily: 'Georgia, serif' }}>Analizar mis patrones</h3>
                                                <p className="text-slate-400 text-xs">La IA leerá tu diario para encontrar desencadenantes invisibles.</p>
                                            </div>
                                        </div>
                                    </button>
                                )}

                                {aiLoading && (
                                    <div className="w-full glass-primary p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl animate-pulse">
                                        <BrainCircuit size={40} className="text-white/80 mb-4 animate-bounce" />
                                        <h3 className="text-white font-medium text-lg mb-2" style={{ fontFamily: 'Georgia, serif' }}>Analizando tu mente...</h3>
                                        <p className="text-blue-100/70 text-sm">Buscando conexiones y patrones emocionales en tus textos.</p>
                                    </div>
                                )}

                                {aiError && (
                                    <div className="w-full bg-red-950/40 border border-red-500/30 p-6 rounded-3xl flex items-start gap-4">
                                        <AlertCircle size={24} className="text-red-400 shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-red-400 font-medium text-base mb-1">Error de Análisis</h3>
                                            <p className="text-red-300/70 text-sm leading-relaxed mb-3">{aiError}</p>
                                            <button onClick={() => setAiError('')} className="text-red-400 text-xs font-bold uppercase tracking-widest hover:text-red-300">Cerrar</button>
                                        </div>
                                    </div>
                                )}

                                {aiResult && (
                                    <div className="w-full glass-primary p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
                                                <Sparkles size={20} />
                                            </div>
                                            <h3 className="text-2xl font-light text-white" style={{ fontFamily: 'Georgia, serif' }}>Informe Cognitivo</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-blue-200/60 text-[10px] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                                                    <AlertCircle size={12} /> Desencadenantes Detectados
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {aiResult.triggers.map((trigger, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-blue-900/50 border border-blue-400/20 rounded-xl text-blue-100 text-xs font-medium">
                                                            {trigger}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-blue-200/60 text-[10px] uppercase font-bold tracking-widest mb-2">Resumen Emocional</div>
                                                <p className="text-white/90 text-sm leading-relaxed italic">
                                                    "{aiResult.emotion_summary}"
                                                </p>
                                            </div>

                                            <div className="bg-white/10 rounded-2xl p-5 border border-white/5">
                                                <div className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-2">Recomendación Clínica</div>
                                                <p className="text-white text-sm font-medium leading-relaxed">
                                                    {aiResult.recommendation}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setAiResult(null)}
                                            className="w-full mt-6 py-4 bg-blue-900/40 hover:bg-blue-900/60 text-blue-200 text-sm font-bold rounded-2xl transition-colors"
                                        >
                                            Entendido
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {notes.map((note) => (
                            <div key={note.id} className="group relative bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 hover:border-blue-500/30 p-8 rounded-[2rem] transition-all hover:translate-y-[-2px] shadow-lg">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{fmtDate(note.created_at)}</span>
                                    </div>
                                    <button
                                        className="p-2 text-slate-700 hover:text-red-400 transition-colors opacity-40 group-hover:opacity-100"
                                        onClick={() => handleDelete(note.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap italic opacity-90" style={{ fontFamily: 'Georgia, serif' }}>
                                    "{note.text}"
                                </div>
                            </div>
                        ))}

                        {notes.length === 0 && !showEditor && (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700 mb-6 shadow-inner">
                                    <PenLine size={40} />
                                </div>
                                <h4 className="text-lg text-slate-400 font-medium mb-2">Tu diario de calma espera</h4>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-[260px]">
                                    Anímate a soltar tus pensamientos y encontrar alivio en la escritura consciente.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
