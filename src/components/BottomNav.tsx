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
        <nav className="nav">
            <NavItem id="home" activeScreen={activeScreen} onNav={onNav} label="Inicio">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={activeScreen === 'home' ? 'var(--c2)' : 'var(--text3)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </NavItem>
            <NavItem id="sounds" activeScreen={activeScreen} onNav={onNav} label="Sonidos">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={activeScreen === 'sounds' ? 'var(--c2)' : 'var(--text3)'} strokeWidth="1.8" strokeLinecap="round"><path d="M3 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3v-6z" /><path d="M21 14h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v-6z" /><path d="M5 14V9a7 7 0 0 1 14 0v5" /></svg>
            </NavItem>
            <NavItem id="notes" activeScreen={activeScreen} onNav={onNav} label="Notas">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={activeScreen === 'notes' ? 'var(--c2)' : 'var(--text3)'} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /></svg>
            </NavItem>
            <NavItem id="breath" activeScreen={activeScreen} onNav={onNav} label="Respirar">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={activeScreen === 'breath' ? 'var(--c2)' : 'var(--text3)'} strokeWidth="1.8" strokeLinecap="round"><path d="M12 6c0 0-2-2-5-1S3 9 3 12s1 5 4 6c1.5.5 3 .2 4-.5" /><path d="M12 6c0 0 2-2 5-1s4 4 4 7-1 5-4 6c-1.5.5-3 .2-4-.5" /><path d="M12 6v12" /></svg>
            </NavItem>
            <NavItem id="crisis" activeScreen={activeScreen} onNav={onNav} label="Crisis">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={activeScreen === 'crisis' ? 'var(--c2)' : 'var(--text3)'} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </NavItem>
            <NavItem id="progress" activeScreen={activeScreen} onNav={onNav} label="Progreso">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={activeScreen === 'progress' ? 'var(--c2)' : 'var(--text3)'} strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </NavItem>

            <style jsx>{`
        .nav{
          flex-shrink:0;
          background:rgba(8,6,15,0.9);
          backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);
          border-top:1px solid var(--border);
          padding:10px 4px 22px;
          display:flex;justify-content:space-around;
          position:relative;z-index:30;
        }
        :global(.ni){
          display:flex;flex-direction:column;align-items:center;gap:5px;
          cursor:pointer;padding:5px 10px;border-radius:14px;
          transition:var(--t);min-width:46px;
        }
        :global(.ni .nl){font-size:9.5px;color:var(--text3);font-weight:600;letter-spacing:.03em;transition:var(--t);}
        :global(.ni.active .nl){color:var(--c2);}
      `}</style>
        </nav>
    );
}
