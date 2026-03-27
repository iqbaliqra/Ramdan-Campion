'use client';

import { Check } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import type { IbadahItem } from '@/lib/types';

type Props = {
  items: IbadahItem[];
  doneIds: string[];
  onToggle: (id: string) => void;
};

export function TrackerItems({ items, doneIds, onToggle }: Props) {
  return (
    <>
      {items.map((item) => {
        const isDone = doneIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={'tracker-item' + (isDone ? ' done' : '')}
            onClick={() => onToggle(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggle(item.id);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="tracker-check">
              {isDone ? <Check size={14} strokeWidth={3} /> : null}
            </div>
            <div className="tracker-label">
              <Icon name={item.icon} size={18} />
              {item.label}
            </div>
          </div>
        );
      })}
    </>
  );
}
