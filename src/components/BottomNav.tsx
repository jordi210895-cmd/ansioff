'use client';

import { Home, Volume2, Pencil, Wind, LayoutGrid } from 'lucide-react';

interface BottomNavProps {
    activeScreen: string;
    onNav: (screen: string) => void;
}

export default function BottomNav({ activeScreen, onNav }: BottomNavProps) {
    const items = [
        { id: 'home', icon: Home, label: 'Inicio', screen: 'sc-home' },
        { id: 'audio', icon: Volume2, label: 'Sonidos', screen: 'sc-audio' },
        { id: 'notes', icon: Pencil, label: 'Notas', screen: 'sc-notes' },
        { id: 'breath', icon: Wind, label: 'Respirar', screen: 'sc-breath' },
        { id: 'tools', icon: LayoutGrid, label: 'Módulos', screen: 'sc-tools' },
    ];

    return (
        <nav className="bnav">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`bt ${activeScreen === item.screen ? 'on' : ''}`}
                    onClick={() => onNav(item.screen)}
                >
                    <item.icon className="bt-ico-svg w-5 h-5 mb-1" />
                    <span className="bt-lbl">{item.label}</span>
                    <div className="bt-pip"></div>
                </div>
            ))}
        </nav>
    );
}
