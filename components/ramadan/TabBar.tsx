'use client';

import { TAB_ITEMS } from '@/lib/ramadan/constants';
import type { TabId } from '@/lib/ramadan/types';

type Props = {
  tab: TabId;
  onTabChange: (id: TabId) => void;
};

export function TabBar({ tab, onTabChange }: Props) {
  return (
    <div className="tabs" role="tablist">
      {TAB_ITEMS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          className={'tab-btn' + (tab === id ? ' active' : '')}
          onClick={() => onTabChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
