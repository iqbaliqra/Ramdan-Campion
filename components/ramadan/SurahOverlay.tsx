'use client';

import { useEffect, useRef, useState } from 'react';
import type { QuranSurah } from '@/lib/ramadan/quran-api';

/* ─────────────────────────────────────────────────────────────────
   STEP 2 — SurahOverlay
   Full-screen in-app overlay. No routing. Slides up over the app.
   Place this file at: src/components/ramadan/SurahOverlay.tsx
───────────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────────
   The alquran.cloud API prepends the full Bismillah text to the
   first ayah of every surah. We check for both Unicode variants
   (ٱ vs ا) so we never render the BismillahDivider twice.
───────────────────────────────────────────────────────────────── */
const BISMILLAH_PREFIX = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
const BISMILLAH_PREFIX_ALT = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

function firstAyahHasBismillah(surah: QuranSurah): boolean {
  const first = surah.ayahs[0]?.text ?? '';
  return (
    first.startsWith(BISMILLAH_PREFIX) || first.startsWith(BISMILLAH_PREFIX_ALT)
  );
}

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */
type Props = {
  surah: QuranSurah;
  allSurahs: QuranSurah[];
  onClose: () => void;
  onNavigate: (surah: QuranSurah) => void;
};

/* ══════════════════════════════════════════════════════════════
   Main SurahOverlay component
══════════════════════════════════════════════════════════════ */
export function SurahOverlay({ surah, allSurahs, onClose, onNavigate }: Props) {
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Trigger slide-in on first paint */
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* Scroll back to top whenever the surah changes via prev/next */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [surah.number]);

  /* Lock body scroll while overlay is open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* Escape key → close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  /* Slide-out then call onClose */
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const prevSurah = surah.number > 1 ? allSurahs[surah.number - 2] : null;
  const nextSurah = surah.number < 114 ? allSurahs[surah.number] : null;
  const isMeccan = surah.revelationType === 'Meccan';
  const translation =
    TRANSLATIONS[surah.number] ?? surah.englishNameTranslation;

  /*
   * Show the standalone BismillahDivider ONLY when:
   *   1. Not Surah 9 (At-Tawbah — never has Bismillah)
   *   2. The API hasn't already included it as the first ayah text
   *      (avoids the duplicate visible in Al-Falaq, Al-Nas, etc.)
   */
  const showBismillahDivider = false;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Surah ${surah.englishName}`}>
      {/* Ambient top glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 260,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% -10%, rgba(201,168,76,0.13) 0%, transparent 70%)',
        }}
      />

      {/* ══════════════════════════════════
          TOP NAVIGATION BAR
      ══════════════════════════════════ */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 20px',
          height: 56,
          background: 'rgba(6,7,15,0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          zIndex: 10,
        }}>
        <BackButton onClick={handleClose} />

        {/* Breadcrumb */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.7rem',
              color: 'var(--muted)',
              letterSpacing: '0.04em',
            }}>
            Al-Quran
          </span>
          <span style={{ color: 'var(--border)', margin: '0 7px' }}>/</span>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.7rem',
              color: 'var(--gold2)',
              letterSpacing: '0.04em',
            }}>
            {surah.number}. {surah.englishName}
          </span>
        </div>

        {/* Prev / Next arrows */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <NavArrow
            direction="prev"
            surah={prevSurah}
            onClick={() => prevSurah && onNavigate(prevSurah)}
          />
          <NavArrow
            direction="next"
            surah={nextSurah}
            onClick={() => nextSurah && onNavigate(nextSurah)}
          />
        </div>
      </div>

      {/* ══════════════════════════════════
          SCROLLABLE CONTENT
      ══════════════════════════════════ */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
          zIndex: 1,
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border) transparent',
        }}>
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            padding: '36px 20px 100px',
          }}>
          {/* Surah header */}
          <SurahHeader
            surah={surah}
            translation={translation}
            isMeccan={isMeccan}
          />

          {/* Bismillah divider — only when the API hasn't already
              included it inside the first ayah text */}
          {showBismillahDivider && <BismillahDivider />}

          {/* Ayah list */}
          <AyahList surah={surah} />

          {/* Bottom navigation */}
          <BottomNav
            prevSurah={prevSurah}
            nextSurah={nextSurah}
            onClose={handleClose}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SURAH HEADER
══════════════════════════════════════════════ */
function SurahHeader({
  surah,
  translation,
  isMeccan,
}: {
  surah: QuranSurah;
  translation: string;
  isMeccan: boolean;
}) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 36 }}>
      {/* Number ring */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid rgba(201,168,76,0.35)',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '1rem',
          color: 'var(--gold2)',
          marginBottom: 18,
        }}>
        {surah.number}
      </div>

      {/* Arabic name */}
      <div
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          color: 'var(--gold2)',
          fontFamily: 'var(--font-crimson), serif',
          direction: 'rtl',
          lineHeight: 1.6,
          textShadow: '0 0 40px rgba(201,168,76,0.3)',
          marginBottom: 10,
        }}>
        {surah.name}
      </div>

      {/* English name */}
      <h2
        style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
          background:
            'linear-gradient(135deg, var(--gold), var(--gold2), var(--gold3))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.05em',
          marginBottom: 6,
        }}>
        {surah.englishName}
      </h2>

      {/* Translation meaning */}
      <div
        style={{
          fontFamily: 'var(--font-crimson), serif',
          fontSize: '1rem',
          color: 'var(--silver)',
          fontStyle: 'italic',
          marginBottom: 20,
        }}>
        {translation}
      </div>

      {/* Meta badges */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '0.66rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: 100,
            border: `1px solid ${isMeccan ? 'rgba(201,168,76,0.4)' : 'rgba(45,212,191,0.4)'}`,
            color: isMeccan ? 'var(--gold2)' : 'var(--teal)',
          }}>
          {isMeccan ? '🕋 Makkah' : '🕌 Madinah'}
        </span>

        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '0.66rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: 100,
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}>
          {surah.ayahs.length} Ayahs
        </span>

        {surah.ayahs[0]?.juz && (
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.66rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: 100,
              border: '1px solid var(--border)',
              color: 'var(--muted)',
            }}>
            Juz {surah.ayahs[0].juz}
            {surah.ayahs[surah.ayahs.length - 1]?.juz !== surah.ayahs[0].juz
              ? `–${surah.ayahs[surah.ayahs.length - 1]?.juz}`
              : ''}
          </span>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BISMILLAH DIVIDER
   Rendered only when the API hasn't already
   included it inside the first ayah.
══════════════════════════════════════════════ */
function BismillahDivider() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px 16px',
        marginBottom: 24,
        background:
          'linear-gradient(135deg, rgba(201,168,76,0.06), transparent)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        fontSize: 'clamp(1.3rem, 2.8vw, 1.8rem)',
        color: 'var(--gold)',
        fontFamily: 'var(--font-crimson), serif',
        direction: 'rtl',
        lineHeight: 1.9,
        textShadow: '0 0 20px rgba(201,168,76,0.22)',
        position: 'relative',
        overflow: 'hidden',
      }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
        }}
      />
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </div>
  );
}

/* ══════════════════════════════════════════════
   AYAH LIST
══════════════════════════════════════════════ */
function AyahList({ surah }: { surah: QuranSurah }) {
  const ayahs = surah.ayahs.filter((ayah) => {
    // Surah 1 (Al-Fatiha): ayah 1 IS the Bismillah — keep it, show all 7 ayahs
    if (surah.number === 1) return true;
    // All other surahs: strip ayah 1 if it starts with Bismillah (API prepends it)
    if (ayah.numberInSurah === 1) {
      return !ayah.text.startsWith('بِسْمِ');
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {ayahs.map((ayah) => (
        <AyahRow
          key={ayah.number}
          number={ayah.numberInSurah}
          text={ayah.text}
        />
      ))}
    </div>
  );
}

/* ── Single ayah row ── */
function AyahRow({ number, text }: { number: number; text: string }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 40px',
        gap: 16,
        padding: '18px 16px',
        borderRadius: 12,
        border: `1px solid ${hov ? 'rgba(201,168,76,0.25)' : 'var(--border)'}`,
        background: hov ? 'rgba(201,168,76,0.03)' : 'var(--bg2)',
        transition: 'border-color 0.18s, background 0.18s',
        direction: 'rtl',
      }}>
      {/* Arabic text */}
      <p
        style={{
          margin: 0,
          fontSize: 'clamp(1.15rem, 2.3vw, 1.5rem)',
          lineHeight: 2.2,
          color: 'var(--text)',
          textAlign: 'right',
          direction: 'rtl',
          fontFamily: 'var(--font-crimson), serif',
          fontFeatureSettings: '"liga" 1, "kern" 1',
        }}>
        {text}
        {/* Ayah end ornament */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
            marginLeft: 4,
            fontSize: '0.78rem',
            color: 'var(--gold)',
            opacity: 0.6,
            fontFamily: 'var(--font-jetbrains), monospace',
            verticalAlign: 'middle',
          }}>
          ۝{number}
        </span>
      </p>

      {/* Ayah number badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 6,
          flexShrink: 0,
        }}>
        <div
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            style={{ position: 'absolute' }}>
            <polygon
              points="15,1 17.9,6 23,6 23,11.1 27,15 23,18.9 23,24 17.9,24 15,29 12.1,24 7,24 7,18.9 3,15 7,11.1 7,6 12.1,6"
              fill="rgba(201,168,76,0.06)"
              stroke={hov ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.18)'}
              strokeWidth="1"
              style={{ transition: 'stroke 0.18s' }}
            />
          </svg>
          <span
            style={{
              position: 'relative',
              zIndex: 1,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: number >= 100 ? '0.52rem' : '0.62rem',
              color: hov ? 'var(--gold2)' : 'var(--gold)',
              lineHeight: 1,
              transition: 'color 0.18s',
            }}>
            {number}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BOTTOM NAVIGATION
══════════════════════════════════════════════ */
function BottomNav({
  prevSurah,
  nextSurah,
  onClose,
  onNavigate,
}: {
  prevSurah: QuranSurah | null;
  nextSurah: QuranSurah | null;
  onClose: () => void;
  onNavigate: (s: QuranSurah) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        marginTop: 52,
        flexWrap: 'wrap',
      }}>
      {prevSurah && (
        <FootNavButton onClick={() => onNavigate(prevSurah)}>
          ← {prevSurah.englishName}
        </FootNavButton>
      )}

      <FootNavButton onClick={onClose} muted>
        ✕ Close
      </FootNavButton>

      {nextSurah && (
        <FootNavButton onClick={() => onNavigate(nextSurah)}>
          {nextSurah.englishName} →
        </FootNavButton>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SMALL REUSABLE PIECES
══════════════════════════════════════════════ */
function BackButton({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'transparent',
        border: 'none',
        color: hov ? 'var(--gold2)' : 'var(--muted)',
        cursor: 'pointer',
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '0.8rem',
        letterSpacing: '0.04em',
        padding: '6px 0',
        transition: 'color 0.18s',
        flexShrink: 0,
      }}>
      <span style={{ fontSize: '1rem', lineHeight: 1 }}>←</span>
      Back
    </button>
  );
}

function NavArrow({
  direction,
  surah,
  onClick,
}: {
  direction: 'prev' | 'next';
  surah: QuranSurah | null;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  if (!surah) return <div style={{ width: 32 }} />;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={surah.englishName}
      style={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hov ? 'rgba(201,168,76,0.1)' : 'transparent',
        border: `1px solid ${hov ? 'rgba(201,168,76,0.4)' : 'var(--border)'}`,
        color: hov ? 'var(--gold2)' : 'var(--muted)',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.18s',
        lineHeight: 1,
      }}>
      {direction === 'prev' ? '‹' : '›'}
    </button>
  );
}

function FootNavButton({
  children,
  onClick,
  muted = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  muted?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '10px 20px',
        background: 'transparent',
        border: `1px solid ${
          muted
            ? hov
              ? 'rgba(201,168,76,0.3)'
              : 'var(--border)'
            : hov
              ? 'rgba(201,168,76,0.5)'
              : 'rgba(201,168,76,0.25)'
        }`,
        borderRadius: 12,
        color: muted
          ? hov
            ? 'var(--silver)'
            : 'var(--muted)'
          : hov
            ? 'var(--gold2)'
            : 'var(--gold)',
        cursor: 'pointer',
        fontFamily: 'var(--font-cinzel), serif',
        fontSize: '0.82rem',
        letterSpacing: '0.04em',
        transition: 'border-color 0.18s, color 0.18s',
      }}>
      {children}
    </button>
  );
}
