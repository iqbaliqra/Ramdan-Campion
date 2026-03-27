import type { Metadata } from 'next';
import {
  Cinzel_Decorative,
  Crimson_Pro,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';

const cinzelDecorative = Cinzel_Decorative({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-cinzel',
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'Ramadan Companion',
  description:
    'Ramadan companion: prayer times, verse of the day, duas, ibadah tracker, zakat calculator, and calendar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cinzelDecorative.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}
        suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
