'use client';

import { LockKeyhole, HeartHandshake } from 'lucide-react';

interface NavItemProps {
    id: string;
    activeScreen: string;
    onNav: (id: string) => void;
    label: string;
    children: React.ReactNode;
    locked?: boolean;
}

const NavItem = ({ id, activeScreen, onNav, label, children, locked = false }: NavItemProps) => {
    const active = activeScreen === id;
    return (
        <div className={`ni ${active ? 'active' : ''}`} onClick={() => onNav(id)}>
            {children}
            {locked && <span className="nav-lock"><LockKeyhole size={9} /></span>}
            <div className="nl">{label}</div>
        </div>
    );
};

interface BottomNavProps {
    activeScreen: string;
    onNav: (id: string) => void;
    isPremium?: boolean;
}

export default function BottomNav({ activeScreen, onNav, isPremium = false }: BottomNavProps) {
    return (
        <nav className="bottom-nav">
            <NavItem id="home" activeScreen={activeScreen} onNav={onNav} label="Inicio">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={activeScreen === 'home' ? 'rgba(14, 165, 233, 0.2)' : 'none'} stroke={activeScreen === 'home' ? 'var(--p)' : 'var(--text3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </NavItem>
            <NavItem id="sc-tools" activeScreen={activeScreen} onNav={onNav} label="Módulos">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={activeScreen === 'sc-tools' ? 'rgba(14, 165, 233, 0.2)' : 'none'} stroke={activeScreen === 'sc-tools' ? 'var(--p)' : 'var(--text3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            </NavItem>
            <NavItem id="sc-my-therapy" activeScreen={activeScreen} onNav={onNav} label="Mi Terapia">
                <HeartHandshake size={22} color={activeScreen === 'sc-my-therapy' ? '#818cf8' : 'var(--text3)'} />
            </NavItem>

            <style jsx>{`
        .bottom-nav{
          flex-shrink:0;
          background:rgba(4,2,8,0.85);
          backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          border-top:1px solid rgba(255,255,255,0.08);
          padding:10px 8px max(34px, calc(var(--safe-bottom) + 10px));
          display:flex;justify-content:space-around;
          position:fixed;bottom:0;left:0;right:0;
          z-index:1000;
        }
        :global(.ni){
          display:flex;flex-direction:column;align-items:center;gap:4px;
          cursor:pointer;padding:6px 0;border-radius:16px;
          transition: var(--t);
          flex: 1;
          position:relative;
        }
        :global(.nav-lock){position:absolute;top:2px;right:calc(50% - 18px);width:15px;height:15px;border-radius:50%;background:#0e1d2e;border:1px solid rgba(255,255,255,.12);color:#9bb8c8;display:flex;align-items:center;justify-content:center;}
        :global(.ni .nl){
            font-size:10px;
            color:var(--text3);
            font-weight:500;
            letter-spacing:0.01em;
            transition:var(--t);
        }
        :global(.ni.active .nl){
            color:#818cf8;
            font-weight:700;
        }
        :global(.ni svg) {
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        :global(.ni.active svg) {
            transform: scale(1.1) translateY(-1px);
        }
      `}</style>
        </nav>
    );
}
