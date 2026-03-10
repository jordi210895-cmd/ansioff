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
        { id: 'sos', icon: Trophy, label: 'Crisis', screen: 'sc-sos' },
        { id: 'stats', icon: GraduationCap, label: 'Progreso', screen: 'sc-stats' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[rgba(8,15,26,0.88)] backdrop-blur-[24px] saturate-[1.4] border-t border-[rgba(255,255,255,0.06)] flex p-[8px_4px_28px] supports-[padding:max(0px)]:pb-[max(28px,env(safe-area-inset-bottom))]">
            {items.map((item) => {
                const isActive = activeScreen === item.screen;
                return (
                    <button
                        key={item.id}
                        onClick={() => onNav(item.screen)}
                        className={`flex-1 flex flex-col items-center gap-2 p-[8px_4px] bg-transparent border-none cursor-pointer relative group ${isActive ? 'active' : ''}`}
                    >
                        {/* Dot indicator */}
                        <div className={`absolute top-[4px] w-[4px] h-[4px] rounded-full bg-[#89cee4] transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>

                        <div className={`w-[32px] h-[32px] rounded-[12px] flex items-center justify-center transition-all duration-200 ${isActive ? 'bg-[rgba(89,174,210,0.15)] scale-[1.05] drop-shadow-[0_0_5px_rgba(89,174,210,0.5)] text-[#89cee4]' : 'text-[rgba(200,225,235,0.35)] group-hover:text-white/60'}`}>
                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={`text-[9px] tracking-[0.04em] font-normal transition-colors duration-200 ${isActive ? 'text-[#89cee4]' : 'text-[rgba(200,225,235,0.35)]'}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
