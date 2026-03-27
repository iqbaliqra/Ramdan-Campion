'use client';

import { BarChart3, ClipboardCheck, RefreshCw } from 'lucide-react';
import { ibadahItems } from '@/lib/constants';
import { buildWeekBars } from '@/lib/utils';
import { TrackerItems } from './TrackerItems';

type Props = {
  active: boolean;
  trackerDone: string[];
  onToggleTracker: (id: string) => void;
  onResetTracker: () => void;
};

export function TrackerTab({ active, trackerDone, onToggleTracker, onResetTracker }: Props) {
  const fullPct = Math.round((trackerDone.length / ibadahItems.length) * 100);
  const weekBars = buildWeekBars();

  return (
    <div className={'tab-section' + (active ? ' active' : '')} id="tab-tracker" role="tabpanel">
      <div className="section-title">
        <ClipboardCheck size={16} /> Daily Ibadah Tracker
      </div>
      <div className="card">
        <div className="tracker-grid" id="fullTracker">
          <TrackerItems items={ibadahItems} doneIds={trackerDone} onToggle={onToggleTracker} />
        </div>
        <div className="progress-bar-wrap" style={{ marginTop: 18 }}>
          <div className="progress-bar" style={{ width: `${fullPct}%` }} />
        </div>
        <div className="progress-label">
          <span>
            {trackerDone.length} / {ibadahItems.length} completed
          </span>
          <span>{fullPct}%</span>
        </div>
        <button type="button" className="refresh-btn" style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }} onClick={onResetTracker}>
          <RefreshCw size={14} /> Reset Day
        </button>
      </div>

      <div className="section-title" style={{ marginTop: 24 }}>
        <BarChart3 size={16} /> Weekly Progress
      </div>
      <div className="card">
        <div
          id="weekChart"
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-end',
            height: 120,
            padding: '10px 0',
          }}
        >
          {weekBars.map((wb, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: Math.max(8, wb.pct * 1.1),
                  background: wb.isToday
                    ? 'linear-gradient(180deg,var(--gold2),var(--gold))'
                    : 'rgba(201,168,76,0.25)',
                  borderRadius: '6px 6px 0 0',
                  border: `1px solid ${wb.isToday ? 'var(--gold)' : 'var(--border)'}`,
                  transition: 'height 0.4s',
                  alignSelf: 'flex-end',
                }}
              />
              <div
                style={{
                  fontSize: '0.7rem',
                  color: wb.isToday ? 'var(--gold2)' : 'var(--muted)',
                  fontFamily: 'var(--font-jetbrains),monospace',
                }}
              >
                {wb.pct}%
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-jetbrains),monospace' }}>
            Mon
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted)',
              fontFamily: 'var(--font-jetbrains),monospace',
              flex: 1,
              textAlign: 'center',
            }}
          >
            Tue
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted)',
              fontFamily: 'var(--font-jetbrains),monospace',
              flex: 1,
              textAlign: 'center',
            }}
          >
            Wed
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted)',
              fontFamily: 'var(--font-jetbrains),monospace',
              flex: 1,
              textAlign: 'center',
            }}
          >
            Thu
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted)',
              fontFamily: 'var(--font-jetbrains),monospace',
              flex: 1,
              textAlign: 'center',
            }}
          >
            Fri
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted)',
              fontFamily: 'var(--font-jetbrains),monospace',
              flex: 1,
              textAlign: 'center',
            }}
          >
            Sat
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted)',
              fontFamily: 'var(--font-jetbrains),monospace',
              textAlign: 'right',
            }}
          >
            Sun
          </span>
        </div>
      </div>
    </div>
  );
}
