import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import styles from './layout.module.css';
import { Auth } from './auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Groeispurters 👯‍♀️',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className={styles.main}>
          <Auth>{children}</Auth>
        </main>
      </body>
    </html>
  );
}
