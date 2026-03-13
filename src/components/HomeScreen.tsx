'use client';

interface HomeScreenProps {
  onNav: (screen: string) => void;
  cbtCount?: number;
}

export default function HomeScreen({ onNav, cbtCount = 0 }: HomeScreenProps) {
  return (
    <div id="home" className="screen active">
      <style jsx>{`
                .screen{position:relative;flex:1;display:none;flex-direction:column;overflow-y:auto;padding-bottom:96px;min-height:0;}
                .screen::-webkit-scrollbar{display:none;}
                .screen.active{display:flex;}
                
                #home .aurora-1{background:radial-gradient(circle,rgba(6,182,212,0.4),transparent 70%);top:-100px;left:-80px;}
                #home .aurora-2{background:radial-gradient(circle,rgba(34,211,238,0.3),transparent 70%);top:200px;right:-120px;}
                #home .aurora-3{background:radial-gradient(circle,rgba(103,232,249,0.2),transparent 70%);bottom:80px;left:20px;}

                .home-pad{padding:20px 22px 0;position:relative;z-index:5;}

                .home-chip{
                  display:inline-flex;align-items:center;gap:7px;
                  background:rgba(6,182,212,0.1);
                  border:1px solid rgba(6,182,212,0.25);
                  border-radius:var(--radp);padding:6px 14px;margin-bottom:16px;
                }
                .chip-dot{width:6px;height:6px;border-radius:50%;background:var(--c2);box-shadow:0 0 8px var(--c2);animation:dotP 2s ease-in-out infinite;}
                @keyframes dotP{0%,100%{opacity:.6;}50%{opacity:1;}}
                .chip-txt{font-size:10px;font-weight:700;color:var(--c3);letter-spacing:.12em;text-transform:uppercase;}

                .home-greet{
                  font-size:48px;font-weight:800;line-height:.96;color:var(--text);
                  letter-spacing:-.03em;margin-bottom:8px;
                }
                .home-greet .hi{color:transparent;background:linear-gradient(90deg,var(--c2),var(--c3));-webkit-background-clip:text;background-clip:text;}
                .home-sub{font-size:13px;color:var(--text2);font-weight:500;margin-bottom:22px;}

                /* SOS pill */
                .sos-pill{
                  margin:0 22px 18px;
                  background:linear-gradient(135deg,rgba(244,63,94,0.14),rgba(244,63,94,0.06));
                  border:1px solid rgba(244,63,94,0.28);border-radius:var(--rad);
                  padding:16px 18px;display:flex;align-items:center;gap:14px;
                  cursor:pointer;position:relative;overflow:hidden;transition:var(--t);
                }
                .sos-pill::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--r);border-radius:3px 0 0 3px;}
                .sos-pill:hover{border-color:rgba(244,63,94,0.5);background:linear-gradient(135deg,rgba(244,63,94,0.2),rgba(244,63,94,0.1));}
                .sos-icon{
                  width:42px;height:42px;border-radius:13px;background:var(--r);
                  flex-shrink:0;display:flex;align-items:center;justify-content:center;
                  font-size:11px;font-weight:800;color:#fff;letter-spacing:.04em;
                  animation:spulse 2.5s ease-in-out infinite;
                }
                @keyframes spulse{0%,100%{box-shadow:0 0 0 0 rgba(244,63,94,0.5);}50%{box-shadow:0 0 0 8px rgba(244,63,94,0);}}
                .sos-text .t{font-size:14px;font-weight:700;color:#ff9eae;}
                .sos-text .s{font-size:11px;color:rgba(255,158,174,0.5);margin-top:1px;}
                .sos-pill-arr{color:rgba(255,158,174,.35);font-size:20px;margin-left:auto;}

                /* Bento cards */
                .bento{padding:0 22px;display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}

                .card{
                  background:var(--glass);
                  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
                  border:1px solid var(--border);border-radius:var(--rad);
                  padding:16px;cursor:pointer;position:relative;overflow:hidden;
                  transition:var(--t);
                }
                .card:hover{border-color:var(--border2);transform:translateY(-2px);}
                .card::before{content:'';position:absolute;inset:0;border-radius:var(--rad);background:linear-gradient(135deg,rgba(255,255,255,0.04),transparent);pointer-events:none;}

                .card-breath{
                  grid-column:span 2;display:flex;align-items:center;gap:16px;
                  background:linear-gradient(135deg,rgba(6,182,212,0.12),rgba(124,58,237,0.08));
                  border-color:rgba(6,182,212,0.2);
                }
                .card-breath:hover{border-color:rgba(6,182,212,0.4);}

                .morb{position:relative;width:52px;height:52px;flex-shrink:0;}
                .morb-r{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(6,182,212,.2);animation:moR 4s ease-in-out infinite;}
                .morb-r.r2{inset:-8px;animation-delay:1.4s;border-color:rgba(6,182,212,.1);}
                @keyframes moR{0%,100%{transform:scale(1);opacity:.4;}50%{transform:scale(1.1);opacity:.8;}}
                .morb-c{position:absolute;inset:9px;border-radius:50%;background:radial-gradient(circle at 36% 30%,rgba(200,240,255,.9),rgba(6,182,212,.7) 50%,rgba(20,80,160,.8));animation:moC 4s ease-in-out infinite;box-shadow:0 0 16px rgba(6,182,212,.4);}
                @keyframes moC{0%,100%{transform:scale(.86);}50%{transform:scale(1.12);}}

                .bnums{display:flex;gap:4px;margin-bottom:4px;}
                .bnum{width:21px;height:21px;border-radius:6px;background:rgba(6,182,212,.12);border:1px solid rgba(6,182,212,.25);font-size:10px;font-weight:800;color:var(--c2);display:flex;align-items:center;justify-content:center;}
                .btitle{font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px;}
                .bmeta{font-size:10px;color:var(--text2);}
                .bstart{
                  margin-left:auto;flex-shrink:0;
                  background:linear-gradient(135deg,var(--c),var(--p));
                  color:#fff;font-size:11px;font-weight:800;letter-spacing:.04em;
                  padding:9px 15px;border-radius:var(--radp);border:none;cursor:pointer;
                  transition:var(--t);box-shadow:0 4px 16px rgba(6,182,212,.3);
                }

                .card-tool{display:flex;flex-direction:column;gap:0;min-height:100px;justify-content:space-between;}
                .ct-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:auto;}
                .ct-ico{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;}
                .ct-arrow{width:24px;height:24px;border-radius:7px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;color:var(--text3);}
                .ct-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px;}
                .ct-desc{font-size:10px;color:var(--text2);line-height:1.4;}

                .tc-sounds .ct-ico{background:rgba(124,58,237,.12);border-color:rgba(124,58,237,.25);}
                .tc-diary .ct-ico{background:rgba(16,185,129,.1);border-color:rgba(16,185,129,.22);}
                .tc-games .ct-ico{background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.22);}
                .tc-progress .ct-ico{background:rgba(244,63,94,.1);border-color:rgba(244,63,94,.22);}

                .home-quote{
                  margin:0 22px;
                  padding:16px 18px;
                  background:var(--glass);backdrop-filter:blur(16px);
                  border:1px solid var(--border);border-radius:var(--rad);
                  border-left:3px solid var(--c);
                }
                .hq-text{font-size:14px;font-style:italic;font-weight:500;color:rgba(241,240,245,.7);line-height:1.7;margin-bottom:8px;}
                .hq-by{font-size:10px;color:var(--text3);font-weight:600;letter-spacing:.1em;text-transform:uppercase;}
            `}</style>

      <div className="aurora"><div className="aurora-1"></div><div className="aurora-2"></div><div className="aurora-3"></div></div>

      <div className="home-pad">
      </div>

      <div className="bento">
        <div className="card card-breath" onClick={() => onNav('breath')}>
          <div className="morb"><div className="morb-r"></div><div className="morb-r r2"></div><div className="morb-c"></div></div>
          <div style={{ flex: 1 }}><div className="bnums"><div className="bnum">4</div><div className="bnum">2</div><div className="bnum">6</div></div><div className="btitle">Alivio del estrés profundo</div><div className="bmeta">⏱ 5 min · Principiante</div></div>
          <button className="bstart">▶ Start</button>
        </div>

        <div className="card card-tool tc-sounds" onClick={() => onNav('sounds')}>
          <div className="ct-top"><div className="ct-ico" style={{ background: 'rgba(6,182,212,0.1)', borderColor: 'rgba(6,182,212,0.2)' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--c2)" strokeWidth="1.7" strokeLinecap="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg></div><div className="ct-arrow"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg></div></div>
          <div><div className="ct-name">Audios</div><div className="ct-desc">Sonidos y meditaciones</div></div>
        </div>
        <div className="card card-tool tc-diary" onClick={() => onNav('notes')}>
          <div className="ct-top"><div className="ct-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="1.7" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /></svg></div><div className="ct-arrow"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg></div></div>
          <div><div className="ct-name">Diario</div><div className="ct-desc">Reflexión consciente</div></div>
        </div>
        <div className="card card-tool tc-modules" style={{ background: 'linear-gradient(135deg,rgba(34,211,238,0.1),rgba(6,182,212,0.06))', borderColor: 'rgba(34,211,238,0.2)' }} onClick={() => onNav('sc-tools')}>
          <div className="ct-top"><div className="ct-ico" style={{ background: 'rgba(34,211,238,0.12)', borderColor: 'rgba(34,211,238,0.25)' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--c2)" strokeWidth="1.7" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg></div><div className="ct-arrow"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg></div></div>
          <div><div className="ct-name">Módulos</div><div className="ct-desc">Todas las herramientas</div></div>
        </div>
        <div className="card card-tool tc-games" onClick={() => onNav('sc-games')}>
          <div className="ct-top"><div className="ct-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--am)" strokeWidth="1.7" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3" /></svg></div><div className="ct-arrow"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg></div></div>
          <div><div className="ct-name">Juegos</div><div className="ct-desc">Distracción cognitiva</div></div>
        </div>
        <div className="card card-tool tc-progress" onClick={() => onNav('progress')}>
          <div className="ct-top"><div className="ct-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--r2)" strokeWidth="1.7" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div><div className="ct-arrow"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10" /></svg></div></div>
          <div><div className="ct-name">Progreso</div><div className="ct-desc">Tu evolución</div></div>
        </div>
      </div>

      <div className="home-quote">
        <div className="hq-text">Tus sentimientos son válidos, pero no son tu destino. Respira y confía en el proceso.</div>
        <div className="hq-by">ANSIOFF · Reflexión de hoy</div>
      </div>
    </div>
  );
}
