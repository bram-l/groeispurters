import { Data } from '@/data/kv/data';
import { getMilkPerDay } from './milk';
import { parseLine } from './parse-line';
import { getStringPerDay } from './per-day';

export function parseText(input: string): Data {
  const lines = input
    .split(/\n/)
    .filter((line) => !!line.trim())
    .map(parseLine);

  return {
    milk: getMilkPerDay(lines),
    poo: getStringPerDay(lines, '💩'),
    diaper: getStringPerDay(lines, '🧷'),
    puke: getStringPerDay(lines, '🤮'),
  };
}
