'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Headphones, PencilLine } from 'lucide-react';
import { getAllTracks } from '@/lib/db';

interface HomeScreenProps {
    onNav: (screen: string) => void;
    cbtCount?: number;
    trackCount?: number;
    userName?: string;
    isPremium?: boolean;
}

type MoodOption = {
    emoji: string;
    label: string;
};

type SavedMood = {
    emoji: string;
    label: string;
    anxiety: number;
};

type DailyGoal = {
    text: string;
    done: boolean;
};

type StoredNote = {
    content?: string;
    text?: string;
    createdAt?: string;
    date?: string;
};

const MOODS: MoodOption[] = [
    { emoji: '😰', label: 'Muy mal' },
    { emoji: '😟', label: 'Mal' },
    { emoji: '😐', label: 'Regular' },
    { emoji: '😌', label: 'Tranquilo' },
    { emoji: '😊', label: 'Bien' },
];

const getTodayKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getYesterdayKey = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 14) return 'Buenos días';
    if (hour < 21) return 'Buenas tardes';
    return 'Buenas noches';
};

export default function HomeScreen({ onNav, trackCount = 0 }: HomeScreenProps) {
    const todayKey = useMemo(() => getTodayKey(), []);
    const [greeting, setGreeting] = useState(getGreeting);
    const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
    const [anxiety, setAnxiety] = useState(5);
    const [savedMood, setSavedMood] = useState<SavedMood | null>(null);
    const [goalInput, setGoalInput] = useState('');
    const [goal, setGoal] = useState<DailyGoal | null>(null);
    const [goalStreak, setGoalStreak] = useState(0);
    const [customTrackCount, setCustomTrackCount] = useState(Math.max(0, trackCount - 3));
    const [lastTrackName, setLastTrackName] = useState('Sin audios aún');
    const [noteCount, setNoteCount] = useState(0);
    const [lastNote, setLastNote] = useState('Sin notas aún');

    const moodKey = `ansioff_home_mood_${todayKey}`;
    const goalKey = `ansioff_home_goal_${todayKey}`;

    useEffect(() => {
        const timer = window.setInterval(() => setGreeting(getGreeting()), 60_000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        try {
            const storedMood = localStorage.getItem(moodKey);
            if (storedMood) {
                const parsed = JSON.parse(storedMood) as SavedMood;
                if (parsed?.emoji && parsed?.label && typeof parsed.anxiety === 'number') {
                    setSavedMood(parsed);
                    setSelectedMood({ emoji: parsed.emoji, label: parsed.label });
                    setAnxiety(parsed.anxiety);
                }
            }

            const storedGoal = localStorage.getItem(goalKey);
            if (storedGoal) {
                const parsed = JSON.parse(storedGoal) as DailyGoal;
                if (parsed?.text) setGoal({ text: parsed.text, done: Boolean(parsed.done) });
            }

            const storedStreak = Number(localStorage.getItem('ansioff_home_goal_streak_v1') || '0');
            if (Number.isFinite(storedStreak)) setGoalStreak(storedStreak);
        } catch (error) {
            console.warn('Home state restore skipped:', error);
        }
    }, [goalKey, moodKey]);

    const refreshRecentData = useCallback(() => {
        try {
            const savedNotes = localStorage.getItem('ansioff_notes');
            const notes = savedNotes ? JSON.parse(savedNotes) as StoredNote[] : [];
            if (Array.isArray(notes) && notes.length > 0) {
                setNoteCount(notes.length);
                const firstNote = notes[0];
                const text = (firstNote.content || firstNote.text || '').trim();
                setLastNote(text ? text : 'Última nota guardada');
            } else {
                setNoteCount(0);
                setLastNote('Sin notas aún');
            }
        } catch (error) {
            console.warn('Home notes summary skipped:', error);
        }

        getAllTracks()
            .then((tracks) => {
                setCustomTrackCount(tracks.length);
                const lastTrack = tracks[tracks.length - 1];
                setLastTrackName(lastTrack?.name || 'Sin audios aún');
            })
            .catch(() => {
                setCustomTrackCount(Math.max(0, trackCount - 3));
                setLastTrackName('Sin audios aún');
            });
    }, [trackCount]);

    useEffect(() => {
        refreshRecentData();
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') refreshRecentData();
        };
        window.addEventListener('focus', refreshRecentData);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            window.removeEventListener('focus', refreshRecentData);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [refreshRecentData]);

    const saveMood = () => {
        if (!selectedMood) return;
        const nextMood = { ...selectedMood, anxiety };
        setSavedMood(nextMood);
        localStorage.setItem(moodKey, JSON.stringify(nextMood));
    };

    const editMood = () => {
        setSavedMood(null);
    };

    const addGoal = () => {
        const trimmed = goalInput.trim();
        if (!trimmed) return;
        const nextGoal = { text: trimmed, done: false };
        setGoal(nextGoal);
        setGoalInput('');
        localStorage.setItem(goalKey, JSON.stringify(nextGoal));
    };

    const deleteGoal = () => {
        setGoal(null);
        localStorage.removeItem(goalKey);
    };

    const toggleGoalDone = () => {
        if (!goal || goal.done) return;

        const nextGoal = { ...goal, done: true };
        setGoal(nextGoal);
        localStorage.setItem(goalKey, JSON.stringify(nextGoal));

        const lastCompleted = localStorage.getItem('ansioff_home_goal_last_completed_v1');
        if (lastCompleted === todayKey) return;

        const nextStreak = lastCompleted === getYesterdayKey() ? goalStreak + 1 : 1;
        setGoalStreak(nextStreak);
        localStorage.setItem('ansioff_home_goal_streak_v1', String(nextStreak));
        localStorage.setItem('ansioff_home_goal_last_completed_v1', todayKey);
    };

    const anxietyFill = `${((anxiety - 1) / 9) * 100}%`;

    return (
        <div className="min-h-full bg-[#03080f] text-[#ddeef5] overflow-y-auto pb-32 font-sans relative scrollbar-hide">
            <style jsx>{`
                .home-content{
                    padding-left:max(18px,calc(env(safe-area-inset-left,0px) + 14px));
                    padding-right:max(18px,calc(env(safe-area-inset-right,0px) + 14px));
                }
                .home-head{
                    padding-top:max(58px,calc(var(--safe-top,0px) + 18px));
                    padding-bottom:18px;
                }
                .home-period{
                    font-size:12px;
                    font-weight:700;
                    letter-spacing:.15em;
                    text-transform:uppercase;
                    color:#38bdf8;
                    margin-bottom:7px;
                    opacity:.82;
                }
                .home-title{
                    font-size:clamp(32px, 8.4vw, 46px);
                    font-weight:800;
                    letter-spacing:-.045em;
                    color:#eef8ff;
                    line-height:.98;
                    text-wrap:balance;
                    max-width:260px;
                }
                .home-stack{display:flex;flex-direction:column;gap:14px;}
                .soft-card{
                    background:linear-gradient(145deg, rgba(255,255,255,.07), rgba(255,255,255,.035));
                    border:1px solid rgba(255,255,255,.08);
                    box-shadow:0 18px 45px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.04);
                    border-radius:20px;
                    padding:17px 18px 16px;
                    backdrop-filter:blur(22px);
                    -webkit-backdrop-filter:blur(22px);
                }
                .card-label{
                    font-size:11px;
                    font-weight:800;
                    letter-spacing:.16em;
                    text-transform:uppercase;
                    color:rgba(210,235,245,.42);
                    margin-bottom:13px;
                }
                .mood-question{
                    font-size:14px;
                    color:rgba(221,238,245,.68);
                    margin-bottom:14px;
                    line-height:1.45;
                }
                .mood-grid{
                    display:grid;
                    grid-template-columns:repeat(5, minmax(0, 1fr));
                    gap:7px;
                    margin-bottom:14px;
                }
                .mood-button{
                    min-width:0;
                    border-radius:15px;
                    padding:10px 4px 9px;
                    border:1px solid rgba(255,255,255,.08);
                    background:rgba(255,255,255,.025);
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    gap:6px;
                    transition:transform .18s ease, border-color .18s ease, background .18s ease;
                }
                .mood-button:active{transform:scale(.94);}
                .mood-button.selected{
                    border-color:rgba(56,189,248,.7);
                    background:rgba(14,165,233,.16);
                    box-shadow:0 0 22px rgba(14,165,233,.12);
                }
                .mood-emoji{font-size:23px;line-height:1;}
                .mood-word{
                    font-size:9px;
                    line-height:1.1;
                    color:rgba(221,238,245,.44);
                    white-space:nowrap;
                }
                .mood-button.selected .mood-word{color:#7dd3fc;}
                .slider-head{
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    margin-bottom:10px;
                    font-size:12px;
                    color:rgba(221,238,245,.62);
                }
                .slider-value{
                    font-size:23px;
                    line-height:1;
                    font-weight:800;
                    color:#38bdf8;
                }
                .anxiety-slider{
                    width:100%;
                    -webkit-appearance:none;
                    appearance:none;
                    height:4px;
                    border-radius:999px;
                    background:linear-gradient(90deg,#38bdf8 ${anxietyFill}, rgba(255,255,255,.12) ${anxietyFill});
                    outline:none;
                    margin-bottom:7px;
                }
                .anxiety-slider::-webkit-slider-thumb{
                    -webkit-appearance:none;
                    width:19px;
                    height:19px;
                    border-radius:999px;
                    background:#38bdf8;
                    border:2px solid #03080f;
                    box-shadow:0 0 16px rgba(56,189,248,.58);
                }
                .anxiety-slider::-moz-range-thumb{
                    width:19px;
                    height:19px;
                    border-radius:999px;
                    background:#38bdf8;
                    border:2px solid #03080f;
                    box-shadow:0 0 16px rgba(56,189,248,.58);
                }
                .slider-marks{
                    display:flex;
                    justify-content:space-between;
                    color:rgba(221,238,245,.32);
                    font-size:9px;
                    margin-bottom:12px;
                }
                .primary-home-btn{
                    width:100%;
                    border:0;
                    border-radius:13px;
                    background:#38bdf8;
                    color:#03080f;
                    font-weight:800;
                    font-size:14px;
                    padding:11px 12px;
                    box-shadow:0 9px 26px rgba(14,165,233,.28);
                    transition:transform .18s ease, opacity .18s ease;
                }
                .primary-home-btn:active{transform:scale(.98);opacity:.9;}
                .mood-summary{
                    display:flex;
                    align-items:center;
                    gap:12px;
                }
                .summary-emoji{font-size:34px;line-height:1;}
                .summary-title{font-size:17px;font-weight:750;color:#eef8ff;line-height:1.15;}
                .summary-sub{font-size:12px;color:rgba(221,238,245,.58);margin-top:2px;}
                .edit-pill{
                    margin-left:auto;
                    border:0;
                    border-radius:9px;
                    background:rgba(14,165,233,.18);
                    color:#38bdf8;
                    font-size:12px;
                    font-weight:750;
                    padding:6px 11px;
                }
                .goal-label{
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:12px;
                }
                .goal-streak{
                    display:inline-flex;
                    align-items:center;
                    gap:4px;
                    color:#38bdf8;
                    background:rgba(14,165,233,.16);
                    border:1px solid rgba(56,189,248,.12);
                    border-radius:999px;
                    padding:3px 9px;
                    font-size:10px;
                    letter-spacing:0;
                    text-transform:none;
                    white-space:nowrap;
                }
                .goal-prompt{
                    color:rgba(221,238,245,.68);
                    font-size:14px;
                    line-height:1.45;
                    margin-bottom:12px;
                }
                .goal-row{
                    display:flex;
                    align-items:flex-end;
                    gap:10px;
                }
                .goal-input{
                    min-height:45px;
                    flex:1;
                    resize:none;
                    outline:none;
                    border:1px solid rgba(255,255,255,.1);
                    background:rgba(255,255,255,.055);
                    color:#eef8ff;
                    border-radius:14px;
                    font-size:14px;
                    line-height:1.35;
                    padding:12px 14px;
                }
                .goal-input::placeholder{color:rgba(221,238,245,.34);}
                .goal-add{
                    width:43px;
                    height:43px;
                    border-radius:13px;
                    flex-shrink:0;
                    border:0;
                    background:#0ea5e9;
                    color:white;
                    font-size:25px;
                    line-height:1;
                    box-shadow:0 8px 25px rgba(14,165,233,.35);
                }
                .goal-item{
                    display:flex;
                    align-items:center;
                    gap:12px;
                }
                .goal-check{
                    width:28px;
                    height:28px;
                    border-radius:50%;
                    border:1.5px solid rgba(255,255,255,.18);
                    background:transparent;
                    color:transparent;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:14px;
                    transition:all .2s ease;
                }
                .goal-check.done{
                    background:#38bdf8;
                    border-color:#38bdf8;
                    color:#03080f;
                    box-shadow:0 4px 16px rgba(56,189,248,.44);
                }
                .goal-text{
                    flex:1;
                    color:#eef8ff;
                    font-size:15px;
                    line-height:1.4;
                    min-width:0;
                    word-break:break-word;
                }
                .goal-text.done{
                    color:rgba(221,238,245,.38);
                    text-decoration:line-through;
                }
                .goal-delete{
                    border:0;
                    background:transparent;
                    color:rgba(221,238,245,.34);
                    font-size:22px;
                    line-height:1;
                    padding:4px;
                }
                .goal-banner{
                    display:flex;
                    align-items:center;
                    gap:10px;
                    margin-top:12px;
                    border-radius:13px;
                    padding:11px 13px;
                    border:1px solid rgba(56,189,248,.15);
                    background:rgba(14,165,233,.08);
                }
                .goal-banner-text{
                    flex:1;
                    font-size:13px;
                    line-height:1.35;
                    color:rgba(125,211,252,.9);
                }
                .goal-new{
                    border:0;
                    background:rgba(14,165,233,.16);
                    border-radius:8px;
                    color:#7dd3fc;
                    padding:5px 9px;
                    font-size:11px;
                    font-weight:800;
                    white-space:nowrap;
                }
                .recent-label{
                    margin:4px 0 -3px;
                    font-size:11px;
                    font-weight:800;
                    letter-spacing:.2em;
                    text-transform:uppercase;
                    color:rgba(210,235,245,.38);
                }
                .recent-row{
                    display:grid;
                    grid-template-columns:repeat(2, minmax(0, 1fr));
                    gap:10px;
                }
                .recent-pill{
                    min-width:0;
                    border-radius:17px;
                    border:1px solid rgba(255,255,255,.08);
                    background:linear-gradient(145deg, rgba(255,255,255,.07), rgba(255,255,255,.035));
                    padding:14px;
                    text-align:left;
                    transition:transform .18s ease, background .18s ease;
                }
                .recent-pill:active{transform:scale(.97);background:rgba(255,255,255,.08);}
                .recent-top{
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    margin-bottom:9px;
                }
                .recent-icon{
                    width:30px;
                    height:30px;
                    border-radius:11px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:rgba(14,165,233,.12);
                    color:#7dd3fc;
                }
                .recent-badge{
                    min-width:18px;
                    height:18px;
                    padding:0 6px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    border-radius:999px;
                    background:rgba(14,165,233,.18);
                    color:#38bdf8;
                    font-size:10px;
                    font-weight:800;
                }
                .recent-title{font-size:13px;font-weight:800;color:#eef8ff;margin-bottom:3px;}
                .recent-sub{
                    color:rgba(221,238,245,.38);
                    font-size:11px;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
                }
                @media(max-width:390px){
                    .home-content{
                        padding-left:max(16px,calc(env(safe-area-inset-left,0px) + 12px));
                        padding-right:max(16px,calc(env(safe-area-inset-right,0px) + 12px));
                    }
                    .home-head{padding-top:max(54px,calc(var(--safe-top,0px) + 15px));padding-bottom:15px;}
                    .home-title{font-size:clamp(31px, 8.2vw, 42px);}
                    .soft-card{padding:16px 16px 15px;border-radius:19px;}
                    .home-stack{gap:13px;}
                    .mood-grid{gap:6px;}
                    .mood-button{padding:9px 3px 8px;}
                    .mood-word{font-size:8.5px;}
                }
                @media(max-height:760px){
                    .home-head{padding-top:max(48px,calc(var(--safe-top,0px) + 12px));padding-bottom:12px;}
                    .home-title{font-size:clamp(29px, 7.4vw, 39px);}
                    .home-stack{gap:11px;}
                    .soft-card{padding:14px 15px 13px;}
                    .card-label{margin-bottom:10px;font-size:10px;}
                    .mood-question,.goal-prompt{font-size:13px;margin-bottom:10px;}
                    .mood-grid{margin-bottom:10px;}
                    .mood-button{padding:8px 3px 7px;}
                    .mood-emoji{font-size:20px;}
                    .primary-home-btn{padding:10px 12px;}
                    .recent-pill{padding:12px;}
                }
            `}</style>

            <div className="aurora">
                <div className="aurora-1" style={{ background: 'radial-gradient(circle, rgba(90, 173, 207, 0.38), transparent 70%)', top: '-110px', left: '-70px' }} />
                <div className="aurora-2" style={{ background: 'radial-gradient(circle, rgba(124, 58, 237, 0.24), transparent 70%)', bottom: '30px', right: '-90px' }} />
            </div>

            <div className="home-content relative z-10">
                <header className="home-head">
                    <div className="home-period">{greeting}</div>
                    <h1 className="home-title">¿Cómo estás<br />hoy?</h1>
                </header>

                <main className="home-stack">
                    <section className="soft-card">
                        <div className="card-label">Estado de hoy</div>

                        {savedMood ? (
                            <div className="mood-summary">
                                <div className="summary-emoji">{savedMood.emoji}</div>
                                <div>
                                    <div className="summary-title">{savedMood.label}</div>
                                    <div className="summary-sub">Ansiedad: {savedMood.anxiety}/10</div>
                                </div>
                                <button className="edit-pill" onClick={editMood}>Editar</button>
                            </div>
                        ) : (
                            <>
                                <p className="mood-question">Selecciona cómo te encuentras ahora</p>
                                <div className="mood-grid">
                                    {MOODS.map((mood) => (
                                        <button
                                            key={mood.label}
                                            className={`mood-button ${selectedMood?.label === mood.label ? 'selected' : ''}`}
                                            onClick={() => setSelectedMood(mood)}
                                            type="button"
                                        >
                                            <span className="mood-emoji">{mood.emoji}</span>
                                            <span className="mood-word">{mood.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {selectedMood && (
                                    <>
                                        <div className="slider-head">
                                            <span>Nivel de ansiedad</span>
                                            <span className="slider-value">{anxiety}</span>
                                        </div>
                                        <input
                                            className="anxiety-slider"
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={anxiety}
                                            onChange={(event) => setAnxiety(Number(event.currentTarget.value))}
                                        />
                                        <div className="slider-marks">
                                            <span>Mínima</span>
                                            <span>Moderada</span>
                                            <span>Máxima</span>
                                        </div>
                                        <button className="primary-home-btn" onClick={saveMood} type="button">
                                            Guardar estado del día
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </section>

                    <section className="soft-card">
                        <div className="card-label goal-label">
                            <span>🎯 Objetivo del día</span>
                            {goalStreak > 0 && (
                                <span className="goal-streak">🔥 {goalStreak} días</span>
                            )}
                        </div>

                        {!goal ? (
                            <>
                                <p className="goal-prompt">Márcate un pequeño objetivo y cúmplelo hoy.</p>
                                <div className="goal-row">
                                    <textarea
                                        className="goal-input"
                                        rows={2}
                                        value={goalInput}
                                        onChange={(event) => setGoalInput(event.currentTarget.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                event.preventDefault();
                                                addGoal();
                                            }
                                        }}
                                        placeholder="Ej: Salir a caminar, llamar a un amigo..."
                                    />
                                    <button className="goal-add" onClick={addGoal} type="button" aria-label="Añadir objetivo">+</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="goal-item">
                                    <button
                                        className={`goal-check ${goal.done ? 'done' : ''}`}
                                        onClick={toggleGoalDone}
                                        type="button"
                                        aria-label="Marcar objetivo como completado"
                                    >
                                        ✓
                                    </button>
                                    <div className={`goal-text ${goal.done ? 'done' : ''}`}>{goal.text}</div>
                                    <button className="goal-delete" onClick={deleteGoal} type="button" aria-label="Eliminar objetivo">×</button>
                                </div>

                                {goal.done && (
                                    <div className="goal-banner">
                                        <span>🎉</span>
                                        <span className="goal-banner-text">¡Lo has conseguido!<br />Cada paso cuenta.</span>
                                        <button className="goal-new" onClick={deleteGoal} type="button">Nuevo objetivo</button>
                                    </div>
                                )}
                            </>
                        )}
                    </section>

                    <div className="recent-label">Reciente</div>
                    <section className="recent-row">
                        <button className="recent-pill" onClick={() => onNav('sounds')} type="button">
                            <div className="recent-top">
                                <span className="recent-icon"><Headphones size={17} /></span>
                                <span className="recent-badge">{customTrackCount}</span>
                            </div>
                            <div className="recent-title">Sonidos</div>
                            <div className="recent-sub">{lastTrackName}</div>
                        </button>

                        <button className="recent-pill" onClick={() => onNav('notes')} type="button">
                            <div className="recent-top">
                                <span className="recent-icon"><PencilLine size={17} /></span>
                                <span className="recent-badge">{noteCount}</span>
                            </div>
                            <div className="recent-title">Notas</div>
                            <div className="recent-sub">{lastNote}</div>
                        </button>
                    </section>
                </main>
            </div>
        </div>
    );
}
