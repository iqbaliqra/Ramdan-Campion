'use client';

import { TAB_ITEMS } from '@/lib/constants';
import type { TabId } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';

type Props = {
  tab: TabId;
  onTabChange: (id: TabId) => void;
};

export function TabBar({ tab, onTabChange }: Props) {
  return (
    <div className="tabs" role="tablist">
      {TAB_ITEMS.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          className={'tab-btn' + (tab === id ? ' active' : '')}
          onClick={() => onTabChange(id)}
        >
          <Icon name={icon} size={18} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
