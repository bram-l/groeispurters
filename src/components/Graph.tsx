'use client';

import { MilkEntry } from '@/domain/milk';
import { add, differenceInDays, format, isSameDay, max, min } from 'date-fns';
import styles from './Graph.module.css';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { DateEntry } from '@/domain/per-day';

interface BarGraphProps {
  bette: DateEntry[];
  elsie: DateEntry[];
}

export const BarGraph = ({ bette, elsie }: BarGraphProps) => {
  const data = makeGraphData({ bette, elsie });

  if (!data.length) return;

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bette" stackId="a" fill="#5015b7" />
          <Bar dataKey="elsie" stackId="a" fill="#b75415" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MilkGraphProps {
  bette: MilkEntry[];
  elsie: MilkEntry[];
}

export const MilkGraph = ({ bette, elsie }: MilkGraphProps) => {
  const data = makeGraphData({ bette, elsie });

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

const makeGraphData = ({ bette, elsie }: BarGraphProps) => {
  const dates = bette
    .map(({ date }) => date)
    .concat(elsie.map(({ date }) => date));

  const start = min(dates);
  const end = max(dates);

  const days = differenceInDays(end, start) + 2;

  console.log({ start, end, days });

  return new Array(days).fill({}).map((_, index) => {
    const date = add(start, {
      days: index,
    });

    return {
      date: format(date, 'd MMM'),
      bette: bette.find((it) => isSameDay(it.date, date))?.amount,
      elsie: elsie.find((it) => isSameDay(it.date, date))?.amount,
    };
  });
};
