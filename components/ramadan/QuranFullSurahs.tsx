'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchFullQuranUthmani, type QuranSurah } from '@/lib/ramadan/quran-api';

export function QuranFullSurahs() {
  const [surahs, setSurahs] = useState<QuranSurah[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFullQuranUthmani();
      setSurahs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load Quran');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!surahs) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        String(s.number).includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(q),
    );
  }, [surahs, filter]);

  return (
    <div className="quran-full">
      <div className="section-title">📿 Complete Quran (Uthmani script)</div>
      <div className="card">
        <p className="quran-full__intro">
          Full Arabic text from the Quran
          . Open a surah to read all verses.
        </p>

        {loading && surahs === null && (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>
            <span className="loading" aria-hidden />
            Loading Quran…
          </p>
        )}

        {error && (
          <div className="quran-full__error" role="alert">
            <span>{error}</span>
            <button type="button" className="refresh-btn" onClick={() => void load()}>
              Try again
            </button>
          </div>
        )}

        {surahs && (
          <>
            <input
              type="search"
              className="quran-full__search"
              placeholder="Search by surah number, Arabic name, or English name…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter surahs"
            />
            <div className="quran-full__meta">
              Showing {filtered.length} of {surahs.length} surahs
            </div>
            <div className="quran-full__list">
              {filtered.map((surah) => {
                const isMedinan = surah.revelationType?.toLowerCase().includes('medinan');
                return (
                  <details key={surah.number} className="surah-details" id={`surah-${surah.number}`}>
                    <summary>
                      <span className="surah-details__num">{surah.number}</span>
                      <div className="surah-details__titles">
                        <div className="surah-details__ar">{surah.name}</div>
                        <div className="surah-details__en">
                          {surah.englishName}
                          <span> · {surah.englishNameTranslation}</span>
                        </div>
                      </div>
                      <span
                        className={
                          'surah-details__badge ' +
                          (isMedinan ? 'surah-details__badge--medinan' : 'surah-details__badge--meccan')
                        }
                      >
                        {surah.revelationType}
                      </span>
                    </summary>
                    <div className="surah-details__body">
                      <div className="surah-details__ayahs">
                        {surah.ayahs.map((ayah) => (
                          <div key={ayah.number} className="ayah-row">
                            <span className="ayah-row__num">{ayah.numberInSurah}</span>
                            <p className="ayah-row__text">{ayah.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0' }}>No surahs match your search.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
