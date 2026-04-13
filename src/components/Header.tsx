'use client';

import { useState, useEffect } from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';

interface HeaderProps {
    onLogout?: () => void;
    onSettings?: () => void;
}

export default function Header({ onLogout, onSettings }: HeaderProps) {
    return (
        <header className="sticky top-0 z-[60] px-6 pt-12 pb-4 flex items-center justify-between border-b border-white/5 bg-transparent backdrop-blur-md">
            <div className="flex items-center justify-start w-12 z-10">
                {onSettings ? (
                    <button
                        onClick={onSettings}
                        title="Ajustes y Privacidad"
                        className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors"
                    >
                        <Menu className="text-slate-400" size={24} />
                    </button>
                ) : (
                    <div className="w-10"></div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-1">
                    <span className="text-[10px] font-black text-white">A</span>
                </div>
                <span className="text-sm font-bold tracking-tight text-white/90">ANSIOFF</span>
            </div>

            <div className="flex items-center justify-end w-12 gap-2 z-10">
                {onLogout && (
                    <button
                        onClick={onLogout}
                        title="Cerrar sesión"
                        className="p-2 -mr-2 rounded-full hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="text-slate-400 hover:text-red-400" size={20} />
                    </button>
                )}
            </div>
        </header>
    );
}
