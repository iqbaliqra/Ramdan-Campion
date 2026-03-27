'use client';

import { CloudSun, MapPin, Moon, Sparkles, Sun, Sunrise, Sunset, Clock } from 'lucide-react';
import { PRAYER_KEYS, PRAYER_NAMES, ibadahItems } from '@/lib/constants';
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
  activePrayerIdx: number | null;
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
  activePrayerIdx,
  trackerDone,
  onToggleTracker,
}: Props) {
  const locDisplay = `${userCity}, ${userCountry}`;
  const quickItems = ibadahItems.slice(0, 8);
  const quickDoneCount = quickItems.filter((item) => trackerDone.includes(item.id)).length;
  const quickPct = Math.round((quickDoneCount / 8) * 100);

  return (
    <div className={'tab-section' + (active ? ' active' : '')} id="tab-home" role="tabpanel">
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

      <div className="section-title">
        <Clock size={16} /> Prayer Times
      </div>
      <div className="prayer-grid" id="prayerGrid">
        {PRAYER_NAMES.map((name, i) => {
          const PrayerIcon = PRAYER_ICONS[name as keyof typeof PRAYER_ICONS];
          return (
            <div key={name} className={'prayer-card' + (activePrayerIdx === i ? ' active' : '')}>
              {PrayerIcon && <PrayerIcon size={18} style={{ marginBottom: 4, opacity: 0.8 }} />}
              <div className="prayer-name">{name}</div>
              <div className="prayer-time">{prayerData ? formatTime(prayerData[PRAYER_KEYS[i]]) : '—'}</div>
            </div>
          );
        })}
      </div>

      <div className="section-title">
        <Sparkles size={16} /> Today&apos;s Ibadah
      </div>
      <div className="card" style={{ marginBottom: 0 }}>
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
    </div>
  );
}
