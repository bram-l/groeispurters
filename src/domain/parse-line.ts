import { isValid, parse } from 'date-fns';
import { DateEntry } from './per-day';

export interface Line {
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

export const parseAmount = (input: string, regex = /\d+/) => {
  const match = input.match(regex);

  if (!match) return 0;

  const value = match.length === 2 ? match[1] : match[0];

  return parseInt(value);
};

const parseDate = (dateTimeString: string) =>
  parse(dateTimeString, detectFormat(dateTimeString), new Date());

const detectFormat = (dateTimeString: string) =>
  dateTimeString.includes('-') ? 'dd-MM-y HH:mm' : 'M/d/yy, HH:mm';

export function getEntriesWithString(
  lines: Line[],
  search: string
): DateEntry[] {
  return lines.reduce((previous: DateEntry[], { message, date }: Line) => {
    if (message.includes(search)) {
      return [
        ...previous,
        {
          amount: 1,
          date,
        },
      ];
    }

    return previous;
  }, []);
}
