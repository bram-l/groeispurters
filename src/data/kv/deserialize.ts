import { SerializedData, Data } from './data';

export const deserialize = (data?: Partial<SerializedData> | null): Data => {
  const defaults: Data = {
    milk: [],
    diaper: [],
    poo: [],
    puke: [],
  };

  return Object.entries(data ?? {}).reduce((previous, [key, value]) => {
    if (!value) return previous;

    return {
      ...previous,
      [key]: value.map((entry) => ({
        ...entry,
        date: new Date(entry.date),
      })),
    };
  }, defaults);
};
