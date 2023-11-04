import { BarGraph } from '@/components/Graph';
import { Page } from '@/components/Page';
import { getData } from '@/data/kv/data';

const Poo = async () => {
  const { bette, elsie } = await getData();

  return (
    <Page title="💩">
      <BarGraph bette={bette.poo} elsie={elsie.poo} />
    </Page>
  );
};

export default Poo;
