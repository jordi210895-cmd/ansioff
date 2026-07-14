'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
    Activity, ArrowLeft, BedDouble, BookOpen, Brain, BriefcaseBusiness,
    Check, ChevronRight, CircleHelp, Clock3, CloudMoon, Headphones,
    HeartHandshake, LockKeyhole, MessageCircle, MoonStar, PenLine,
    ShieldCheck, Sparkles, Waves, Wind,
} from 'lucide-react';
import {
    completeOnboarding, createPersonalizedPlan, DailyMinutes, EMPTY_ONBOARDING_ANSWERS,
    Impact, loadOnboardingState, Manifestation, OnboardingAnswers, OnboardingGoal,
    PersonalizedPlan, saveOnboardingState, Trigger, Coping,
    toggleLimitedSelection,
} from '@/lib/onboarding';

interface OnboardingFlowProps {
    onFinished: (answers: OnboardingAnswers, plan: PersonalizedPlan) => void;
    onLogin: () => void;
}

interface Option<T extends string | number> {
    value: T;
    label: string;
    icon: React.ReactNode;
}

const GOALS: Option<OnboardingGoal>[] = [
    { value: 'calm_now', label: 'Crear una pausa rápida', icon: <Waves size={20} /> },
    { value: 'slow_thoughts', label: 'Frenar pensamientos repetitivos', icon: <Brain size={20} /> },
    { value: 'sleep_better', label: 'Preparar una rutina nocturna', icon: <MoonStar size={20} /> },
    { value: 'daily_stress', label: 'Ordenar el día a día', icon: <BriefcaseBusiness size={20} /> },
    { value: 'understand_patterns', label: 'Entender mis patrones', icon: <Sparkles size={20} /> },
];

const MANIFESTATIONS: Option<Manifestation>[] = [
    { value: 'breathing_heart', label: 'Me cuesta volver a una tarea', icon: <Activity size={20} /> },
    { value: 'physical_tension', label: 'Necesito soltar carga mental', icon: <Waves size={20} /> },
    { value: 'racing_thoughts', label: 'Pensamientos difíciles de frenar', icon: <Brain size={20} /> },
    { value: 'avoidance', label: 'Me cuesta empezar o continuar', icon: <ChevronRight size={20} /> },
    { value: 'sleep', label: 'Quiero cerrar mejor el día', icon: <MoonStar size={20} /> },
    { value: 'unclear', label: 'No identifico una señal clara', icon: <CircleHelp size={20} /> },
];

const TRIGGERS: Option<Trigger>[] = [
    { value: 'work_study', label: 'Trabajo o estudios', icon: <BriefcaseBusiness size={20} /> },
    { value: 'relationships', label: 'Relaciones o situaciones sociales', icon: <HeartHandshake size={20} /> },
    { value: 'health', label: 'Sensaciones o energía del día', icon: <Activity size={20} /> },
    { value: 'uncertainty', label: 'Dinero o incertidumbre', icon: <CloudMoon size={20} /> },
    { value: 'digital_environment', label: 'Pantallas, noticias o entorno', icon: <Sparkles size={20} /> },
    { value: 'unclear', label: 'No encuentro un desencadenante claro', icon: <CircleHelp size={20} /> },
];

const IMPACTS: Option<Impact>[] = [
    { value: 'sleep', label: 'La rutina nocturna', icon: <BedDouble size={20} /> },
    { value: 'focus', label: 'La concentración', icon: <Brain size={20} /> },
    { value: 'relationships', label: 'Las relaciones', icon: <HeartHandshake size={20} /> },
    { value: 'energy', label: 'La energía', icon: <Activity size={20} /> },
    { value: 'enjoyment', label: 'Disfrutar del día', icon: <Sparkles size={20} /> },
    { value: 'body', label: 'Las pausas del día', icon: <Wind size={20} /> },
];

const COPING_OPTIONS: Option<Coping>[] = [
    { value: 'talk', label: 'Hablo con alguien', icon: <MessageCircle size={20} /> },
    { value: 'distract', label: 'Intento distraerme', icon: <Sparkles size={20} /> },
    { value: 'breathe', label: 'Respiro o hago una pausa', icon: <Wind size={20} /> },
    { value: 'write', label: 'Escribo lo que siento', icon: <PenLine size={20} /> },
    { value: 'rest', label: 'Intento descansar', icon: <MoonStar size={20} /> },
    { value: 'unsure', label: 'No sé muy bien qué hacer', icon: <CircleHelp size={20} /> },
];

const MINUTES: Option<DailyMinutes>[] = [
    { value: 3, label: '3 minutos', icon: <Clock3 size={20} /> },
    { value: 5, label: '5 minutos', icon: <Clock3 size={20} /> },
    { value: 10, label: '10 minutos', icon: <Clock3 size={20} /> },
    { value: 15, label: '15 minutos', icon: <Clock3 size={20} /> },
];

const MAX_STEP = 9;

function QuestionHeader({ eyebrow, title, detail }: { eyebrow: string; title: string; detail?: string }) {
    return (
        <div className="onboarding-question-header">
            <span>{eyebrow}</span>
            <h1>{title}</h1>
            {detail && <p>{detail}</p>}
        </div>
    );
}

function OptionGrid<T extends string | number>({
    options, selected, onSelect, multi = false,
}: {
    options: Option<T>[];
    selected: T | T[] | null;
    onSelect: (value: T) => void;
    multi?: boolean;
}) {
    const isSelected = (value: T) => Array.isArray(selected) ? selected.includes(value) : selected === value;
    return (
        <div className="onboarding-options" role={multi ? 'group' : 'radiogroup'}>
            {options.map((option) => {
                const active = isSelected(option.value);
                return (
                    <button
                        key={String(option.value)}
                        type="button"
                        className={`onboarding-option ${active ? 'selected' : ''}`}
                        onClick={() => onSelect(option.value)}
                        role={multi ? 'checkbox' : 'radio'}
                        aria-checked={active}
                    >
                        <span className="option-icon">{option.icon}</span>
                        <span>{option.label}</span>
                        <span className="option-check">{active ? <Check size={16} /> : null}</span>
                    </button>
                );
            })}
        </div>
    );
}

function getPatternPhases(_pattern: PersonalizedPlan['exercisePattern']) {
    return [{ name: 'Inhala', seconds: 4 }, { name: 'Mantén', seconds: 7 }, { name: 'Exhala', seconds: 8 }];
}

export default function OnboardingFlow({ onFinished, onLogin }: OnboardingFlowProps) {
    const stored = useMemo(() => loadOnboardingState(), []);
    const [step, setStep] = useState(Math.min(stored?.step || 0, MAX_STEP));
    const [answers, setAnswers] = useState<OnboardingAnswers>(stored?.answers || EMPTY_ONBOARDING_ANSWERS);
    const plan = useMemo(() => createPersonalizedPlan(answers), [answers]);
    const [experienceState, setExperienceState] = useState<'before' | 'running' | 'after' | 'done'>('before');
    const [beforeTension, setBeforeTension] = useState<number | null>(null);
    const [afterTension, setAfterTension] = useState<number | null>(null);
    const phases = useMemo(() => getPatternPhases(plan.exercisePattern), [plan.exercisePattern]);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(phases[0].seconds);
    const [cycle, setCycle] = useState(1);
    const totalCycles = 3;

    useEffect(() => {
        saveOnboardingState(step, answers);
    }, [step, answers]);

    useEffect(() => {
        if (experienceState !== 'running') return;
        const timer = window.setTimeout(() => {
            if (secondsLeft > 1) {
                setSecondsLeft((value) => value - 1);
                return;
            }
            const nextPhase = (phaseIndex + 1) % phases.length;
            if (nextPhase === 0 && cycle >= totalCycles) {
                setExperienceState('after');
                return;
            }
            if (nextPhase === 0) setCycle((value) => value + 1);
            setPhaseIndex(nextPhase);
            setSecondsLeft(phases[nextPhase].seconds);
        }, 1000);
        return () => window.clearTimeout(timer);
    }, [cycle, experienceState, phaseIndex, phases, secondsLeft, totalCycles]);

    const next = () => setStep((value) => Math.min(MAX_STEP, value + 1));
    const back = () => setStep((value) => Math.max(0, value - 1));
    const finish = () => {
        completeOnboarding();
        onFinished(answers, plan);
    };

    const saveFirstCheckIn = () => {
        if (beforeTension !== null && afterTension !== null) {
            localStorage.setItem('ansioff_onboarding_first_pause_v1', JSON.stringify({
                before: beforeTension,
                after: afterTension,
                pattern: plan.exercisePattern,
                completedAt: new Date().toISOString(),
            }));
        }
        setExperienceState('done');
    };

    const canContinue =
        (step === 1 && Boolean(answers.goal)) ||
        (step === 2 && answers.manifestations.length > 0) ||
        (step === 3 && answers.triggers.length > 0) ||
        (step === 4 && answers.impacts.length > 0) ||
        (step === 5 && answers.coping.length > 0) ||
        (step === 6 && Boolean(answers.dailyMinutes));

    return (
        <div className="onboarding-root">
            <style jsx>{`
                .onboarding-root{position:fixed;inset:0;z-index:1000;background:#03080f;color:#ddeef5;overflow:hidden;font-family:var(--font-plus-jakarta),sans-serif;}
                .onboarding-shell{height:100%;display:flex;flex-direction:column;max-width:520px;margin:0 auto;padding:max(18px,env(safe-area-inset-top)) 20px max(18px,env(safe-area-inset-bottom));}
                .onboarding-top{height:44px;display:flex;align-items:center;gap:14px;flex-shrink:0;}
                .back-button,.login-link{height:40px;border:0;background:transparent;color:#9bb8c8;font:inherit;font-weight:700;cursor:pointer;}
                .back-button{width:40px;border:1px solid rgba(255,255,255,.09);border-radius:12px;display:flex;align-items:center;justify-content:center;}
                .login-link{margin-left:auto;color:#7fc8df;font-size:13px;}
                .progress-track{height:4px;flex:1;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;}
                .progress-fill{height:100%;background:#5aadcf;border-radius:999px;transition:width .3s ease;}
                .onboarding-content{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:28px 2px 18px;scrollbar-width:none;}
                .onboarding-content::-webkit-scrollbar{display:none;}
                :global(.onboarding-question-header span){display:block;color:#69bdd8;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;margin-bottom:10px;}
                :global(.onboarding-question-header h1){font-size:30px;line-height:1.16;letter-spacing:0;font-weight:750;margin:0 0 12px;color:#edf8fc;}
                :global(.onboarding-question-header p){font-size:14px;line-height:1.55;color:rgba(210,232,240,.62);margin:0 0 24px;}
                :global(.onboarding-options){display:flex;flex-direction:column;gap:10px;margin-top:24px;}
                :global(.onboarding-option){width:100%;min-height:62px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035);border-radius:16px;color:#ddecf2;display:grid;grid-template-columns:42px 1fr 24px;align-items:center;gap:10px;text-align:left;padding:10px 14px;font:inherit;font-size:14px;font-weight:650;cursor:pointer;transition:background .18s,border-color .18s,transform .18s;}
                :global(.onboarding-option:active){transform:scale(.985);}
                :global(.onboarding-option.selected){background:rgba(90,173,207,.12);border-color:rgba(90,173,207,.55);}
                :global(.option-icon){width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#69bdd8;background:rgba(90,173,207,.1);}
                :global(.option-check){width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(90,173,207,.15);color:#8ed8ed;}
                .onboarding-actions{flex-shrink:0;padding-top:10px;}
                .primary-action{width:100%;min-height:56px;border:0;border-radius:16px;background:#5aadcf;color:#031018;font:inherit;font-size:15px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;}
                .primary-action:disabled{opacity:.35;cursor:default;}
                .secondary-action{width:100%;min-height:44px;border:0;background:transparent;color:#89a5b3;font:inherit;font-size:13px;font-weight:650;cursor:pointer;margin-top:6px;}
                .welcome-mark{width:112px;height:112px;border-radius:28px;background:#0d2554;border:1px solid rgba(90,173,207,.26);display:flex;align-items:center;justify-content:center;margin:4px 0 24px;box-shadow:0 18px 50px rgba(25,121,153,.2);overflow:hidden;}
                .welcome-logo-img{width:100%;height:100%;object-fit:cover;display:block;}
                .welcome-title{font-size:35px;line-height:1.12;font-weight:780;letter-spacing:0;margin-bottom:14px;max-width:450px;}
                .welcome-copy{font-size:16px;line-height:1.6;color:rgba(210,232,240,.68);margin-bottom:28px;}
                .benefit-list{display:grid;gap:14px;margin-bottom:26px;}
                .benefit-row{display:grid;grid-template-columns:38px 1fr;gap:12px;align-items:start;}
                .benefit-row svg{padding:9px;width:38px;height:38px;color:#69bdd8;background:rgba(90,173,207,.1);border-radius:12px;}
                .benefit-row strong{display:block;font-size:14px;margin:1px 0 3px;}
                .benefit-row p{font-size:12px;line-height:1.45;color:rgba(210,232,240,.55);margin:0;}
                .safety-note{font-size:11px;line-height:1.45;color:rgba(210,232,240,.42);text-align:center;margin-top:16px;}
                .safety-note a{color:#8ed8ed;text-decoration:none;}
                .plan-summary{font-size:15px;line-height:1.6;color:rgba(220,239,246,.72);margin:4px 0 24px;}
                .plan-list{display:grid;gap:10px;}
                .plan-step{display:grid;grid-template-columns:38px 1fr;gap:12px;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.07);}
                .plan-step:last-child{border-bottom:0;}
                .stage-number{width:34px;height:34px;border-radius:11px;background:#102b3b;color:#7ccce4;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;}
                .plan-step span{color:#69bdd8;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;}
                .plan-step strong{display:block;font-size:14px;margin:3px 0;}
                .plan-step p{font-size:12px;line-height:1.45;color:rgba(210,232,240,.55);margin:0;}
                .tension-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:28px 0 12px;}
                .tension-grid button{aspect-ratio:1;border-radius:12px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035);color:#b7cdd6;font:inherit;font-weight:750;cursor:pointer;}
                .tension-grid button.selected{background:#5aadcf;color:#031018;border-color:#5aadcf;}
                .tension-labels{display:flex;justify-content:space-between;color:rgba(210,232,240,.48);font-size:11px;}
                .breathing-stage{text-align:center;display:flex;flex-direction:column;align-items:center;padding-top:12px;}
                .breathing-orb{width:180px;height:180px;border-radius:50%;background:radial-gradient(circle at 35% 28%,#d8f6ff,#5aadcf 42%,#194a63 78%);box-shadow:0 0 70px rgba(90,173,207,.25);display:flex;align-items:center;justify-content:center;margin:30px auto 24px;animation:breathePreview 12s ease-in-out infinite;}
                .breathing-orb strong{font-size:46px;color:#04111a;}
                .breathing-phase{font-size:24px;font-weight:800;margin-bottom:6px;}
                .breathing-meta{font-size:12px;color:rgba(210,232,240,.52);}
                .done-mark{width:82px;height:82px;border-radius:50%;background:rgba(110,210,165,.12);color:#78d8ad;display:flex;align-items:center;justify-content:center;margin:22px auto 24px;}
                .value-intro{font-size:14px;line-height:1.55;color:rgba(210,232,240,.65);margin:0 0 22px;}
                .value-list{display:grid;gap:2px;margin-bottom:22px;}
                .value-row{display:grid;grid-template-columns:42px 1fr;gap:12px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07);}
                .value-row:last-child{border-bottom:0;}
                .value-icon{width:40px;height:40px;border-radius:12px;background:rgba(90,173,207,.11);color:#74c7df;display:flex;align-items:center;justify-content:center;}
                .value-row strong{display:block;font-size:14px;margin:1px 0 4px;}
                .value-row p{font-size:12px;line-height:1.45;color:rgba(210,232,240,.55);margin:0;}
                .personal-proof{border-top:1px solid rgba(255,255,255,.09);padding-top:20px;margin-top:4px;}
                .personal-proof h2{font-size:19px;line-height:1.25;margin:0 0 13px;}
                .proof-item{display:grid;grid-template-columns:24px 1fr;gap:9px;align-items:start;margin:10px 0;color:#cfe3ea;font-size:12px;line-height:1.45;}
                .proof-item svg{color:#7ad4ad;margin-top:1px;}
                .honest-note{font-size:11px;line-height:1.5;color:rgba(210,232,240,.43);margin:18px 0 0;}
                @keyframes breathePreview{0%,100%{transform:scale(.78)}45%,58%{transform:scale(1)}}
                @media(max-height:700px){.onboarding-content{padding-top:16px}.welcome-mark{width:88px;height:88px;margin-bottom:16px}.welcome-title{font-size:29px}.benefit-list{gap:10px}.onboarding-shell{padding-top:max(10px,env(safe-area-inset-top));}}
                @media(prefers-reduced-motion:reduce){.progress-fill,.onboarding-option,.breathing-orb{transition:none;animation:none;}}
            `}</style>

            <div className="onboarding-shell">
                <div className="onboarding-top">
                    {step > 0 ? (
                        <button className="back-button" onClick={back} aria-label="Volver"><ArrowLeft size={18} /></button>
                    ) : <div style={{ width: 40 }} />}
                    <div className="progress-track" aria-label={`Paso ${step + 1} de ${MAX_STEP + 1}`}>
                        <div className="progress-fill" style={{ width: `${(step / MAX_STEP) * 100}%` }} />
                    </div>
                    {step === 0 ? <button className="login-link" onClick={onLogin}>Ya tengo cuenta</button> : <div style={{ width: 40 }} />}
                </div>

                <main className="onboarding-content">
                    {step === 0 && (
                        <>
                            <div className="welcome-mark">
                                <Image className="welcome-logo-img" src="/logo.png" alt="ANSIOFF" width={112} height={112} priority />
                            </div>
                            <h1 className="welcome-title">Un espacio para crear pausas y entender lo que se repite.</h1>
                            <p className="welcome-copy">Prepararemos una experiencia sencilla según lo que necesitas hoy. Es una guía personal para configurar la app.</p>
                            <div className="benefit-list">
                                <div className="benefit-row"><Waves /><div><strong>Pausa rápida</strong><p>Guías breves cuando necesitas parar y volver a tu ritmo.</p></div></div>
                                <div className="benefit-row"><BookOpen /><div><strong>Herramientas prácticas</strong><p>Diario, ejercicios y rutinas para tu día a día.</p></div></div>
                                <div className="benefit-row"><ShieldCheck /><div><strong>Privacidad clara</strong><p>Tus respuestas de personalización permanecen en este dispositivo.</p></div></div>
                            </div>
                        </>
                    )}
                    {step === 1 && <><QuestionHeader eyebrow="Tu prioridad" title="¿Qué necesitas primero?" detail="Elige la opción que más se acerque a lo que buscas hoy." /><OptionGrid options={GOALS} selected={answers.goal} onSelect={(goal) => setAnswers((value) => ({ ...value, goal }))} /></>}
                    {step === 2 && <><QuestionHeader eyebrow="Cómo aparece" title="¿Qué suele interrumpir tu ritmo?" detail="Puedes elegir hasta tres opciones. Esto solo ajusta la experiencia." /><OptionGrid multi options={MANIFESTATIONS} selected={answers.manifestations} onSelect={(item) => setAnswers((value) => ({ ...value, manifestations: toggleLimitedSelection(value.manifestations, item) }))} /></>}
                    {step === 3 && <><QuestionHeader eyebrow="Situaciones" title="¿Qué suele desencadenarlo?" detail="Elige hasta tres. También está bien si todavía no lo tienes claro." /><OptionGrid multi options={TRIGGERS} selected={answers.triggers} onSelect={(item) => setAnswers((value) => ({ ...value, triggers: toggleLimitedSelection(value.triggers, item) }))} /></>}
                    {step === 4 && <><QuestionHeader eyebrow="Impacto cotidiano" title="¿Dónde lo notas más?" detail="Marca las áreas que más te gustaría cuidar." /><OptionGrid multi options={IMPACTS} selected={answers.impacts} onSelect={(item) => setAnswers((value) => ({ ...value, impacts: toggleLimitedSelection(value.impacts, item) }))} /></>}
                    {step === 5 && <><QuestionHeader eyebrow="Lo que haces ahora" title="¿Qué haces normalmente cuando pierdes el ritmo?" detail="No hay respuestas buenas o malas. Elige hasta tres." /><OptionGrid multi options={COPING_OPTIONS} selected={answers.coping} onSelect={(item) => setAnswers((value) => ({ ...value, coping: toggleLimitedSelection(value.coping, item) }))} /></>}
                    {step === 6 && <><QuestionHeader eyebrow="Una rutina posible" title="¿Cuánto tiempo puedes dedicarte?" detail="Crearemos un plan que quepa en tu día, sin penalizar los descansos." /><OptionGrid options={MINUTES} selected={answers.dailyMinutes} onSelect={(dailyMinutes) => setAnswers((value) => ({ ...value, dailyMinutes }))} /></>}
                    {step === 7 && (
                        <>
                            <QuestionHeader eyebrow="Tu Ecosistema de Calma" title={plan.title} />
                            <p className="plan-summary">{plan.summary}</p>
                            <div className="plan-list">
                                {plan.steps.map((item, index) => (
                                    <div className="plan-step" key={item.stage}>
                                        <div className="stage-number">{index + 1}</div>
                                        <div><span>{item.stage}</span><strong>{item.title}</strong><p>{item.description}</p></div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {step === 8 && experienceState === 'before' && (
                        <>
                            <QuestionHeader eyebrow="Tu primera pausa" title="¿Cuánta carga notas ahora?" detail="Antes de probar 3 repeticiones de ritmo 4-7-8, marca cómo te sientes. Es solo un registro personal." />
                            <div className="tension-grid">{Array.from({ length: 11 }, (_, value) => <button key={value} className={beforeTension === value ? 'selected' : ''} onClick={() => setBeforeTension(value)}>{value}</button>)}</div>
                            <div className="tension-labels"><span>Muy poca</span><span>Mucha</span></div>
                        </>
                    )}
                    {step === 8 && experienceState === 'running' && (
                        <div className="breathing-stage">
                            <QuestionHeader eyebrow={`Repetición ${cycle} de ${totalCycles}`} title="Ritmo 4-7-8" detail="Sigue el ritmo sin forzarte." />
                            <div className="breathing-orb"><strong>{secondsLeft}</strong></div>
                            <div className="breathing-phase">{phases[phaseIndex].name}</div>
                            <div className="breathing-meta">Puedes parar en cualquier momento si no te resulta cómodo.</div>
                        </div>
                    )}
                    {step === 8 && experienceState === 'after' && (
                        <>
                            <QuestionHeader eyebrow="Después de la pausa" title="¿Cuánta carga notas ahora?" detail="No pasa nada si no ha cambiado. La práctica sirve para observar, no para aprobar un resultado." />
                            <div className="tension-grid">{Array.from({ length: 11 }, (_, value) => <button key={value} className={afterTension === value ? 'selected' : ''} onClick={() => setAfterTension(value)}>{value}</button>)}</div>
                            <div className="tension-labels"><span>Muy poca</span><span>Mucha</span></div>
                        </>
                    )}
                    {step === 8 && experienceState === 'done' && (
                        <div style={{ textAlign: 'center' }}>
                            <div className="done-mark"><Check size={38} /></div>
                            <QuestionHeader eyebrow="Primera práctica completada" title="Has completado tu primera pausa" detail="Ya tienes una primera referencia personal. Ahora descubre todo lo que reunirá tu plan." />
                        </div>
                    )}
                    {step === 9 && (
                        <>
                            <QuestionHeader eyebrow="Tu ecosistema de pausas" title="Tus herramientas, conectadas en un solo lugar" />
                            <p className="value-intro">ANSIOFF combina pausas breves, diario personal y rutinas sencillas para comprender lo que se repite y crear un hábito que quepa en tu día.</p>
                            <div className="value-list">
                                <div className="value-row"><div className="value-icon"><Waves size={21} /></div><div><strong>Volver al presente</strong><p>Pausas guiadas, ritmo 4-7-8 y audios para acompañarte cuando necesitas parar un momento.</p></div></div>
                                <div className="value-row"><div className="value-icon"><BookOpen size={21} /></div><div><strong>Entender lo que se repite</strong><p>Diario, ejercicios de escritura y reflexión opcional con IA para ordenar temas personales.</p></div></div>
                                <div className="value-row"><div className="value-icon"><MoonStar size={21} /></div><div><strong>Construir una rutina posible</strong><p>Modo noche, sonidos, check-ins, juegos de atención y recordatorios adaptados a tu ritmo.</p></div></div>
                                <div className="value-row"><div className="value-icon"><Activity size={21} /></div><div><strong>Observar tu constancia</strong><p>Actividad y progreso para reconocer lo que practicas, sin penalizar los días de descanso.</p></div></div>
                            </div>
                            <div className="personal-proof">
                                <h2>Tu plan ya parte de ti</h2>
                                <div className="proof-item"><Check size={18} /><span>Has definido qué quieres cuidar primero.</span></div>
                                <div className="proof-item"><Check size={18} /><span>Has completado 3 repeticiones de ritmo 4-7-8.</span></div>
                                <div className="proof-item"><Check size={18} /><span>Tu rutina está preparada para {answers.dailyMinutes || 5} minutos al día.</span></div>
                                <p className="honest-note">ANSIOFF te ofrece un espacio práctico para parar, registrar y volver a tus herramientas cuando lo necesites.</p>
                            </div>
                        </>
                    )}
                </main>

                <div className="onboarding-actions">
                    {step === 0 && <button className="primary-action" onClick={next}>Crear mi plan <ChevronRight size={18} /></button>}
                    {step >= 1 && step <= 6 && <button className="primary-action" disabled={!canContinue} onClick={next}>Continuar <ChevronRight size={18} /></button>}
                    {step === 7 && <button className="primary-action" onClick={next}>Probar mi primera pausa <Wind size={18} /></button>}
                    {step === 8 && experienceState === 'before' && <button className="primary-action" disabled={beforeTension === null} onClick={() => { setPhaseIndex(0); setSecondsLeft(phases[0].seconds); setCycle(1); setExperienceState('running'); }}>Empezar ritmo <Wind size={18} /></button>}
                    {step === 8 && experienceState === 'running' && <button className="secondary-action" onClick={() => setExperienceState('after')}>Terminar antes</button>}
                    {step === 8 && experienceState === 'after' && <button className="primary-action" disabled={afterTension === null} onClick={saveFirstCheckIn}>Guardar este check-in</button>}
                    {step === 8 && experienceState === 'done' && <button className="primary-action" onClick={next}>Descubrir todo lo que incluye <ChevronRight size={18} /></button>}
                    {step === 9 && <button className="primary-action" onClick={finish}>Ver mis opciones de acceso <ChevronRight size={18} /></button>}
                    {step === 0 && <p className="safety-note">ANSIOFF es una herramienta de organización personal y uso cotidiano.</p>}
                </div>
            </div>
        </div>
    );
}
