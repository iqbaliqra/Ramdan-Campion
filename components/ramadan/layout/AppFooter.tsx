'use client';

import { Heart } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="app-footer">
      Built with <Heart size={13} fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }} /> for <span>RamadanHacks</span> · ummah.build · <span>رمضان كريم</span>
    </footer>
  );
}
