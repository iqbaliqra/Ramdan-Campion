import { ibadahItems } from './constants';
import type { PrayerTimings } from './types';

/** Strip optional timezone suffix from Aladhan-style strings, e.g. "18:05 (PKT)". */
export function normalizeTimeString(t: string | undefined) {
  if (!t) return '';
  return t.trim().split(/\s+/)[0] ?? '';
}

export function formatTime(t: string | undefined) {
  if (!t) return '—';
  const n = normalizeTimeString(t);
  const [h, m] = n.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function timeToMins(t: string) {
  const n = normalizeTimeString(t);
  const [h, m] = n.split(':').map(Number);
  return h * 60 + m;
}

/** Seconds since local midnight from API time string (HH:MM or HH:MM:SS). */
export function timeToSecsFromMidnight(t: string) {
  const n = normalizeTimeString(t);
  const parts = n.split(':').map(Number);
  const h = parts[0];
  const m = parts[1] ?? 0;
  const sec = parts[2] ?? 0;
  return h * 3600 + m * 60 + sec;
}

export function trackerKey() {
  return 'tracker_' + new Date().toDateString();
}

export async function fetchPrayerTimes(lat: number, lon: number): Promise<PrayerTimings | null> {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lon}&method=2`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 200) return data.data.timings as PrayerTimings;
  } catch {
    /* ignore */
  }
  return null;
}

export function buildCalendarDays() {
  const ramadanStart = new Date(2025, 2, 1);
  const today = new Date();
  const days: { day: number; date: Date; isPast: boolean; isToday: boolean }[] = [];
  for (let d = 1; d <= 30; d++) {
    const date = new Date(ramadanStart);
    date.setDate(ramadanStart.getDate() + d - 1);
    const isPast = date < today && date.toDateString() !== today.toDateString();
    const isToday = date.toDateString() === today.toDateString();
    days.push({ day: d, date, isPast, isToday });
  }
  return days;
}

export function buildWeekBars() {
  const today = new Date();
  const todayDay = today.getDay();
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
    const date = new Date(today);
    const diff = i - ((todayDay + 6) % 7);
    date.setDate(today.getDate() + diff);
    const key = 'tracker_' + date.toDateString();
    let done: string[] = [];
    try {
      done = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem(key) || '[]' : '[]');
    } catch {
      /* ignore */
    }
    const pct = Math.round((done.length / ibadahItems.length) * 100);
    const isToday = diff === 0;
    return { d, pct, isToday };
  });
}
