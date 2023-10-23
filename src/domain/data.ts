'use client';
import { MilkEntry } from './milk';

export interface Data {
  milk: MilkEntry[];
}

export interface SerializedMilkEntry extends Omit<MilkEntry, 'date'> {
  date: string;
}

export interface SerializedData {
  milk: SerializedMilkEntry[];
}

export const serialize = (data: Data): SerializedData => {
  const { milk } = data;

  return {
    ...data,
    milk: milk.map((entry) => ({
      ...entry,
      date: entry.date.toISOString(),
    })),
  };
};
