'use client';

import { ArrowLeft } from 'lucide-react';

interface TopBarProps {
    title: string;
    onBack: () => void;
    dark?: boolean;
}

export default function TopBar({ title, onBack, dark }: TopBarProps) {
    return (
        <div className={`flex items-center gap-4 px-6 py-4 flex-shrink-0 ${dark ? 'bg-slate-900' : 'bg-transparent'}`}>
            <button
                onClick={onBack}
                className="w-10 h-10 border-2 border-slate-800 hover:border-blue-500/50 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 bg-slate-900 text-blue-400"
            >
                <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h1 className="text-lg font-medium text-white/90 pl-1 py-1" style={{ fontFamily: 'Georgia, serif' }}>
                {title}
            </h1>
        </div>
    );
}

