'use client';

import { Home, Volume2, BookOpen, Wind, GraduationCap } from 'lucide-react';

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
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 glass border-t border-slate-800/50 px-2 pb-6 pt-3 flex justify-around items-center z-50 bg-slate-950/80">
            {items.map((item) => {
                const isActive = activeScreen === item.screen;
                return (
                    <button
                        key={item.id}
                        onClick={() => onNav(item.screen)}
                        className="flex flex-col items-center gap-1 group w-16"
                    >
                        <div className={`p-2 transition-colors duration-300 rounded-full ${isActive ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500 group-hover:text-slate-300'}`}>
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider transition-colors duration-300 ${isActive ? 'font-bold text-blue-500' : 'font-medium text-slate-500'}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
