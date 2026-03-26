'use client';

import { useState } from 'react';

/* ─────────────────────────────────────────────────────────────────
   STEP 4 — DuasTab
   4 categories: Morning Adhkar · Evening Adhkar · Post-Prayer · Ramadan
   Click any dua card to copy Arabic + transliteration + meaning
───────────────────────────────────────────────────────────────── */

type DuaEntry = {
  ar: string; // Arabic text
  tr: string; // Transliteration
  me: string; // Meaning
  src?: string; // Source reference (hadith / quran)
};

type Category = 'morning' | 'evening' | 'prayer' | 'ramadan';

/* ══════════════════════════════════════════════
   DUA DATA
══════════════════════════════════════════════ */
const DUAS: Record<Category, DuaEntry[]> = {
  morning: [
    {
      ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      tr: 'Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah',
      me: 'We have entered the morning and at this very time the dominion belongs to Allah. All praise is due to Allah. None has the right to be worshipped except Allah, alone without any partner.',
      src: 'Abu Dawud 4/318',
    },
    {
      ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
      tr: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu, wa ilaykan-nushoor',
      me: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
      src: 'Abu Dawud, At-Tirmidhi',
    },
    {
      ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
      tr: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata't",
      me: 'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can.',
      src: 'Sayyid Al-Istighfar — Bukhari 8/318',
    },
    {
      ar: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ — اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
      tr: "A'udhu billahi minash-shaytanir-rajeem — Allahu la ilaha illa huwal-hayyul-qayyoom (Ayatul Kursi)",
      me: 'I seek refuge in Allah from the accursed Shaytan — Allah, there is no deity except Him, the Ever-Living, the Sustainer of existence. (Ayatul Kursi — recite in full)',
      src: 'Surah Al-Baqarah 2:255',
    },
    {
      ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ — ١٠٠ مَرَّة',
      tr: 'Subhanallahi wa bihamdihi — 100 times',
      me: 'Glory be to Allah and all praise is due to Him. The Prophet ﷺ said: whoever says this 100 times in the morning, his sins are forgiven even if they are like the foam of the sea.',
      src: 'Muslim 4/2071',
    },
    {
      ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
      tr: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wa a'udhu bika minal-'ajzi wal-kasal",
      me: 'O Allah, I seek refuge in You from anxiety and grief, and I seek refuge in You from incapacity and laziness.',
      src: 'Bukhari 7/158',
    },
  ],

  evening: [
    {
      ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      tr: 'Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah',
      me: 'We have entered the evening and at this very time the dominion belongs to Allah. All praise is due to Allah. None has the right to be worshipped except Allah, alone without partner.',
      src: 'Abu Dawud 4/318',
    },
    {
      ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
      tr: 'Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namootu, wa ilaykal-maseer',
      me: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
      src: 'Abu Dawud, At-Tirmidhi',
    },
    {
      ar: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      tr: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
      me: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
      src: 'Muslim 4/2080',
    },
    {
      ar: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي',
      tr: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari",
      me: 'O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.',
      src: 'Abu Dawud 4/324',
    },
    {
      ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ — ٣ مرات',
      tr: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'aleem — 3 times",
      me: 'In the name of Allah with whose name nothing can cause harm on earth or in the heavens, and He is the All-Hearing, All-Knowing. (3 times)',
      src: 'Abu Dawud, At-Tirmidhi',
    },
    {
      ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
      tr: "Allahumma inni as'alukal-'afwa wal-'afiyata fid-dunya wal-akhirah",
      me: 'O Allah, I ask You for pardon and well-being in this life and the next.',
      src: 'Ibn Majah 2/332',
    },
  ],

  prayer: [
    {
      ar: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ',
      tr: "Allahumma a'inni 'ala dhikrika, wa shukrika, wa husni 'ibadatik",
      me: 'O Allah, help me to remember You, to give thanks to You, and to worship You in an excellent manner.',
      src: 'Abu Dawud, Ahmad — after every Salah',
    },
    {
      ar: 'سُبْحَانَ اللَّهِ — ٣٣، الْحَمْدُ لِلَّهِ — ٣٣، اللَّهُ أَكْبَرُ — ٣٣',
      tr: 'Subhanallah — 33, Alhamdulillah — 33, Allahu Akbar — 33',
      me: 'Glory be to Allah (33x), All praise is to Allah (33x), Allah is the Greatest (33x). Complete with: La ilaha illAllahu wahdahu la shareeka lah...',
      src: 'Muslim 1/418 — after every Salah',
    },
    {
      ar: 'آيَةُ الْكُرْسِيِّ — بعد كل صلاة مكتوبة',
      tr: 'Ayatul Kursi — after every obligatory prayer',
      me: 'Recite Ayatul Kursi (2:255) after each obligatory prayer. The Prophet ﷺ said: whoever recites it after each prayer, nothing will prevent him from entering Jannah except death.',
      src: 'An-Nasai, Ibn Hibban',
    },
    {
      ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبُخْلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ مِنَ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ',
      tr: "Allahumma inni a'udhu bika minal-bukhl, wa a'udhu bika minal-jubn, wa a'udhu bika min an uradda ila ardhalil-'umur",
      me: 'O Allah, I seek refuge in You from miserliness, I seek refuge in You from cowardice, and I seek refuge in You from being returned to the worst of ages.',
      src: 'Bukhari — after Fajr and Asr',
    },
    {
      ar: 'اللَّهُمَّ اغْفِرْ لِي، وَارْحَمْنِي، وَاهْدِنِي، وَاجْبُرْنِي، وَعَافِنِي، وَارْزُقْنِي، وَارْفَعْنِي',
      tr: "Allahummagh-firli, war-hamni, wahdinee, wajburni, wa 'afini, warzuqni, warfa'ni",
      me: 'O Allah, forgive me, have mercy on me, guide me, support me, protect me, provide for me, and elevate me.',
      src: 'Muslim 4/2073 — between Sunnah & Fard',
    },
    {
      ar: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي، رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
      tr: "Rabbij-'alni muqimas-salati wa min dhurriyyati, rabbana wa taqabbal du'a",
      me: 'My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.',
      src: 'Surah Ibrahim 14:40',
    },
  ],

  ramadan: [
    {
      ar: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      tr: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
      me: 'O Allah, You are forgiving and You love forgiveness, so forgive me.',
      src: 'At-Tirmidhi — Laylatul Qadr',
    },
    {
      ar: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
      tr: "Allahumma laka sumtu wa bika aamantu wa 'ala rizqika aftartu",
      me: 'O Allah, I fasted for You, I believe in You, and I break my fast with Your sustenance.',
      src: 'Abu Dawud — Iftar dua',
    },
    {
      ar: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
      tr: "Dhahaba az-zama', wabtallatil-'urooq, wa thabatal-ajru insha'Allah",
      me: 'The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
      src: 'Abu Dawud 2/306 — after Iftar',
    },
    {
      ar: 'وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
      tr: 'Wa bisawmi ghadin nawaitu min shahri Ramadan',
      me: 'I intend to keep the fast for tomorrow in the month of Ramadan.',
      src: 'Abu Dawud — Suhoor Niyyah',
    },
    {
      ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ رَحْمَتَكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ',
      tr: "Allahumma inni as'aluka rahmataka allati wasi'at kulla shay",
      me: 'O Allah, I ask You for Your mercy which encompasses all things.',
      src: 'Ibn Majah — general Ramadan dua',
    },
    {
      ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      tr: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
      me: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.',
      src: 'Surah Al-Baqarah 2:201',
    },
  ],
};

const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; color: string; desc: string }
> = {
  morning: {
    label: 'Morning',
    icon: '🌅',
    color: 'rgba(201,168,76,0.55)',
    desc: 'Recite after Fajr prayer until sunrise',
  },
  evening: {
    label: 'Evening',
    icon: '🌆',
    color: 'rgba(45,212,191,0.55)',
    desc: 'Recite after Asr prayer until Maghrib',
  },
  prayer: {
    label: 'After Prayer',
    icon: '🕌',
    color: 'rgba(168,184,216,0.55)',
    desc: 'Recite after each obligatory Salah',
  },
  ramadan: {
    label: 'Ramadan',
    icon: '🌙',
    color: 'rgba(201,168,76,0.55)',
    desc: 'Iftar, Suhoor, Laylatul Qadr & more',
  },
};

const CATEGORIES: Category[] = ['morning', 'evening', 'prayer', 'ramadan'];

/* ══════════════════════════════════════════════
   Main DuasTab component
══════════════════════════════════════════════ */
type Props = { active: boolean };

export function DuasTab({ active }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('morning');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyDua = async (idx: number, dua: DuaEntry) => {
    try {
      await navigator.clipboard?.writeText(
        `${dua.ar}\n\n${dua.tr}\n\n${dua.me}${dua.src ? `\n\nSource: ${dua.src}` : ''}`,
      );
    } catch {
      /* ignore */
    }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  };

  const duas = DUAS[activeCategory];
  const meta = CATEGORY_META[activeCategory];

  return (
    <div
      className={'tab-section' + (active ? ' active' : '')}
      id="tab-duas"
      role="tabpanel">
      <div className="section-title">🤲 Adhkar &amp; Duas</div>

      {/* ── Category selector ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          marginBottom: 20,
        }}>
        {CATEGORIES.map((cat) => {
          const m = CATEGORY_META[cat];
          const isAc = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                padding: '12px 8px',
                borderRadius: 14,
                border: `1px solid ${isAc ? m.color : 'var(--border)'}`,
                background: isAc
                  ? `linear-gradient(135deg, ${m.color.replace('0.55', '0.12')}, rgba(17,21,40,0.95))`
                  : 'var(--bg2)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: isAc
                  ? `0 0 20px ${m.color.replace('0.55', '0.15')}`
                  : 'none',
              }}>
              <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>
                {m.icon}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '0.62rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: isAc ? 'var(--gold2)' : 'var(--muted)',
                  transition: 'color 0.18s',
                }}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Category description ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px',
          marginBottom: 18,
          background: 'rgba(201,168,76,0.04)',
          border: '1px solid var(--border)',
          borderRadius: 10,
        }}>
        <span style={{ fontSize: '1.1rem' }}>{meta.icon}</span>
        <span
          style={{
            fontFamily: 'var(--font-crimson), serif',
            fontSize: '0.9rem',
            color: 'var(--muted)',
            fontStyle: 'italic',
          }}>
          {meta.desc}
        </span>
      </div>

      {/* ── Dua cards ── */}
      <div className="dua-grid">
        {duas.map((dua, idx) => {
          const copied = copiedIdx === idx;
          return (
            <div
              key={idx}
              className="dua-item"
              style={{
                background: copied ? 'rgba(201,168,76,0.08)' : undefined,
                borderColor: copied ? 'rgba(201,168,76,0.45)' : undefined,
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => copyDua(idx, dua)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  copyDua(idx, dua);
                }
              }}>
              {/* Copy flash badge */}
              {copied && (
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 12,
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                    color: 'var(--teal)',
                    background: 'rgba(45,212,191,0.12)',
                    border: '1px solid rgba(45,212,191,0.3)',
                    borderRadius: 100,
                    padding: '2px 8px',
                  }}>
                  ✓ copied
                </div>
              )}

              {/* Arabic text */}
              <div
                className="dua-arabic"
                style={{ fontSize: '1.2rem', marginTop: copied ? 16 : 0 }}>
                {dua.ar}
              </div>

              {/* Transliteration */}
              <div className="dua-transliteration">{dua.tr}</div>

              {/* Meaning */}
              <div className="dua-meaning">{dua.me}</div>

              {/* Source */}
              {dua.src && (
                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 6,
                  }}>
                  <span className="dua-occasion">
                    {meta.icon} {meta.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: '0.65rem',
                      color: 'var(--muted)',
                      opacity: 0.7,
                    }}>
                    {dua.src}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <p
        style={{
          marginTop: 16,
          fontSize: '0.8rem',
          color: 'var(--muted)',
          textAlign: 'center',
          fontStyle: 'italic',
          fontFamily: 'var(--font-crimson), serif',
        }}>
        Tap any card to copy Arabic, transliteration &amp; meaning ✦
      </p>
    </div>
  );
}
