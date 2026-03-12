'use client';

import {
    Activity, Wind, Gamepad2, Music, PenLine, Heart,
    Brain, FileText, Stethoscope, Moon, Target, ChevronRight
} from 'lucide-react';

interface ToolsScreenProps {
    onBack: () => void;
    onNav: (screen: string) => void;
}

const moduleCategories = [
    {
        title: 'Terapéutico',
        tools: [
            { id: 'crisis', name: 'Kit de Crisis', sub: 'Anclaje rápido 5-4-3-2-1', icon: <Activity />, color: 'var(--r)' },
            { id: 'sc-cbt', name: 'Técnicas TCC', sub: 'Reestructuración de ideas', icon: <Brain />, color: 'var(--p)' },
            { id: 'sc-act', name: 'Módulo ACT', sub: 'Aceptación y Compromiso', icon: <Heart />, color: 'var(--p2)' },
        ]
    },
    {
        title: 'Bienestar',
        tools: [
            { id: 'breath', name: 'Respiración', sub: 'Patrones guiados', icon: <Wind />, color: 'var(--c)' },
            { id: 'sounds', name: 'Audios relax', sub: 'Paisajes sonoros', icon: <Music />, color: 'var(--c2)' },
            { id: 'notes', name: 'Diario', sub: 'Escritura consciente', icon: <PenLine />, color: 'var(--em)' },
        ]
    },
    {
        title: 'Herramientas',
        tools: [
            { id: 'sc-games', name: 'Juegos', sub: 'Distracción cognitiva', icon: <Gamepad2 />, color: 'var(--am)' },
            { id: 'sc-eval', name: 'Evaluaciones', sub: 'Hamilton y Goldberg', icon: <FileText />, color: 'var(--p3)' },
            { id: 'sc-night', name: 'Modo Noche', sub: 'Higiene del sueño', icon: <Moon />, color: 'var(--c3)' },
            { id: 'sc-exposure-why', name: 'Mis Motivos', sub: 'Exposición y mejora', icon: <Target />, color: 'var(--r2)' },
        ]
    }
];

export default function ToolsScreen({ onBack, onNav }: ToolsScreenProps) {
    return (
        <div id="modules" className="screen active">
            <style jsx>{`
                .screen{position:absolute;inset:0;display:flex;flex-direction:column;overflow-y:auto;padding-bottom:120px;}
                .screen::-webkit-scrollbar{display:none;}

                #modules .aurora-1{background:radial-gradient(circle,rgba(124,58,237,0.35),transparent 70%);top:-60px;right:-40px;}
                #modules .aurora-2{background:radial-gradient(circle,rgba(6,182,212,0.25),transparent 70%);bottom:100px;left:-80px;}

                .mod-hd{padding:22px 24px 20px;position:relative;z-index:5;}
                .mod-title{font-size:36px;font-weight:800;letter-spacing:-.03em;color:var(--text);margin-bottom:3px;}
                .mod-sub{font-size:12px;color:var(--text2);}

                .cat-sec{margin-bottom:24px;padding:0 22px;position:relative;z-index:5;}
                .cat-lbl{font-size:10px;font-weight:700;letter-spacing:.14em;color:var(--text3);text-transform:uppercase;margin-bottom:12px;padding-left:4px;}
                
                .mod-grid{display:flex;flex-direction:column;gap:10px;}
                .mod-row{
                    background:var(--glass);border:1px solid var(--border);border-radius:20px;
                    padding:14px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:var(--t);
                }
                .mod-row:hover{border-color:var(--border2);background:rgba(255,255,255,0.08);transform:translateY(-1px);}
                
                .mod-ico-box{
                    width:44px;height:44px;border-radius:14px;
                    background:rgba(255,255,255,0.04);border:1px solid var(--border);
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;
                }
                .mod-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:1px;}
                .mod-meta{font-size:11px;color:var(--text2);}
                .mod-arr{margin-left:auto;color:var(--text3);opacity:.5;}
            `}</style>

            <div className="aurora"><div className="aurora-1"></div><div className="aurora-2"></div></div>

            <div className="mod-hd">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div className="mod-title">Módulos</div>
                        <div className="mod-sub">Todas tus herramientas en un solo lugar</div>
                    </div>
                    <div onClick={onBack} style={{ cursor: 'pointer', padding: '8px', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>‹</div>
                </div>
            </div>

            {moduleCategories.map((cat, ci) => (
                <div key={ci} className="cat-sec">
                    <div className="cat-lbl">{cat.title}</div>
                    <div className="mod-grid">
                        {cat.tools.map((t, ti) => (
                            <div key={ti} className="mod-row" onClick={() => onNav(t.id)}>
                                <div className="mod-ico-box" style={{ color: t.color }}>
                                    {t.icon}
                                </div>
                                <div>
                                    <div className="mod-name">{t.name}</div>
                                    <div className="mod-meta">{t.sub}</div>
                                </div>
                                <div className="mod-arr"><ChevronRight size={18} /></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

