'use client';

import { useState, useEffect } from 'react';
import { Trophy, Wind, Shield, PenLine } from 'lucide-react';
import TopBar from './TopBar';
import { getStats, getLevelForPoints, UserStats } from '../utils/stats';

interface StatsScreenProps {
    onBack: () => void;
}

export default function StatsScreen({ onBack }: StatsScreenProps) {
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        setStats(getStats());
    }, []);

    if (!stats) return null;

    const level = getLevelForPoints(stats.points);
    const progressPercent = Math.min(100, Math.max(0, ((stats.points - level.currentThreshold) / (level.nextThreshold - level.currentThreshold)) * 100));

    return (
        <div id="s-stats" className="screen active flex flex-col overflow-hidden">
            <style jsx>{`
                #s-stats { background: var(--navy-1); min-height: 100vh; }
                .stats-head { padding: 40px 28px 24px; text-align: center; }
                .st-label { font-size: 10px; font-weight: 700; color: var(--sky-1); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px; }
                .st-level { font-family: var(--serif); font-size: 36px; color: var(--white); margin-bottom: 8px; }
                .st-rank { font-size: 14px; color: var(--muted); }

                .stats-scroll { flex: 1; padding: 0 28px 120px; overflow-y: auto; }

                .lvl-card {
                    background: var(--navy-2); border-radius: 24px; padding: 24px;
                    border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px;
                }
                .p-bar-bg { height: 6px; background: var(--navy-3); border-radius: 10px; margin: 16px 0 8px; overflow: hidden; }
                .p-bar-fill { height: 100%; background: var(--sky-1); border-radius: 10px; transition: width 1s ease-out; }
                .p-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); font-weight: 600; }

                .grid-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .stat-box {
                    background: var(--navy-2); border-radius: 20px; padding: 20px;
                    border: 1px solid rgba(255,255,255,0.03);
                }
                .sb-ico { font-size: 24px; margin-bottom: 12px; opacity: 0.8; }
                .sb-val { font-family: var(--serif); font-size: 28px; color: var(--white); line-height: 1; margin-bottom: 4px; }
                .sb-lab { font-size: 11px; color: var(--muted); font-weight: 500; }
            `}</style>

            <TopBar title="" onBack={onBack} />

            <div className="stats-head">
                <div className="st-label">Tu Camino de Calma</div>
                <div className="st-level">{level.title}</div>
                <div className="st-rank">Nivel de Conciencia Actual</div>
            </div>

            <div className="stats-scroll scrollbar-hide">
                <div className="lvl-card">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold text-lg">{stats.points} <span className="text-sm font-normal text-muted">pts</span></span>
                        <Trophy size={20} color="var(--sky-1)" />
                    </div>
                    <div className="p-bar-bg">
                        <div className="p-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="p-meta">
                        <span>Lvl. {level.title.split(' ')[1] || '1'}</span>
                        <span>{level.nextThreshold} pts para el siguiente</span>
                    </div>
                </div>

                <div className="grid-stats">
                    <div className="stat-box">
                        <div className="sb-ico">🫁</div>
                        <div className="sb-val">{stats.breathMins}</div>
                        <div className="sb-lab">Minutos Respira</div>
                    </div>
                    <div className="stat-box">
                        <div className="sb-ico">✍️</div>
                        <div className="sb-val">{stats.cbtEntries}</div>
                        <div className="sb-lab">Notas Diario</div>
                    </div>
                    <div className="stat-box">
                        <div className="sb-ico">🛡️</div>
                        <div className="sb-val">{stats.sosUses}</div>
                        <div className="sb-lab">Crisis Superadas</div>
                    </div>
                    <div className="stat-box">
                        <div className="sb-ico">🎧</div>
                        <div className="sb-val">{stats.tracksCount || 0}</div>
                        <div className="sb-lab">Paisajes Usados</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
