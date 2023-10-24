'use client';

import { FC } from 'react';
import { MilkEntry } from '@/domain/milk';
import styles from './page.module.css';
import { isToday } from 'date-fns';

export const MilkToday: FC<{ bette: MilkEntry[]; elsie: MilkEntry[] }> = ({
  bette,
  elsie,
}) => {
  return (
    <div className={styles.today}>
      <h4>VANDAAG</h4>
      <div>Elsie: {getAmountToday(elsie)}</div>
      <div>Bette: {getAmountToday(bette)}</div>
    </div>
  );
};

function getAmountToday(input: MilkEntry[]) {
  const last = input.at(-1);

  return !!last && isToday(last.date) ? last.amount : '-';
}
