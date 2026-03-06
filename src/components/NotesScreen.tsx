'use client';

import { useState, useEffect } from 'react';
import { PenLine, Trash2, Calendar, Loader2 } from 'lucide-react';
import TopBar from './TopBar';
import { supabase } from '@/lib/supabase';

interface Note {
    id: number;
    text: string;
    created_at: string;
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

    const loadNotes = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setNotes(data);
        setLoading(false);
    };

    useEffect(() => { loadNotes(); }, []);

    const handleSave = async () => {
        if (!inputText.trim()) return;
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('notes').insert({
            text: inputText.trim(),
            user_id: user?.id,
        });
        setInputText('');
        setShowEditor(false);
        await loadNotes();
        setSaving(false);
    };

    const handleDelete = async (id: number) => {
        await supabase.from('notes').delete().eq('id', id);
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    const fmtDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) +
            ' · ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
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
