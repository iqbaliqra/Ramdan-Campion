'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, Building2, ChevronRight, RefreshCw, Search } from 'lucide-react';
import {
  fetchFullQuranUthmani,
  type QuranSurah,
} from '@/lib/quran-api';

/* ── All 114 surah meaning translations ── */
const TRANSLATIONS: Record<number, string> = {
  1: 'The Opening',
  2: 'The Cow',
  3: 'Family of Imran',
  4: 'The Women',
  5: 'The Table Spread',
  6: 'The Cattle',
  7: 'The Heights',
  8: 'The Spoils of War',
  9: 'The Repentance',
  10: 'Jonah',
  11: 'Hud',
  12: 'Joseph',
  13: 'The Thunder',
  14: 'Abraham',
  15: 'The Rocky Tract',
  16: 'The Bee',
  17: 'The Night Journey',
  18: 'The Cave',
  19: 'Mary',
  20: 'Ta-Ha',
  21: 'The Prophets',
  22: 'The Pilgrimage',
  23: 'The Believers',
  24: 'The Light',
  25: 'The Criterion',
  26: 'The Poets',
  27: 'The Ant',
  28: 'The Stories',
  29: 'The Spider',
  30: 'The Romans',
  31: 'Luqman',
  32: 'The Prostration',
  33: 'The Combined Forces',
  34: 'Sheba',
  35: 'Originator',
  36: 'Ya Sin',
  37: 'Those Ranged in Ranks',
  38: 'Sad',
  39: 'The Troops',
  40: 'The Forgiver',
  41: 'Explained in Detail',
  42: 'The Consultation',
  43: 'The Gold Adornments',
  44: 'The Smoke',
  45: 'The Crouching',
  46: 'Wind-Curved Sandhills',
  47: 'Muhammad',
  48: 'The Victory',
  49: 'The Rooms',
  50: 'The Letter Qaf',
  51: 'The Winnowing Winds',
  52: 'The Mount',
  53: 'The Star',
  54: 'The Moon',
  55: 'The Beneficent',
  56: 'The Inevitable',
  57: 'The Iron',
  58: 'The Pleading Woman',
  59: 'The Exile',
  60: 'She to be Examined',
  61: 'The Ranks',
  62: 'Friday',
  63: 'The Hypocrites',
  64: 'The Mutual Disillusion',
  65: 'The Divorce',
  66: 'The Prohibition',
  67: 'The Sovereignty',
  68: 'The Pen',
  69: 'The Reality',
  70: 'The Ascending Stairways',
  71: 'Noah',
  72: 'The Jinn',
  73: 'The Enshrouded One',
  74: 'The Cloaked One',
  75: 'The Resurrection',
  76: 'The Man',
  77: 'The Emissaries',
  78: 'The Tidings',
  79: 'Those Who Drag Forth',
  80: 'He Frowned',
  81: 'The Overthrowing',
  82: 'The Cleaving',
  83: 'The Defrauding',
  84: 'The Splitting Open',
  85: 'Mansions of the Stars',
  86: 'The Morning Star',
  87: 'The Most High',
  88: 'The Overwhelming',
  89: 'The Dawn',
  90: 'The City',
  91: 'The Sun',
  92: 'The Night',
  93: 'The Morning Hours',
  94: 'The Relief',
  95: 'The Fig',
  96: 'The Clot',
  97: 'The Power',
  98: 'The Clear Proof',
  99: 'The Earthquake',
  100: 'The Courser',
  101: 'The Calamity',
  102: 'The Rivalry',
  103: 'The Declining Day',
  104: 'The Traducer',
  105: 'The Elephant',
  106: 'Quraysh',
  107: 'The Small Kindnesses',
  108: 'The Abundance',
  109: 'The Disbelievers',
  110: 'The Divine Support',
  111: 'The Palm Fiber',
  112: 'The Sincerity',
  113: 'The Daybreak',
  114: 'The Mankind',
};

type FilterType = 'all' | 'meccan' | 'medinan';

type Props = {
  onSurahSelect?: (surah: QuranSurah) => void;
  onSurahsLoaded?: (surahs: QuranSurah[]) => void;
};

export function QuranFullSurahs({ onSurahSelect, onSurahsLoaded }: Props) {
  const [surahs, setSurahs] = useState<QuranSurah[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFullQuranUthmani();
      setSurahs(data);
      onSurahsLoaded?.(data);
      setTimeout(() => setReady(true), 60);
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
    const q = search.trim().toLowerCase();
    return surahs.filter((s) => {
      const matchSearch =
        !q ||
        String(s.number).includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        (TRANSLATIONS[s.number] ?? '').toLowerCase().includes(q) ||
        s.name.includes(q);

      const matchFilter =
        filter === 'all' ||
        (filter === 'meccan' && s.revelationType === 'Meccan') ||
        (filter === 'medinan' && s.revelationType === 'Medinan');

      return matchSearch && matchFilter;
    });
  }, [surahs, search, filter]);

  const meccanCount =
    surahs?.filter((s) => s.revelationType === 'Meccan').length ?? 0;
  const medinanCount =
    surahs?.filter((s) => s.revelationType === 'Medinan').length ?? 0;

  return (
    <div className="quran-full" style={{ marginBottom: 36 }}>
      {/* ── Section heading ── */}
      <div className="section-title" style={{ marginBottom: 18 }}>
        <BookOpen size={16} /> Al-Quran Al-Kareem
      </div>

      {/* ── Bismillah banner ── */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px 16px 16px',
          marginBottom: 20,
          background:
            'linear-gradient(135deg, rgba(201,168,76,.08) 0%, rgba(17,21,40,.96) 60%, rgba(201,168,76,.04) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              'linear-gradient(90deg, transparent, var(--gold), transparent)',
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,.13) 0%, transparent 65%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: 'var(--gold2)',
            fontFamily: 'var(--font-crimson), serif',
            direction: 'rtl',
            lineHeight: 1.9,
            textShadow: '0 0 30px rgba(201,168,76,.35)',
          }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
        <div
          style={{
            position: 'relative',
            fontSize: '0.74rem',
            color: 'var(--muted)',
            marginTop: 5,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-jetbrains), monospace',
          }}>
          In the name of Allah, the Most Gracious, the Most Merciful
        </div>
      </div>

      {/* ── Search input ── */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search
          size={15}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            opacity: 0.45,
            color: 'var(--muted)',
          }}
        />
        <input
          type="search"
          className="quran-full__search"
          style={{ paddingLeft: 38, marginBottom: 0 }}
          placeholder="Search by name, number, or meaning…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search surahs"
        />
      </div>

      {/* ── Filter pills ── */}
      {surahs && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 16,
            flexWrap: 'wrap',
          }}>
          {[
            { id: 'all' as FilterType, label: 'All', count: surahs.length, icon: null },
            { id: 'meccan' as FilterType, label: 'Makkah', count: meccanCount, icon: 'meccan' },
            { id: 'medinan' as FilterType, label: 'Madinah', count: medinanCount, icon: 'medinan' },
          ].map(({ id, label, count, icon }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 13px',
                  borderRadius: 100,
                  border: `1px solid ${active ? 'rgba(201,168,76,.55)' : 'var(--border)'}`,
                  background: active ? 'rgba(201,168,76,.11)' : 'transparent',
                  color: active ? 'var(--gold2)' : 'var(--muted)',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all .16s ease',
                }}>
                {icon && <Building2 size={11} />}
                {label}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 20,
                    height: 16,
                    padding: '0 5px',
                    borderRadius: 100,
                    background: active
                      ? 'rgba(201,168,76,.18)'
                      : 'rgba(255,255,255,.05)',
                    fontSize: '0.62rem',
                  }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && surahs === null && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '24px 0 20px',
              color: 'var(--muted)',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
            }}>
            <span className="loading" aria-hidden />
            Loading Al-Quran Al-Kareem…
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 8,
            }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 74,
                  borderRadius: 13,
                  border: '1px solid var(--border)',
                  background: 'var(--bg2)',
                  opacity: 0.5 + (i % 3) * 0.1,
                  animation: 'skeletonPulse 1.6s ease-in-out infinite',
                  animationDelay: `${i * 70}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="quran-full__error" role="alert">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={16} /> {error}
          </span>
          <button
            type="button"
            className="refresh-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => void load()}>
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      )}

      {/* ── Results meta + Grid ── */}
      {surahs && !loading && (
        <>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.72rem',
              color: 'var(--muted)',
              marginBottom: 12,
              letterSpacing: '0.04em',
            }}>
            {filtered.length === surahs.length
              ? `All ${surahs.length} Surahs`
              : `${filtered.length} of ${surahs.length} Surahs`}
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--muted)',
                fontFamily: 'var(--font-crimson), serif',
                fontStyle: 'italic',
                fontSize: '1rem',
              }}>
              <div
                style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, opacity: 0.35 }}>
                <Search size={32} />
              </div>
              No surahs match &ldquo;{search}&rdquo;
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 8,
              }}>
              {filtered.map((surah, idx) => (
                <SurahCard
                  key={surah.number}
                  surah={surah}
                  index={idx}
                  ready={ready}
                  onClick={() => onSurahSelect?.(surah)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   SurahCard
════════════════════════════════════════════ */
function SurahCard({
  surah,
  index,
  ready,
  onClick,
}: {
  surah: QuranSurah;
  index: number;
  ready: boolean;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const isMeccan = surah.revelationType === 'Meccan';
  const translation =
    TRANSLATIONS[surah.number] ?? surah.englishNameTranslation;
  const delay = Math.min(index, 30) * 25;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr auto',
        alignItems: 'center',
        gap: 13,
        padding: '13px 15px',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        background: hov
          ? 'linear-gradient(135deg, rgba(201,168,76,.08), rgba(17,21,40,.98))'
          : 'var(--bg2)',
        border: `1px solid ${hov ? 'rgba(201,168,76,.48)' : 'var(--border)'}`,
        borderRadius: 13,
        transition:
          'border-color .18s, background .18s, transform .18s, box-shadow .18s',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? '0 8px 28px rgba(201,168,76,.1)' : 'none',
        opacity: ready ? 1 : 0,
        animationName: ready ? 'surahCardIn' : 'none',
        animationDuration: '0.38s',
        animationTimingFunction: 'ease',
        animationFillMode: 'forwards',
        animationDelay: `${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
      }}>
      {hov && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              'linear-gradient(90deg, transparent, rgba(201,168,76,.65), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      <NumberBadge number={surah.number} hov={hov} />

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: hov ? 'var(--gold3)' : 'var(--text)',
            transition: 'color .18s',
            marginBottom: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {surah.englishName}
        </div>
        <div
          style={{
            fontSize: '0.73rem',
            color: 'var(--muted)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-crimson), serif',
            marginBottom: 6,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {translation}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.59rem',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-jetbrains), monospace',
              color: isMeccan ? 'var(--gold2)' : 'var(--teal)',
              border: `1px solid ${isMeccan ? 'rgba(201,168,76,.3)' : 'rgba(45,212,191,.3)'}`,
              borderRadius: 100,
              padding: '2px 7px',
            }}>
            <Building2 size={10} />
            {isMeccan ? 'Makkah' : 'Madinah'}
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              color: 'var(--muted)',
              fontFamily: 'var(--font-jetbrains), monospace',
            }}>
            {surah.ayahs.length} ayahs
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
          flexShrink: 0,
        }}>
        <div
          style={{
            fontSize: '1.2rem',
            direction: 'rtl',
            fontFamily: 'var(--font-crimson), serif',
            lineHeight: 1.5,
            color: hov ? 'var(--gold2)' : 'rgba(201,168,76,.72)',
            textShadow: hov ? '0 0 14px rgba(201,168,76,.32)' : 'none',
            transition: 'color .18s, text-shadow .18s',
          }}>
          {surah.name}
        </div>
        <ChevronRight
          size={16}
          style={{
            color: hov ? 'var(--gold2)' : 'var(--muted)',
            opacity: hov ? 1 : 0.35,
            transform: hov ? 'translateX(2px)' : 'none',
            transition: 'all .18s',
          }}
        />
      </div>
    </button>
  );
}

/* ════════════════════════════════════════════
   Number badge — surah number in 8-point star
════════════════════════════════════════════ */
function NumberBadge({ number, hov }: { number: number; hov: boolean }) {
  return (
    <div
      style={{
        width: 46,
        height: 46,
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        style={{ position: 'absolute' }}>
        <polygon
          points="22,2 26.5,8 34,8 34,15.5 40,22 34,28.5 34,36 26.5,36 22,42 17.5,36 10,36 10,28.5 4,22 10,15.5 10,8 17.5,8"
          fill={hov ? 'rgba(201,168,76,.12)' : 'rgba(201,168,76,.05)'}
          stroke={hov ? 'rgba(201,168,76,.55)' : 'rgba(201,168,76,.22)'}
          strokeWidth="1"
          style={{ transition: 'all .18s' }}
        />
        <circle
          cx="22"
          cy="22"
          r="8"
          fill="none"
          stroke={hov ? 'rgba(201,168,76,.28)' : 'rgba(201,168,76,.1)'}
          strokeWidth="0.8"
          style={{ transition: 'all .18s' }}
        />
      </svg>
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: number >= 100 ? '0.6rem' : '0.7rem',
          color: hov ? 'var(--gold2)' : 'var(--gold)',
          lineHeight: 1,
          transition: 'color .18s',
        }}>
        {number}
      </span>
    </div>
  );
}
