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
    const [inputs, setInputs] = useState<Record<string, string[]>>({
        see: ['', '', '', '', ''],
        touch: ['', '', '', ''],
        hear: ['', '', ''],
        smell: ['', ''],
        taste: ['']
    });
    const [writing, setWriting] = useState('');

    const currentStep = groundingSteps[step];

    const handleInputChange = (stepId: string, index: number, value: string) => {
        setInputs(prev => ({
            ...prev,
            [stepId]: prev[stepId].map((v, i) => i === index ? value : v)
        }));
    };

    const isStepComplete = () => {
        if (currentStep.count === 0) return true;
        return (inputs[currentStep.id] || []).every(val => val.trim().length > 0);
    };

    return (
        <div id="crisis" className="screen active">
            <style jsx>{`
                .screen{position:absolute;inset:0;display:flex;flex-direction:column;overflow-y:auto;padding-bottom:120px;}
                .screen::-webkit-scrollbar{display:none;}

                #crisis .aurora-1{background:radial-gradient(circle,rgba(244,63,94,0.65),transparent 70%);top:-100px;left:-60px;}
                #crisis .aurora-2{background:radial-gradient(circle,rgba(245,158,11,0.3),transparent 70%);bottom:0;right:-80px;}

                .sos-top{padding:24px 26px 20px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:5;}
                .sos-badge{background:rgba(244,63,94,.1);border:1px solid rgba(244,63,94,.3);border-radius:var(--radp);padding:6px 14px;color:var(--r2);font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;}
                
                .sos-main{flex:1;padding:0 26px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;z-index:5;}
                .sos-hero{width:90px;height:90px;border-radius:100%;background:rgba(244,63,94,.1);border:1px solid rgba(244,63,94,.2);display:flex;align-items:center;justify-content:center;font-size:36px;margin-bottom:20px;animation:spulse 2s infinite;}
                .sos-h1{font-size:28px;font-weight:800;color:var(--text);line-height:1.1;margin-bottom:8px;letter-spacing:-.02em;}
                .sos-p{font-size:13px;color:var(--text2);line-height:1.5;margin-bottom:24px;}

                .sos-card{
                    width:100%;background:var(--glass);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
                    border:1px solid var(--border);border-radius:24px;padding:22px;
                    display:flex;flex-direction:column;gap:12px;text-align:left;position:relative;transition:var(--t);margin-bottom:12px;
                }
                .sc-top{display:flex;gap:18px;align-items:center;}
                .sc-num{
                    width:38px;height:38px;border-radius:12px;flex-shrink:0;
                    background:linear-gradient(135deg,var(--r),var(--am));
                    display:flex;align-items:center;justify-content:center;
                    font-size:16px;font-weight:800;color:#fff;
                }
                .sc-t{font-size:17px;font-weight:800;color:var(--text);margin-bottom:2px;}
                .sc-d{font-size:13px;color:var(--text2);line-height:1.4;}

                .grounding-list{display:flex;flex-direction:column;gap:8px;margin-top:10px;width:100%;}
                .g-input{
                    background:rgba(255,255,255,0.03);border:1px solid var(--border);
                    border-radius:14px;padding:12px 14px;color:var(--text);
                    font-size:14px;outline:none;transition:var(--t);
                }
                .g-input:focus{border-color:rgba(244,63,94,0.4);background:rgba(255,255,255,0.06);}
                .g-input::placeholder{color:var(--text3);}

                .sos-write{
                    width:100%;min-height:160px;background:rgba(255,255,255,0.03);
                    border:1px solid var(--border);border-radius:20px;padding:16px;
                    color:var(--text);font-family:inherit;font-size:15px;line-height:1.6;
                    resize:none;outline:none;transition:var(--t);margin-top:8px;
                }
                .sos-write:focus{border-color:rgba(244,63,94,0.4);background:rgba(255,255,255,0.06);}

                .sos-nav{margin-top:20px;display:flex;gap:12px;width:100%;}
                .sbtn-sec{flex:1;background:var(--glass);border:1px solid var(--border);color:var(--text2);padding:16px;border-radius:var(--rad);font-size:14px;font-weight:700;cursor:pointer;transition:var(--t);}
                .sbtn-pri{
                    flex:2;background:linear-gradient(135deg,var(--r),#fb7185);color:#fff;
                    padding:16px;border-radius:var(--rad);font-size:14px;font-weight:800;
                    border:none;cursor:pointer;box-shadow:0 8px 24px rgba(244,63,94,.3);transition:var(--t);
                }
                .sbtn-pri:disabled{opacity:.4;cursor:default;transform:none !important;box-shadow:none !important;}
                .sbtn-pri:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(244,63,94,.45);}

                .prog-bar{position:fixed;top:0;left:0;right:0;height:4px;background:rgba(255,255,255,.05);z-index:100;}
                .prog-fill{height:100%;background:var(--r);transition:width .4s ease-out;}
            `}</style>

            <div className="prog-bar">
                <div className="prog-fill" style={{ width: `${((step + 1) / groundingSteps.length) * 100}%` }}></div>
            </div>

            <div className="aurora"><div className="aurora-1"></div><div className="aurora-2"></div></div>

            <div className="sos-top">
                <div onClick={onBack} style={{ cursor: 'pointer', padding: '8px', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--border)' }}>‹</div>
                <div className="sos-badge">Guía de Anclaje</div>
                <div style={{ width: 36 }}></div>
            </div>

            <div className="sos-main">
                <div className="sos-hero">{currentStep.i}</div>
                <div className="sos-h1">Mantén la calma,<br />esto pasará</div>
                <div className="sos-p">Sigue la técnica 5-4-3-2-1 para anclarte al presente.</div>

                <div className="sos-card">
                    <div className="sc-top">
                        <div className="sc-num">{step + 1}</div>
                        <div>
                            <div className="sc-t">{currentStep.t}</div>
                            <div className="sc-d">{currentStep.d}</div>
                        </div>
                    </div>

                    {currentStep.count > 0 && (
                        <div className="grounding-list">
                            {(inputs[currentStep.id] || []).map((val, idx) => (
                                <input
                                    key={idx}
                                    className="g-input"
                                    placeholder={`${idx + 1}º elemento...`}
                                    value={val}
                                    onChange={(e) => handleInputChange(currentStep.id, idx, e.target.value)}
                                    autoFocus={idx === 0}
                                />
                            ))}
                        </div>
                    )}

                    {currentStep.id === 'write' && (
                        <textarea
                            className="sos-write"
                            placeholder="Escribe aquí lo que tienes en mente..."
                            value={writing}
                            onChange={(e) => setWriting(e.target.value)}
                            autoFocus
                        />
                    )}
                </div>

                <div className="sos-nav">
                    <button className="sbtn-sec" onClick={step === 0 ? onBack : () => setStep(step - 1)}>
                        {step === 0 ? 'Cerrar' : 'Anterior'}
                    </button>
                    <button
                        className="sbtn-pri"
                        disabled={!isStepComplete()}
                        onClick={() => {
                            if (step < groundingSteps.length - 1) setStep(step + 1);
                            else if (onFinished) onFinished();
                        }}
                    >
                        {step < groundingSteps.length - 1 ? 'Siguiente paso' : 'Estoy mejor'}
                    </button>
                </div>
            </div>
        </div>
    );
}
