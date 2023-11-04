import { Page } from '@/components/Page';
import { MilkGraph } from '@/components/Graph';
import { MilkToday } from '@/components/MilkToday';
import { getData } from '@/data/kv/data';

const Milk = async () => {
  const { bette, elsie } = await getData();

  return (
    <>
      <Page title="🍼">
        <MilkToday bette={bette.milk} elsie={elsie.milk} />
        <MilkGraph bette={bette.milk} elsie={elsie.milk} />
      </Page>
    </>
  );
};



export default Milk;
