import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';

const DAILY_REMINDER_ID = 81026;
const REENGAGEMENT_IDS = [81031, 81032, 81033, 81034];
const REMINDER_CHANNEL_ID = 'ansioff-reminders';
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
export const REMINDER_TIME_KEY = 'ansioff_daily_reminder_time_v1';

export interface ReminderStatus {
    enabled: boolean;
    time: string;
}

export interface ReminderMessage {
    id: number;
    title: string;
    body: string;
    at: Date;
}

const REENGAGEMENT_MESSAGES = [
    { title: 'Te echamos de menos', body: 'Vuelve a ANSIOFF y haz una pausa breve de 1 minuto.' },
    { title: 'Tu espacio de calma sigue aquí', body: 'Respira 4-7-8 o registra cómo estás hoy.' },
    { title: 'Un check-in pequeño puede ayudar', body: 'Entra cuando puedas y retoma tu rutina sin presión.' },
    { title: 'Volvemos poco a poco', body: 'Tienes tus herramientas listas para cuando las necesites.' },
];

export function parseReminderTime(time: string) {
    const match = /^(\d{2}):(\d{2})$/.exec(time);
    if (!match) throw new Error('La hora del recordatorio no es válida.');
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        throw new Error('La hora del recordatorio no es válida.');
    }
    return { hour, minute };
}

export function buildInactivityReminders(from: number): ReminderMessage[] {
    return REENGAGEMENT_MESSAGES.map((message, index) => ({
        id: REENGAGEMENT_IDS[index],
        ...message,
        at: new Date(from + (index + 1) * THREE_DAYS_MS),
    }));
}

async function ensureReminderChannel() {
    if (Capacitor.getPlatform() !== 'android') return;
    await LocalNotifications.createChannel({
        id: REMINDER_CHANNEL_ID,
        name: 'Recordatorios de ANSIOFF',
        description: 'Pausas diarias y recordatorios suaves de actividad.',
        importance: 4,
        visibility: 1,
        vibration: true,
    });
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
    const { hour, minute } = parseReminderTime(time);

    let permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') return false;

    await ensureReminderChannel();
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
    await LocalNotifications.schedule({
        notifications: [{
            id: DAILY_REMINDER_ID,
            title: 'Tu pausa de ANSIOFF',
            body: 'Tómate unos minutos para respirar o hacer tu check-in.',
            schedule: { on: { hour, minute, second: 0 }, allowWhileIdle: true },
            channelId: REMINDER_CHANNEL_ID,
            extra: { destination: 'home' },
        }],
    });
    const pending = await LocalNotifications.getPending();
    if (!pending.notifications.some((notification) => notification.id === DAILY_REMINDER_ID)) {
        throw new Error('El sistema no pudo guardar el recordatorio. Inténtalo de nuevo.');
    }
    localStorage.setItem(REMINDER_TIME_KEY, time);
    return true;
}

async function ensurePermission(request = false) {
    if (!Capacitor.isNativePlatform()) return false;
    let permission = await LocalNotifications.checkPermissions();
    if (request && permission.display !== 'granted') permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
}

export async function scheduleInactivityReminders(requestPermission = false) {
    if (!Capacitor.isNativePlatform()) return false;
    const allowed = await ensurePermission(requestPermission);
    if (!allowed) return false;

    await ensureReminderChannel();
    await LocalNotifications.cancel({ notifications: REENGAGEMENT_IDS.map((id) => ({ id })) });
    const reminders = buildInactivityReminders(Date.now());

    await LocalNotifications.schedule({
        notifications: reminders.map((reminder) => ({
            id: reminder.id,
            title: reminder.title,
            body: reminder.body,
            schedule: { at: reminder.at, allowWhileIdle: true },
            channelId: REMINDER_CHANNEL_ID,
            extra: { destination: 'home', kind: 'reengagement' },
        })),
    });
    return true;
}

export async function requestNotificationsForEntry(time?: string) {
    const allowed = await ensurePermission(true);
    if (!allowed) return false;
    if (time) await scheduleDailyReminder(time);
    await scheduleInactivityReminders(false);
    return true;
}

export async function registerInactivityLifecycle(): Promise<PluginListenerHandle | null> {
    if (!Capacitor.isNativePlatform()) return null;
    return App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
            scheduleInactivityReminders(false).catch((error) => console.warn('Inactivity reminders skipped:', error));
        }
    });
}

export async function cancelDailyReminder() {
    if (!Capacitor.isNativePlatform()) return;
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
}
