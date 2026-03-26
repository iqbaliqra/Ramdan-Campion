'use client';

import { useEffect, useRef, useState } from 'react';
import { trackerKey } from '@/lib/ramadan/utils';

export function useIbadahTracker(nowTick: number) {
  const [trackerDone, setTrackerDone] = useState<string[]>([]);
  const lastTrackerKeyRef = useRef('');

  useEffect(() => {
    const key = trackerKey();
    if (lastTrackerKeyRef.current !== key) {
      lastTrackerKeyRef.current = key;
      setTrackerDone(JSON.parse(localStorage.getItem(key) || '[]'));
    }
  }, [nowTick]);

  const toggleItem = (id: string) => {
    setTrackerDone((prev) => {
      const state = [...prev];
      const i = state.indexOf(id);
      if (i === -1) state.push(id);
      else state.splice(i, 1);
      localStorage.setItem(trackerKey(), JSON.stringify(state));
      return state;
    });
  };

  const reset = () => {
    localStorage.setItem(trackerKey(), JSON.stringify([]));
    setTrackerDone([]);
  };

  return { trackerDone, toggleItem, reset };
}
