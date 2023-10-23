import { MilkGraph } from './graph';
import { Guard } from './auth';
import Link from 'next/link';
import { client } from './api/data/client';
import { Data, SerializedData } from '../domain/data';
import { Button } from '@/components/button';

export default async function Home() {
  const { bette, elsie } = await getData();

  return (
    <Guard>
      <h2>🍼</h2>
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <MilkGraph bette={bette.milk} elsie={elsie.milk} />
      </div>
    </Guard>
  );
}

async function getData() {
  const elsie = await client.get<SerializedData>('elsie');
  const bette = await client.get<SerializedData>('bette');

  return {
    elsie: deserialize(elsie),
    bette: deserialize(bette),
  };
}

const deserialize = (data?: Partial<SerializedData> | null): Data => {
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
