import { isSameDay, startOfDay } from 'date-fns';
import { Line, getEntriesWithString } from './parse-line';

export interface DateEntry {
  date: Date;
  amount: number;
}

export function getStringPerDay(lines: Line[], search: string): DateEntry[] {
  const entries = getEntriesWithString(lines, search);

  return groupAmountPerDay(entries);
}

export function groupAmountPerDay<T extends DateEntry>(entries: T[]): T[] {
  return entries.reduce((previous: T[], current: T): T[] => {
    const last = previous.pop();

    if (!last) return [current];

    if (!isSameDay(last.date, current.date))
      return [
        ...previous,
        last,
        {
          ...current,
          date: startOfDay(current.date),
        },
      ];

    return [
      ...previous,
      {
        ...current,
        amount: last.amount + current.amount,
        date: last.date,
      },
    ];
  }, []);
}
