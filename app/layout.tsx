import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Suyash Pandey — AI & Data Science Student, Developer, Builder',
  description:
    'A scroll-driven portfolio by Suyash Pandey: AI & Data Science student, developer and builder of intelligent digital experiences.',
  openGraph: {
    title: 'Suyash Pandey — AI, Data & Creative Technology',
    description:
      'I build intelligent digital experiences by combining AI, technology, design, and experimentation.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#07080c',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
