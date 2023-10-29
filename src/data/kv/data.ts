import { MilkEntry } from '../../domain/milk';

export interface Data {
  milk: MilkEntry[];
}

export interface SerializedMilkEntry extends Omit<MilkEntry, 'date'> {
  date: string;
}

export interface SerializedData {
  milk: SerializedMilkEntry[];
}
