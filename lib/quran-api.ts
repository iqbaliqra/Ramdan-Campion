const QURAN_UPSTREAM = 'https://api.alquran.cloud/v1/quran/quran-uthmani';

/** Browser uses same-origin API route (reliable on Vercel); server falls back to upstream. */
function quranFetchUrl(): string {
  if (typeof window !== 'undefined') return '/api/quran/full';
  return QURAN_UPSTREAM;
}

export type QuranAyah = {
  number: number;
  text: string;
  numberInSurah: number;
  juz?: number;
  page?: number;
};

export type QuranSurah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: QuranAyah[];
};

export type QuranApiResponse = {
  code: number;
  status: string;
  data: {
    surahs: QuranSurah[];
  };
};

let fullQuranCache: QuranSurah[] | null = null;
let fullQuranInflight: Promise<QuranSurah[]> | null = null;

/** Synchronous read of prefetched data (e.g. after app-start fetch). */
export function getCachedFullQuran(): QuranSurah[] | null {
  return fullQuranCache;
}

export async function fetchFullQuranUthmani(signal?: AbortSignal): Promise<QuranSurah[]> {
  if (fullQuranCache) return fullQuranCache;
  if (fullQuranInflight) return fullQuranInflight;

  fullQuranInflight = (async () => {
    const res = await fetch(quranFetchUrl(), { signal });
    if (!res.ok) throw new Error(`Quran API: ${res.status}`);
    const json: QuranApiResponse = await res.json();
    if (json.code !== 200 || !json.data?.surahs?.length) {
      throw new Error(json.status || 'Invalid Quran response');
    }
    fullQuranCache = json.data.surahs;
    return fullQuranCache;
  })();

  try {
    return await fullQuranInflight;
  } finally {
    fullQuranInflight = null;
  }
}
