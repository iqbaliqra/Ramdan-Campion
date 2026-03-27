'use client';

import { useEffect, useState } from 'react';

export function useJuzRead() {
  const [juzRead, setJuzRead] = useState<number[]>([]);

  useEffect(() => {
    try {
      setJuzRead(JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('juzRead') || '[]' : '[]'));
    } catch {
      setJuzRead([]);
    }
  }, []);

  const toggleJuz = (n: number) => {
    setJuzRead((prev) => {
      const list = [...prev];
      const idx = list.indexOf(n);
      if (idx === -1) list.push(n);
      else list.splice(idx, 1);
      localStorage.setItem('juzRead', JSON.stringify(list));
      return list;
    });
  };

  return { juzRead, toggleJuz };
}
