'use client';

import { useState } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { requestNotificationsForEntry, scheduleDailyReminder } from '@/lib/reminders';

interface PostOnboardingSetupProps {
    open: boolean;
    onDone: () => void;
}

export default function PostOnboardingSetup({ open, onDone }: PostOnboardingSetupProps) {
    const [time, setTime] = useState('20:00');
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');

    if (!open) return null;

    const enableReminder = async () => {
        setBusy(true);
        setMessage('');
        try {
            const enabled = await scheduleDailyReminder(time);
            setReminderEnabled(enabled);
            if (!enabled) setMessage('Puedes permitir las notificaciones más tarde desde Ajustes.');
        } catch {
            setMessage('No se pudo activar ahora. Puedes hacerlo después desde Ajustes.');
        } finally {
            setBusy(false);
        }
    };

    const enterApp = async () => {
        try {
            await requestNotificationsForEntry(reminderEnabled ? time : undefined);
        } catch {
            // The user can still enter the app if OS permissions are denied or unavailable.
        }
        onDone();
    };

    return (
        <div className="setup-root" role="dialog" aria-modal="true" aria-labelledby="setup-title">
            <style jsx>{`
                .setup-root{position:fixed;inset:0;z-index:1350;background:#03080f;color:#e5f2f7;overflow-y:auto;}
                .setup-shell{width:100%;max-width:480px;min-height:100%;margin:0 auto;padding:max(18px,env(safe-area-inset-top)) 20px max(20px,env(safe-area-inset-bottom));display:flex;flex-direction:column;}
                .heading{padding:42px 2px 26px;}
                .eyebrow{color:#69bdd8;font-size:10px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;margin-bottom:10px;}
                h2{font-size:30px;line-height:1.15;letter-spacing:0;margin:0 0 11px;}
                .lead{color:rgba(210,232,240,.62);font-size:14px;line-height:1.55;}
                .option{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035);border-radius:18px;padding:18px;margin-bottom:12px;}
                .option-top{display:grid;grid-template-columns:42px 1fr;gap:13px;align-items:center;}
                .icon{width:42px;height:42px;border-radius:13px;background:rgba(90,173,207,.12);color:#72c6df;display:flex;align-items:center;justify-content:center;}
                .option-title{font-size:14px;font-weight:800;margin-bottom:3px;}
                .option-copy{font-size:11px;color:rgba(210,232,240,.54);line-height:1.45;}
                .time-row{display:flex;gap:10px;margin-top:16px;}
                input{height:48px;flex:1;border:1px solid rgba(255,255,255,.1);background:#07111d;color:#e5f2f7;border-radius:13px;padding:0 14px;font:inherit;}
                .action{min-height:48px;border-radius:13px;border:0;background:#5aadcf;color:#031018;font-size:12px;font-weight:850;padding:0 16px;display:flex;align-items:center;justify-content:center;gap:7px;}
                .account{width:100%;margin-top:16px;}
                .enabled{margin-top:14px;color:#83d9b3;font-size:12px;display:flex;align-items:center;gap:7px;}
                .message{margin-top:12px;color:#f5c97a;font-size:11px;line-height:1.4;}
                .done{width:100%;min-height:56px;margin-top:auto;border:0;border-radius:16px;background:#e3f2f6;color:#031018;font-size:14px;font-weight:850;}
            `}</style>
            <div className="setup-shell">
                <div className="heading">
                    <div className="eyebrow">7 días completos activados</div>
                    <h2 id="setup-title">Tu acceso está listo. ¿Cuándo quieres tu recordatorio?</h2>
                    <p className="lead">Durante los próximos 7 días tienes todas las herramientas desbloqueadas, sin tarjeta ni renovación automática. Elige una hora para tu pausa diaria o entra directamente para activar avisos suaves.</p>
                </div>

                <div className="option">
                    <div className="option-top">
                        <div className="icon"><Bell size={21} /></div>
                        <div><div className="option-title">Recordatorio diario</div><div className="option-copy">Una notificación local, a la hora que elijas. Puedes desactivarla cuando quieras.</div></div>
                    </div>
                    {reminderEnabled ? (
                        <div className="enabled"><Check size={15} /> Activado todos los días a las {time}</div>
                    ) : (
                        <div className="time-row"><input type="time" value={time} onChange={(event) => setTime(event.target.value)} aria-label="Hora del recordatorio" /><button className="action" onClick={enableReminder} disabled={busy}>{busy ? <Loader2 size={16} className="animate-spin" /> : 'Activar'}</button></div>
                    )}
                    {message && <div className="message">{message}</div>}
                </div>

                <button className="done" onClick={enterApp}>Entrar en ANSIOFF</button>
            </div>
        </div>
    );
}
