'use client';

import { useState } from 'react';
import { essentialDuas } from '@/lib/ramadan/constants';

type Props = { active: boolean };

export function DuasTab({ active }: Props) {
  const [duaFlash, setDuaFlash] = useState<number | null>(null);

  const copyDua = async (index: number, el: HTMLElement) => {
    const arabic = el.querySelector('.dua-arabic')?.textContent || '';
    const trans = el.querySelector('.dua-transliteration')?.textContent || '';
    const meaning = el.querySelector('.dua-meaning')?.textContent || '';
    try {
      await navigator.clipboard?.writeText(`${arabic}\n${trans}\n${meaning}`);
    } catch {
      /* ignore */
    }
    setDuaFlash(index);
    setTimeout(() => setDuaFlash(null), 600);
  };

  return (
    <div className={'tab-section' + (active ? ' active' : '')} id="tab-duas" role="tabpanel">
      <div className="section-title">🤲 Essential Ramadan Duas</div>
      <div className="dua-grid">
        {essentialDuas.map((dua, idx) => (
          <div
            key={idx}
            className="dua-item"
            style={duaFlash === idx ? { background: 'rgba(201,168,76,0.1)' } : undefined}
            onClick={(e) => copyDua(idx, e.currentTarget)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyDua(idx, e.currentTarget);
              }
            }}
          >
            <div className="dua-arabic">{dua.ar}</div>
            <div className="dua-transliteration">{dua.tr}</div>
            <div className="dua-meaning">{dua.me}</div>
            <div className="dua-occasion">{dua.oc}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 14, fontSize: '0.82rem', color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic' }}>
        Click any dua to copy to clipboard ✦
      </p>
    </div>
  );
}
