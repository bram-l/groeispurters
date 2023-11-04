import { ReactNode } from 'react';
import styles from './Page.module.css';
import { Guard } from '@/app/auth';
import { Messaging } from './Messaging';

interface PageProps {
  title?: string;
  children?: ReactNode;
}

export const Page = ({ title, children }: PageProps) => {
  return (
    <Guard>
      <Messaging />
      <div className={styles.wrap}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
      </div>
    </Guard>
  );
};
