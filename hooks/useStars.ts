'use client';

import { useEffect, useState } from 'react';
import type { StarSpec } from '@/lib/ramadan/types';

export function useStars() {
  const [stars, setStars] = useState<StarSpec[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 80 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        dur: 2 + Math.random() * 4,
        delay: -Math.random() * 4,
      })),
    );
  }, []);

  return stars;
}
