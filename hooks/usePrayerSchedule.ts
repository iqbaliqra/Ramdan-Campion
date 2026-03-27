'use client';

import { useEffect, useRef, useState } from 'react';
import { PRAYER_KEYS, PRAYER_NAMES } from '@/lib/constants';
import type { PrayerTimings } from '@/lib/types';
import { fetchPrayerTimes, timeToMins, timeToSecsFromMidnight } from '@/lib/utils';

const NEXT_EVENT_LABEL: Record<(typeof PRAYER_KEYS)[number], string> = {
  Fajr: 'Suhoor Ends (Fajr)',
  Sunrise: 'Sunrise',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Iftar (Maghrib)',
  Isha: 'Isha Prayer',
};

export function usePrayerSchedule() {
  const [userCity, setUserCity] = useState('Lahore');
  const [userCountry, setUserCountry] = useState('Pakistan');
  const userLatRef = useRef(31.5204);
  const userLonRef = useRef(74.3587);

  const [prayerData, setPrayerData] = useState<PrayerTimings | null>(null);
  const [nextEvent, setNextEvent] = useState('Loading prayer times…');
  const [countH, setCountH] = useState('00');
  const [countM, setCountM] = useState('00');
  const [countS, setCountS] = useState('00');
  const [activePrayerIdx, setActivePrayerIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const loadPrayerTimes = async () => {
        const lat = userLatRef.current;
        const lon = userLonRef.current;
        const data = await fetchPrayerTimes(lat, lon);
        if (cancelled) return;
        setPrayerData(data);
        if (!data) setNextEvent('Could not load prayer times');
      };

      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            userLatRef.current = pos.coords.latitude;
            userLonRef.current = pos.coords.longitude;
            try {
              const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${userLatRef.current}&lon=${userLonRef.current}&format=json`,
              );
              const geoData = await geoRes.json();
              if (!cancelled) {
                setUserCity(geoData.address?.city || geoData.address?.town || geoData.address?.village || 'Your City');
                setUserCountry(geoData.address?.country || '');
              }
            } catch {
              /* ignore */
            }
            await loadPrayerTimes();
          },
          () => loadPrayerTimes(),
        );
      } else {
        await loadPrayerTimes();
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!prayerData) return;

    function tick() {
      const pd = prayerData;
      if (!pd) return;
      const now = new Date();
      const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const nowMins = now.getHours() * 60 + now.getMinutes();

      let nextSecsFromMidnight: number | null = null;
      let nextName = 'Fajr (Tomorrow)';
      for (const key of PRAYER_KEYS) {
        const raw = pd[key];
        if (!raw) continue;
        const evSecs = timeToSecsFromMidnight(raw);
        if (evSecs > nowSecs) {
          nextSecsFromMidnight = evSecs;
          nextName = NEXT_EVENT_LABEL[key];
          break;
        }
      }
      if (nextSecsFromMidnight === null) {
        nextSecsFromMidnight = timeToSecsFromMidnight(pd['Fajr']) + 86400;
        nextName = 'Fajr (Tomorrow)';
      }

      const diffSecs = Math.max(0, nextSecsFromMidnight - nowSecs);
      const h = Math.floor(diffSecs / 3600);
      const m = Math.floor((diffSecs % 3600) / 60);
      const s = Math.floor(diffSecs % 60);
      setNextEvent(nextName);
      setCountH(String(h).padStart(2, '0'));
      setCountM(String(m).padStart(2, '0'));
      setCountS(String(s).padStart(2, '0'));

      let active: number | null = null;
      PRAYER_NAMES.forEach((_, i) => {
        const t = timeToMins(pd[PRAYER_KEYS[i]]);
        if (Math.abs(t - nowMins) < 60) active = i;
      });
      setActivePrayerIdx(active);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [prayerData]);

  return {
    prayerData,
    userCity,
    userCountry,
    nextEvent,
    countH,
    countM,
    countS,
    activePrayerIdx,
  };
}
