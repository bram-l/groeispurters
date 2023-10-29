import { Data, SerializedData } from './data';

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
