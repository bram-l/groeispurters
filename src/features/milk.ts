import { isSameDay, isValid, parse, startOfDay } from 'date-fns';

export function getMilkPerDay(lines: Line[]): MilkEntry[] {
  const entries = getMilkEntries(lines);

  return entries.reduce((previous: MilkEntry[], current: MilkEntry) => {
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
        amount: last.amount + current.amount,
        date: last.date,
      },
    ];
  }, []);
}

export interface MilkEntry {
  amount: number;
  date: Date;
}

function getMilkEntries(lines: Line[]): MilkEntry[] {
  return lines.reduce((previous: MilkEntry[], { message, date }: Line) => {
    if (hasMilk(message)) {
      return [
        ...previous,
        {
          amount: getAmount(message),
          date,
        },
      ];
    }

    if (isAmend(message)) {
      const last = previous.pop();

      if (!last) return previous;

      return [
        ...previous,
        {
          amount: last.amount + getAmount(message),
          date: last.date,
        },
      ];
    }

    return previous;
  }, []);
}

interface Line {
  date: Date;
  person: string;
  message: string;
}

export function parseLine(input: string) {
  const [dateTimeString, rest] = splitFirst(input, ' - ');
  const [person, message] = splitFirst(rest, ': ');

  const date = parseDate(dateTimeString);

  if (!isValid(date)) throw new Error(`Invalid date: ${dateTimeString}`);

  return {
    date,
    person,
    message,
  };
}

const splitFirst = (input: string, separator: string) => {
  const [first, ...rest] = input.split(separator);

  return [first, rest.join(separator)];
};

const hasMilk = (input: string) => input.includes('🍼');
const isAmend = (input: string) => input.includes('+');
const getAmount = (input: string) => {
  const match = input.match(/\d+/);

  if (!match) return 0;

  return parseInt(match[0]);
};

const parseDate = (dateTimeString: string) =>
  parse(dateTimeString, 'M/d/y, HH:mm', new Date());
