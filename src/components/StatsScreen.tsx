'use client';

import { useState, useEffect } from 'react';
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
    const nextLevelPts = level.nextThreshold - level.currentThreshold;
    const currentLevelPts = stats.points - level.currentThreshold;
    const progressPercent = Math.min(100, Math.max(0, (currentLevelPts / nextLevelPts) * 100));

    return (
        <div id="stats" className="screen active">
            <style jsx>{`
                .screen{position:absolute;inset:0;display:flex;flex-direction:column;overflow-y:auto;padding-bottom:96px;}
                .screen::-webkit-scrollbar{display:none;}

                #stats .aurora-1{background:radial-gradient(circle,rgba(245,158,11,0.4),transparent 70%);top:-80px;left:-60px;}
                #stats .aurora-2{background:radial-gradient(circle,rgba(16,185,129,0.3),transparent 70%);bottom:100px;right:-80px;}

                .st-hd{padding:22px 24px 16px;position:relative;z-index:5;}
                .st-title{font-size:36px;font-weight:800;letter-spacing:-.03em;color:var(--text);margin-bottom:3px;}
                .st-sub{font-size:12px;color:var(--text2);}

                .lvl-card{
                    margin:0 22px 20px;
                    background:var(--glass);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
                    border:1px solid var(--border);border-radius:28px;
                    padding:24px;position:relative;z-index:5;overflow:hidden;
                }
                .lvl-card::after{content:'';position:absolute;top:0;right:0;width:120px;height:120px;background:radial-gradient(circle,rgba(245,158,11,.1),transparent 70%);}
                
                .lvl-badge{background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.3);border-radius:var(--radp);padding:5px 12px;color:var(--am);font-size:9px;font-weight:800;letter-spacing:.1em;display:inline-block;margin-bottom:14px;}
                .lvl-name{font-size:24px;font-weight:800;color:var(--text);margin-bottom:6px;}
                .lvl-pts{font-size:13px;color:var(--text2);margin-bottom:24px;}
                .lvl-pts b{color:var(--am);}

                .prog-wrap{margin-bottom:8px;}
                .prog-base{height:8px;background:rgba(255,255,255,.06);border-radius:10px;overflow:hidden;position:relative;}
                .prog-bar{height:100%;background:linear-gradient(90deg,var(--am),#fbbf24);border-radius:10px;}
                .prog-meta{display:flex;justify-content:space-between;font-size:10px;font-weight:700;color:var(--text3);margin-top:8px;letter-spacing:.05em;}

                .st-grid{padding:0 22px;display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative;z-index:5;}
                .st-box{
                    background:var(--glass);border:1px solid var(--border);border-radius:22px;
                    padding:20px;transition:var(--t);
                }
                .st-box:hover{border-color:var(--border2);transform:translateY(-2px);}
                .sb-ico{font-size:20px;margin-bottom:12px;width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;}
                .sb-val{font-size:24px;font-weight:800;color:var(--text);margin-bottom:2px;}
                .sb-lab{font-size:11px;color:var(--text2);letter-spacing:.02em;}

                .streak-card{
                    margin:20px 22px 0;
                    background:linear-gradient(135deg,rgba(244,63,94,.1),rgba(124,58,237,.1));
                    border:1px solid rgba(255,255,255,.08);border-radius:22px;
                    padding:18px;display:flex;align-items:center;gap:16px;z-index:5;position:relative;
                }
                .str-fire{font-size:28px;animation:fireW 1.5s ease-in-out infinite alternate;}
                @keyframes fireW{from{transform:scale(1) rotate(-5deg);}to{transform:scale(1.1) rotate(5deg);}}
                .str-t{font-size:15px;font-weight:800;color:var(--text);margin-bottom:1px;}
                .str-d{font-size:12px;color:var(--text2);}
            `}</style>

            <div className="aurora"><div className="aurora-1"></div><div className="aurora-2"></div></div>

            <div className="st-hd">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div className="st-title">Progreso</div>
                        <div className="st-sub">Tu viaje hacia la calma interior</div>
                    </div>
                    <div onClick={onBack} style={{ cursor: 'pointer', padding: '8px', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>‹</div>
                </div>
            </div>

            <div className="lvl-card">
                <div className="lvl-badge">NIVEL ACTUAL</div>
                <div className="lvl-name">{level.title}</div>
                <div className="lvl-pts">Tienes <b>{stats.points}</b> puntos de paz</div>

                <div className="prog-wrap">
                    <div className="prog-base">
                        <div className="prog-bar" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="prog-meta">
                        <span>{level.currentThreshold} PTS</span>
                        <span>{level.nextThreshold} PTS</span>
                    </div>
                </div>
            </div>

            <div className="st-grid">
                <div className="st-box">
                    <div className="sb-ico">🌬️</div>
                    <div className="sb-val">{stats.breathMins}</div>
                    <div className="sb-lab">Paz respirada</div>
                </div>
                <div className="st-box">
                    <div className="sb-ico">📓</div>
                    <div className="sb-val">{stats.cbtEntries}</div>
                    <div className="sb-lab">Pensamientos libres</div>
                </div>
                <div className="st-box">
                    <div className="sb-ico">🛡️</div>
                    <div className="sb-val">{stats.sosUses}</div>
                    <div className="sb-lab">Crisis superadas</div>
                </div>
                <div className="st-box">
                    <div className="sb-ico">🎧</div>
                    <div className="sb-val">{stats.tracksCount || 0}</div>
                    <div className="sb-lab">Calmas sonoras</div>
                </div>
            </div>

            <div className="streak-card">
                <div className="str-fire">🔥</div>
                <div>
                    <div className="str-t">Racha de 5 días</div>
                    <div className="str-d">¡Vas por muy buen camino!</div>
                </div>
            </div>
        </div>
    );
}
