'use client';

import { MilkEntry } from '@/features/milk';
import { format, isSameDay } from 'date-fns';
import { FC } from 'react';
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
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line type="monotone" dataKey="bette" stroke="#b75415" />
          <Line type="monotone" dataKey="elsie" stroke="#5015b7" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
