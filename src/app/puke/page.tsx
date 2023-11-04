import { BarGraph } from '@/components/Graph';
import { Page } from '@/components/Page';
import { getData } from '@/data/kv/data';

const Puke = async () => {
  const { bette, elsie } = await getData();

  return (
    <Page title="🤮">
      <BarGraph bette={bette.puke} elsie={elsie.puke} />
    </Page>
  );
};

export default Puke;
