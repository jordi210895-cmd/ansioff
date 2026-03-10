'use client';

import { useState } from 'react';
import { Gamepad2, Hash, HelpCircle, Brain, ArrowRight } from 'lucide-react';
import TopBar from './TopBar';
import SOSDisclaimer from './SOSGames/SOSDisclaimer';
import MindfulTetris from './SOSGames/MindfulTetris';
import CognitiveSubtraction from './SOSGames/CognitiveSubtraction';

interface GamesScreenProps {
    onBack: () => void;
}

type GameMode = 'MENU' | 'DISCLAIMER' | 'TETRIS' | 'SUBTRACTION';

export default function GamesScreen({ onBack }: GamesScreenProps) {
    const [mode, setMode] = useState<GameMode>('MENU');
    const [selectedGame, setSelectedGame] = useState<'TETRIS' | 'SUBTRACTION' | null>(null);

    const handleGameSelect = (game: 'TETRIS' | 'SUBTRACTION') => {
        setSelectedGame(game);
        setMode('DISCLAIMER');
    };

    const startSelectedGame = () => {
        if (selectedGame === 'TETRIS') setMode('TETRIS');
        if (selectedGame === 'SUBTRACTION') setMode('SUBTRACTION');
    };

    if (mode === 'MENU') {
        return (
            <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
                <TopBar title="Juegos de Anclaje" onBack={onBack} />
                <div className="flex-1 overflow-y-auto screen-px pb-24">
                    <div className="text-blue-500 text-[10px] uppercase tracking-widest font-bold mt-4 mb-6">Distracción Cognitiva</div>

                    <div className="space-y-4">
                        <button
                            className="w-full bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl text-left hover:border-blue-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden shadow-lg shadow-slate-900/50"
                            onClick={() => handleGameSelect('TETRIS')}
                        >
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                            <div className="bg-blue-600/10 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                <Gamepad2 size={24} />
                            </div>
                            <h3 className="text-xl font-medium mb-1 font-serif">Tetris Mindful</h3>
                            <p className="text-slate-400 text-xs leading-relaxed max-w-[80%]">
                                Un juego rítmico y pausado para centrar tu atención visual y motora.
                            </p>
                            <ArrowRight className="absolute right-6 bottom-6 text-slate-700 group-hover:text-blue-500 transition-colors" size={20} />
                        </button>

                        <button
                            className="w-full bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl text-left hover:border-blue-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden shadow-lg shadow-slate-900/50"
                            onClick={() => handleGameSelect('SUBTRACTION')}
                        >
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                            <div className="bg-blue-600/10 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                <Hash size={24} />
                            </div>
                            <h3 className="text-xl font-medium mb-1 font-serif">Restas en Cascada</h3>
                            <p className="text-slate-400 text-xs leading-relaxed max-w-[80%]">
                                Activa tu razonamiento lógico para reducir la intensidad emocional.
                            </p>
                            <ArrowRight className="absolute right-6 bottom-6 text-slate-700 group-hover:text-blue-500 transition-colors" size={20} />
                        </button>
                    </div>

                    <div className="mt-12 p-8 bg-slate-900 border-2 border-blue-500/20 rounded-[32px] relative overflow-hidden shadow-2xl shadow-blue-900/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Brain size={64} />
                        </div>
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
                            <HelpCircle size={16} /> ¿Para qué sirven estos juegos?
                        </div>
                        <p className="text-slate-200/40 text-xs leading-relaxed">
                            Durante un ataque de pánico, el cerebro emocional toma el control. Estos ejercicios fuerzan al cerebro a usar la lógica y la coordinación, ayudando a interrumpir el ciclo de pensamientos catastróficos.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'DISCLAIMER') {
        return (
            <div className="flex flex-col h-full bg-slate-950">
                <SOSDisclaimer
                    onAccept={startSelectedGame}
                    onCancel={() => setMode('MENU')}
                />
            </div>
        );
    }

    if (mode === 'TETRIS') {
        return <MindfulTetris onBack={() => setMode('MENU')} />;
    }

    if (mode === 'SUBTRACTION') {
        return <CognitiveSubtraction onBack={() => setMode('MENU')} />;
    }

    return null;
}

