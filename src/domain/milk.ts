import { isSameDay, isToday, isValid, parse, startOfDay } from 'date-fns';

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
const isMilkAmend = (input: string) => input.includes('+');

const parseAmount = (input: string, regex = /\d+/) => {
  const match = input.match(regex);

  if (!match) return 0;

  const value = match.length === 2 ? match[1] : match[0];

  return parseInt(value);
};

const parseDate = (dateTimeString: string) =>
  parse(dateTimeString, detectFormat(dateTimeString), new Date());

const detectFormat = (dateTimeString: string) =>
  dateTimeString.includes('-') ? 'dd-MM-y HH:mm' : 'M/d/yy, HH:mm';
export function getMilkAmountToday(input: MilkEntry[]) {
  const last = input.at(-1);

  return !!last && isToday(last.date) ? last.amount : '-';
}
