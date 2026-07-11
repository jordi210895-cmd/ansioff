import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const DAILY_REMINDER_ID = 81026;
export const REMINDER_TIME_KEY = 'ansioff_daily_reminder_time_v1';

export interface ReminderStatus {
    enabled: boolean;
    time: string;
}

export async function getDailyReminderStatus(): Promise<ReminderStatus> {
    const time = typeof window !== 'undefined' ? localStorage.getItem(REMINDER_TIME_KEY) || '20:00' : '20:00';
    if (!Capacitor.isNativePlatform()) return { enabled: false, time };

    try {
        const [permission, pending] = await Promise.all([
            LocalNotifications.checkPermissions(),
            LocalNotifications.getPending(),
        ]);
        return {
            enabled: permission.display === 'granted' && pending.notifications.some((item) => item.id === DAILY_REMINDER_ID),
            time,
        };
    } catch {
        return { enabled: false, time };
    }
}

export async function scheduleDailyReminder(time: string) {
    if (!Capacitor.isNativePlatform()) return false;
    const [hour, minute] = time.split(':').map(Number);
    if (!Number.isInteger(hour) || !Number.isInteger(minute)) throw new Error('La hora del recordatorio no es válida.');

    let permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') return false;

    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
    await LocalNotifications.schedule({
        notifications: [{
            id: DAILY_REMINDER_ID,
            title: 'Tu pausa de ANSIOFF',
            body: 'Tómate unos minutos para respirar o hacer tu check-in.',
            schedule: { on: { hour, minute }, allowWhileIdle: true },
            extra: { destination: 'home' },
        }],
    });
    localStorage.setItem(REMINDER_TIME_KEY, time);
    return true;
}

export async function cancelDailyReminder() {
    if (!Capacitor.isNativePlatform()) return;
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
}
