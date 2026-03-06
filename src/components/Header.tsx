'use client';

import { useState, useEffect } from 'react';

export default function Header() {
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
            </div>
        </header>
    );
}
