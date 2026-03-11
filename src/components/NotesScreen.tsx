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
        <div className="flex flex-col h-full bg-[#03080f] text-[#ddeef5] overflow-hidden">
            <TopBar title="Diario de Calma" onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-5 pb-32 scrollbar-hide animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mt-4 mb-6">
                    <button
                        onClick={() => setShowEditor(true)}
                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-[#ddeef5] rounded-2xl py-5 flex items-center justify-center gap-3 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                        <PenLine size={22} strokeWidth={2} />
                        <span className="font-sans font-semibold text-xs tracking-wider">Escribir nueva nota</span>
                    </button>
                </div>

                {showEditor && (
                    <div className="mb-6 p-5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-3 text-[rgba(200,225,235,0.38)] text-[10px] uppercase tracking-widest font-medium mb-6">
                            <div className="p-2 bg-[rgba(255,255,255,0.05)] rounded-lg">
                                <Calendar size={14} />
                            </div>
                            {fmtDate(new Date().toISOString())}
                        </div>
                        <textarea
                            className="w-full bg-transparent text-[#ddeef5] placeholder-[rgba(200,225,235,0.38)] border-none outline-none resize-none font-sans font-light text-sm leading-loose mb-6 min-h-[160px] pl-1 pr-2 italic"
                            placeholder="¿Cómo te sientes en este momento? No sientas presión, solo deja fluir tus pensamientos..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowEditor(false)}
                                className="px-5 py-2.5 bg-transparent border border-white/10 text-slate-300 text-xs tracking-wider font-semibold rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-5 py-2.5 bg-[#5aadcf] text-[#03080f] font-semibold text-xs tracking-wider rounded-full hover:bg-[#89cee4] transition-colors flex items-center gap-2 disabled:opacity-60"
                            >
                                {saving && <Loader2 size={14} className="animate-spin" />}
                                Guardar
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 size={28} className="animate-spin text-[#5aadcf]/40" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notes.length > 0 && (
                            <div className="mb-6">
                                {!aiResult && !aiLoading && !aiError && (
                                    <button
                                        onClick={handleAnalyze}
                                        className="w-full bg-[#0e1d2e] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl flex items-center justify-between group transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#c9a96e] transition-transform">
                                                <Sparkles size={24} />
                                            </div>
                                            <div className="text-left pl-1">
                                                <h3 className="text-xl font-light text-[#ddeef5] font-serif italic mb-1">Analizar mis patrones</h3>
                                                <p className="font-sans font-light text-[12px] text-[rgba(200,225,235,0.38)] leading-tight">La IA leerá tu diario para encontrar desencadenantes invisibles.</p>
                                            </div>
                                        </div>
                                    </button>
                                )}

                                {aiLoading && (
                                    <div className="w-full bg-[#0e1d2e] border border-[rgba(255,255,255,0.07)] py-8 px-5 rounded-2xl flex flex-col items-center justify-center text-center animate-pulse">
                                        <BrainCircuit size={40} className="text-[#c9a96e] mb-4 animate-bounce" />
                                        <h3 className="text-xl font-light text-[#ddeef5] font-serif italic mb-2">Analizando tu mente...</h3>
                                        <p className="font-sans font-light text-[13px] text-[rgba(200,225,235,0.38)]">Buscando conexiones y patrones emocionales en tus textos.</p>
                                    </div>
                                )}

                                {aiError && (
                                    <div className="w-full bg-[#d97c6a]/10 border border-[#d97c6a]/30 p-5 rounded-2xl flex items-start gap-4">
                                        <AlertCircle size={24} className="text-[#d97c6a] shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-[#d97c6a] font-medium text-[15px] mb-1">Error de Análisis</h3>
                                            <p className="text-[#d97c6a]/70 font-sans font-light text-[13px] leading-relaxed mb-3">{aiError}</p>
                                            <button onClick={() => setAiError('')} className="text-[#d97c6a] text-[10px] font-bold uppercase tracking-widest hover:text-white">Cerrar</button>
                                        </div>
                                    </div>
                                )}

                                {aiResult && (
                                    <div className="w-full bg-[#0e1d2e] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#c9a96e]/5 rounded-full blur-3xl pointer-events-none"></div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-[#c9a96e] shrink-0">
                                                <Sparkles size={20} />
                                            </div>
                                            <h3 className="text-xl font-light text-[#ddeef5] font-serif italic pl-1">Informe Cognitivo</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-[rgba(200,225,235,0.38)] text-[10px] uppercase tracking-widest font-medium mb-2 flex items-center gap-2">
                                                    <AlertCircle size={12} /> Desencadenantes Detectados
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {aiResult.triggers.map((trigger, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-xl text-[#ddeef5] font-sans font-light text-[11px]">
                                                            {trigger}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-[rgba(200,225,235,0.38)] text-[10px] uppercase tracking-widest font-medium mb-2 pl-1">Resumen Emocional</div>
                                                <p className="font-sans font-light text-sm text-[#ddeef5] leading-loose italic pl-1">
                                                    "{aiResult.emotion_summary}"
                                                </p>
                                            </div>

                                            <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5">
                                                <div className="text-[#5aadcf] text-[10px] uppercase tracking-widest font-medium mb-2">Recomendación Clínica</div>
                                                <p className="font-sans font-light text-[13px] text-[#ddeef5] leading-loose pl-1 pr-2">
                                                    {aiResult.recommendation}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setAiResult(null)}
                                            className="w-full mt-6 py-2.5 bg-transparent border border-white/10 text-slate-300 text-xs tracking-wider font-semibold rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                        >
                                            Entendido
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {notes.map((note) => (
                            <div key={note.id} className="group relative bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-5 rounded-2xl transition-transform duration-200 hover:-translate-y-0.5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-[5px] h-[5px] rounded-full bg-[#5aadcf]" />
                                        <span className="text-[10px] uppercase tracking-widest text-[rgba(200,225,235,0.38)]">{fmtDate(note.created_at)}</span>
                                    </div>
                                    <button
                                        className="p-1.5 text-[rgba(200,225,235,0.38)] hover:text-[#d97c6a] transition-colors"
                                        onClick={() => handleDelete(note.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="font-sans font-light text-sm text-[#ddeef5] leading-[1.8] whitespace-pre-wrap italic pl-1 pr-2">
                                    "{note.text}"
                                </div>
                            </div>
                        ))}

                        {notes.length === 0 && !showEditor && (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-8 animate-in fade-in duration-300">
                                <div className="w-20 h-20 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-full flex items-center justify-center text-[rgba(200,225,235,0.38)] mb-6">
                                    <PenLine size={32} />
                                </div>
                                <h4 className="text-2xl font-light text-[#ddeef5] mb-2 font-serif italic">Tu diario de calma espera</h4>
                                <p className="font-sans font-light text-sm text-[rgba(200,225,235,0.38)] max-w-[240px]">
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
