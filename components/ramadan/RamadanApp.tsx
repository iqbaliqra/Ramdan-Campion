'use client';

import { useState } from 'react';
import { useIbadahTracker } from '@/hooks/useIbadahTracker';
import { useJuzRead } from '@/hooks/useJuzRead';
import { usePrayerSchedule } from '@/hooks/usePrayerSchedule';
import { useRamadanClock } from '@/hooks/useRamadanClock';
import { useStars } from '@/hooks/useStars';
import type { TabId } from '@/lib/ramadan/types';
import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import { StarsBackground } from './StarsBackground';
import { TabBar } from './TabBar';
import { CalendarTab } from './tabs/CalendarTab';
import { DuasTab } from './tabs/DuasTab';
import { HomeTab } from './tabs/HomeTab';
import { QuranTab } from './tabs/QuranTab';
import { TrackerTab } from './tabs/TrackerTab';
import { ZakatTab } from './tabs/ZakatTab';

export function RamadanApp() {
  const stars = useStars();
  const { nowTick, gregDate, hijriDate, currentTime } = useRamadanClock();
  const prayer = usePrayerSchedule();
  const { trackerDone, toggleItem, reset } = useIbadahTracker(nowTick);
  const { juzRead, toggleJuz } = useJuzRead();
  const [tab, setTab] = useState<TabId>('home');

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
          activePrayerIdx={prayer.activePrayerIdx}
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
