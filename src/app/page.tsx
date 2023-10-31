import { MilkGraph } from './graph';
import { Guard } from './auth';
import { client } from '../data/kv/client';
import { SerializedData } from '../data/kv/data';
import styles from './page.module.css';
import { MilkToday } from './today';
import { Messaging } from './messaging';
import { deserialize } from '@/data/kv/deserialize';

export default async function Home() {
  const { bette, elsie } = await getData();

  return (
    <Guard>
      <Messaging />
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
