'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Languages, MapPin, Search, ShieldCheck, UserCheck, Video } from 'lucide-react';

interface PsychologistsScreenProps {
    onBack: () => void;
}

type Mode = 'Todos' | 'Online' | 'Presencial';

const previewProfiles = [
    {
        id: 'preview-anxiety',
        initials: 'PS',
        title: 'Plantilla de especialista en ansiedad',
        specialty: 'Ansiedad, pánico y exposición gradual',
        location: 'España',
        mode: 'Online' as const,
        languages: 'Español',
        focus: ['Terapia cognitivo-conductual', 'Exposición gradual', 'Ansiedad'],
    },
    {
        id: 'preview-act',
        initials: 'AC',
        title: 'Plantilla de especialista en aceptación',
        specialty: 'Aceptación, rumiación y hábitos',
        location: 'España',
        mode: 'Presencial' as const,
        languages: 'Español',
        focus: ['Aceptación y compromiso', 'Pensamientos repetitivos', 'Autocuidado'],
    },
];

export default function PsychologistsScreen({ onBack }: PsychologistsScreenProps) {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<Mode>('Todos');

    const visibleProfiles = useMemo(() => {
        const normalized = query.trim().toLocaleLowerCase('es');
        return previewProfiles.filter((profile) => {
            const matchesMode = mode === 'Todos' || profile.mode === mode;
            const haystack = [profile.title, profile.specialty, profile.location, ...profile.focus].join(' ').toLocaleLowerCase('es');
            return matchesMode && (!normalized || haystack.includes(normalized));
        });
    }, [mode, query]);

    return (
        <div className="psychologists-screen">
            <style jsx>{`
                .psychologists-screen{position:absolute;inset:0;overflow:hidden;background:#080b15;color:#fff;}
                .psychologists-screen:before{content:"";position:absolute;inset:-120px auto auto -100px;width:390px;height:390px;border-radius:50%;background:radial-gradient(circle,rgba(86,57,190,.35),transparent 70%);pointer-events:none;}
                .scroll{position:relative;z-index:1;height:100%;overflow-y:auto;padding:calc(20px + var(--safe-top)) 18px calc(120px + var(--safe-bottom));scrollbar-width:none;}
                .scroll::-webkit-scrollbar{display:none;}
                .header{display:flex;align-items:flex-start;justify-content:space-between;margin:8px 2px 20px;}
                h1{font-size:34px;line-height:1.04;letter-spacing:-.04em;margin:0;font-weight:800;}
                .subtitle{margin-top:7px;color:rgba(255,255,255,.5);font-size:13px;}
                .back{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid rgba(255,255,255,.12);border-radius:13px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.75);cursor:pointer;}
                .preview{padding:16px;margin-bottom:16px;border:1px solid rgba(0,196,255,.25);border-radius:20px;background:linear-gradient(135deg,rgba(0,196,255,.09),rgba(86,57,190,.1));}
                .preview-title{display:flex;align-items:center;gap:8px;margin-bottom:7px;color:#9be8ff;font-size:13px;font-weight:800;}
                .preview p{margin:0;color:rgba(255,255,255,.62);font-size:12px;line-height:1.55;}
                .search{display:flex;align-items:center;gap:9px;height:46px;padding:0 13px;border:1px solid rgba(255,255,255,.11);border-radius:14px;background:rgba(255,255,255,.06);}
                .search input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#fff;font:inherit;font-size:13px;}
                .search input::placeholder{color:rgba(255,255,255,.3);}
                .modes{display:flex;gap:8px;margin:11px 0 18px;}
                .mode{flex:1;min-height:36px;border:1px solid rgba(255,255,255,.1);border-radius:11px;background:rgba(255,255,255,.05);color:rgba(255,255,255,.48);font-size:11px;font-weight:700;cursor:pointer;}
                .mode.active{border-color:rgba(0,196,255,.38);background:rgba(0,196,255,.12);color:#87e5ff;}
                .card{padding:18px;margin-bottom:12px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:#121728;box-shadow:0 12px 32px rgba(0,0,0,.25);}
                .card-top{display:flex;align-items:flex-start;gap:13px;}
                .avatar{display:flex;align-items:center;justify-content:center;width:52px;height:52px;flex:0 0 auto;border-radius:16px;background:linear-gradient(135deg,#1f9bc6,#6445ca);font-size:14px;font-weight:800;}
                .card-main{min-width:0;flex:1;}
                .demo{display:inline-block;padding:3px 7px;margin-bottom:5px;border-radius:7px;background:rgba(255,185,50,.12);color:#ffc75b;font-size:9px;font-weight:900;letter-spacing:.12em;}
                .card-title{font-size:15px;font-weight:800;line-height:1.3;}
                .specialty{margin-top:3px;color:#aeb8d2;font-size:12px;line-height:1.4;}
                .meta{display:flex;flex-wrap:wrap;gap:11px;margin:14px 0;color:rgba(255,255,255,.48);font-size:11px;}
                .meta span{display:flex;align-items:center;gap:5px;}
                .tags{display:flex;flex-wrap:wrap;gap:7px;}
                .tag{padding:5px 8px;border:1px solid rgba(255,255,255,.08);border-radius:999px;background:rgba(255,255,255,.04);color:rgba(255,255,255,.62);font-size:10px;}
                .soon{width:100%;min-height:42px;margin-top:16px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(255,255,255,.05);color:rgba(255,255,255,.38);font-size:12px;font-weight:800;}
                .empty{padding:28px 16px;border:1px dashed rgba(255,255,255,.12);border-radius:18px;color:rgba(255,255,255,.38);font-size:12px;text-align:center;}
            `}</style>

            <div className="scroll">
                <header className="header">
                    <div><h1>Apoyo<br />profesional</h1><p className="subtitle">Directorio de psicólogos</p></div>
                    <button className="back" onClick={onBack} aria-label="Volver a módulos"><ArrowLeft size={18} /></button>
                </header>

                <section className="preview">
                    <div className="preview-title"><ShieldCheck size={17} /> Vista previa del directorio</div>
                    <p>Los perfiles reales se publicarán únicamente después de verificar identidad, colegiación y datos de contacto. Las tarjetas de esta versión son plantillas de demostración y no permiten reservar.</p>
                </section>

                <label className="search">
                    <Search size={17} color="rgba(255,255,255,.45)" />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar especialidad o enfoque" />
                </label>
                <div className="modes" role="group" aria-label="Modalidad">
                    {(['Todos', 'Online', 'Presencial'] as Mode[]).map((item) => <button key={item} className={`mode ${mode === item ? 'active' : ''}`} onClick={() => setMode(item)}>{item}</button>)}
                </div>

                {visibleProfiles.length ? visibleProfiles.map((profile) => (
                    <article className="card" key={profile.id}>
                        <div className="card-top">
                            <div className="avatar">{profile.initials}</div>
                            <div className="card-main">
                                <span className="demo">DEMOSTRACIÓN</span>
                                <div className="card-title">{profile.title}</div>
                                <div className="specialty">{profile.specialty}</div>
                            </div>
                            <UserCheck size={18} color="#87e5ff" />
                        </div>
                        <div className="meta">
                            <span>{profile.mode === 'Online' ? <Video size={14} /> : <MapPin size={14} />}{profile.mode} · {profile.location}</span>
                            <span><Languages size={14} />{profile.languages}</span>
                        </div>
                        <div className="tags">{profile.focus.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
                        <button className="soon" disabled>Reservas próximamente</button>
                    </article>
                )) : <div className="empty">No hay plantillas que coincidan con esta búsqueda.</div>}
            </div>
        </div>
    );
}
