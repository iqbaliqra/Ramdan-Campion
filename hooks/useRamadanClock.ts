'use client';

import { useEffect, useState } from 'react';

export function useRamadanClock() {
  const [nowTick, setNowTick] = useState(0);
  const [gregDate, setGregDate] = useState('—');
  const [hijriDate, setHijriDate] = useState('—');
  const [currentTime, setCurrentTime] = useState('—');

  useEffect(() => {
    const id = setInterval(() => setNowTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setGregDate(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }));
    const ramadanStart = new Date(2025, 2, 1);
    const dayDiff = Math.floor((+now - +ramadanStart) / 86400000);
    const hijriDay = Math.max(1, Math.min(30, dayDiff + 1));
    setHijriDate(`${hijriDay} Ramadan 1446H`);
  }, [nowTick]);

  return { nowTick, gregDate, hijriDate, currentTime };
}
