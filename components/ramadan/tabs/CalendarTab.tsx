'use client';

import { useEffect, useRef, useState } from 'react';
import { SPECIAL_NIGHTS_REMINDER, specialDays } from '@/lib/ramadan/constants';
import { buildCalendarDays } from '@/lib/ramadan/utils';

type Props = { active: boolean };

export function CalendarTab({ active }: Props) {
  const [calDetailDay, setCalDetailDay] = useState<number | null>(null);
  const [calDetailDate, setCalDetailDate] = useState<Date | null>(null);
  const [specialSpeaking, setSpecialSpeaking] = useState(false);
  const calStripRef = useRef<HTMLDivElement>(null);

  const calendarDays = buildCalendarDays();

  useEffect(() => {
    const strip = calStripRef.current;
    if (!strip) return;
    const todayEl = strip.querySelector('.today');
    todayEl?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, []);

  const playSpecialNightsReminder = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Your browser does not support spoken audio for this reminder.');
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(SPECIAL_NIGHTS_REMINDER);
    u.rate = 0.92;
    u.pitch = 1;
    setSpecialSpeaking(true);
    u.onend = () => setSpecialSpeaking(false);
    u.onerror = () => setSpecialSpeaking(false);
    speechSynthesis.speak(u);
  };

  return (
    <div className={'tab-section' + (active ? ' active' : '')} id="tab-calendar" role="tabpanel">
      <div className="section-title">📆 Ramadan 2025 / 1446H</div>
      <div className="cal-strip" id="calStrip" ref={calStripRef}>
        {calendarDays.map(({ day, date, isPast, isToday }) => (
          <div
            key={day}
            className={'cal-day' + (isToday ? ' today' : '') + (isPast ? ' past' : '')}
            onClick={() => {
              setCalDetailDay(day);
              setCalDetailDate(date);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCalDetailDay(day);
                setCalDetailDate(date);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="day-num">{day}</div>
            <div className="day-label">{date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
          </div>
        ))}
      </div>
      <div className="card" id="calDetail">
        {calDetailDay == null || calDetailDate == null ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic' }}>Select a day above to view details.</p>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '1.1rem', color: 'var(--gold2)', marginBottom: 10 }}>
              {calDetailDay} Ramadan 1446H
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 12, fontFamily: 'var(--font-jetbrains),monospace' }}>
              {calDetailDate.toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            {specialDays[calDetailDay] ? (
              <>
                <div style={{ color: 'var(--gold)', fontWeight: 600, marginBottom: 8 }}>⭐ {specialDays[calDetailDay].title}</div>
                <div style={{ color: 'var(--silver)', lineHeight: 1.7 }}>{specialDays[calDetailDay].note}</div>
              </>
            ) : (
              <div style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                A blessed day of Ramadan. Keep fasting, make du&apos;a, and increase your good deeds.
              </div>
            )}
          </>
        )}
      </div>
      <div
        style={{ marginTop: 20 }}
        className={'section-title special-nights-title' + (specialSpeaking ? ' speaking' : '')}
        id="specialNightsTitle"
        role="button"
        tabIndex={0}
        aria-label="Play audio reminder about special nights"
        onClick={(e) => {
          e.preventDefault();
          playSpecialNightsReminder();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playSpecialNightsReminder();
          }
        }}
      >
        🌟 Special Nights
        <span className="special-nights-hint">· tap for reminder</span>
      </div>
      <div className="dua-grid">
        <div className="dua-item">
          <div className="dua-arabic" style={{ fontSize: '1.3rem' }}>
            لَيْلَةُ الْقَدْرِ
          </div>
          <div className="dua-meaning" style={{ marginTop: 8, fontWeight: 600, color: 'var(--gold2)' }}>
            Laylatul Qadr — Night of Power
          </div>
          <div className="dua-meaning">
            Look for it in the last 10 odd nights: 21st, 23rd, 25th, 27th, 29th. Better than 1,000 months of worship.
          </div>
          <div className="dua-occasion">Last 10 Nights</div>
        </div>
        <div className="dua-item">
          <div className="dua-arabic" style={{ fontSize: '1.3rem' }}>
            اعْتِكَاف
          </div>
          <div className="dua-meaning" style={{ marginTop: 8, fontWeight: 600, color: 'var(--gold2)' }}>
            I&apos;tikaf — Spiritual Seclusion
          </div>
          <div className="dua-meaning">
            Spend the last 10 days in the mosque in worship, remembrance, and reflection. Follow the Sunnah of the Prophet ﷺ.
          </div>
          <div className="dua-occasion">Last 10 Days</div>
        </div>
        <div className="dua-item">
          <div className="dua-arabic" style={{ fontSize: '1.3rem' }}>
            صَدَقَةُ الْفِطْر
          </div>
          <div className="dua-meaning" style={{ marginTop: 8, fontWeight: 600, color: 'var(--gold2)' }}>
            Sadaqah al-Fitr — Charity of Breaking Fast
          </div>
          <div className="dua-meaning">Pay before Eid prayer. Approximately the value of 2kg of staple food per family member.</div>
          <div className="dua-occasion">Before Eid al-Fitr</div>
        </div>
      </div>
    </div>
  );
}
