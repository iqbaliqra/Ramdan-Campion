export type TabId = 'home' | 'quran' | 'duas' | 'tracker' | 'zakat' | 'calendar';

export type PrayerTimings = Record<string, string>;

export type StarSpec = {
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
};

export type Verse = { arabic: string; translation: string; ref: string };

export type IbadahItem = { id: string; label: string; icon: string };

export type EssentialDua = { ar: string; tr: string; me: string; oc: string };

export type TabItem = { id: TabId; label: string; icon: string };
