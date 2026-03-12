'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Sparkles, BrainCircuit, AlertCircle, Download, Loader2 } from 'lucide-react';
import { addCbtEntry } from '../utils/stats';
import TopBar from './TopBar';
import { exportClinicalDiaryPDF } from '../utils/exportUtils';

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
            console.error('Error loading notes', e);
        }
        setLoading(false);
    };

    useEffect(() => { loadNotes(); }, []);

    const handleSave = () => {
        if (!inputText.trim()) return;
        setSaving(true);
        try {
            const newNote: Note = { id: Date.now(), text: inputText.trim(), created_at: new Date().toISOString() };
            const updatedNotes = [newNote, ...notes];
            localStorage.setItem('ansioff_notes', JSON.stringify(updatedNotes));
            setNotes(updatedNotes);
            addCbtEntry();
            setInputText('');
            setShowEditor(false);
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
        return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    const handleAnalyze = async () => {
        if (notes.length === 0) return;
        setAiLoading(true);
        setAiError('');
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes })
            });
            const data = await res.json();
            if (!res.ok) setAiError(data.error || 'No se pudo completar el análisis.');
            else setAiResult(data);
        } catch (err) {
            setAiError('Error de conexión.');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div id="s-notes" className="screen active flex flex-col overflow-hidden">
            <style jsx>{`
                #s-notes { background: var(--navy-1); min-height: 100vh; }
                .notes-head { padding: 40px 28px 20px; }
                .nt-title { font-family: var(--serif); font-size: 32px; color: var(--white); margin-bottom: 8px; }
                .nt-desc { font-size: 14px; color: var(--muted); }

                .notes-list { flex: 1; padding: 0 28px 120px; overflow-y: auto; }
                
                .note-card {
                    background: var(--navy-2); border-radius: 20px; padding: 20px;
                    border: 1px solid rgba(255,255,255,0.05); margin-bottom: 16px;
                    position: relative; transition: 0.2s;
                }
                .note-card:active { transform: scale(0.98); }
                .nc-date { font-size: 10px; font-weight: 700; color: var(--sky-1); text-transform: uppercase; margin-bottom: 8px; opacity: 0.6; }
                .nc-text { font-size: 15px; color: var(--white); line-height: 1.6; opacity: 0.9; }

                .ai-banner {
                    background: linear-gradient(135deg, #1e3a5f, #0d1a2e);
                    border-radius: 24px; padding: 24px; margin-bottom: 24px;
                    border: 1px solid rgba(74,168,204,0.2); position: relative; overflow: hidden;
                }
                .ai-banner::after {
                    content: '✨'; position: absolute; right: -10px; top: -10px; font-size: 80px; opacity: 0.05;
                }

                .fab {
                    position: fixed; bottom: 100px; right: 28px; width: 64px; height: 64px;
                    border-radius: 50%; background: var(--sky-1); color: var(--navy-1);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 8px 32px rgba(74,168,204,0.4); border: none; z-index: 100;
                }

                .editor-overlay {
                    position: fixed; inset: 0; background: var(--navy-1); z-index: 200;
                    padding: 60px 28px; display: flex; flex-direction: column;
                }
                .ed-area {
                    flex: 1; background: transparent; border: none; color: var(--white);
                    font-size: 18px; line-height: 1.6; outline: none; resize: none;
                }
            `}</style>

            <TopBar title="" onBack={onBack} />

            <div className="notes-head">
                <div className="nt-title">Tu diario</div>
                <div className="nt-desc">Escribe lo que sientes para liberar tu mente.</div>
            </div>

            <div className="notes-list scrollbar-hide">
                {notes.length > 0 && !aiResult && !aiLoading && (
                    <div className="ai-banner" onClick={handleAnalyze}>
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles size={20} color="var(--sky-1)" />
                            <span className="font-bold text-[11px] text-white tracking-widest uppercase">Análisis Clínico</span>
                        </div>
                        <div className="text-white/80 text-sm leading-relaxed mb-4">
                            Deja que nuestra IA encuentre patrones en tus sentimientos.
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all">
                            Analizar ahora
                        </button>
                    </div>
                )}

                {aiLoading && (
                    <div className="ai-banner flex flex-col items-center py-10 text-center">
                        <Loader2 className="animate-spin mb-4" size={32} color="var(--sky-1)" />
                        <div className="text-white font-serif italic text-lg">Analizando patrones...</div>
                    </div>
                )}

                {aiResult && (
                    <div className="ai-banner">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <BrainCircuit size={24} color="var(--sky-1)" />
                                <span className="font-serif italic text-xl text-white">Informe de Bienestar</span>
                            </div>
                            <button onClick={() => setAiResult(null)} className="text-white/40"><AlertCircle size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[10px] font-bold text-sky-300/60 uppercase tracking-widest mb-1">Resumen</div>
                                <div className="text-white/90 text-sm leading-relaxed italic">"{aiResult.emotion_summary}"</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-[10px] font-bold text-sky-300/60 uppercase tracking-widest mb-2">Recomendación</div>
                                <div className="text-white/90 text-sm leading-relaxed">{aiResult.recommendation}</div>
                            </div>
                        </div>
                    </div>
                )}

                {notes.map(note => (
                    <div key={note.id} className="note-card">
                        <div className="flex justify-between items-center mb-3">
                            <div className="nc-date">{fmtDate(note.created_at)}</div>
                            <Trash2 size={14} className="text-white/20" onClick={() => handleDelete(note.id)} />
                        </div>
                        <div className="nc-text">{note.text}</div>
                    </div>
                ))}
            </div>

            <button className="fab" onClick={() => setShowEditor(true)}>
                <Plus size={32} />
            </button>

            {showEditor && (
                <div className="editor-overlay animate-in fade-in slide-in-from-bottom-10">
                    <div className="flex justify-between items-center mb-10">
                        <button onClick={() => setShowEditor(false)} className="text-white/60 font-semibold">Cancelar</button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !inputText.trim()}
                            className="bg-sky-500 text-slate-900 px-6 py-2 rounded-full font-bold text-sm disabled:opacity-50"
                        >
                            Guardar
                        </button>
                    </div>
                    <textarea
                        className="ed-area"
                        placeholder="Sin filtros, solo tú..."
                        autoFocus
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}
