'use client';

import { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, ShieldCheck, X } from 'lucide-react';
import { Capacitor, CapacitorHttp } from '@capacitor/core';

const AI_CONSENT_KEY = 'ansioff_ai_reflection_consent_v1';

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
    
    // AI State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);
    const [aiError, setAiError] = useState('');
    const [showAiConsent, setShowAiConsent] = useState(false);

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

    const requestNotesAnalysis = () => {
        if (notes.length === 0) return;
        if (localStorage.getItem(AI_CONSENT_KEY) === 'accepted') {
            void analyzeNotes();
            return;
        }
        setShowAiConsent(true);
    };

    const acceptAiConsent = () => {
        localStorage.setItem(AI_CONSENT_KEY, 'accepted');
        setShowAiConsent(false);
        void analyzeNotes();
    };

    const analyzeNotes = async () => {
        if (notes.length === 0) return;
        setIsAnalyzing(true);
        setAiError('');
        setAiResult(null);

        try {
            const recentNotes = notes.slice(0, 15);
            let data: any;

            if (Capacitor.isNativePlatform()) {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://app-ansiedad-flame.vercel.app';
                const response = await CapacitorHttp.post({
                    url: `${apiBaseUrl}/api/analyze`,
                    headers: { 'Content-Type': 'application/json' },
                    data: { notes: recentNotes },
                });
                data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(data?.error || `Error del servidor (${response.status}).`);
                }
            } else {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notes: recentNotes }),
                });
                const contentType = response.headers.get('content-type');
                if (!response.ok) {
                    const errorData = contentType?.includes('application/json') ? await response.json() : null;
                    throw new Error(errorData?.error || `Error del servidor (${response.status}).`);
                }
                if (!contentType?.includes('application/json')) throw new Error('Respuesta del servidor no válida.');
                data = await response.json();
            }

            setAiResult(data);
        } catch (err: any) {
            setAiError(err.message || 'Error de conexión con la IA.');
        } finally {
            setIsAnalyzing(false);
        }
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
        
        .ai-btn{
            width:100%;margin-top:12px;
            background:linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.05));
            border:1px solid rgba(16,185,129,0.3);border-radius:14px;
            padding:12px;color:var(--em);font-size:13px;font-weight:700;
            display:flex;align-items:center;justify-content:center;gap:8px;
            cursor:pointer;transition:var(--t);
        }
        .ai-btn:hover{background:rgba(16,185,129,0.2);border-color:rgba(16,185,129,0.5);}
        .ai-btn:disabled{opacity:0.5;cursor:not-allowed;}
        
        .ai-card{
            background:linear-gradient(180deg,rgba(16,185,129,0.08),rgba(3,8,15,0.5));
            border:1px solid rgba(16,185,129,0.2);border-radius:20px;
            padding:20px;margin-top:14px;
            animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .ai-title{font-size:15px;font-weight:800;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
        .ai-section{margin-bottom:14px;}
        .ai-section-title{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--em);margin-bottom:6px;}
        .ai-tag{display:inline-block;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:8px;padding:4px 10px;font-size:11px;color:var(--text);margin-right:6px;margin-bottom:6px;}
        .ai-p{font-size:13px;color:rgba(255,255,255,0.8);line-height:1.6;white-space:pre-wrap;}
        .ai-rec{background:rgba(255,255,255,0.04);border-left:3px solid var(--r);border-radius:8px;padding:12px;font-size:13px;font-weight:500;color:var(--text2);line-height:1.6;white-space:pre-wrap;}
        .consent-overlay{position:fixed;inset:0;z-index:120;background:rgba(3,8,15,.88);backdrop-filter:blur(12px);display:flex;align-items:flex-end;justify-content:center;padding:20px max(20px,env(safe-area-inset-right)) max(24px,calc(env(safe-area-inset-bottom) + 16px)) max(20px,env(safe-area-inset-left));}
        .consent-card{width:100%;max-width:420px;background:#0e1d2e;border:1px solid rgba(90,173,207,.25);border-radius:22px;padding:22px;position:relative;box-shadow:0 24px 70px rgba(0,0,0,.5);}
        .consent-icon{width:46px;height:46px;border-radius:14px;background:rgba(90,173,207,.12);color:#5aadcf;display:flex;align-items:center;justify-content:center;margin-bottom:16px;}
        .consent-title{font-size:21px;font-weight:800;color:var(--text);margin-bottom:10px;}
        .consent-copy{font-size:13px;line-height:1.6;color:var(--text2);margin-bottom:12px;}
        .consent-note{font-size:11px;line-height:1.5;color:var(--text3);padding:11px 12px;border:1px solid var(--border);border-radius:12px;margin-bottom:18px;}
        .consent-actions{display:flex;flex-direction:column;gap:9px;}
        .consent-primary,.consent-secondary{min-height:48px;border-radius:13px;font-size:13px;font-weight:800;cursor:pointer;}
        .consent-primary{border:0;background:#5aadcf;color:#03080f;}
        .consent-secondary{border:1px solid var(--border);background:transparent;color:var(--text2);}
        .consent-close{position:absolute;right:14px;top:14px;width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--glass);color:var(--text2);display:flex;align-items:center;justify-content:center;}
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
                <div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ fontSize: '18px' }}>💡</div>
                        <div className="nt-ai-txt">La <b>IA de reflexión</b> puede resumir tus notas recientes y ayudarte a detectar temas repetidos. No ofrece diagnóstico ni consejo médico.</div>
                    </div>
                    {notes.length > 0 && (
                        <button className="ai-btn" onClick={requestNotesAnalysis} disabled={isAnalyzing}>
                            {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                            {isAnalyzing ? 'Resumiendo patrones...' : 'Reflexionar sobre mis notas con IA'}
                        </button>
                    )}
                    {aiError && <div style={{ color: 'var(--r)', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>{aiError}</div>}
                    
                    {aiResult && (
                        <div className="ai-card">
                            <div className="ai-title"><BrainCircuit size={18} className="text-[#10b981]" /> Tu resumen personal</div>
                            
                            <div className="ai-section">
                                <div className="ai-section-title">Temas frecuentes</div>
                                <div>
                                    {aiResult.triggers?.map((t: string, i: number) => (
                                        <span key={i} className="ai-tag">{t}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="ai-section">
                                <div className="ai-section-title">Resumen Emocional</div>
                                <div className="ai-p">{aiResult.emotion_summary}</div>
                            </div>
                            
                            <div className="ai-section" style={{ marginBottom: 0 }}>
                                <div className="ai-section-title">Idea para explorar</div>
                                <div className="ai-rec">{aiResult.recommendation}</div>
                            </div>
                        </div>
                    )}
                </div>
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

            {showAiConsent && (
                <div className="consent-overlay" role="dialog" aria-modal="true" aria-labelledby="ai-consent-title">
                    <div className="consent-card">
                        <button className="consent-close" onClick={() => setShowAiConsent(false)} aria-label="Cerrar"><X size={18} /></button>
                        <div className="consent-icon"><ShieldCheck size={23} /></div>
                        <div id="ai-consent-title" className="consent-title">Antes de usar la reflexión IA</div>
                        <p className="consent-copy">Al continuar, se enviarán mediante una conexión segura tus {Math.min(notes.length, 15)} notas más recientes al servicio de ANSIOFF y a Google Gemini para crear este resumen.</p>
                        <p className="consent-copy">La IA buscará temas repetidos y propondrá una idea de autocuidado. No realiza diagnósticos, no determina causas y no sustituye a un profesional.</p>
                        <div className="consent-note">Tus notas no se envían a Meta, Google Ads ni a herramientas publicitarias.</div>
                        <div className="consent-actions">
                            <button className="consent-primary" onClick={acceptAiConsent}>Entiendo y quiero continuar</button>
                            <button className="consent-secondary" onClick={() => setShowAiConsent(false)}>Ahora no</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
