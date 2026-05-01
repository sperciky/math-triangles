import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navigation from './components/Navigation';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trojúhelníky | Gymnázium — Trigonometrie',
  description: 'Interaktivní výuka trigonometrie pro 2. ročník gymnázia: goniometrické funkce, sinová a kosinová věta.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex antialiased">
        <Navigation />
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
