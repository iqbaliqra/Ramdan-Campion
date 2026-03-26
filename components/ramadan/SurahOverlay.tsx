'use client';

import { forwardRef } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { QuranSurah } from '@/lib/ramadan/quran-api';

/* ─────────────────────────────────────────────────────────────────
   SurahOverlay — Audio Player + Ayah Highlighting
   Reciter : Abdul Basit Abdus Samad (Murattal 192kbps)
   CDN     : everyayah.com
───────────────────────────────────────────────────────────────── */

function ayahAudioUrl(surahNum: number, ayahNum: number): string {
  const s = String(surahNum).padStart(3, '0');
  const a = String(ayahNum).padStart(3, '0');
  return `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${s}${a}.mp3`;
}

/* ─────────────────────────────────────────────────────────────────
   Helper — does ayah 1 of this surah contain the Bismillah?
   (API prepends it for every surah except 1 and 9)
───────────────────────────────────────────────────────────────── */
function ayah1IsBismillah(surah: QuranSurah): boolean {
  if (surah.number === 1 || surah.number === 9) return false;
  const text = surah.ayahs[0]?.text ?? '';
  return text.includes('ٱلرَّحِيمِ') || text.includes('الرَّحِيمِ');
}

/* ── Translations ── */
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

type PlayState = 'idle' | 'loading' | 'playing' | 'paused';

type Props = {
  surah: QuranSurah;
  allSurahs: QuranSurah[];
  onClose: () => void;
  onNavigate: (surah: QuranSurah) => void;
};

/* ══════════════════════════════════════════════════════════════
   useAudioPlayer
══════════════════════════════════════════════════════════════ */
function useAudioPlayer(surah: QuranSurah) {
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const [isPlayAll, setIsPlayAll] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayAllRef = useRef(false);
  const surahRef = useRef(surah);

  useEffect(() => {
    surahRef.current = surah;
  }, [surah]);
  useEffect(() => {
    isPlayAllRef.current = isPlayAll;
  }, [isPlayAll]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.oncanplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setPlayState('idle');
    setActiveAyah(null);
    setIsPlayAll(false);
    isPlayAllRef.current = false;
  }, []);

  useEffect(() => {
    stop();
  }, [surah.number, stop]);
  useEffect(() => () => stop(), [stop]);

  const playAyah = useCallback((ayahNum: number) => {
    if (audioRef.current) {
      audioRef.current.oncanplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }

    setActiveAyah(ayahNum);
    setPlayState('loading');

    const audio = new Audio();
    audioRef.current = audio;

    audio.oncanplay = () => {
      setPlayState('playing');
      audio.play().catch(() => {
        setPlayState('idle');
        setActiveAyah(null);
      });
    };

    audio.onerror = () => {
      setPlayState('idle');
      setActiveAyah(null);
    };

    audio.onended = () => {
      if (!isPlayAllRef.current) {
        setPlayState('idle');
        setActiveAyah(null);
        return;
      }
      const nextNum = ayahNum + 1;
      const exists = surahRef.current.ayahs.some(
        (a) => a.numberInSurah === nextNum,
      );
      if (exists) {
        playAyah(nextNum);
      } else {
        setPlayState('idle');
        setActiveAyah(null);
        setIsPlayAll(false);
        isPlayAllRef.current = false;
      }
    };

    audio.src = ayahAudioUrl(surahRef.current.number, ayahNum);
    audio.load();
  }, []);

  const togglePlayAll = useCallback(() => {
    if (playState === 'playing' || playState === 'loading') {
      stop();
      return;
    }
    /* Skip bismillah ayah (ayah 1) for all surahs except 1 and 9 */
    const hasBismillah = ayah1IsBismillah(surahRef.current);
    const startAyah = hasBismillah ? 2 : 1;
    isPlayAllRef.current = true;
    setIsPlayAll(true);
    playAyah(startAyah);
  }, [playState, stop, playAyah]);

  const toggleAyah = useCallback(
    (ayahNum: number) => {
      if (activeAyah === ayahNum) {
        if (playState === 'playing') {
          audioRef.current?.pause();
          setPlayState('paused');
        } else if (playState === 'paused') {
          audioRef.current?.play().catch(() => setPlayState('idle'));
          setPlayState('playing');
        }
        return;
      }
      isPlayAllRef.current = false;
      setIsPlayAll(false);
      playAyah(ayahNum);
    },
    [activeAyah, playState, playAyah],
  );

  return { playState, activeAyah, isPlayAll, togglePlayAll, toggleAyah, stop };
}

/* ══════════════════════════════════════════════════════════════
   Main SurahOverlay
══════════════════════════════════════════════════════════════ */
export function SurahOverlay({ surah, allSurahs, onClose, onNavigate }: Props) {
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const audio = useAudioPlayer(surah);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    ayahRefs.current = {};
  }, [surah.number]);

  useEffect(() => {
    if (audio.activeAyah !== null) {
      ayahRefs.current[audio.activeAyah]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [audio.activeAyah]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const handleClose = () => {
    audio.stop();
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleNavigate = (s: QuranSurah) => {
    audio.stop();
    onNavigate(s);
  };

  const prevSurah = surah.number > 1 ? allSurahs[surah.number - 2] : null;
  const nextSurah = surah.number < 114 ? allSurahs[surah.number] : null;
  const isMeccan = surah.revelationType === 'Meccan';
  const translation =
    TRANSLATIONS[surah.number] ?? surah.englishNameTranslation;

  /* ─────────────────────────────────────────────────────────
     Bismillah handling:
     - If ayah 1 contains Bismillah → show it as a decorative
       heading, skip it from the ayah list entirely.
     - Ayah numbers stay correct (2, 3, 4… not 1, 2, 3…)
     - Surah 1 (Al-Fatiha): Bismillah IS the real ayah 1 → keep
     - Surah 9 (At-Tawbah): no Bismillah → keep all ayahs
  ───────────────────────────────────────────────────────── */
  const hasBismillahHeading = ayah1IsBismillah(surah);

  /* Skip ayah 1 from the list when it's just the bismillah */
  const visibleAyahs = hasBismillahHeading ? surah.ayahs.slice(1) : surah.ayahs;

  const isListening =
    audio.playState === 'playing' || audio.playState === 'loading';

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
      {/* Ambient glow */}
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

      {/* ── Top nav bar ── */}
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

        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <NavArrow
            direction="prev"
            surah={prevSurah}
            onClick={() => prevSurah && handleNavigate(prevSurah)}
          />
          <NavArrow
            direction="next"
            surah={nextSurah}
            onClick={() => nextSurah && handleNavigate(nextSurah)}
          />
        </div>
      </div>

      {/* ── Scrollable content ── */}
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

          {/* Audio player panel */}
          <AudioPanel
            playState={audio.playState}
            activeAyah={audio.activeAyah}
            isListening={isListening}
            totalAyahs={visibleAyahs.length}
            onTogglePlayAll={audio.togglePlayAll}
          />

          {/* ── Bismillah heading (not an ayah) ── */}
          {hasBismillahHeading && (
            <div
              style={{
                textAlign: 'center',
                padding: '18px 16px',
                marginBottom: 12,
                fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
                color: 'var(--gold)',
                fontFamily: 'var(--font-crimson), serif',
                direction: 'rtl',
                lineHeight: 1.9,
                textShadow: '0 0 20px rgba(201,168,76,0.22)',
                background:
                  'linear-gradient(135deg, rgba(201,168,76,0.06), transparent)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                position: 'relative',
                overflow: 'hidden',
              }}>
              {/* top shimmer */}
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
          )}

          {/* ── Ayah list ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {visibleAyahs.map((ayah) => (
              <AyahRow
                key={ayah.number}
                ref={(el) => {
                  ayahRefs.current[ayah.numberInSurah] = el;
                }}
                number={ayah.numberInSurah}
                text={ayah.text}
                isActive={audio.activeAyah === ayah.numberInSurah}
                playState={
                  audio.activeAyah === ayah.numberInSurah
                    ? audio.playState
                    : 'idle'
                }
                onPlayToggle={() => audio.toggleAyah(ayah.numberInSurah)}
              />
            ))}
          </div>

          {/* Bottom nav */}
          <BottomNav
            prevSurah={prevSurah}
            nextSurah={nextSurah}
            onClose={handleClose}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   AUDIO PANEL
══════════════════════════════════════════════ */
function AudioPanel({
  playState,
  activeAyah,
  isListening,
  totalAyahs,
  onTogglePlayAll,
}: {
  playState: PlayState;
  activeAyah: number | null;
  isListening: boolean;
  totalAyahs: number;
  onTogglePlayAll: () => void;
}) {
  return (
    <div
      style={{
        marginBottom: 20,
        padding: '18px 22px',
        background: isListening
          ? 'linear-gradient(135deg, rgba(45,212,191,0.07), rgba(17,21,40,0.95))'
          : 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(17,21,40,0.95))',
        border: `1px solid ${isListening ? 'rgba(45,212,191,0.3)' : 'var(--border)'}`,
        borderRadius: 16,
        transition: 'border-color 0.3s, background 0.3s',
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
          background: isListening
            ? 'linear-gradient(90deg, transparent, rgba(45,212,191,0.5), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)',
          transition: 'background 0.3s',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
        {/* Play / Stop button */}
        <button
          type="button"
          onClick={onTogglePlayAll}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 24px',
            borderRadius: 50,
            border: `1px solid ${isListening ? 'rgba(45,212,191,0.5)' : 'rgba(201,168,76,0.45)'}`,
            background: isListening
              ? 'rgba(45,212,191,0.12)'
              : 'rgba(201,168,76,0.1)',
            color: isListening ? 'var(--teal)' : 'var(--gold2)',
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '0.88rem',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            transition: 'all 0.22s ease',
            flexShrink: 0,
          }}>
          {playState === 'loading' && activeAyah === null ? (
            <>
              <SpinnerIcon color="var(--gold2)" /> Loading…
            </>
          ) : isListening ? (
            <>
              <StopIcon /> Stop
            </>
          ) : (
            <>
              <HeadphonesIcon /> Listen to Surah
            </>
          )}
        </button>

        {/* Now-playing status */}
        {activeAyah !== null ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {playState === 'playing' && (
              <div
                style={{
                  display: 'flex',
                  gap: 3,
                  alignItems: 'flex-end',
                  height: 20,
                }}>
                {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      width: 3,
                      borderRadius: 3,
                      background: 'var(--teal)',
                      animationName: 'audioWave',
                      animationDuration: '0.75s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationDelay: `${delay}s`,
                    }}
                  />
                ))}
              </div>
            )}
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background:
                  playState === 'loading' ? 'var(--gold2)' : 'var(--teal)',
                boxShadow: `0 0 8px ${playState === 'loading' ? 'var(--gold2)' : 'var(--teal)'}`,
                display: 'inline-block',
                animationName: 'audioPulse',
                animationDuration: '1.4s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '0.75rem',
                color: playState === 'loading' ? 'var(--gold2)' : 'var(--teal)',
              }}>
              {playState === 'loading' ? 'Loading' : 'Playing'} ayah{' '}
              {activeAyah} / {totalAyahs}
            </span>
          </div>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.72rem',
              color: 'var(--muted)',
              letterSpacing: '0.04em',
            }}>
            Abdul Basit Abdus Samad · Murattal
          </span>
        )}
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
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
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
   AYAH ROW
══════════════════════════════════════════════ */
const AyahRow = forwardRef<
  HTMLDivElement,
  {
    number: number;
    text: string;
    isActive: boolean;
    playState: PlayState;
    onPlayToggle: () => void;
  }
>(({ number, text, isActive, playState, onPlayToggle }, ref) => {
  const [hov, setHov] = useState(false);
  const isPlaying = isActive && playState === 'playing';
  const isLoading = isActive && playState === 'loading';

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '44px 1fr',
        gap: 14,
        padding: '16px 14px',
        borderRadius: 12,
        border: `1px solid ${
          isActive
            ? 'rgba(201,168,76,0.45)'
            : hov
              ? 'rgba(201,168,76,0.22)'
              : 'var(--border)'
        }`,
        background: isActive
          ? 'linear-gradient(135deg, rgba(201,168,76,0.09), rgba(17,21,40,0.97))'
          : hov
            ? 'rgba(201,168,76,0.03)'
            : 'var(--bg2)',
        boxShadow: isActive ? '0 0 24px rgba(201,168,76,0.08)' : 'none',
        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        direction: 'rtl',
      }}>
      {/* Left col: play button + wave */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 7,
          paddingTop: 4,
        }}>
        <button
          type="button"
          onClick={onPlayToggle}
          aria-label={
            isPlaying ? `Pause ayah ${number}` : `Play ayah ${number}`
          }
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${
              isPlaying
                ? 'rgba(45,212,191,0.55)'
                : isActive
                  ? 'rgba(201,168,76,0.45)'
                  : hov
                    ? 'rgba(201,168,76,0.28)'
                    : 'var(--border)'
            }`,
            background: isPlaying
              ? 'rgba(45,212,191,0.12)'
              : isActive
                ? 'rgba(201,168,76,0.1)'
                : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.18s',
          }}>
          {isLoading ? (
            <SpinnerIcon size={12} color="var(--gold2)" />
          ) : isPlaying ? (
            <span style={{ display: 'flex', gap: 2 }}>
              <span
                style={{
                  width: 3,
                  height: 11,
                  background: 'var(--teal)',
                  borderRadius: 2,
                  display: 'block',
                }}
              />
              <span
                style={{
                  width: 3,
                  height: 11,
                  background: 'var(--teal)',
                  borderRadius: 2,
                  display: 'block',
                }}
              />
            </span>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: number >= 100 ? '0.48rem' : '0.58rem',
                color: isActive
                  ? 'var(--gold2)'
                  : hov
                    ? 'var(--gold)'
                    : 'var(--muted)',
                lineHeight: 1,
                transition: 'color 0.18s',
              }}>
              {number}
            </span>
          )}
        </button>

        {isPlaying && (
          <div
            style={{
              display: 'flex',
              gap: 2,
              alignItems: 'flex-end',
              height: 16,
            }}>
            {[0, 0.18, 0.36, 0.18].map((delay, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  width: 3,
                  borderRadius: 3,
                  background: 'var(--teal)',
                  animationName: 'audioWave',
                  animationDuration: '0.75s',
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right col: Arabic text */}
      <p
        style={{
          margin: 0,
          fontSize: 'clamp(1.15rem, 2.3vw, 1.5rem)',
          lineHeight: 2.2,
          color: isActive ? 'var(--gold3)' : 'var(--text)',
          textAlign: 'right',
          direction: 'rtl',
          fontFamily: 'var(--font-crimson), serif',
          fontFeatureSettings: '"liga" 1, "kern" 1',
          textShadow: isActive ? '0 0 18px rgba(201,168,76,0.22)' : 'none',
          transition: 'color 0.22s, text-shadow 0.22s',
        }}>
        {text}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
            marginLeft: 4,
            fontSize: '0.76rem',
            color: isActive ? 'var(--gold2)' : 'var(--gold)',
            opacity: isActive ? 0.8 : 0.5,
            fontFamily: 'var(--font-jetbrains), monospace',
            verticalAlign: 'middle',
            transition: 'color 0.22s, opacity 0.22s',
          }}>
          ۝{number}
        </span>
      </p>
    </div>
  );
});
AyahRow.displayName = 'AyahRow';

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
      <span style={{ fontSize: '1rem', lineHeight: 1 }}>←</span> Back
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
      title={surah.englishName}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
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

function HeadphonesIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

function SpinnerIcon({
  size = 14,
  color = 'currentColor',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.2)',
        borderTopColor: color,
        animationName: 'spin',
        animationDuration: '0.7s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      }}
    />
  );
}
