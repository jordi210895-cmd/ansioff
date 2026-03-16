'use client';

import { useState, useEffect } from 'react';

interface Note {
    id: string;
    content: string;
    created_at: string;
}

interface NotesScreenProps {
    onBack: () => void;
}

export default function NotesScreen({ onBack }: NotesScreenProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const saved = localStorage.getItem('ansioff_notes');
            if (saved) {
                const parsed = JSON.parse(saved);
                setNotes(parsed);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const addNote = async () => {
        if (!text.trim()) return;
        const newNote: Note = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
            content: text.trim(),
            created_at: new Date().toISOString()
        };
        const updated = [newNote, ...notes];
        setNotes(updated);
        localStorage.setItem('ansioff_notes', JSON.stringify(updated));
        setText('');
    };

    const deleteNote = async (id: string) => {
        const updated = notes.filter(n => n.id !== id);
        setNotes(updated);
        localStorage.setItem('ansioff_notes', JSON.stringify(updated));
    };

    return (
        <div id="notes" className="screen active">
            <style jsx>{`
        .screen{position:absolute;inset:0;display:flex;flex-direction:column;overflow-y:auto;padding-bottom:96px;}
        .screen::-webkit-scrollbar{display:none;}

        #notes .aurora-1{background:radial-gradient(circle,rgba(16,185,129,.4),transparent 70%);top:-80px;right:-40px;}
        #notes .aurora-2{background:radial-gradient(circle,rgba(6,182,212,.25),transparent 70%);bottom:40px;left:-60px;}

        .nt-hd{padding:22px 24px 14px;position:relative;z-index:5;}
        .nt-title{font-size:36px;font-weight:800;letter-spacing:-.03em;color:var(--text);margin-bottom:3px;}
        .nt-sub{font-size:12px;color:var(--text2);}

        .nt-editor{margin:0 22px 24px;position:relative;z-index:5;}
        .nt-area{
          width:100%;min-height:120px;
          background:var(--glass);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          border:1px solid var(--border);border-radius:22px;
          padding:18px;color:var(--text);font-size:15px;line-height:1.6;
          resize:none;transition:var(--t);outline:none;
        }
        .nt-area:focus{border-color:rgba(16,185,129,.4);background:rgba(255,255,255,0.08);}
        .nt-save{
          position:absolute;bottom:14px;right:14px;
          background:var(--em);color:#fff;border:none;
          border-radius:12px;padding:8px 18px;font-size:13px;font-weight:800;
          cursor:pointer;transition:var(--t);box-shadow:0 4px 12px rgba(16,185,129,.3);
        }
        .nt-save:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(16,185,129,.45);}

        .nt-list{padding:0 22px;display:flex;flex-direction:column;gap:12px;position:relative;z-index:5;}
        .note{
          background:var(--glass);border:1px solid var(--border);border-radius:20px;
          padding:18px;position:relative;transition:var(--t);
        }
        .note:hover{border-color:var(--border2);}
        .note-meta{font-size:10px;font-weight:700;color:var(--em);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;}
        .note-txt{font-size:14px;color:rgba(241,240,245,.85);line-height:1.6;white-space:pre-wrap;}
        .note-del{
          position:absolute;top:14px;right:14px;width:28px;height:28px;
          display:flex;align-items:center;justify-content:center;
          color:rgba(255,255,255,.15);cursor:pointer;transition:var(--t);
        }
        .note-del:hover{color:var(--r2);}

        .nt-empty{text-align:center;padding:40px 0;color:var(--text3);}
        .nt-empty-ico{font-size:32px;margin-bottom:12px;opacity:.3;}

        .nt-ai-info{
          margin:0 22px 16px;padding:14px 18px;
          background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);
          border-radius:18px;display:flex;gap:12px;align-items:center;
          position:relative;z-index:5;transition:var(--t);
        }
        .nt-ai-info:hover{background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.3);}
        .nt-ai-txt{font-size:12.5px;color:rgba(255,255,255,0.8);line-height:1.5;font-weight:500;}
        .nt-ai-txt b{color:#10b981;font-weight:700;}
      `}</style>

            <div className="aurora"><div className="aurora-1"></div><div className="aurora-2"></div></div>

            <div className="nt-hd">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div className="nt-title">Diario</div>
                        <div className="nt-sub">Escribe tus pensamientos para liberarlos</div>
                    </div>
                    <div onClick={onBack} style={{ cursor: 'pointer', padding: '8px', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>‹</div>
                </div>
            </div>

            <div className="nt-ai-info">
                <div style={{ fontSize: '18px' }}>💡</div>
                <div className="nt-ai-txt">Una vez escritas tus notas, la <b>IA</b> puede ayudarte a identificar patrones en tu ansiedad.</div>
            </div>

            <div className="nt-editor">
                <textarea
                    className="nt-area"
                    placeholder="¿Cómo te sientes hoy?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button className="nt-save" onClick={addNote}>Guardar</button>
            </div>

            <div className="nt-list">
                {loading ? (
                    <div className="nt-empty">Cargando...</div>
                ) : notes.length === 0 ? (
                    <div className="nt-empty">
                        <div className="nt-empty-ico">✍️</div>
                        <div>Tu diario está vacío</div>
                    </div>
                ) : (
                    notes.map(n => (
                        <div key={n.id} className="note">
                            <div className="note-meta">{new Date(n.created_at).toLocaleDateString()}</div>
                            <div className="note-txt">{n.content}</div>
                            <div className="note-del" onClick={() => deleteNote(n.id)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
