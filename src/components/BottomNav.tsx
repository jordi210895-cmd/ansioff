'use client';

interface NavItemProps {
    id: string;
    activeScreen: string;
    onNav: (id: string) => void;
    label: string;
    children: React.ReactNode;
}

const NavItem = ({ id, activeScreen, onNav, label, children }: NavItemProps) => {
    const active = activeScreen === id;
    return (
        <div className={`ni ${active ? 'active' : ''}`} onClick={() => onNav(id)}>
            {children}
            <div className="nl">{label}</div>
        </div>
    );
};

interface BottomNavProps {
    activeScreen: string;
    onNav: (id: string) => void;
}

export default function BottomNav({ activeScreen, onNav }: BottomNavProps) {
    return (
        <nav className="bottom-nav">
            <NavItem id="home" activeScreen={activeScreen} onNav={onNav} label="Inicio">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={activeScreen === 'home' ? 'rgba(14, 165, 233, 0.2)' : 'none'} stroke={activeScreen === 'home' ? 'var(--p)' : 'var(--text3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </NavItem>
            <NavItem id="sc-tools" activeScreen={activeScreen} onNav={onNav} label="Módulos">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={activeScreen === 'sc-tools' ? 'rgba(14, 165, 233, 0.2)' : 'none'} stroke={activeScreen === 'sc-tools' ? 'var(--p)' : 'var(--text3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            </NavItem>
            <NavItem id="sounds" activeScreen={activeScreen} onNav={onNav} label="Sonidos">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={activeScreen === 'sounds' ? 'rgba(14, 165, 233, 0.2)' : 'none'} stroke={activeScreen === 'sounds' ? 'var(--p)' : 'var(--text3)'} strokeWidth="2" strokeLinecap="round"><path d="M3 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3v-6z" /><path d="M21 14h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v-6z" /><path d="M5 14V9a7 7 0 0 1 14 0v5" /></svg>
            </NavItem>
            <NavItem id="notes" activeScreen={activeScreen} onNav={onNav} label="Notas">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={activeScreen === 'notes' ? 'rgba(14, 165, 233, 0.2)' : 'none'} stroke={activeScreen === 'notes' ? 'var(--p)' : 'var(--text3)'} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /></svg>
            </NavItem>
            {/* Shortened for brevity, labels are important for UX */}
            <NavItem id="breath" activeScreen={activeScreen} onNav={onNav} label="Calma">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={activeScreen === 'breath' ? 'rgba(14, 165, 233, 0.2)' : 'none'} stroke={activeScreen === 'breath' ? 'var(--p)' : 'var(--text3)'} strokeWidth="2" strokeLinecap="round"><path d="M12 6c0 0-2-2-5-1S3 9 3 12s1 5 4 6c1.5.5 3 .2 4-.5" /><path d="M12 6c0 0 2-2 5-1s4 4 4 7-1 5-4 6c-1.5.5-3 .2-4-.5" /><path d="M12 6v12" /></svg>
            </NavItem>
            <NavItem id="progress" activeScreen={activeScreen} onNav={onNav} label="Estado">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={activeScreen === 'progress' ? 'rgba(14, 165, 233, 0.2)' : 'none'} stroke={activeScreen === 'progress' ? 'var(--p)' : 'var(--text3)'} strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </NavItem>

            <style jsx>{`
        .bottom-nav{
          flex-shrink:0;
          background:rgba(4,2,8,0.85);
          backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          border-top:1px solid rgba(255,255,255,0.08);
          padding:10px 8px 34px;
          display:flex;justify-content:space-around;
          position:fixed;bottom:0;left:0;right:0;
          z-index:1000;
        }
        :global(.ni){
          display:flex;flex-direction:column;align-items:center;gap:4px;
          cursor:pointer;padding:6px 0;border-radius:16px;
          transition: var(--t);
          flex: 1;
        }
        :global(.ni .nl){
            font-size:10px;
            color:var(--text3);
            font-weight:500;
            letter-spacing:0.01em;
            transition:var(--t);
        }
        :global(.ni.active .nl){
            color:var(--p);
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
