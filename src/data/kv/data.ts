import { DateEntry } from '@/domain/per-day';
import { MilkEntry } from '../../domain/milk';
import { Name } from '@/domain/name';
import { client } from './client';
import { deserialize } from './deserialize';

export type DataPerName = Record<Name, Data>;

export interface Data extends Record<string, DateEntry[]> {
  milk: MilkEntry[];
  diaper: DateEntry[];
  poo: DateEntry[];
  puke: DateEntry[];
}

export type SerializedEntry<T extends DateEntry> = Omit<T, 'date'> & {
  date: string;
};

type Serialized<T extends Record<string, DateEntry[]>> = {
  [P in keyof T]: SerializedEntry<T[P][0]>[];
};

export type SerializedData = Serialized<Data>;

export async function getData(): Promise<DataPerName> {
  const elsie = await client.get<SerializedData>('elsie');
  const bette = await client.get<SerializedData>('bette');

  return {
    elsie: deserialize(elsie),
    bette: deserialize(bette),
  };
}
