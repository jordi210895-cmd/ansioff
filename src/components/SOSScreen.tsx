'use client';

import { useState } from 'react';

interface SOSScreenProps {
    onBack: () => void;
    onFinished?: () => void;
}

const groundingSteps = [
    { id: 'intro', t: 'Pausa y Respira', d: 'No estás en peligro real, es solo una respuesta física intensa.', i: '🌬️', count: 0 },
    { id: 'see', t: '5 cosas que VES', d: 'Nombra y describe 5 objetos que tengas delante.', i: '👁️', count: 5 },
    { id: 'touch', t: '4 cosas que TOCAS', d: 'Siente las texturas de 4 cosas a tu alcance.', i: '🤝', count: 4 },
    { id: 'hear', t: '3 cosas que OYES', d: 'Presta atención a 3 sonidos distintos.', i: '👂', count: 3 },
    { id: 'smell', t: '2 cosas que HUELES', d: 'Identifica 2 olores en tu entorno.', i: '👃', count: 2 },
    { id: 'taste', t: '1 cosa que SABOREAS', d: 'Nota 1 sensación en tu boca.', i: '👅', count: 1 },
    { id: 'write', t: 'Expresión Libre', d: 'Escribe sin filtros todo lo que sientes ahora mismo. Suéltalo todo.', i: '✍️', count: 0 }
];

export default function SOSScreen({ onBack, onFinished }: SOSScreenProps) {
    const [step, setStep] = useState(0);
    const [writing, setWriting] = useState('');

    return (
        <div id="crisis" className="screen active">
            <style jsx>{`
                .screen{position:absolute;inset:0;display:flex;flex-direction:column;overflow-y:auto;padding-bottom:96px;}
                .screen::-webkit-scrollbar{display:none;}

                #crisis .aurora-1{background:radial-gradient(circle,rgba(244,63,94,0.65),transparent 70%);top:-100px;left:-60px;}
                #crisis .aurora-2{background:radial-gradient(circle,rgba(245,158,11,0.3),transparent 70%);bottom:0;right:-80px;}

                .sos-top{padding:24px 26px 20px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:5;}
                .sos-badge{background:rgba(244,63,94,.1);border:1px solid rgba(244,63,94,.3);border-radius:var(--radp);padding:6px 14px;color:var(--r2);font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;}
                
                .sos-main{flex:1;padding:0 26px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;z-index:5;}
                .sos-hero{width:110px;height:110px;border-radius:100%;background:rgba(244,63,94,.1);border:1px solid rgba(244,63,94,.2);display:flex;align-items:center;justify-content:center;font-size:42px;margin-bottom:26px;animation:spulse 2s infinite;}
                .sos-h1{font-size:34px;font-weight:800;color:var(--text);line-height:1;margin-bottom:12px;letter-spacing:-.02em;}
                .sos-p{font-size:14px;color:var(--text2);line-height:1.6;margin-bottom:32px;}

                .sos-card{
                    width:100%;background:var(--glass);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
                    border:1px solid var(--border);border-radius:24px;padding:22px;
                    display:flex;gap:18px;text-align:left;position:relative;transition:var(--t);margin-bottom:12px;
                }
                .sos-card:hover{border-color:var(--border2);}
                .sc-num{
                    width:38px;height:38px;border-radius:12px;flex-shrink:0;
                    background:linear-gradient(135deg,var(--r),var(--am));
                    display:flex;align-items:center;justify-content:center;
                    font-size:16px;font-weight:800;color:#fff;
                }
                .sc-t{font-size:17px;font-weight:800;color:var(--text);margin-bottom:4px;}
                .sc-d{font-size:13px;color:var(--text2);line-height:1.5;}

                .sos-nav{margin-top:24px;display:flex;gap:12px;width:100%;}
                .sbtn-sec{flex:1;background:var(--glass);border:1px solid var(--border);color:var(--text2);padding:16px;border-radius:var(--rad);font-size:14px;font-weight:700;cursor:pointer;transition:var(--t);}
                .sbtn-pri{flex:2;background:linear-gradient(135deg,var(--r),#fb7185);color:#fff;padding:16px;border-radius:var(--rad);font-size:14px;font-weight:800;border:none;cursor:pointer;box-shadow:0 8px 24px rgba(244,63,94,.3);transition:var(--t);}
                .sbtn-pri:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(244,63,94,.45);}

                .sos-write{
                    width:100%;min-height:160px;background:rgba(255,255,255,0.03);
                    border:1px solid var(--border);border-radius:20px;padding:16px;
                    color:var(--text);font-family:inherit;font-size:15px;line-height:1.6;
                    resize:none;outline:none;transition:var(--t);margin-top:12px;
                }
                .sos-write:focus{border-color:rgba(244,63,94,0.4);background:rgba(255,255,255,0.06);}
            `}</style>

            <div className="aurora"><div className="aurora-1"></div><div className="aurora-2"></div></div>

            <div className="sos-top">
                <div onClick={onBack} style={{ cursor: 'pointer', padding: '8px', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>‹</div>
                <div className="sos-badge">Kit de Crisis</div>
                <div style={{ width: 36 }}></div>
            </div>

            <div className="sos-main">
                <div className="sos-hero">{emergencySteps[step].i}</div>
                <div className="sos-h1">Mantén la calma,<br />esto pasará</div>
                <div className="sos-p">Sigue estos pasos simples para recuperar el control de tu respiración y pensamientos.</div>

                <div className="sos-card">
                    <div className="sc-num">{step + 1}</div>
                    <div style={{ flex: 1 }}>
                        <div className="sc-t">{emergencySteps[step].t}</div>
                        <div className="sc-d">{emergencySteps[step].d}</div>

                        {emergencySteps[step].i === '✍️' && (
                            <textarea
                                className="sos-write"
                                placeholder="Escribe aquí lo que tienes en mente..."
                                value={writing}
                                onChange={(e) => setWriting(e.target.value)}
                                autoFocus
                            />
                        )}
                    </div>
                </div>

                <div className="sos-nav">
                    <button className="sbtn-sec" onClick={onBack}>Cerrar</button>
                    <button className="sbtn-pri" onClick={() => {
                        if (step < emergencySteps.length - 1) setStep(step + 1);
                        else if (onFinished) onFinished();
                    }}>
                        {step < emergencySteps.length - 1 ? 'Siguiente paso' : 'Estoy mejor'}
                    </button>
                </div>
            </div>
        </div>
    );
}
