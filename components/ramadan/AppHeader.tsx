'use client';

type Props = {
  gregDate: string;
  hijriDate: string;
  currentTime: string;
};

export function AppHeader({ gregDate, hijriDate, currentTime }: Props) {
  return (
    <header>
      <span className="crescent-moon">☪</span>
      <h1>Ramadan Companion</h1>
      <p className="arabic-title">رمضان المبارك</p>
      <div className="date-bar">
        <div>
          📅 Gregorian: <span>{gregDate}</span>
        </div>
        <div>
          🌙 Hijri: <span>{hijriDate}</span>
        </div>
        <div>
          🕐 <span>{currentTime}</span>
        </div>
      </div>
    </header>
  );
}
