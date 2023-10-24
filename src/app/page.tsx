import { MilkGraph } from './graph';
import { Guard } from './auth';
import { client } from './api/data/client';
import { Data, SerializedData } from '../domain/data';
import styles from './page.module.css';
import { MilkToday } from './today';

export default async function Home() {
  const { bette, elsie } = await getData();

  return (
    <Guard>
      <div className={styles.wrap}>
        <h2 className={styles.title}>🍼</h2>
        <MilkToday bette={bette.milk} elsie={elsie.milk} />
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
