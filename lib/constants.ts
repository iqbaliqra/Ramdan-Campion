import type { EssentialDua, IbadahItem, TabId, TabItem, Verse } from './types';

export const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export const verses: Verse[] = [
  {
    arabic: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ',
    translation: 'The month of Ramadan [is that] in which was revealed the Quran, a guidance for the people',
    ref: 'Surah Al-Baqarah 2:185',
  },
  {
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ',
    translation: 'O you who have believed, decreed upon you is fasting as it was decreed upon those before you',
    ref: 'Surah Al-Baqarah 2:183',
  },
  {
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ',
    translation: 'And when My servants ask you concerning Me — indeed I am near.',
    ref: 'Surah Al-Baqarah 2:186',
  },
  {
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    translation: 'Indeed, Allah is with the patient.',
    ref: 'Surah Al-Baqarah 2:153',
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    ref: 'Surah Al-Baqarah 2:152',
  },
  {
    arabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
    translation: 'Allah is the Light of the heavens and the earth.',
    ref: 'Surah An-Nur 24:35',
  },
  {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    translation:
      'And whoever fears Allah — He will make for him a way out. And will provide for him from where he does not expect.',
    ref: 'Surah At-Talaq 65:2-3',
  },
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship will be ease.',
    ref: 'Surah Ash-Sharh 94:6',
  },
];

export const ibadahItems: IbadahItem[] = [
  { id: 'fajr', label: 'Fajr Salah', icon: 'Sunrise' },
  { id: 'dhuhr', label: 'Dhuhr Salah', icon: 'Sun' },
  { id: 'asr', label: 'Asr Salah', icon: 'CloudSun' },
  { id: 'maghrib', label: 'Maghrib Salah', icon: 'Sunset' },
  { id: 'isha', label: 'Isha Salah', icon: 'Moon' },
  { id: 'quran', label: 'Quran Reading', icon: 'BookOpen' },
  { id: 'dhikr', label: 'Morning Dhikr', icon: 'RefreshCw' },
  { id: 'sadaqah', label: 'Sadaqah Given', icon: 'Heart' },
  { id: 'tarawih', label: 'Tarawih Prayer', icon: 'Moon' },
  { id: 'niyah', label: 'Made Niyyah (Suhoor)', icon: 'Feather' },
];

export const essentialDuas: EssentialDua[] = [
  {
    ar: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    tr: "Allahumma innaka 'afuwwun, tuhibbul-'afwa, fa'fu 'anni",
    me: '"O Allah, You are forgiving and love forgiveness, so forgive me."',
    oc: 'Laylatul Qadr',
  },
  {
    ar: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
    tr: "Allahumma laka sumtu wa bika aamantu wa 'ala rizqika aftartu",
    me: '"O Allah, I fasted for You, I believe in You, and I break my fast with Your sustenance."',
    oc: 'Breaking Fast (Iftar)',
  },
  {
    ar: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    tr: "Dhahab az-zama', wabtallatil-'urooq, wa thabatal-ajru inshaa-Allah",
    me: '"The thirst is gone, the veins are moistened and the reward is confirmed, if Allah wills."',
    oc: 'After Iftar',
  },
  {
    ar: 'وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
    tr: 'Wa bisawmi ghadin nawaitu min shahri Ramadan',
    me: '"I intend to keep the fast for tomorrow in the month of Ramadan."',
    oc: 'Suhoor Intention (Niyyah)',
  },
  {
    ar: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَارْزُقْنِي',
    tr: 'Allahummaghfirli warhamni wahdini warzuqni',
    me: '"O Allah, forgive me, have mercy on me, guide me, and provide for me."',
    oc: 'General Daily Dua',
  },
  {
    ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ وَالْهَرَمِ',
    tr: "Allahumma inni a'udhu bika minal-kasali wal-haram",
    me: '"O Allah, I seek refuge in You from laziness and old age."',
    oc: 'Morning Adhkar',
  },
];

export const SPECIAL_NIGHTS_REMINDER =
  'In Islam, blessed nights such as Laylatul Qadr are not occasions for celebration like Eid or worldly festivals. ' +
  'They are not for parties, fireworks, music, or innovated customs that resemble non-Islamic holidays. ' +
  'The Prophet, peace and blessings be upon him, taught us to seek these nights in worship: prayer, recitation of the Quran, supplication, and remembrance of Allah. ' +
  'Turning them into social celebrations or mixing them with prohibited or invented practices is contrary to the Sunnah. ' +
  'Seek the Night of Power in humility, night prayer, and obedience — not in show, noise, or celebration.';

export const specialDays: Record<number, { title: string; note: string }> = {
  1: {
    title: 'First Night of Ramadan',
    note: 'The blessed month begins! Gates of heaven open, gates of hell close, and shayateen are chained.',
  },
  15: { title: 'Middle of Ramadan', note: "Halfway through! Increase worship and du'a." },
  17: { title: 'Battle of Badr (17th)', note: 'Great victory for the Muslims. A day of remembrance and gratitude.' },
  21: {
    title: 'First of Last 10 Nights',
    note: 'Seek Laylatul Qadr! Increase night prayers (Tahajjud), dua, and dhikr.',
  },
  23: {
    title: 'Possible Laylatul Qadr',
    note: 'Many scholars say the 23rd night is among the most likely for Laylatul Qadr.',
  },
  27: {
    title: '27th Night — Most Likely Laylatul Qadr',
    note: 'Widely considered the most likely Night of Power. Maximize worship tonight!',
  },
  29: { title: 'Last Odd Night', note: "One of the possible nights of Laylatul Qadr. Don't miss it." },
  30: {
    title: 'Last Day of Ramadan',
    note: 'Pay Sadaqah al-Fitr before Eid prayer. The Eid moon will be sighted tonight, inshAllah.',
  },
};

export const TAB_ITEMS: TabItem[] = [
  { id: 'home', label: 'Home', icon: 'Moon' },
  { id: 'quran', label: 'Quran', icon: 'BookOpen' },
  { id: 'duas', label: 'Duas', icon: 'HandHeart' },
  { id: 'tracker', label: 'Tracker', icon: 'ClipboardCheck' },
  { id: 'zakat', label: 'Zakat', icon: 'Coins' },
  { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
];
