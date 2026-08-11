'use client';

import { useState } from 'react';
import {
    Activity, Wind, Brain, Heart, Zap, ArrowLeft,
    Sparkles, ShieldCheck, ChevronRight, CircleDot, Info,
    Flame, Stethoscope
} from 'lucide-react';

interface BodyMapScreenProps {
    onBack: () => void;
    onNav: (screen: string) => void;
}

export type BodyZoneId = 'head' | 'throat' | 'chest' | 'stomach' | 'hands' | 'skin';

export interface BodyZoneData {
    id: BodyZoneId;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    accentGlow: string;
    x: number; // percentage
    y: number; // percentage
    symptom: string;
    why: string;
    mechanism: string;
    actionLabel: string;
    actionTarget: string;
    actionIcon: React.ReactNode;
}

const BODY_ZONES: BodyZoneData[] = [
    {
        id: 'head',
        title: 'Cabeza / Sienes',
        subtitle: 'Mareo, desrealización y presión',
        icon: <Brain className="w-5 h-5" />,
        color: '#38bdf8',
        accentGlow: 'rgba(56, 189, 248, 0.4)',
        x: 50,
        y: 13,
        symptom: 'Mareo, sensación de flotar o irrealidad (desrealización), presión o peso en la cabeza.',
        why: 'La hiperventilación altera los niveles de CO₂ en sangre. La contracción temporal de vasos cerebrales causa mareo, pero es 100% inofensivo.',
        mechanism: 'El cerebro ajusta el flujo sanguíneo por el nivel de dióxido de carbono. Tu cerebro está intacto y protegido en todo momento.',
        actionLabel: 'Abrir ejercicio de Grounding 5-4-3-2-1',
        actionTarget: 'crisis',
        actionIcon: <Sparkles className="w-4 h-4" />
    },
    {
        id: 'throat',
        title: 'Garganta / Cuello',
        subtitle: 'Nudo en la garganta (Globo histérico)',
        icon: <CircleDot className="w-5 h-5" />,
        color: '#818cf8',
        accentGlow: 'rgba(129, 140, 248, 0.4)',
        x: 50,
        y: 22,
        symptom: 'Sensación de opresión, nudo en la garganta (globo histérico) y sequedad.',
        why: 'Los músculos de la glotis se tensan automáticamente para evitar que tragues aire o comida si tuvieras que huir de un peligro real.',
        mechanism: 'Tu cuerpo prepara la vía aérea para una respiración más directa ante una amenaza percibida.',
        actionLabel: 'Iniciar respiración guiada 4-7-8',
        actionTarget: 'breath',
        actionIcon: <Wind className="w-4 h-4" />
    },
    {
        id: 'chest',
        title: 'Pecho / Corazón',
        subtitle: 'Opresión, taquicardia y pinchazos',
        icon: <Heart className="w-5 h-5" />,
        color: '#f43f5e',
        accentGlow: 'rgba(244, 63, 94, 0.45)',
        x: 50,
        y: 33,
        symptom: 'Opresión en el pecho, taquicardia, palpitaciones o pinchazos intercostales.',
        why: 'Tu corazón bombea más sangre a los músculos grandes. Los músculos intercostales se tensan por la respiración agitada. No es un infarto, es adrenalina pura.',
        mechanism: 'Redirección rápida de oxígeno a tus extremidades para prepararte a moverte con fuerza.',
        actionLabel: 'Iniciar respiración guiada 4-7-8',
        actionTarget: 'breath',
        actionIcon: <Wind className="w-4 h-4" />
    },
    {
        id: 'stomach',
        title: 'Estómago / Abdomen',
        subtitle: 'Nudo, náuseas y digestión cortada',
        icon: <Zap className="w-5 h-5" />,
        color: '#fbbf24',
        accentGlow: 'rgba(251, 191, 36, 0.4)',
        x: 50,
        y: 47,
        symptom: 'Sensación de "nudo", náuseas, digestión cortada o pesadez.',
        why: 'El cerebro redirige la sangre desde el sistema digestivo hacia los brazos y piernas para prepararte para la acción ("lucha o huida").',
        mechanism: 'Pausa temporal de la motilidad gastrointestinal para optimizar energía hacia la supervivencia.',
        actionLabel: 'Iniciar respiración de calma',
        actionTarget: 'breath',
        actionIcon: <Wind className="w-4 h-4" />
    },
    {
        id: 'hands',
        title: 'Manos / Extremidades',
        subtitle: 'Hormigueo, adormecimiento y temblor',
        icon: <Activity className="w-5 h-5" />,
        color: '#22d3ee',
        accentGlow: 'rgba(34, 211, 238, 0.4)',
        x: 23,
        y: 56,
        symptom: 'Hormigueo, adormecimiento, temblor o flojera en las manos y pies.',
        why: 'La alcalosis respiratoria por hiperventilar desplaza el calcio en sangre y causa parestesia (hormigueo). Tus manos reciben menos flujo porque la sangre va a grandes músculos.',
        mechanism: 'Disminución periférica de irrigación a dedos para priorizar los músculos motores principales.',
        actionLabel: 'Ejercicio de tensión y relajación muscular',
        actionTarget: 'sc-act',
        actionIcon: <Activity className="w-4 h-4" />
    },
    {
        id: 'skin',
        title: 'Piel / General',
        subtitle: 'Sudor frío, escalofríos y calor repentino',
        icon: <Flame className="w-5 h-5" />,
        color: '#a855f7',
        accentGlow: 'rgba(168, 85, 247, 0.4)',
        x: 62,
        y: 72,
        symptom: 'Sudor frío, escalofríos, calor repentino o destellos térmicos.',
        why: 'El sistema nervioso simpático activa las glándulas sudoríparas para refrigerar el cuerpo antes del esfuerzo físico que la mente "cree" que va a hacer.',
        mechanism: 'Termorregulación anticipatoria para evitar el sobrecalentamiento durante la respuesta de lucha o huida.',
        actionLabel: 'Abrir Kit SOS de Emergencia',
        actionTarget: 'crisis',
        actionIcon: <Sparkles className="w-4 h-4" />
    }
];

export default function BodyMapScreen({ onBack, onNav }: BodyMapScreenProps) {
    const [selectedZoneId, setSelectedZoneId] = useState<BodyZoneId>('chest');

    const activeZone = BODY_ZONES.find(z => z.id === selectedZoneId) || BODY_ZONES[2];

    return (
        <div id="bodymap-screen" className="screen active">
            <style jsx>{`
                .screen {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    padding-bottom: 120px;
                    background: #060913;
                }
                .screen::-webkit-scrollbar { display: none; }

                .aurora-1 {
                    background: radial-gradient(circle, rgba(56, 189, 248, 0.25), transparent 70%);
                    top: -60px;
                    left: -40px;
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    pointer-events: none;
                }
                .aurora-2 {
                    background: radial-gradient(circle, rgba(244, 63, 94, 0.2), transparent 70%);
                    bottom: 100px;
                    right: -60px;
                    position: absolute;
                    width: 320px;
                    height: 320px;
                    pointer-events: none;
                }

                .map-header {
                    padding: 22px 24px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    z-index: 10;
                }
                .map-title {
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: -.03em;
                    color: var(--text);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .map-sub {
                    font-size: 13px;
                    color: var(--text2);
                    margin-top: 2px;
                }
                .back-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 14px;
                    background: var(--glass);
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text);
                    cursor: pointer;
                    transition: var(--t);
                }
                .back-btn:hover {
                    background: rgba(255,255,255,0.12);
                }

                /* Body Map Visual Container */
                .body-stage {
                    position: relative;
                    width: 100%;
                    max-width: 380px;
                    height: 360px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .body-svg {
                    height: 100%;
                    width: auto;
                    filter: drop-shadow(0 0 18px rgba(56, 189, 248, 0.15));
                }

                /* Hotspots */
                .hotspot {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    cursor: pointer;
                    z-index: 20;
                    padding: 8px;
                    background: transparent;
                    border: none;
                    outline: none;
                }

                .hotspot-ring {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    animation: pulseRing 2.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                    pointer-events: none;
                }

                .hotspot-dot {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
                    position: relative;
                    box-shadow: 0 0 12px currentColor;
                }

                .hotspot:hover .hotspot-dot, .hotspot.active .hotspot-dot {
                    transform: scale(1.35);
                }

                .hotspot-inner-core {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #ffffff;
                }

                .hotspot-label {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: -20px;
                    white-space: nowrap;
                    font-size: 10px;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 10px;
                    background: rgba(8, 12, 22, 0.85);
                    border: 1px solid var(--border);
                    color: var(--text);
                    opacity: 0.8;
                    transition: var(--t);
                    pointer-events: none;
                }

                .hotspot.active .hotspot-label {
                    opacity: 1;
                    border-color: currentColor;
                }

                @keyframes pulseRing {
                    0% {
                        transform: scale(0.6);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(2.4);
                        opacity: 0;
                    }
                }

                /* Zone Pills Carousel */
                .pills-bar {
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                    padding: 8px 24px 16px;
                    position: relative;
                    z-index: 10;
                }
                .pills-bar::-webkit-scrollbar { display: none; }

                .zone-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    border-radius: 999px;
                    background: var(--glass);
                    border: 1px solid var(--border);
                    color: var(--text2);
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: var(--t);
                }
                .zone-pill:hover {
                    background: rgba(255,255,255,0.08);
                    color: var(--text);
                }
                .zone-pill.active {
                    background: rgba(255, 255, 255, 0.12);
                    color: var(--text);
                    border-color: rgba(255, 255, 255, 0.3);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                /* Clinical Card Detail */
                .clinical-card {
                    margin: 0 20px 20px;
                    background: rgba(15, 23, 42, 0.75);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid var(--border2);
                    border-radius: 26px;
                    padding: 22px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    position: relative;
                    z-index: 10;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                    animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .card-header-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    width: fit-content;
                }

                .sec-box {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border);
                    border-radius: 18px;
                    padding: 14px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .sec-title {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--text2);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .sec-text {
                    font-size: 14px;
                    color: var(--text);
                    line-height: 1.55;
                    font-weight: 400;
                }

                .action-cta-btn {
                    width: 100%;
                    padding: 16px 20px;
                    border-radius: 18px;
                    border: none;
                    font-size: 14px;
                    font-weight: 800;
                    color: #ffffff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: var(--t);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                }
                .action-cta-btn:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                }
                .action-cta-btn:active {
                    transform: translateY(0);
                }
            `}</style>

            <div className="aurora-1"></div>
            <div className="aurora-2"></div>

            {/* Header */}
            <div className="map-header">
                <div>
                    <div className="map-title">
                        <Stethoscope className="w-7 h-7 text-[#38bdf8]" />
                        Mapa Corporal
                    </div>
                    <div className="map-sub">Toca un punto para entender lo que siente tu cuerpo</div>
                </div>
                <button className="back-btn" onClick={onBack} aria-label="Volver">
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>

            {/* Zone Selector Pills */}
            <div className="pills-bar">
                {BODY_ZONES.map(z => (
                    <button
                        key={z.id}
                        className={`zone-pill ${selectedZoneId === z.id ? 'active' : ''}`}
                        onClick={() => setSelectedZoneId(z.id)}
                        style={{
                            borderColor: selectedZoneId === z.id ? z.color : undefined,
                            boxShadow: selectedZoneId === z.id ? `0 0 12px ${z.accentGlow}` : undefined
                        }}
                    >
                        <span style={{ color: z.color }}>{z.icon}</span>
                        <span>{z.title.split(' / ')[0]}</span>
                    </button>
                ))}
            </div>

            {/* Visual Body Avatar Stage */}
            <div className="body-stage">
                {/* SVG Silhouette */}
                <svg className="body-svg" viewBox="0 0 200 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Glow outline */}
                    <g filter="blur(4px)" opacity="0.4">
                        <ellipse cx="100" cy="55" rx="28" ry="32" stroke="#38bdf8" strokeWidth="3" />
                        <path d="M90 85 L90 102 M110 85 L110 102" stroke="#38bdf8" strokeWidth="3" />
                        <path d="M90 102 C70 104 42 118 36 150 L25 240 C23 255 35 260 40 245 L48 190 L52 260 C55 310 65 390 75 405 C80 412 90 412 92 400 L96 280 L104 280 L108 400 C110 412 120 412 125 405 C135 390 145 310 148 260 L152 190 L160 245 C165 260 177 255 175 240 L164 150 C158 118 130 104 110 102" stroke="#38bdf8" strokeWidth="3" />
                    </g>

                    {/* Sharp Silhouette Lines */}
                    <ellipse cx="100" cy="55" rx="26" ry="30" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="2.5" fill="rgba(15, 23, 42, 0.6)" />
                    <path d="M88 56 Q100 52 112 56" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeLinecap="round" />

                    <path d="M91 83 L91 100 M109 83 L109 100" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2" />

                    <path
                        d="M91 100 C72 102 46 115 40 145 L28 235 C26 250 36 254 41 240 L50 185 L54 255 C57 305 67 385 76 400 C80 408 89 408 91 395 L96 275 L104 275 L109 395 C111 408 120 408 124 400 C133 385 143 305 146 255 L150 185 L159 240 C164 254 174 250 172 235 L160 145 C154 115 128 102 109 100 Z"
                        stroke="rgba(255, 255, 255, 0.4)"
                        strokeWidth="2.5"
                        fill="rgba(15, 23, 42, 0.5)"
                    />

                    <path d="M80 140 C90 150 110 150 120 140" stroke="rgba(244, 63, 94, 0.25)" strokeWidth="1.5" />
                    <path d="M85 170 C92 180 108 180 115 170" stroke="rgba(251, 191, 36, 0.25)" strokeWidth="1.5" />
                </svg>

                {/* Hotspots */}
                {BODY_ZONES.map(z => {
                    const isActive = selectedZoneId === z.id;
                    return (
                        <button
                            key={z.id}
                            className={`hotspot ${isActive ? 'active' : ''}`}
                            style={{ left: `${z.x}%`, top: `${z.y}%` }}
                            onClick={() => setSelectedZoneId(z.id)}
                            aria-label={`Zona ${z.title}`}
                        >
                            <div
                                className="hotspot-ring"
                                style={{
                                    border: `2px solid ${z.color}`,
                                    boxShadow: `0 0 16px ${z.color}`
                                }}
                            />
                            <div
                                className="hotspot-dot"
                                style={{
                                    backgroundColor: z.color,
                                    color: z.color,
                                    boxShadow: isActive ? `0 0 20px ${z.color}` : `0 0 10px ${z.color}`
                                }}
                            >
                                <div className="hotspot-inner-core" />
                            </div>
                            <div className="hotspot-label" style={{ borderColor: isActive ? z.color : undefined }}>
                                {z.title.split(' / ')[0]}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Clinical Explanation Bottom Card */}
            <div className="clinical-card" style={{ borderColor: activeZone.color + '40' }}>
                <div
                    className="card-header-badge"
                    style={{
                        background: activeZone.color + '18',
                        color: activeZone.color,
                        border: `1px solid ${activeZone.color}40`
                    }}
                >
                    {activeZone.icon}
                    <span>{activeZone.title}</span>
                </div>

                {/* 1. Síntoma */}
                <div className="sec-box">
                    <div className="sec-title" style={{ color: activeZone.color }}>
                        <Info className="w-3.5 h-3.5" />
                        ¿Qué sientes?
                    </div>
                    <div className="sec-text">{activeZone.symptom}</div>
                </div>

                {/* 2. Explicación fisiológica */}
                <div className="sec-box">
                    <div className="sec-title" style={{ color: '#38bdf8' }}>
                        <Brain className="w-3.5 h-3.5" />
                        ¿Por qué pasa? (Explicación clínica)
                    </div>
                    <div className="sec-text">{activeZone.why}</div>
                </div>

                {/* 3. Mecanismo de defensa */}
                <div className="sec-box">
                    <div className="sec-title" style={{ color: '#a855f7' }}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Mecanismo de acción (Defensa del cuerpo)
                    </div>
                    <div className="sec-text">{activeZone.mechanism}</div>
                </div>

                {/* 4. Micro-acción instantánea */}
                <button
                    className="action-cta-btn"
                    style={{
                        background: `linear-gradient(135deg, ${activeZone.color}, #0284c7)`
                    }}
                    onClick={() => onNav(activeZone.actionTarget)}
                >
                    {activeZone.actionIcon}
                    <span>{activeZone.actionLabel}</span>
                    <ChevronRight className="w-5 h-5 ml-auto" />
                </button>
            </div>
        </div>
    );
}
