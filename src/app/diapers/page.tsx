import { BarGraph } from '@/components/Graph';
import { Page } from '@/components/Page';
import { Total } from '@/components/Total';
import { getData } from '@/data/kv/data';

const Diapers = async () => {
  const { bette, elsie } = await getData();

  return (
    <Page title="🧷">
      <Total bette={bette.diaper} elsie={elsie.diaper} />
      <BarGraph bette={bette.diaper} elsie={elsie.diaper} />
    </Page>
  );
};

export default Diapers;
