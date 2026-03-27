'use client';

import { useState } from 'react';
import { CloudSun, MapPin, Moon, Quote, RefreshCw, Sparkles, Sun, Sunrise, Sunset, Clock } from 'lucide-react';
import { PRAYER_KEYS, PRAYER_NAMES, ibadahItems, verses } from '@/lib/constants';
import type { PrayerTimings } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { TrackerItems } from '../tracker/TrackerItems';

type Props = {
  active: boolean;
  prayerData: PrayerTimings | null;
  userCity: string;
  userCountry: string;
  nextEvent: string;
  countH: string;
  countM: string;
  countS: string;
  nextPrayerIdx: number | null;
  trackerDone: string[];
  onToggleTracker: (id: string) => void;
};

const PRAYER_ICONS = {
  Fajr: Sunrise,
  Sunrise: Sunrise,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
} as const;

export function HomeTab({
  active,
  prayerData,
  userCity,
  userCountry,
  nextEvent,
  countH,
  countM,
  countS,
  nextPrayerIdx,
  trackerDone,
  onToggleTracker,
}: Props) {
  const locDisplay = `${userCity}, ${userCountry}`;
  const quickItems = ibadahItems.slice(0, 8);
  const quickDoneCount = quickItems.filter((item) => trackerDone.includes(item.id)).length;
  const quickPct = Math.round((quickDoneCount / 8) * 100);
  const [verseIdx, setVerseIdx] = useState(0);
  const v = verses[verseIdx];

  return (
    <div
      className={'tab-section home-tab' + (active ? ' active' : '')}
      id="tab-home"
      role="tabpanel">
      <section className="home-section" aria-label="Next prayer countdown">
        <div className="countdown-card">
          <div className="countdown-label">Next</div>
          <div className="countdown-type">{nextEvent}</div>
          <div className="countdown-digits">
            <div className="digit-block">
              <div className="digit">{countH}</div>
              <div className="digit-label">Hours</div>
            </div>
            <div className="colon">:</div>
            <div className="digit-block">
              <div className="digit">{countM}</div>
              <div className="digit-label">Minutes</div>
            </div>
            <div className="colon">:</div>
            <div className="digit-block">
              <div className="digit">{countS}</div>
              <div className="digit-label">Seconds</div>
            </div>
          </div>
          <div className="location-note">
            <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Location: <span>{locDisplay}</span>
          </div>
        </div>
      </section>

      <section className="home-section" aria-label="Prayer times">
        <div className="section-title">
          <Clock size={16} /> Prayer Times
        </div>
        <div className="prayer-grid" id="prayerGrid">
          {PRAYER_NAMES.map((name, i) => {
            const PrayerIcon = PRAYER_ICONS[name as keyof typeof PRAYER_ICONS];
            return (
              <div key={name} className={'prayer-card' + (nextPrayerIdx === i ? ' active' : '')}>
                {PrayerIcon && <PrayerIcon size={18} style={{ marginBottom: 4, opacity: 0.8 }} />}
                <div className="prayer-name">{name}</div>
                <div className="prayer-time">{prayerData ? formatTime(prayerData[PRAYER_KEYS[i]]) : '—'}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-section" aria-label="Verse of the day">
        <div className="section-title">
          <Quote size={16} /> Verse of the Day
        </div>
        <div className="card">
          <div className="quran-arabic" id="verseArabic">
            {v.arabic}
          </div>
          <div className="quran-translation" id="verseTranslation">
            {v.translation}
          </div>
          <div className="quran-ref" id="verseRef">
            {v.ref}
          </div>
          <button
            type="button"
            className="refresh-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => setVerseIdx((i) => (i + 1) % verses.length)}>
            <RefreshCw size={14} /> Next Verse
          </button>
        </div>
      </section>

      <section className="home-section" aria-label="Today's ibadah">
        <div className="section-title">
          <Sparkles size={16} /> Today&apos;s Ibadah
        </div>
        <div className="card">
          <div className="tracker-grid" id="quickTracker">
            <TrackerItems items={quickItems} doneIds={trackerDone} onToggle={onToggleTracker} />
          </div>
          <div className="progress-bar-wrap" style={{ marginTop: 16 }}>
            <div className="progress-bar" style={{ width: `${quickPct}%` }} />
          </div>
          <div className="progress-label">
            <span>
              {quickDoneCount} / 8 completed
            </span>
            <span>{quickPct}%</span>
          </div>
        </div>
      </section>
    </div>
  );
}
