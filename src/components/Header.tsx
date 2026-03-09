'use client';

import { useState, useEffect } from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';

interface HeaderProps {
    onLogout?: () => void;
    onSettings?: () => void;
}

export default function Header({ onLogout, onSettings }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 glass px-8 pt-8 pb-6 flex flex-col items-center justify-center gap-1 border-b border-white/5 bg-[#080A12]">
            <div className="flex items-center justify-between w-full max-w-md">
                <div className="flex items-center">
                    {onSettings ? (
                        <button
                            onClick={onSettings}
                            title="Ajustes y Privacidad"
                            className="p-2 -ml-2 rounded-full hover:bg-slate-800/50 transition-colors"
                        >
                            <Menu className="text-slate-400" size={24} />
                        </button>
                    ) : (
                        <div className="w-10"></div>
                    )}
                </div>
                <div className="text-center absolute left-1/2 -translate-x-1/2 flex flex-col gap-1.5">
                    <h1 className="text-2xl font-bold tracking-tighter text-white">ANSIOFF</h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-bold">Tu Espacio Seguro</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-slate-800/50 transition-colors relative hidden">
                        <Bell className="text-slate-400" size={24} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            title="Cerrar sesión"
                            className="p-2 rounded-full hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="text-slate-400 hover:text-red-400" size={20} />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
