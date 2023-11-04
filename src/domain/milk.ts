import { isToday } from 'date-fns';
import { Line, parseAmount } from './parse-line';
import { groupAmountPerDay, DateEntry } from './per-day';

export function getMilkPerDay(lines: Line[]): MilkEntry[] {
  const entries = getMilkEntries(lines);

  return groupAmountPerDay(entries);
}

export interface MilkEntry extends DateEntry {}

function getMilkEntries(lines: Line[]): MilkEntry[] {
  return lines.reduce((previous: MilkEntry[], { message, date }: Line) => {
    if (hasMilk(message)) {
      return [
        ...previous,
        {
          amount: parseAmount(message, /🍼(\d+)/),
          date,
        },
      ];
    }

    if (isMilkAmend(message)) {
      const last = previous.pop();

      if (!last) return previous;

      return [
        ...previous,
        {
          amount: last.amount + parseAmount(message, /\+(\d+)/),
          date: last.date,
        },
      ];
    }

    return previous;
  }, []);
}

const hasMilk = (input: string) => input.includes('🍼');
const isMilkAmend = (input: string) => input.includes('+');

export function getMilkAmountToday(input: MilkEntry[]) {
  const last = input.at(-1);

  return !!last && isToday(last.date) ? last.amount : '-';
}
