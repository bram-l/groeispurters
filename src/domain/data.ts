'use client';
import { MilkEntry } from './milk';

export type Data = MilkEntry[];

export interface SerializedMilkEntry extends Omit<MilkEntry, 'date'> {
  date: string;
}

export type SerializedData = SerializedMilkEntry[];

export const serialize = (data: Data): SerializedData => {
  return data.map((entry) => ({
    ...entry,
    date: entry.date.toISOString(),
  }));
};
