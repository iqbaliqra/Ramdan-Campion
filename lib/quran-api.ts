const QURAN_UTHMANI_URL = 'https://api.alquran.cloud/v1/quran/quran-uthmani';

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

export async function fetchFullQuranUthmani(signal?: AbortSignal): Promise<QuranSurah[]> {
  if (fullQuranCache) return fullQuranCache;
  if (fullQuranInflight) return fullQuranInflight;

  fullQuranInflight = (async () => {
    const res = await fetch(QURAN_UTHMANI_URL, { signal });
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
