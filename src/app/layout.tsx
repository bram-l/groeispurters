import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import './globals.css';
import styles from './layout.module.css';
import { Auth } from './auth';
import { Menu } from '@/components/Menu';

const inter = Inter({ subsets: ['latin'] });

const title = 'Groeispurters';

export const metadata: Metadata = {
  applicationName: title,
  title,
  description: '',
  manifest: '/manifest.json',
  themeColor: '#000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title,
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Auth>
          <Menu />
          <main className={styles.main}>{children}</main>
        </Auth>
        <Analytics />
      </body>
    </html>
  );
}
