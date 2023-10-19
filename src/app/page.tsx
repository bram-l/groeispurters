import styles from './page.module.css';
import { parseLine, getMilkPerDay } from '@/features/milk';
import { readFile } from 'fs/promises';
import { MilkGraph } from './graph';

export default async function Home() {
  const { bette, elsie } = await getData();

  return (
    <main className={styles.main}>
      <h2>🍼</h2>
      <MilkGraph bette={bette} elsie={elsie} />
    </main>
  );
}

type Daughter = 'bette' | 'elsie';

async function getData() {
  const data = {
    bette: await getDataFor('bette'),
    elsie: await getDataFor('elsie'),
  };

  return data;
}

async function getDataFor(daughter: Daughter) {
  const data = await readFile(process.cwd() + `/data/${daughter}.txt`, 'utf-8');

  const lines = data
    .split(/\n/)
    .filter((line) => !!line.trim())
    .map(parseLine);

  return getMilkPerDay(lines);
}
