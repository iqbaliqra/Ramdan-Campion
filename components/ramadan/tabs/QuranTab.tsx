'use client';

import { useState } from 'react';
import { QuranFullSurahs } from '@/components/ramadan/QuranFullSurahs';
import { verses } from '@/lib/ramadan/constants';

type Props = {
  active: boolean;
  juzRead: number[];
  onToggleJuz: (n: number) => void;
};

export function QuranTab({ active, juzRead, onToggleJuz }: Props) {
  const [verseIdx, setVerseIdx] = useState(0);
  const v = verses[verseIdx];

  return (
    <div className={'tab-section' + (active ? ' active' : '')} id="tab-quran" role="tabpanel">
      {active && <QuranFullSurahs />}

      <div className="section-title">📖 Verse of the Day</div>
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
        <button type="button" className="refresh-btn" onClick={() => setVerseIdx((i) => (i + 1) % verses.length)}>
          ↺ Next Verse
        </button>
      </div>

      <div style={{ marginTop: 24 }} className="section-title">
        📚 30-Day Reading Plan
      </div>
      <div className="card">
        <p style={{ color: 'var(--silver)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 16 }}>
          Complete the Quran in Ramadan by reading{' '}
          <span style={{ color: 'var(--gold2)' }}>4 pages (2 rub)</span> after each prayer, or{' '}
          <span style={{ color: 'var(--gold2)' }}>1 Juz per day</span>.
        </p>
        <div className="juz-grid" id="juzGrid">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => {
            const isDone = juzRead.includes(n);
            return (
              <button
                key={n}
                type="button"
                className={'juz-cell' + (isDone ? ' read' : '')}
                onClick={() => onToggleJuz(n)}
              >
                <div className="juz-num">{n}</div>
                <div className="juz-lbl">JUZ</div>
              </button>
            );
          })}
        </div>
        <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--muted)' }}>
          Click a Juz to mark it read. Progress is saved locally.
        </p>
      </div>
    </div>
  );
}
