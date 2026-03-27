'use client';

import type { StarSpec } from '@/lib/types';

type Props = { stars: StarSpec[] };

export function StarsBackground({ stars }: Props) {
  return (
    <div className="stars" aria-hidden>
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.left}%`,
            top: `${s.top}%`,
            ['--dur' as string]: `${s.dur}s`,
            ['--delay' as string]: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
