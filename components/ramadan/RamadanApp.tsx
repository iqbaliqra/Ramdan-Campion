'use client';

import { useEffect, useState } from 'react';
import { useIbadahTracker } from '@/hooks/useIbadahTracker';
import { useJuzRead } from '@/hooks/useJuzRead';
import { usePrayerSchedule } from '@/hooks/usePrayerSchedule';
import { useRamadanClock } from '@/hooks/useRamadanClock';
import { useStars } from '@/hooks/useStars';
import { fetchFullQuranUthmani } from '@/lib/quran-api';
import type { TabId } from '@/lib/types';
import { AppFooter } from './layout/AppFooter';
import { AppHeader } from './layout/AppHeader';
import { StarsBackground } from './layout/StarsBackground';
import { TabBar } from './layout/TabBar';
import { CalendarTab } from './features/calendar/CalendarTab';
import { DuasTab } from './features/duas/DuasTab';
import { HomeTab } from './features/home/HomeTab';
import { QuranTab } from './features/quran/QuranTab';
import { TrackerTab } from './features/tracker/TrackerTab';
import { ZakatTab } from './features/zakat/ZakatTab';

export function RamadanApp() {
  const stars = useStars();
  const { nowTick, gregDate, hijriDate, currentTime } = useRamadanClock();
  const prayer = usePrayerSchedule();
  const { trackerDone, toggleItem, reset } = useIbadahTracker(nowTick);
  const { juzRead, toggleJuz } = useJuzRead();
  const [tab, setTab] = useState<TabId>('home');

  useEffect(() => {
    void fetchFullQuranUthmani();
  }, []);

  return (
    <>
      <StarsBackground stars={stars} />

      <div className="app">
        <AppHeader gregDate={gregDate} hijriDate={hijriDate} currentTime={currentTime} />

        <div className="ornament">✦ ✦ ✦</div>

        <TabBar tab={tab} onTabChange={setTab} />

        <HomeTab
          active={tab === 'home'}
          prayerData={prayer.prayerData}
          userCity={prayer.userCity}
          userCountry={prayer.userCountry}
          nextEvent={prayer.nextEvent}
          countH={prayer.countH}
          countM={prayer.countM}
          countS={prayer.countS}
          nextPrayerIdx={prayer.nextPrayerIdx}
          trackerDone={trackerDone}
          onToggleTracker={toggleItem}
        />

        <QuranTab active={tab === 'quran'} juzRead={juzRead} onToggleJuz={toggleJuz} />

        <DuasTab active={tab === 'duas'} />

        <TrackerTab
          active={tab === 'tracker'}
          trackerDone={trackerDone}
          onToggleTracker={toggleItem}
          onResetTracker={reset}
        />

        <ZakatTab active={tab === 'zakat'} />

        <CalendarTab active={tab === 'calendar'} />
      </div>

      <AppFooter />
    </>
  );
}
