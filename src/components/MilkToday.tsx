'use client';

import { MilkEntry, getMilkAmountToday } from '@/domain/milk';
import styles from './MilkToday.module.css';

interface MilkTodayProps {
    bette: MilkEntry[];
    elsie: MilkEntry[];
}

export const MilkToday = ({
    bette,
    elsie,
  }: MilkTodayProps) => {
    return (
      <div className={styles.today}>
        <h4>VANDAAG</h4>
        <div>Elsie: {getMilkAmountToday(elsie)}</div>
        <div>Bette: {getMilkAmountToday(bette)}</div>
      </div>
    );
  };