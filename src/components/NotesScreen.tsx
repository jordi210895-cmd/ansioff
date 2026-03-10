'use client';

import { useState, useEffect } from 'react';
import { PenLine, FileText, ChevronRight, Lock, Brain, Sparkles, AlertCircle, Calendar, Loader2, BrainCircuit, Trash2 } from 'lucide-react';
import { addCbtEntry } from '../utils/stats';
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

            // Gamification
            addCbtEntry();

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
        <div className="flex flex-col h-full bg-[#06101a] text-white overflow-hidden">
            <TopBar title="Diario de Calma" onBack={onBack} />
            <div className="flex-1 overflow-y-auto screen-px pb-32 scrollbar-hide">
                <div className="mt-6 mb-10">
                    <button
                        onClick={() => setShowEditor(true)}
                        className="w-full bg-[#78b478]/15 hover:bg-[#78b478]/25 border border-[#78b478]/30 text-[#78b478] rounded-[24px] py-5 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                    >
                        <PenLine size={22} strokeWidth={2} />
                        <span className="text-[16px] font-medium tracking-[0.02em]">Escribir nueva nota</span>
                    </button>
                </div>

                {showEditor && (
                    <div className="mb-10 p-7 bg-[#1a2e42]/60 backdrop-blur-xl border border-white/10 rounded-[28px] animate-in fade-in zoom-in-95 duration-500 shadow-2xl">
                        <div className="flex items-center gap-3 text-[#78b478] text-[10px] uppercase tracking-[0.15em] font-medium mb-6">
                            <div className="p-2 bg-[#78b478]/15 rounded-lg">
                                <Calendar size={14} />
                            </div>
                            {fmtDate(new Date().toISOString())}
                        </div>
                        <textarea
                            className="w-full bg-transparent text-[#e8f4f8] placeholder-white/30 border-none outline-none resize-none text-[18px] leading-loose mb-6 min-h-[160px] pl-1 pr-2 font-serif italic"
                            placeholder="¿Cómo te sientes en este momento? No sientas presión, solo deja fluir tus pensamientos..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowEditor(false)}
                                className="px-5 py-2.5 text-white/50 text-[13px] font-medium hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-2.5 bg-[#78b478] text-[#0d1b2a] text-[14px] font-medium rounded-[16px] hover:bg-[#8bc98b] transition-colors flex items-center gap-2 disabled:opacity-60 shadow-lg shadow-[#78b478]/20"
                            >
                                {saving && <Loader2 size={14} className="animate-spin" />}
                                Guardar
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
                                        className="w-full bg-gradient-to-br from-[#1a2e42] to-[#1e3349] border border-white/5 p-5 rounded-[24px] flex items-center justify-between group hover:border-[#b48cdc]/40 transition-all active:scale-[0.98] shadow-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#b48cdc]/15 rounded-2xl flex items-center justify-center text-[#b48cdc] group-hover:scale-110 transition-transform">
                                                <Sparkles size={24} />
                                            </div>
                                            <div className="text-left pl-1">
                                                <h3 className="text-[#e8f4f8] font-serif text-[18px] mb-1">Analizar mis patrones</h3>
                                                <p className="text-[#e8f4f8]/50 text-[12px] leading-tight">La IA leerá tu diario para encontrar desencadenantes invisibles.</p>
                                            </div>
                                        </div>
                                    </button>
                                )}

                                {aiLoading && (
                                    <div className="w-full bg-gradient-to-br from-[#1a2e42] to-[#1e3349] border border-white/5 py-10 px-8 rounded-[24px] flex flex-col items-center justify-center text-center shadow-xl animate-pulse">
                                        <BrainCircuit size={40} className="text-[#b48cdc] mb-4 animate-bounce" />
                                        <h3 className="text-[#e8f4f8] font-serif text-[20px] mb-2 pl-1">Analizando tu mente...</h3>
                                        <p className="text-[#e8f4f8]/50 text-[13px]">Buscando conexiones y patrones emocionales en tus textos.</p>
                                    </div>
                                )}

                                {aiError && (
                                    <div className="w-full bg-[#e07d6a]/10 border border-[#e07d6a]/30 p-6 rounded-[24px] flex items-start gap-4">
                                        <AlertCircle size={24} className="text-[#e07d6a] shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-[#f0a898] font-medium text-[15px] mb-1">Error de Análisis</h3>
                                            <p className="text-[#f0a898]/70 text-[13px] leading-relaxed mb-3">{aiError}</p>
                                            <button onClick={() => setAiError('')} className="text-[#e07d6a] text-[11px] font-bold uppercase tracking-widest hover:text-white">Cerrar</button>
                                        </div>
                                    </div>
                                )}

                                {aiResult && (
                                    <div className="w-full bg-gradient-to-br from-[#1a2e42] to-[#1e3349] border border-white/5 p-8 rounded-[32px] shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#b48cdc]/10 rounded-full blur-3xl pointer-events-none"></div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-[#b48cdc]/20 rounded-full flex items-center justify-center text-[#b48cdc] shrink-0">
                                                <Sparkles size={20} />
                                            </div>
                                            <h3 className="text-[24px] font-serif text-[#e8f4f8] pl-1">Informe Cognitivo</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-white/40 text-[10px] uppercase font-bold tracking-[0.15em] mb-2 flex items-center gap-2">
                                                    <AlertCircle size={12} /> Desencadenantes Detectados
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {aiResult.triggers.map((trigger, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-[#e07d6a]/15 border border-[#e07d6a]/20 rounded-xl text-[#f0a898] text-[11px] font-medium">
                                                            {trigger}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-white/40 text-[10px] uppercase font-bold tracking-[0.15em] mb-2 pl-1">Resumen Emocional</div>
                                                <p className="text-[#e8f4f8] text-[14px] leading-loose italic pl-1 font-serif">
                                                    "{aiResult.emotion_summary}"
                                                </p>
                                            </div>

                                            <div className="bg-white/5 rounded-[20px] p-6 border border-white/5">
                                                <div className="text-[#7ec8e3]/60 text-[10px] uppercase font-bold tracking-[0.15em] mb-2">Recomendación Clínica</div>
                                                <p className="text-[#e8f4f8] text-[13px] leading-loose pl-1 pr-2">
                                                    {aiResult.recommendation}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setAiResult(null)}
                                            className="w-full mt-6 py-3.5 bg-[#b48cdc]/20 hover:bg-[#b48cdc]/30 text-[#e8f4f8] border border-[#b48cdc]/30 text-[13px] font-medium rounded-[16px] transition-colors"
                                        >
                                            Entendido
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {notes.map((note) => (
                            <div key={note.id} className="group relative bg-[#1a2e42]/30 backdrop-blur-sm border border-white/5 hover:border-[#78b478]/30 p-7 rounded-[28px] transition-all hover:translate-y-[-2px] shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-[5px] h-[5px] rounded-full bg-[#78b478] shadow-[0_0_8px_rgba(120,180,120,0.8)]" />
                                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.1em]">{fmtDate(note.created_at)}</span>
                                    </div>
                                    <button
                                        className="p-2 text-white/30 hover:text-[#e07d6a] transition-colors opacity-40 group-hover:opacity-100"
                                        onClick={() => handleDelete(note.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="text-[#e8f4f8]/90 text-[16px] leading-[1.8] whitespace-pre-wrap italic pl-1 pr-2 font-serif">
                                    "{note.text}"
                                </div>
                            </div>
                        ))}

                        {notes.length === 0 && !showEditor && (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-[24px] flex items-center justify-center text-white/30 mb-6 shadow-inner">
                                    <PenLine size={32} />
                                </div>
                                <h4 className="text-[18px] text-[#e8f4f8]/80 font-medium font-serif mb-2">Tu diario de calma espera</h4>
                                <p className="text-[#e8f4f8]/40 text-[14px] leading-relaxed max-w-[260px]">
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
