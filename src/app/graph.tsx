'use client';

import { MilkEntry } from '@/domain/milk';
import { format, isSameDay } from 'date-fns';
import { FC } from 'react';
import styles from './graph.module.css';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
} from 'recharts';

export const MilkGraph: FC<{ bette: MilkEntry[]; elsie: MilkEntry[] }> = ({
  bette,
  elsie,
}) => {
  const data = bette.map(({ date, amount }) => ({
    date: format(date, 'd MMM'),
    bette: amount,
    elsie: elsie.find((it) => isSameDay(it.date, date))?.amount ?? 0,
  }));

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line type="monotone" dataKey="bette" stroke="#5015b7" />
          <Line type="monotone" dataKey="elsie" stroke="#b75415" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
