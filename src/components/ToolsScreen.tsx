'use client';

import {
    Activity,
    Wind,
    Gamepad2,
    Music,
    PenLine,
    Heart,
    Brain,
    FileText,
    Stethoscope,
    Moon,
    ChevronRight,
    Target
} from 'lucide-react';
import TopBar from './TopBar';

interface ToolsScreenProps {
    onBack: () => void;
    onNav: (screen: string) => void;
}

export default function ToolsScreen({ onBack, onNav }: ToolsScreenProps) {
    const tools = [
        { id: 'sc-sos', icon: <Activity />, name: 'SOS Crisis', sub: 'Anclaje rápido y 5-4-3-2-1', color: 'text-red-400' },
        { id: 'sc-breath', icon: <Wind />, name: 'Respiración', sub: 'Patrones diafragmáticos guiados', color: 'text-blue-400' },
        { id: 'sc-games', icon: <Gamepad2 />, name: 'Juegos de Anclaje', sub: 'Tetris y Distracción cognitiva', color: 'text-indigo-400' },
        { id: 'sc-audio', icon: <Music />, name: 'Audios y sonidos', sub: 'Tu biblioteca de sonidos relax', color: 'text-cyan-400' },
        { id: 'sc-notes', icon: <PenLine />, name: 'Diario de Calma', sub: 'Escribe para liberar tensión', color: 'text-teal-400' },
        { id: 'sc-act', icon: <Heart />, name: 'Sin Miedo (ACT)', sub: 'Aceptación y Compromiso', color: 'text-rose-400' },
        { id: 'sc-cbt', icon: <Brain />, name: 'Técnicas TCC', sub: 'Reestructuración de pensamientos', color: 'text-purple-400' },
        { id: 'sc-eval', icon: <FileText />, name: 'Evaluación', sub: 'Tests de Hamilton, Goldberg y BAI', color: 'text-amber-400' },
        { id: 'sc-support', icon: <Stethoscope />, name: 'Apoyo Médico', sub: 'Recursos y guía profesional', color: 'text-emerald-400' },
        { id: 'sc-night', icon: <Moon />, name: 'Modo Noche', sub: 'Conciliación del sueño y pánico', color: 'text-blue-500' },
        { id: 'sc-exposure-why', icon: <Target />, name: '¿Por qué Expongo?', sub: 'Mis motivos para no rendirme', color: 'text-orange-500' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
            <TopBar title="Todos los Módulos" onBack={onBack} />
            <div className="flex-1 overflow-y-auto screen-px pb-32 pt-6">
                <div className="mt-2 space-y-3">
                    {tools.map((tool, i) => (
                        <button
                            key={i}
                            className="w-full flex items-center gap-4 p-4 bg-slate-900/40 border border-slate-800/50 rounded-3xl hover:border-blue-500/30 transition-all active:scale-[0.98] group text-left"
                            onClick={() => onNav(tool.id)}
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center transition-colors group-hover:bg-slate-700 ${tool.color}`}>
                                {tool.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{tool.name}</h3>
                                <p className="text-[11px] text-slate-500 truncate">{tool.sub}</p>
                            </div>
                            <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

