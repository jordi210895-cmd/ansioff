'use client';

import { Home, Volume2, BookOpen, Wind, GraduationCap, Trophy } from 'lucide-react';

interface BottomNavProps {
    activeScreen: string;
    onNav: (screen: string) => void;
}

export default function BottomNav({ activeScreen, onNav }: BottomNavProps) {
    const items = [
        { id: 'home', icon: Home, label: 'Inicio', screen: 'sc-home' },
        { id: 'audio', icon: Volume2, label: 'Sonidos', screen: 'sc-audio' },
        { id: 'notes', icon: BookOpen, label: 'Notas', screen: 'sc-notes' },
        { id: 'breath', icon: Wind, label: 'Respirar', screen: 'sc-breath' },
        { id: 'tools', icon: GraduationCap, label: 'Módulos', screen: 'sc-tools' },
        { id: 'stats', icon: Trophy, label: 'Progreso', screen: 'sc-stats' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0d1b2a]/90 backdrop-blur-xl border-t border-white/5 px-2 pb-6 pt-2 5 flex justify-around items-center z-50">
            {items.map((item) => {
                const isActive = activeScreen === item.screen;
                return (
                    <button
                        key={item.id}
                        onClick={() => onNav(item.screen)}
                        className={`flex flex-col items-center gap-1 flex-1 py-1.5 transition-colors group ${isActive ? 'active' : ''}`}
                    >
                        <div className={`transition-all duration-300 ${isActive ? 'text-[#7ec8e3] drop-shadow-[0_0_6px_rgba(126,200,227,0.8)]' : 'text-white/40 group-hover:text-white/60'}`}>
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={`text-[9px] tracking-[0.04em] transition-colors duration-300 ${isActive ? 'font-medium text-[#7ec8e3]' : 'font-medium text-white/40'}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
