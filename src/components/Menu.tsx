import Link from 'next/link';
import styles from './Menu.module.css';
import { Guard } from '@/app/auth';

export const Menu = () => {
  return (
    <Guard noFallback>
      <nav className={styles.nav}>
        <Link href="/milk">🍼</Link>
        <Link href="/diapers">🧷</Link>
        <Link href="/poo">💩</Link>
        <Link href="/puke">🤮</Link>
      </nav>
    </Guard>
  );
};
