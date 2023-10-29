'use client';

import { FC } from 'react';
import { MilkEntry } from '@/domain/milk';
import styles from './page.module.css';
import { getMilkAmountToday } from '@/domain/milk';

export const MilkToday: FC<{ bette: MilkEntry[]; elsie: MilkEntry[] }> = ({
  bette,
  elsie,
}) => {
  return (
    <div className={styles.today}>
      <h4>VANDAAG</h4>
      <div>Elsie: {getMilkAmountToday(elsie)}</div>
      <div>Bette: {getMilkAmountToday(bette)}</div>
    </div>
  );
};
