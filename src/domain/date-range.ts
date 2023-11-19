import { differenceInDays, max, min } from 'date-fns';
import { DateEntry } from '@/domain/per-day';

interface DateRange {
  start: Date;
  end: Date;
  days: number;
}

export function getDateRange(
  bette: DateEntry[],
  elsie: DateEntry[]
): DateRange {
  const dates = bette
    .map(({ date }) => date)
    .concat(elsie.map(({ date }) => date));

  const start = min(dates);
  const end = max(dates);

  const days = differenceInDays(end, start) + 2;

  return { start, end, days };
}
