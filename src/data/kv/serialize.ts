import { Data, SerializedData } from './data';

export const serialize = (data: Data): SerializedData => {
  const defaults: SerializedData = {
    milk: [],
    diaper: [],
    poo: [],
    puke: [],
  };

  return Object.entries(data).reduce((previous, [key, value]) => {
    return {
      ...previous,
      [key]: value.map((entry) => ({
        ...entry,
        date: entry.date.toISOString(),
      })),
    };
  }, defaults);
};
