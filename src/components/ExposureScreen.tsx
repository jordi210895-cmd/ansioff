'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    ArrowLeft,
    Brain,
    ChevronRight,
    Headphones,
    Hand,
    Lightbulb,
    Minus,
    Plus,
    Trash2,
    Wind,
    Waves,
    X,
} from 'lucide-react';

interface ExposureScreenProps {
    onBack: () => void;
    userId?: string;
}

interface ExposureEntry {
    id: string;
    before: number;
    during: number;
    after: number;
    tool: string;
    comment: string;
    createdAt: string;
}

interface ExposureSituation {
    id: string;
    name: string;
    level: number;
    entries: ExposureEntry[];
}

interface ExposureDraft {
    situationId: string;
    before: number;
    during: number;
    after: number;
    tool: string;
    comment: string;
}

const STORAGE_PREFIX = 'ansioff_exposure_hierarchy_v1';
const TOOLS = [
    { label: 'Respiración', icon: Wind },
    { label: 'Grounding 5-4-3-2-1', icon: Hand },
    { label: 'ACT / Flotar', icon: Waves },
    { label: 'TCC', icon: Brain },
    { label: 'Audio relax', icon: Headphones },
    { label: 'Ninguna', icon: Minus },
];

function storageKey(userId?: string) {
    return `${STORAGE_PREFIX}:${userId || 'guest'}`;
}

function createId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function levelClass(level: number) {
    if (level <= 3) return 'low';
    if (level <= 6) return 'medium';
    return 'high';
}

function formatDate(value: string) {
    try {
        const date = new Date(value);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    } catch {
        return value;
    }
}

function formatNumber(value: number) {
    return value.toFixed(1).replace('.', ',');
}

export default function ExposureScreen({ onBack, userId }: ExposureScreenProps) {
    const key = storageKey(userId);
    const [situations, setSituations] = useState<ExposureSituation[]>([]);
    const [loadedKey, setLoadedKey] = useState<string | null>(null);
    const [situationName, setSituationName] = useState('');
    const [situationLevel, setSituationLevel] = useState(5);
    const [openSituationId, setOpenSituationId] = useState<string | null>(null);
    const [draft, setDraft] = useState<ExposureDraft | null>(null);

    useEffect(() => {
        setLoadedKey(null);
        try {
            const raw = window.localStorage.getItem(key);
            const parsed = raw ? JSON.parse(raw) : [];
            const valid = Array.isArray(parsed)
                ? parsed.filter((item): item is ExposureSituation => (
                    item && typeof item.id === 'string' && typeof item.name === 'string'
                    && Number.isFinite(item.level) && Array.isArray(item.entries)
                ))
                : [];
            setSituations(valid.map((item) => ({
                ...item,
                entries: item.entries.filter((entry: ExposureEntry) => (
                    entry && typeof entry.id === 'string'
                    && Number.isFinite(entry.before)
                    && Number.isFinite(entry.during)
                    && Number.isFinite(entry.after)
                )),
            })));
        } catch {
            setSituations([]);
        }
        setLoadedKey(key);
    }, [key]);

    useEffect(() => {
        if (loadedKey !== key) return;
        window.localStorage.setItem(key, JSON.stringify(situations));
    }, [key, loadedKey, situations]);

    const totalEntries = useMemo(
        () => situations.reduce((total, situation) => total + situation.entries.length, 0),
        [situations],
    );

    const handleAddSituation = () => {
        const name = situationName.trim();
        if (!name) return;
        const next: ExposureSituation = {
            id: createId(),
            name,
            level: situationLevel,
            entries: [],
        };
        setSituations((current) => [...current, next].sort((a, b) => a.level - b.level));
        setSituationName('');
        setSituationLevel(5);
        setOpenSituationId(next.id);
    };

    const openEntryModal = (situation: ExposureSituation) => {
        setDraft({
            situationId: situation.id,
            before: situation.level,
            during: situation.level,
            after: situation.level,
            tool: '',
            comment: '',
        });
    };

    const saveEntry = () => {
        if (!draft) return;
        const entry: ExposureEntry = {
            id: createId(),
            before: draft.before,
            during: draft.during,
            after: draft.after,
            tool: draft.tool,
            comment: draft.comment.trim(),
            createdAt: new Date().toISOString(),
        };
        setSituations((current) => current.map((situation) => (
            situation.id === draft.situationId
                ? { ...situation, entries: [entry, ...situation.entries] }
                : situation
        )));
        setOpenSituationId(draft.situationId);
        setDraft(null);
    };

    const deleteEntry = (situationId: string, entryId: string) => {
        setSituations((current) => current.map((situation) => (
            situation.id === situationId
                ? { ...situation, entries: situation.entries.filter((entry) => entry.id !== entryId) }
                : situation
        )));
    };

    const deleteSituation = (situationId: string) => {
        setSituations((current) => current.filter((situation) => situation.id !== situationId));
        setOpenSituationId((current) => current === situationId ? null : current);
    };

    return (
        <div className="exposure-screen">
            <style jsx>{`
                .exposure-screen{position:absolute;inset:0;overflow:hidden;background:#0f0c1e;color:#fff;}
                .exposure-screen:before{content:"";position:absolute;top:-70px;left:-70px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(80,20,140,.46),transparent 70%);pointer-events:none;}
                .exposure-scroll{position:relative;z-index:1;height:100%;overflow-y:auto;padding:calc(20px + var(--safe-top)) 0 calc(120px + var(--safe-bottom));scrollbar-width:none;}
                .exposure-scroll::-webkit-scrollbar{display:none;}
                .exposure-header{display:flex;align-items:flex-start;justify-content:space-between;padding:8px 20px 20px;}
                .exposure-title{font-size:36px;font-weight:800;line-height:1.03;letter-spacing:-.04em;}
                .exposure-subtitle{font-size:14px;color:rgba(255,255,255,.48);margin-top:8px;}
                .back-button{width:38px;height:38px;display:flex;align-items:center;justify-content:center;margin-top:2px;border-radius:13px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);color:rgba(255,255,255,.75);cursor:pointer;}
                .info-card,.form-card{margin:0 16px 14px;border-radius:18px;}
                .info-card{display:flex;gap:12px;align-items:flex-start;padding:15px 16px;border:1px solid rgba(0,196,255,.22);background:rgba(0,196,255,.06);}
                .info-icon{color:#00c4ff;flex:0 0 auto;margin-top:1px;}
                .info-copy{font-size:13px;line-height:1.5;color:rgba(255,255,255,.64);}
                .info-copy strong{color:#00c4ff;font-weight:700;}
                .form-card{padding:16px 18px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.06);}
                .field-label,.section-label{font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:rgba(255,255,255,.34);}
                .field-label{margin-bottom:12px;}
                .name-input{width:100%;height:46px;padding:0 14px;margin-bottom:16px;border:1px solid rgba(255,255,255,.1);border-radius:12px;outline:none;background:rgba(255,255,255,.06);color:#fff;font:inherit;font-size:15px;}
                .name-input:focus{border-color:#00c4ff;}
                .name-input::placeholder{color:rgba(255,255,255,.28);}
                .level-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;color:rgba(255,255,255,.56);font-size:13px;}
                .level-number{font-size:28px;font-weight:800;color:#00c4ff;line-height:1;}
                input[type=range]{width:100%;accent-color:#00c4ff;cursor:pointer;}
                .range-marks{display:flex;justify-content:space-between;margin:4px 0 16px;color:rgba(255,255,255,.27);font-size:10px;}
                .add-button{width:100%;min-height:48px;border:0;border-radius:14px;background:#00c4ff;color:#07101e;font-size:15px;font-weight:800;cursor:pointer;}
                .add-button:disabled{opacity:.4;cursor:not-allowed;}
                .section-label{display:block;padding:0 16px;margin:24px 0 10px;}
                .empty-state{margin:0 16px;padding:34px 18px;border:1px dashed rgba(255,255,255,.1);border-radius:18px;text-align:center;color:rgba(255,255,255,.33);font-size:13px;line-height:1.5;}
                .empty-state svg{opacity:.35;margin-bottom:8px;}
                .situation{margin:0 16px 8px;overflow:hidden;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(255,255,255,.055);}
                .situation-header{display:flex;align-items:center;gap:14px;width:100%;padding:14px 16px;border:0;background:transparent;color:#fff;text-align:left;cursor:pointer;}
                .level-badge{width:42px;height:42px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:12px;font-size:17px;font-weight:800;}
                .level-badge.low{background:rgba(50,210,100,.13);color:#32d264;}
                .level-badge.medium{background:rgba(255,180,0,.13);color:#ffb300;}
                .level-badge.high{background:rgba(255,70,70,.13);color:#ff4545;}
                .situation-name{font-size:16px;font-weight:600;margin-bottom:3px;}
                .situation-meta{font-size:12px;color:rgba(255,255,255,.4);}
                .situation-chevron{margin-left:auto;color:rgba(255,255,255,.3);transition:transform .2s;}
                .situation-chevron.open{transform:rotate(90deg);}
                .situation-panel{padding:14px 16px;border-top:1px solid rgba(255,255,255,.08);}
                .panel-label{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:11px;}
                .register-button{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:44px;margin-bottom:12px;border:1px solid rgba(0,196,255,.24);border-radius:12px;background:rgba(0,196,255,.08);color:#00c4ff;font-size:14px;font-weight:700;cursor:pointer;}
                .no-entries{padding:8px 0 12px;color:rgba(255,255,255,.28);font-size:13px;text-align:center;}
                .entry{padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);}
                .entry:last-of-type{border-bottom:0;}
                .entry-top{display:flex;align-items:center;gap:6px;min-width:0;}
                .entry-date{flex:0 0 auto;color:rgba(255,255,255,.3);font-size:11px;}
                .tool-badge{max-width:135px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:3px 7px;border-radius:7px;background:rgba(0,196,255,.08);color:rgba(0,196,255,.78);font-size:10px;}
                .entry-levels{display:flex;align-items:center;gap:4px;margin-left:auto;flex:0 0 auto;}
                .entry-level{padding:3px 7px;border-radius:7px;font-size:11px;font-weight:800;}
                .entry-level.before{background:rgba(255,140,0,.13);color:#ffa828;}
                .entry-level.during{background:rgba(255,80,80,.13);color:#ff6666;}
                .entry-level.after{background:rgba(50,210,100,.13);color:#32d264;}
                .entry-arrow{color:rgba(255,255,255,.22);font-size:11px;}
                .delete-icon{display:flex;align-items:center;justify-content:center;width:26px;height:26px;margin-left:2px;border:0;background:transparent;color:rgba(255,255,255,.3);cursor:pointer;}
                .entry-comment{margin-top:7px;padding-top:7px;border-top:1px solid rgba(255,255,255,.05);color:rgba(255,255,255,.48);font-size:12px;line-height:1.45;white-space:pre-wrap;}
                .delete-situation{display:flex;align-items:center;gap:5px;justify-content:flex-end;margin-top:12px;border:0;background:transparent;color:rgba(255,80,80,.6);font-size:12px;cursor:pointer;}
                .modal-backdrop{position:fixed;inset:0;z-index:1300;display:flex;align-items:flex-end;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);}
                .modal{width:100%;max-height:min(90vh,760px);overflow-y:auto;padding:24px 20px calc(34px + var(--safe-bottom));border-top:1px solid rgba(255,255,255,.12);border-radius:24px 24px 0 0;background:#18142e;animation:exposure-slide-up .24s cubic-bezier(.22,1,.36,1);}
                @keyframes exposure-slide-up{from{transform:translateY(100%)}to{transform:translateY(0)}}
                .modal-heading{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;}
                .modal-title{font-size:19px;font-weight:800;}
                .modal-subtitle{margin-top:4px;color:rgba(255,255,255,.42);font-size:13px;}
                .close-button{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.7);cursor:pointer;}
                .slider-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;}
                .slider-label{margin-bottom:8px;color:rgba(255,255,255,.34);font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;}
                .slider-value{margin-bottom:8px;color:#00c4ff;text-align:center;font-size:32px;font-weight:800;line-height:1;}
                .slider-value.during{color:#ffa828;}
                .divider{height:1px;margin:18px 0;border:0;background:rgba(255,255,255,.08);}
                .tool-grid{display:flex;flex-wrap:wrap;gap:8px;}
                .tool-button{display:flex;align-items:center;gap:6px;padding:8px 11px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.58);font-size:12px;cursor:pointer;}
                .tool-button.selected{border-color:rgba(0,196,255,.45);background:rgba(0,196,255,.13);color:#00c4ff;}
                .notes-label{display:block;margin-bottom:10px;color:rgba(255,255,255,.34);font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;}
                .notes-input{width:100%;min-height:92px;padding:11px 14px;resize:vertical;outline:none;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(255,255,255,.05);color:#fff;font:inherit;font-size:14px;line-height:1.5;}
                .notes-input:focus{border-color:#00c4ff;}
                .notes-input::placeholder{color:rgba(255,255,255,.25);}
                .modal-actions{display:flex;gap:10px;margin-top:18px;}
                .modal-cancel,.modal-save{min-height:48px;border-radius:14px;font-size:14px;font-weight:800;cursor:pointer;}
                .modal-cancel{flex:1;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.07);color:rgba(255,255,255,.7);}
                .modal-save{flex:2;border:0;background:#00c4ff;color:#07101e;}
                @media (max-width:360px){.exposure-title{font-size:32px}.slider-grid{gap:10px}.entry-top{gap:3px}.tool-badge{max-width:100px}.entry-level{padding-inline:5px}}
            `}</style>

            <div className="exposure-scroll">
                <header className="exposure-header">
                    <div>
                        <h1 className="exposure-title">Exposición<br />gradual</h1>
                        <p className="exposure-subtitle">Enfrenta tus miedos paso a paso</p>
                    </div>
                    <button className="back-button" onClick={onBack} aria-label="Volver a módulos"><ArrowLeft size={18} /></button>
                </header>

                <section className="info-card">
                    <Lightbulb className="info-icon" size={19} />
                    <p className="info-copy">
                        Ordena tus situaciones de <strong>menor a mayor malestar</strong> (1–10).
                        Registra tu ansiedad antes y después de cada exposición y comprueba cómo disminuye con el tiempo.
                    </p>
                </section>

                <section className="form-card" aria-label="Añadir situación">
                    <div className="field-label">Añadir situación</div>
                    <input
                        className="name-input"
                        value={situationName}
                        onChange={(event) => setSituationName(event.target.value)}
                        onKeyDown={(event) => { if (event.key === 'Enter') handleAddSituation(); }}
                        placeholder="Ej: Coger el metro, hablar en público..."
                        maxLength={120}
                    />
                    <div className="level-row"><span>Nivel de malestar</span><span className="level-number">{situationLevel}</span></div>
                    <input aria-label="Nivel de malestar" type="range" min="1" max="10" value={situationLevel} onChange={(event) => setSituationLevel(Number(event.target.value))} />
                    <div className="range-marks"><span>1 Leve</span><span>5 Moderado</span><span>10 Intenso</span></div>
                    <button className="add-button" onClick={handleAddSituation} disabled={!situationName.trim()}><Plus size={17} /> Añadir a mi jerarquía</button>
                </section>

                <span className="section-label">Mi jerarquía {situations.length > 0 && `· ${situations.length}`}</span>
                {situations.length === 0 ? (
                    <div className="empty-state"><ClipboardListIcon /><br />Aún no tienes situaciones.<br />Añade la primera arriba.</div>
                ) : situations.map((situation) => {
                    const reduction = situation.entries.length
                        ? situation.entries.reduce((sum, entry) => sum + entry.before - entry.after, 0) / situation.entries.length
                        : null;
                    const isOpen = openSituationId === situation.id;
                    return (
                        <section className="situation" key={situation.id}>
                            <button className="situation-header" onClick={() => setOpenSituationId(isOpen ? null : situation.id)} aria-expanded={isOpen}>
                                <span className={`level-badge ${levelClass(situation.level)}`}>{situation.level}</span>
                                <span style={{ flex: 1, minWidth: 0 }}>
                                    <span className="situation-name">{situation.name}</span>
                                    <span className="situation-meta">
                                        {situation.entries.length} {situation.entries.length === 1 ? 'exposición' : 'exposiciones'}
                                        {reduction !== null && ` · Reducción media: ${formatNumber(reduction)}`}
                                    </span>
                                </span>
                                <ChevronRight className={`situation-chevron ${isOpen ? 'open' : ''}`} size={19} />
                            </button>
                            {isOpen && (
                                <div className="situation-panel">
                                    <div className="panel-label">Historial</div>
                                    <button className="register-button" onClick={() => openEntryModal(situation)}><Plus size={16} /> Registrar nueva exposición</button>
                                    {situation.entries.length === 0 ? (
                                        <div className="no-entries">Sin exposiciones aún.</div>
                                    ) : situation.entries.map((entry) => (
                                        <div className="entry" key={entry.id}>
                                            <div className="entry-top">
                                                <span className="entry-date">{formatDate(entry.createdAt)}</span>
                                                {entry.tool && <span className="tool-badge">{entry.tool}</span>}
                                                <span className="entry-levels">
                                                    <span className="entry-level before">{entry.before}</span>
                                                    <span className="entry-arrow">→</span>
                                                    <span className="entry-level during">{entry.during}</span>
                                                    <span className="entry-arrow">→</span>
                                                    <span className="entry-level after">{entry.after}</span>
                                                </span>
                                                <button className="delete-icon" onClick={() => deleteEntry(situation.id, entry.id)} aria-label="Eliminar exposición"><X size={16} /></button>
                                            </div>
                                            {entry.comment && <div className="entry-comment">{entry.comment}</div>}
                                        </div>
                                    ))}
                                    <button className="delete-situation" onClick={() => deleteSituation(situation.id)}><Trash2 size={13} /> Eliminar situación</button>
                                </div>
                            )}
                        </section>
                    );
                })}
                {totalEntries > 0 && <p style={{ padding: '18px 16px 0', color: 'rgba(255,255,255,.28)', fontSize: 11, textAlign: 'center' }}>{totalEntries} {totalEntries === 1 ? 'exposición registrada' : 'exposiciones registradas'}</p>}
            </div>

            {draft && (
                <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setDraft(null); }}>
                    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="exposure-modal-title">
                        <div className="modal-heading">
                            <div><h2 className="modal-title" id="exposure-modal-title">Registrar exposición</h2><p className="modal-subtitle">{situations.find((item) => item.id === draft.situationId)?.name || 'Situación'}</p></div>
                            <button className="close-button" onClick={() => setDraft(null)} aria-label="Cerrar"><X size={17} /></button>
                        </div>

                        <div className="slider-grid">
                            {(['before', 'during', 'after'] as const).map((field) => (
                                <label key={field}>
                                    <span className="slider-label">{field === 'before' ? 'Antes' : field === 'during' ? 'Durante' : 'Después'}</span>
                                    <span className={`slider-value ${field === 'during' ? 'during' : ''}`}>{draft[field]}</span>
                                    <input type="range" min="1" max="10" value={draft[field]} onChange={(event) => setDraft({ ...draft, [field]: Number(event.target.value) })} aria-label={`Ansiedad ${field}`} style={{ accentColor: field === 'during' ? '#ffa828' : '#00c4ff' }} />
                                </label>
                            ))}
                        </div>

                        <hr className="divider" />
                        <div className="field-label" style={{ marginBottom: 10 }}>Herramienta utilizada</div>
                        <div className="tool-grid">
                            {TOOLS.map(({ label, icon: Icon }) => (
                                <button key={label} className={`tool-button ${draft.tool === label ? 'selected' : ''}`} onClick={() => setDraft({ ...draft, tool: draft.tool === label ? '' : label })}><Icon size={14} /> {label}</button>
                            ))}
                        </div>

                        <hr className="divider" />
                        <label className="notes-label" htmlFor="exposure-comment">¿Qué hiciste? ¿Cómo fue?</label>
                        <textarea id="exposure-comment" className="notes-input" value={draft.comment} onChange={(event) => setDraft({ ...draft, comment: event.target.value })} placeholder="Describe lo que hiciste, cómo te sentiste y qué aprendiste de esta exposición..." maxLength={1000} />
                        <div className="modal-actions"><button className="modal-cancel" onClick={() => setDraft(null)}>Cancelar</button><button className="modal-save" onClick={saveEntry}>Guardar exposición</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ClipboardListIcon() {
    return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="M8 9h8M8 13h8M8 17h5" /></svg>;
}
