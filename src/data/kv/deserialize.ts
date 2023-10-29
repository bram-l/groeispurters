import { SerializedData, Data } from './data';

export const deserialize = (data?: Partial<SerializedData> | null): Data => {
  if (!data || !data.milk) return { milk: [] };

  const { milk } = data;
  return {
    ...data,
    milk: milk.map((entry) => ({
      ...entry,
      date: new Date(entry.date),
    })),
  };
};
