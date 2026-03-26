'use client';

import { useState } from 'react';
import { QuranFullSurahs } from '@/components/ramadan/QuranFullSurahs';
import { SurahOverlay } from '@/components/ramadan/SurahOverlay';
import type { QuranSurah } from '@/lib/ramadan/quran-api';
import { verses } from '@/lib/ramadan/constants';

type Props = {
  active: boolean;
  juzRead: number[];
  onToggleJuz: (n: number) => void;
};

export function QuranTab({ active, juzRead, onToggleJuz }: Props) {
  const [verseIdx, setVerseIdx] = useState(0);
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah | null>(null);

  /*
   * We need allSurahs here so SurahOverlay can navigate prev/next
   * without re-fetching. QuranFullSurahs has already cached them
   * in the module-level cache inside quran-api.ts, so we just lift
   * them up the first time they arrive via onSurahsLoaded.
   */
  const [allSurahs, setAllSurahs] = useState<QuranSurah[]>([]);

  const v = verses[verseIdx];

  return (
    <div
      className={'tab-section' + (active ? ' active' : '')}
      id="tab-quran"
      role="tabpanel">
      {/* ── STEP 2: Overlay — rendered outside tab flow so it covers everything ── */}
      {selectedSurah && allSurahs.length > 0 && (
        <SurahOverlay
          surah={selectedSurah}
          allSurahs={allSurahs}
          onClose={() => setSelectedSurah(null)}
          onNavigate={(s) => setSelectedSurah(s)}
        />
      )}

      {/* ── Surah Grid (Step 1) ── */}
      {active && (
        <QuranFullSurahs
          onSurahSelect={(surah) => setSelectedSurah(surah)}
          onSurahsLoaded={(surahs) => setAllSurahs(surahs)}
        />
      )}

      {/* ── Verse of the Day ── */}
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
        <button
          type="button"
          className="refresh-btn"
          onClick={() => setVerseIdx((i) => (i + 1) % verses.length)}>
          ↺ Next Verse
        </button>
      </div>

      {/* ── 30-Day Reading Plan ── */}
      <div style={{ marginTop: 24 }} className="section-title">
        📚 30-Day Reading Plan
      </div>
      <div className="card">
        <p
          style={{
            color: 'var(--silver)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            marginBottom: 16,
          }}>
          Complete the Quran in Ramadan by reading{' '}
          <span style={{ color: 'var(--gold2)' }}>4 pages (2 rub)</span> after
          each prayer, or{' '}
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
                onClick={() => onToggleJuz(n)}>
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
