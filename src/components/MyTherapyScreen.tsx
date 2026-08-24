'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Share2,
  Download,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  Smile,
  Plus,
  Trash2,
  Check,
  EyeOff,
  BookOpen,
  ChevronRight,
  Brain
} from 'lucide-react';
import { exportClinicalDiaryPDF, shareClinicalReportPDF } from '@/utils/exportUtils';
import { getStats, addCbtEntry } from '@/utils/stats';

export interface TherapyGoal {
  id: string;
  text: string;
  category: string;
  progress: number;
  completed: boolean;
  createdAt: string;
}

export interface MoodLogEntry {
  id: string;
  date: string;
  moodLevel: number; // 1-10
  anxietyLevel?: number; // 0-10
  notes?: string;
  time: string;
}

export interface CBTThoughtEntry {
  id: string;
  date: string;
  situation: string;
  negativeThought: string;
  alternativeThought?: string;
  distortions: string[];
  time: string;
}

export interface AvoidedSituation {
  id: string;
  situation: string;
  distressLevel: number;
  category: string;
  createdAt: string;
}

export interface ExposureLogEntry {
  id?: string | number;
  date?: string;
  created_at?: string;
  title?: string;
  situation?: string;
  initial_discomfort?: number;
  max_discomfort?: number;
  final_discomfort?: number;
  duration_mins?: number;
  notes?: string;
  learnings?: string;
}

interface MyTherapyScreenProps {
  onBack: () => void;
  onNav: (screen: string) => void;
}

export default function MyTherapyScreen({ onBack, onNav }: MyTherapyScreenProps) {
  const [activeTab, setActiveTab] = useState<
    'objetivos' | 'exposiciones' | 'depresion' | 'situaciones' | 'pensamientos' | 'progreso' | 'diario'
  >('objetivos');

  // State: Goals
  const [goals, setGoals] = useState<TherapyGoal[]>([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Ansiedad / Superar Miedo');

  // State: Mood / Depresión
  const [moodLogs, setMoodLogs] = useState<MoodLogEntry[]>([]);
  const [sliderMood, setSliderMood] = useState(5);
  const [sliderAnxiety, setSliderAnxiety] = useState(5);
  const [moodNote, setMoodNote] = useState('');

  // State: Avoided Situations
  const [avoidedList, setAvoidedList] = useState<AvoidedSituation[]>([]);
  const [newAvoidedText, setNewAvoidedText] = useState('');
  const [newAvoidedDistress, setNewAvoidedDistress] = useState(7);
  const [newAvoidedCategory, setNewAvoidedCategory] = useState('Agorafobia / Espacios');

  // State: Exposure Logs
  const [exposureLogs, setExposureLogs] = useState<ExposureLogEntry[]>([]);

  // State: Thoughts / Pensamientos TCC
  const [thoughts, setThoughts] = useState<CBTThoughtEntry[]>([]);
  const [thoughtSituation, setThoughtSituation] = useState('');
  const [negativeThought, setNegativeThought] = useState('');
  const [alternativeThought, setAlternativeThought] = useState('');
  const [selectedDistortions, setSelectedDistortions] = useState<string[]>([]);

  // State: Therapy Journal Prep
  const [journalPrep, setJournalPrep] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  // State: Streak & Sharing
  const [streakDays, setStreakDays] = useState(0);
  const [isSharing, setIsSharing] = useState(false);

  // Load all real data from localStorage & stats system
  useEffect(() => {
    try {
      // 1. Goals
      const savedG = localStorage.getItem('ansioff_therapy_goals_v2');
      if (savedG) {
        setGoals(JSON.parse(savedG));
      } else {
        const defaultGoals: TherapyGoal[] = [
          { id: '1', text: 'Ir a la farmacia solo', category: 'Ansiedad / Superar Miedo', progress: 60, completed: false, createdAt: new Date().toISOString() },
          { id: '2', text: 'Caminar 20 minutos', category: 'Bienestar General', progress: 85, completed: false, createdAt: new Date().toISOString() },
          { id: '3', text: 'Llamar a un amigo', category: 'Habilidades Sociales', progress: 30, completed: false, createdAt: new Date().toISOString() },
        ];
        setGoals(defaultGoals);
        localStorage.setItem('ansioff_therapy_goals_v2', JSON.stringify(defaultGoals));
      }

      // 2. Mood Logs
      const savedM = localStorage.getItem('ansioff_mood_logs_minimal') || localStorage.getItem('ansioff_mood_logs');
      if (savedM) setMoodLogs(JSON.parse(savedM));

      // 3. Avoided Situations
      const savedA = localStorage.getItem('ansioff_avoided_situations');
      if (savedA) setAvoidedList(JSON.parse(savedA));

      // 4. Exposure Logs
      const expStr = localStorage.getItem('ansioff_exposure_logs') || localStorage.getItem('ansioff_exposure_records') || localStorage.getItem('ansioff_exposure_steps');
      if (expStr) {
        try {
          setExposureLogs(JSON.parse(expStr));
        } catch {
          setExposureLogs([]);
        }
      }

      // 5. Thoughts / CBT Entries
      const savedT = localStorage.getItem('ansioff_local_cbt_records') || localStorage.getItem('ansioff_cbt_entries');
      if (savedT) {
        try {
          const parsed = JSON.parse(savedT);
          setThoughts(
            parsed.map((item: any) => ({
              id: item.id || Date.now().toString(),
              date: item.created_at || item.date || new Date().toISOString(),
              situation: item.trigger || item.situation || '',
              negativeThought: item.thought || item.negative_thought || '',
              alternativeThought: item.alternative || item.alternative_thought || '',
              distortions: item.distortion ? [item.distortion] : item.distortions || [],
              time: item.time || new Date(item.created_at || Date.now()).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            }))
          );
        } catch {
          setThoughts([]);
        }
      }

      // 6. Journal Prep Notes
      const savedJ = localStorage.getItem('ansioff_therapy_journal_prep');
      if (savedJ) setJournalPrep(savedJ);

      // 7. Streak Days
      const stats = getStats();
      setStreakDays(stats.streak || 0);

    } catch (e) {
      console.warn('Error loading therapy state:', e);
    }
  }, []);

  // Sync helpers
  const saveGoals = (updated: TherapyGoal[]) => {
    setGoals(updated);
    localStorage.setItem('ansioff_therapy_goals_v2', JSON.stringify(updated));
  };

  const saveMoodLogs = (updated: MoodLogEntry[]) => {
    setMoodLogs(updated);
    localStorage.setItem('ansioff_mood_logs_minimal', JSON.stringify(updated));
  };

  const saveAvoided = (updated: AvoidedSituation[]) => {
    setAvoidedList(updated);
    localStorage.setItem('ansioff_avoided_situations', JSON.stringify(updated));
  };

  const saveThoughts = (updated: CBTThoughtEntry[]) => {
    setThoughts(updated);
    const cbtFormatted = updated.map((t) => ({
      id: t.id,
      created_at: t.date,
      trigger: t.situation,
      thought: t.negativeThought,
      alternative: t.alternativeThought,
      distortion: t.distortions.join(', '),
    }));
    localStorage.setItem('ansioff_local_cbt_records', JSON.stringify(cbtFormatted));
  };

  // Dynamic calculated stats
  const activeGoalsCount = useMemo(() => goals.filter((g) => !g.completed).length, [goals]);

  const averageMood = useMemo(() => {
    if (moodLogs.length === 0) return '—';
    const sum = moodLogs.reduce((acc, curr) => acc + (curr.moodLevel || 0), 0);
    return (sum / moodLogs.length).toFixed(1);
  }, [moodLogs]);

  const exposuresCount = useMemo(() => exposureLogs.length, [exposureLogs]);

  // Goal Actions
  const handleAddGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal: TherapyGoal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      category: newGoalCategory,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    saveGoals([newGoal, ...goals]);
    setNewGoalText('');
  };

  const useExample = (text: string) => {
    setNewGoalText(text);
  };

  const toggleGoal = (id: string) => {
    const updated = goals.map((g) => {
      if (g.id === id) {
        const nextDone = !g.completed;
        return { ...g, completed: nextDone, progress: nextDone ? 100 : g.progress };
      }
      return g;
    });
    saveGoals(updated);
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter((g) => g.id !== id));
  };

  // Mood Actions
  const handleSaveMood = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entry: MoodLogEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      moodLevel: sliderMood,
      anxietyLevel: sliderAnxiety,
      notes: moodNote.trim() || 'Sin nota',
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    saveMoodLogs([entry, ...moodLogs]);
    setMoodNote('');
  };

  const deleteMood = (id: string) => {
    saveMoodLogs(moodLogs.filter((m) => m.id !== id));
  };

  // Avoided Actions
  const handleAddAvoided = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAvoidedText.trim()) return;

    const item: AvoidedSituation = {
      id: Date.now().toString(),
      situation: newAvoidedText.trim(),
      distressLevel: newAvoidedDistress,
      category: newAvoidedCategory,
      createdAt: new Date().toISOString(),
    };

    saveAvoided([item, ...avoidedList]);
    setNewAvoidedText('');
  };

  const deleteAvoided = (id: string) => {
    saveAvoided(avoidedList.filter((a) => a.id !== id));
  };

  // Distortion Selection Toggle
  const toggleDistortion = (d: string) => {
    if (selectedDistortions.includes(d)) {
      setSelectedDistortions(selectedDistortions.filter((x) => x !== d));
    } else {
      setSelectedDistortions([...selectedDistortions, d]);
    }
  };

  // Thought Actions
  const handleAddThought = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!thoughtSituation.trim() || !negativeThought.trim()) {
      alert('Completa la situación y el pensamiento negativo');
      return;
    }

    const newThought: CBTThoughtEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      situation: thoughtSituation.trim(),
      negativeThought: negativeThought.trim(),
      alternativeThought: alternativeThought.trim() || undefined,
      distortions: [...selectedDistortions],
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    saveThoughts([newThought, ...thoughts]);
    addCbtEntry();

    setThoughtSituation('');
    setNegativeThought('');
    setAlternativeThought('');
    setSelectedDistortions([]);
  };

  const deleteThought = (id: string) => {
    saveThoughts(thoughts.filter((t) => t.id !== id));
  };

  // Journal Action
  const handleSaveJournal = () => {
    localStorage.setItem('ansioff_therapy_journal_prep', journalPrep);
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2500);
  };

  // Share handler
  const handleShareReport = async () => {
    setIsSharing(true);
    try {
      const res = await shareClinicalReportPDF();
      if (!res.shared && res.error) {
        alert('Se ha descargado el informe PDF en tu dispositivo.');
      }
    } catch {
      exportClinicalDiaryPDF();
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0e1a] text-[#e5e7eb] font-sans overflow-y-auto pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0e1a]/90 backdrop-blur border-b border-indigo-900/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-indigo-900/30 rounded-lg transition text-slate-300"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">Mi Terapia</h1>
                <span className="px-2 py-0.5 bg-indigo-600/30 text-indigo-300 text-xs rounded-full border border-indigo-500/30 font-medium">
                  Clínico
                </span>
              </div>
              <p className="text-xs text-gray-400">Objetivos, autoregistro y canal con tu psicólogo/a</p>
            </div>
          </div>

          <button
            onClick={() => onNav('sc-psychologists')}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-900/30 hover:bg-indigo-900/50 rounded-lg border border-indigo-500/30 text-xs text-indigo-300 font-medium transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Ver Red</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* Card Profesional */}
        <section className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] border border-indigo-500/30 shadow-xl">
          <div className="relative z-10">
            <span className="text-xs font-semibold text-indigo-200 tracking-wider uppercase block mb-1">
              ENLACE CON TU PROFESIONAL
            </span>
            <h2 className="text-xl font-bold text-white mb-2">Comparte tu registro clínico en un clic</h2>
            <p className="text-indigo-100/80 text-sm mb-4 leading-relaxed">
              Genera un informe PDF con tu progreso de ansiedad, desensibilización y tareas de activación para tu terapeuta.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleShareReport}
                disabled={isSharing}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2.5 rounded-lg font-medium text-sm text-white flex items-center gap-2 transition hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartir</span>
              </button>
              <button
                onClick={() => exportClinicalDiaryPDF()}
                className="bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-lg text-sm text-white border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats dinámicas reales (4-grid) */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#111827] rounded-xl p-3.5 border border-indigo-900/30">
            <p className="text-xl font-bold text-white">{activeGoalsCount}</p>
            <p className="text-xs text-gray-400">Objetivos activos</p>
          </div>
          <div className="bg-[#111827] rounded-xl p-3.5 border border-indigo-900/30">
            <p className="text-xl font-bold text-emerald-400">{streakDays}</p>
            <p className="text-xs text-gray-400">Días de racha</p>
          </div>
          <div className="bg-[#111827] rounded-xl p-3.5 border border-indigo-900/30">
            <p className="text-xl font-bold text-purple-300">{averageMood}</p>
            <p className="text-xs text-gray-400">Ánimo promedio</p>
          </div>
          <div className="bg-[#111827] rounded-xl p-3.5 border border-indigo-900/30">
            <p className="text-xl font-bold text-blue-300">{exposuresCount}</p>
            <p className="text-xs text-gray-400">Exposiciones</p>
          </div>
        </section>

        {/* Tabs con ajuste multilínea (flex-wrap) ideal para móviles */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'objetivos', label: '🎯 Objetivos' },
            { id: 'exposiciones', label: '📈 Exposiciones' },
            { id: 'depresion', label: '😔 Depresión' },
            { id: 'situaciones', label: '🚫 Situaciones Evitadas' },
            { id: 'pensamientos', label: '🧠 Pensamientos' },
            { id: 'progreso', label: '✨ Progreso' },
            { id: 'diario', label: '📖 Diario' },
          ].map((t) => {
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isSel
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md font-semibold'
                    : 'bg-[#111827] text-slate-300 hover:text-white border border-indigo-900/40 hover:bg-indigo-900/30'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OBJETIVOS */}
        {activeTab === 'objetivos' && (
          <section className="space-y-4">
            <div className="bg-[#111827] rounded-2xl p-5 border border-indigo-900/30 shadow-xl">
              <h3 className="font-semibold text-white mb-3">Añadir Nuevo Objetivo Terapéutico</h3>

              <form onSubmit={handleAddGoal}>
                <input
                  type="text"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  placeholder="Ej. 'Ir a la farmacia solo'..."
                  className="w-full bg-[#0a0e1a] border border-indigo-900/50 rounded-xl px-4 py-3 text-sm mb-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition"
                />

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => useExample('Ir a la farmacia solo')}
                    className="px-3 py-1.5 bg-[#0a0e1a] hover:bg-indigo-900/40 border border-indigo-900/50 rounded-full text-xs text-slate-300 transition-all hover:-translate-y-0.5"
                  >
                    🏥 Farmacia
                  </button>
                  <button
                    type="button"
                    onClick={() => useExample('Caminar 20 minutos')}
                    className="px-3 py-1.5 bg-[#0a0e1a] hover:bg-indigo-900/40 border border-indigo-900/50 rounded-full text-xs text-slate-300 transition-all hover:-translate-y-0.5"
                  >
                    🚶 Caminar
                  </button>
                  <button
                    type="button"
                    onClick={() => useExample('Llamar a un amigo')}
                    className="px-3 py-1.5 bg-[#0a0e1a] hover:bg-indigo-900/40 border border-indigo-900/50 rounded-full text-xs text-slate-300 transition-all hover:-translate-y-0.5"
                  >
                    📞 Llamar
                  </button>
                </div>

                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-indigo-900/50 rounded-xl px-4 py-3 text-sm mb-4 text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Ansiedad / Superar Miedo">Ansiedad / Superar Miedo</option>
                  <option value="Depresión / Activación Conductual">Depresión / Activación Conductual</option>
                  <option value="Habilidades Sociales">Habilidades Sociales</option>
                </select>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-5 py-3 rounded-xl font-medium text-sm text-white shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
                >
                  + Guardar Objetivo
                </button>
              </form>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">
                Tus Objetivos <span className="text-xs text-gray-400">({goals.length})</span>
              </h3>

              {goals.length === 0 ? (
                <div className="bg-[#111827] rounded-xl p-6 text-center text-sm text-gray-400 border border-indigo-900/30">
                  Sin objetivos. ¡Crea el primero!
                </div>
              ) : (
                <div className="space-y-2">
                  {goals.map((g) => (
                    <div
                      key={g.id}
                      className={`bg-[#111827] rounded-xl p-3 border border-indigo-900/30 transition-all hover:border-indigo-500/40 ${
                        g.completed ? 'opacity-60 bg-emerald-950/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleGoal(g.id)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition ${
                            g.completed
                              ? 'bg-indigo-500 border-indigo-500 text-white'
                              : 'border-indigo-500/50 hover:border-indigo-400'
                          }`}
                        >
                          {g.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${g.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                            {g.text}
                          </p>
                          <p className="text-xs text-indigo-400 mb-2">{g.category}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[#0a0e1a] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${g.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-indigo-300 font-medium">{g.progress}%</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteGoal(g.id)}
                          className="text-gray-500 hover:text-rose-400 transition shrink-0 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 2: EXPOSICIONES (Conectado al motor guiado y logs reales) */}
        {activeTab === 'exposiciones' && (
          <section className="space-y-4">
            <div className="bg-[#111827] rounded-2xl p-5 border border-indigo-900/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white text-base flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Jerarquía de Exposición (SUDs)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Desensibilización progresiva guiada para reducir la evitación y habituar el malestar.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNav('sc-exposure-why')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-3 text-sm font-semibold text-white transition-all shadow-md cursor-pointer"
              >
                <span>Ir al Módulo Guiado de Exposición</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-400 px-1">Registros Realizados ({exposureLogs.length})</h4>
              {exposureLogs.length === 0 ? (
                <div className="bg-[#111827] rounded-xl p-6 text-center text-sm text-gray-400 border border-indigo-900/30">
                  Sin exposiciones registradas aún.
                </div>
              ) : (
                exposureLogs.map((log, idx) => (
                  <div key={idx} className="bg-[#111827] rounded-xl p-3 border border-indigo-900/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-300">{log.situation || log.title || 'Exposición gradual'}</span>
                      <span className="text-[11px] text-slate-500">
                        {log.created_at ? new Date(log.created_at).toLocaleDateString('es-ES') : 'Reciente'}
                      </span>
                    </div>
                    {(log.initial_discomfort !== undefined || log.max_discomfort !== undefined || log.final_discomfort !== undefined) && (
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span>SUDs:</span>
                        <span className="text-indigo-400">Inicial {log.initial_discomfort ?? '—'}/10</span>
                        <span>➔</span>
                        <span className="text-rose-400">Pico {log.max_discomfort ?? '—'}/10</span>
                        <span>➔</span>
                        <span className="text-emerald-400">Final {log.final_discomfort ?? '—'}/10</span>
                      </div>
                    )}
                    {log.notes && <p className="text-xs text-slate-400 italic">"{log.notes}"</p>}
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* TAB 3: DEPRESIÓN Y ÁNIMO (SLIDER CROMÁTICO DUAL) */}
        {activeTab === 'depresion' && (
          <section className="space-y-4">
            <div className="bg-[#111827] rounded-2xl p-5 border border-indigo-900/30 space-y-4">
              <h3 className="font-semibold text-white">¿Cómo te sientes hoy?</h3>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Estado de Ánimo (1 = muy bajo, 10 = excelente)</span>
                  <span className="text-lg font-bold text-purple-400">{sliderMood}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sliderMood}
                  onChange={(e) => setSliderMood(Number(e.target.value))}
                  className="w-full h-2 rounded-lg outline-none cursor-pointer accent-purple-500"
                  style={{
                    background: 'linear-gradient(90deg, #ef4444, #f59e0b, #10b981)',
                  }}
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Nivel de Ansiedad (0 = calma total, 10 = muy alta)</span>
                  <span className="text-lg font-bold text-indigo-400">{sliderAnxiety}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={sliderAnxiety}
                  onChange={(e) => setSliderAnxiety(Number(e.target.value))}
                  className="w-full h-2 rounded-lg outline-none cursor-pointer accent-indigo-500"
                />
              </div>

              <input
                type="text"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="¿Qué estás haciendo? (opcional)"
                className="w-full bg-[#0a0e1a] border border-indigo-900/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition"
              />

              <button
                onClick={handleSaveMood}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-5 py-3 rounded-xl font-medium text-sm text-white shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
              >
                Guardar Registro Emocional
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">
                Registros <span className="text-xs text-gray-400">({moodLogs.length})</span>
              </h3>

              {moodLogs.length === 0 ? (
                <div className="bg-[#111827] rounded-xl p-6 text-center text-sm text-gray-400 border border-indigo-900/30">
                  Sin registros aún
                </div>
              ) : (
                <div className="space-y-2">
                  {moodLogs.map((m) => {
                    const colorClass =
                      m.moodLevel <= 3
                        ? 'text-red-400'
                        : m.moodLevel <= 6
                        ? 'text-amber-400'
                        : 'text-emerald-400';
                    return (
                      <div
                        key={m.id}
                        className="bg-[#111827] rounded-xl p-3 border border-indigo-900/30 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-indigo-900/30 flex items-center justify-center shrink-0">
                          <span className={`text-lg font-bold ${colorClass}`}>{m.moodLevel}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{m.notes}</p>
                          <p className="text-xs text-gray-400">
                            Ánimo: {m.moodLevel}/10 {m.anxietyLevel !== undefined ? `| Ansiedad: ${m.anxietyLevel}/10` : ''} · {m.time}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteMood(m.id)}
                          className="text-gray-500 hover:text-rose-400 p-1 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 4: SITUACIONES EVITADAS */}
        {activeTab === 'situaciones' && (
          <section className="space-y-4">
            <div className="bg-[#111827] rounded-2xl p-5 border border-indigo-900/30 space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-rose-400" />
                Registrar Situación Evitada
              </h3>

              <form onSubmit={handleAddAvoided} className="space-y-3">
                <input
                  type="text"
                  value={newAvoidedText}
                  onChange={(e) => setNewAvoidedText(e.target.value)}
                  placeholder="Ej. 'Reunión social', 'Viajar en metro'..."
                  className="w-full bg-[#0a0e1a] border border-indigo-900/50 rounded-xl p-3 text-xs text-white placeholder:text-gray-500 focus:outline-none"
                />

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Nivel de malestar al intentar: {newAvoidedDistress}/10</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={newAvoidedDistress}
                    onChange={(e) => setNewAvoidedDistress(Number(e.target.value))}
                    className="w-32 accent-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  Añadir Situación Evitada
                </button>
              </form>
            </div>

            <div className="space-y-2">
              {avoidedList.length === 0 ? (
                <div className="bg-[#111827] rounded-xl p-6 text-center text-sm text-gray-400 border border-indigo-900/30">
                  Sin situaciones evitadas registradas.
                </div>
              ) : (
                avoidedList.map((a) => (
                  <div key={a.id} className="bg-[#111827] rounded-xl p-3 border border-indigo-900/30 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{a.situation}</p>
                      <span className="text-xs text-rose-400 font-medium">Malestar: {a.distressLevel}/10</span>
                    </div>
                    <button onClick={() => deleteAvoided(a.id)} className="text-gray-500 hover:text-rose-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* TAB 5: PENSAMIENTOS (REESTRUCTURACIÓN COGNITIVA TCC) */}
        {activeTab === 'pensamientos' && (
          <section className="space-y-4">
            <div className="bg-[#111827] rounded-2xl p-5 border border-indigo-900/30 space-y-3">
              <h3 className="font-semibold text-white">Registro de Pensamiento (TCC)</h3>

              <textarea
                value={thoughtSituation}
                onChange={(e) => setThoughtSituation(e.target.value)}
                placeholder="¿Qué pasó? (situación)"
                rows={2}
                className="w-full bg-[#0a0e1a] border border-indigo-900/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
              />

              <textarea
                value={negativeThought}
                onChange={(e) => setNegativeThought(e.target.value)}
                placeholder="Pensamiento automático negativo"
                rows={2}
                className="w-full bg-[#0a0e1a] border border-indigo-900/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
              />

              <div>
                <p className="text-xs text-gray-400 mb-2 font-medium">Distorsión (opcional)</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'Lectura de mente', label: '🔮 Lectura mente' },
                    { key: 'Catastrofismo', label: '💥 Catastrofismo' },
                    { key: 'Todo o nada', label: '⚫⚪ Todo/nada' },
                  ].map((item) => {
                    const isSel = selectedDistortions.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleDistortion(item.key)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${
                          isSel
                            ? 'bg-indigo-900/50 border-purple-500 text-purple-300 font-semibold'
                            : 'bg-[#0a0e1a] border-indigo-900/50 text-slate-300 hover:border-indigo-500'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <textarea
                value={alternativeThought}
                onChange={(e) => setAlternativeThought(e.target.value)}
                placeholder="Pensamiento alternativo / racional"
                rows={2}
                className="w-full bg-[#0a0e1a] border border-indigo-900/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
              />

              <button
                onClick={handleAddThought}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-5 py-3 rounded-xl font-medium text-sm text-white shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
              >
                Guardar Reestructuración
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">
                Pensamientos <span className="text-xs text-gray-400">({thoughts.length})</span>
              </h3>

              {thoughts.length === 0 ? (
                <div className="bg-[#111827] rounded-xl p-6 text-center text-sm text-gray-400 border border-indigo-900/30">
                  Sin pensamientos registrados
                </div>
              ) : (
                <div className="space-y-2">
                  {thoughts.map((t) => (
                    <div key={t.id} className="bg-[#111827] rounded-xl p-3 border border-indigo-900/30">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs text-gray-400">Situación:</p>
                        <button
                          onClick={() => deleteThought(t.id)}
                          className="text-gray-500 hover:text-rose-400 p-1 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-white mb-2">{t.situation}</p>

                      <p className="text-xs text-red-400 mb-0.5">Pensamiento negativo:</p>
                      <p className="text-sm text-red-300 italic mb-2">"{t.negativeThought}"</p>

                      {t.distortions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {t.distortions.map((d, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-red-900/30 border border-red-500/30 rounded-full text-red-300"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}

                      {t.alternativeThought && (
                        <>
                          <p className="text-xs text-emerald-400 mb-0.5">Alternativo:</p>
                          <p className="text-sm text-emerald-300 italic mb-1">"{t.alternativeThought}"</p>
                        </>
                      )}

                      <p className="text-[11px] text-gray-500 mt-2">{t.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 6: PROGRESO (EVOLUCIÓN SEMANAL Y GRÁFICO) */}
        {activeTab === 'progreso' && (
          <section className="space-y-4">
            <div className="bg-[#111827] rounded-2xl p-5 border border-indigo-900/30">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Evolución Semanal de Ansiedad
              </h3>
              <div className="h-56 relative">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <line x1="40" y1="20" x2="40" y2="180" stroke="#312e81" strokeWidth="1" />
                  <line x1="40" y1="180" x2="380" y2="180" stroke="#312e81" strokeWidth="1" />

                  <line x1="40" y1="60" x2="380" y2="60" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="4" />
                  <line x1="40" y1="100" x2="380" y2="100" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="4" />
                  <line x1="40" y1="140" x2="380" y2="140" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="4" />

                  <text x="30" y="65" fill="#9ca3af" fontSize="10" textAnchor="end">8</text>
                  <text x="30" y="105" fill="#9ca3af" fontSize="10" textAnchor="end">5</text>
                  <text x="30" y="145" fill="#9ca3af" fontSize="10" textAnchor="end">3</text>
                  <text x="30" y="185" fill="#9ca3af" fontSize="10" textAnchor="end">1</text>

                  <text x="70" y="195" fill="#9ca3af" fontSize="10" textAnchor="middle">Lun</text>
                  <text x="130" y="195" fill="#9ca3af" fontSize="10" textAnchor="middle">Mar</text>
                  <text x="190" y="195" fill="#9ca3af" fontSize="10" textAnchor="middle">Mié</text>
                  <text x="250" y="195" fill="#9ca3af" fontSize="10" textAnchor="middle">Jue</text>
                  <text x="310" y="195" fill="#9ca3af" fontSize="10" textAnchor="middle">Vie</text>
                  <text x="370" y="195" fill="#9ca3af" fontSize="10" textAnchor="middle">Sáb</text>

                  <path
                    d="M 70 140 L 130 120 L 190 100 L 250 80 L 310 110 L 370 90"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <circle cx="70" cy="140" r="5" fill="#8b5cf6" />
                  <circle cx="130" cy="120" r="5" fill="#8b5cf6" />
                  <circle cx="190" cy="100" r="5" fill="#8b5cf6" />
                  <circle cx="250" cy="80" r="5" fill="#8b5cf6" />
                  <circle cx="310" cy="110" r="5" fill="#8b5cf6" />
                  <circle cx="370" cy="90" r="5" fill="#8b5cf6" />

                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="mt-3 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <p className="text-xs text-emerald-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Avance constante: acumulas {streakDays} días de racha de registro personal. ¡Sigue así!
                </p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 7: DIARIO Y NOTAS PARA SESIÓN */}
        {activeTab === 'diario' && (
          <section className="space-y-4">
            <div className="bg-[#111827] rounded-2xl p-5 border border-indigo-900/30 space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Notas para la Próxima Sesión de Terapia
              </h3>
              <p className="text-xs text-gray-400">
                Apunta temas, situaciones o preguntas que quieras consultar con tu psicólogo/a.
              </p>

              <textarea
                value={journalPrep}
                onChange={(e) => setJournalPrep(e.target.value)}
                placeholder="Escribe aquí los puntos clave para comentar en consulta..."
                rows={5}
                className="w-full bg-[#0a0e1a] border border-indigo-900/50 rounded-xl p-3 text-xs text-white placeholder:text-gray-500 focus:outline-none resize-none"
              />

              <div className="flex items-center justify-between">
                {journalSaved ? (
                  <span className="text-xs text-emerald-400 font-medium">✓ Guardado correctamente</span>
                ) : (
                  <span className="text-[11px] text-gray-500">Se adjunta al informe PDF</span>
                )}

                <button
                  onClick={handleSaveJournal}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Guardar Notas
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* SOS Button */}
      <button
        onClick={() => onNav('crisis')}
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all text-sm z-30 cursor-pointer"
      >
        SOS
      </button>
    </div>
  );
}
