import { BarGraph } from '@/components/Graph';
import { Page } from '@/components/Page';
import { Total } from '@/components/Total';
import { getData } from '@/data/kv/data';

const Poo = async () => {
  const { bette, elsie } = await getData();

  return (
    <Page title="💩">
      <Total bette={bette.poo} elsie={elsie.poo} />
      <BarGraph bette={bette.poo} elsie={elsie.poo} />
    </Page>
  );
};

export default Poo;
