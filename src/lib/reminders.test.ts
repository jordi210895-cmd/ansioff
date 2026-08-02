import { describe, expect, it } from 'vitest';
import { buildInactivityReminders, parseReminderTime } from './reminders';

describe('notification reminders', () => {
    it('accepts a valid daily reminder down to the minute', () => {
        expect(parseReminderTime('07:05')).toEqual({ hour: 7, minute: 5 });
        expect(parseReminderTime('23:59')).toEqual({ hour: 23, minute: 59 });
    });

    it('rejects malformed or out-of-range reminder times', () => {
        for (const time of ['7:05', '24:00', '12:60', 'not-a-time']) {
            expect(() => parseReminderTime(time)).toThrow('La hora del recordatorio no es válida.');
        }
    });

    it('schedules four inactivity reminders every three days', () => {
        const from = Date.UTC(2026, 6, 11, 12, 0, 0);
        const reminders = buildInactivityReminders(from);
        const threeDays = 3 * 24 * 60 * 60 * 1000;

        expect(reminders).toHaveLength(4);
        expect(reminders.map((reminder) => reminder.at.getTime() - from)).toEqual([
            threeDays,
            threeDays * 2,
            threeDays * 3,
            threeDays * 4,
        ]);
        expect(new Set(reminders.map((reminder) => reminder.id)).size).toBe(4);
    });
});
