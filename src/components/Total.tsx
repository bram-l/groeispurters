'use client';

import { DateEntry } from '@/domain/per-day';
import { getDateRange } from '@/domain/date-range';
import styles from './Total.module.css';

interface TotalProps {
  bette: DateEntry[];
  elsie: DateEntry[];
}

export const Total = ({ bette, elsie }: TotalProps) => {
  const totalBette = getTotal(bette);
  const totalElsie = getTotal(elsie);
  const total = totalElsie + totalBette;

  const { days } = getDateRange(bette, elsie);

  const bettePerDay = (totalBette / days).toFixed(1);
  const elsiePerDay = (totalElsie / days).toFixed(1);
  const totalPerDay = (total / days).toFixed(1);

  return (
    <div className={styles.total}>
      <div>
        Elsie: {totalElsie} ({elsiePerDay}/dag)
      </div>
      <div>
        Bette: {totalBette} ({bettePerDay}/dag)
      </div>
      <div>
        Samen: {totalElsie + totalBette} ({totalPerDay}/dag)
      </div>
    </div>
  );
};

const getTotal = (entries: DateEntry[]) => {
  return entries.reduce(
    (previous: number, current) => previous + current.amount,
    0
  );
};
