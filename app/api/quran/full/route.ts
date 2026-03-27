import { NextResponse } from 'next/server';

const UPSTREAM = 'https://api.alquran.cloud/v1/quran/quran-uthmani';

/** Cache on Vercel / Next data layer — client hits same-origin /api to avoid browser CORS / blocking. */
export const revalidate = 86_400;

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, { next: { revalidate: 86_400 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}` },
        { status: 502 },
      );
    }
    const body = await res.json();
    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Quran fetch failed' }, { status: 500 });
  }
}
