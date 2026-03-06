'use client';

import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
    onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const tick = () => {
            const d = new Date();
            const t = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
            setTime(t);
        };
        tick();
        const interval = setInterval(tick, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="app-header">
            <div className="flex items-center gap-3">
                <img src="/logo.png" alt="ANSIOFF Logo" className="w-10 h-10 rounded-xl shadow-lg border border-white/10" />
                <div className="app-logo">ANSI<span>OFF</span></div>
            </div>
            <div className="header-right">
                <span className="header-time">{time}</span>
                {onLogout && (
                    <button
                        onClick={onLogout}
                        title="Cerrar sesión"
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800/60"
                    >
                        <LogOut size={15} />
                    </button>
                )}
            </div>
        </header>
    );
}
