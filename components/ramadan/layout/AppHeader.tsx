'use client';

import { CalendarDays, Clock, Moon } from 'lucide-react';

type Props = {
  gregDate: string;
  hijriDate: string;
  currentTime: string;
};

export function AppHeader({ gregDate, hijriDate, currentTime }: Props) {
  return (
    <header>
      <Moon className="crescent-moon" size={48} />
      <h1>Ramadan Companion</h1>
      <p className="arabic-title">رمضان المبارك</p>
      <div className="date-bar">
        <div>
          <CalendarDays size={14} /> Gregorian: <span>{gregDate}</span>
        </div>
        <div>
          <Moon size={14} /> Hijri: <span>{hijriDate}</span>
        </div>
        <div>
          <Clock size={14} /> <span>{currentTime}</span>
        </div>
      </div>
    </header>
  );
}
