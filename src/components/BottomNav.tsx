'use client';

interface BottomNavProps {
    activeScreen: string;
    onNav: (screen: string) => void;
}

export default function BottomNav({ activeScreen, onNav }: BottomNavProps) {
    const items = [
        { id: 'audio', ico: '🎵', label: 'Audios', screen: 'sc-audio' },
        { id: 'notes', ico: '✍️', label: 'Diario', screen: 'sc-notes' },
        { id: 'home', ico: '🏠', label: 'Inicio', screen: 'sc-home' },
        { id: 'breath', ico: '🫁', label: 'Respira', screen: 'sc-breath' },
        { id: 'stats', ico: '📊', label: 'Stats', screen: 'sc-stats' },
    ];

    return (
        <nav className="nav fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between p-[8px_14px_34px] bg-[rgba(13,26,46,0.8)] backdrop-blur-[20px] border-t border-[rgba(255,255,255,0.05)] shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
            <style jsx>{`
                .nav-item {
                    display: flex; flex-direction: column; align-items: center; gap: 5px;
                    flex: 1; padding: 10px 0; border: none; background: none;
                    cursor: pointer; position: relative; transition: all 0.2s;
                }
                .ni-ico { font-size: 20px; transition: 0.2s; opacity: 0.45; filter: grayscale(1); }
                .ni-lab { font-size: 10px; font-weight: 600; color: var(--muted); letter-spacing: 0.02em; }
                
                .nav-item.active .ni-ico { opacity: 1; filter: grayscale(0); transform: translateY(-3px); }
                .nav-item.active .ni-lab { color: var(--sky-1); }
                .nav-item.active::after {
                    content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
                    width: 24px; height: 3px; background: var(--sky-1); border-radius: 0 0 3px 3px;
                    box-shadow: 0 0 10px rgba(74,168,204,0.5);
                }
            `}</style>
            {items.map((item) => {
                const isActive = activeScreen === item.screen;
                return (
                    <button
                        key={item.id}
                        onClick={() => onNav(item.screen)}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <div className="ni-ico">{item.ico}</div>
                        <span className="ni-lab">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
