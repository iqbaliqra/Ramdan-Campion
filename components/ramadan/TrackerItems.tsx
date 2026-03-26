'use client';

import type { IbadahItem } from '@/lib/ramadan/types';

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
            <div className="tracker-check">{isDone ? '✓' : ''}</div>
            <div className="tracker-label">
              {item.icon} {item.label}
            </div>
          </div>
        );
      })}
    </>
  );
}
