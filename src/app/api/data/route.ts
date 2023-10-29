import { SerializedData } from '@/data/kv/data';
import { Name } from '@/domain/name';
import { NextRequest, NextResponse } from 'next/server';
import { client } from '../../../data/kv/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { sendNotification } from '@/data/firebase/server/messaging';
import { getTokens } from '@/data/kv/messaging-tokens';
import { getMilkAmountToday } from '@/domain/milk';
import { deserialize } from '@/data/kv/deserialize';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const bette = await client.get<SerializedData>('bette');
  const elsie = await client.get<SerializedData>('elsie');

  return NextResponse.json({ bette, elsie });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const json = await req.json();

  if (!isValidJson(json))
    return NextResponse.json(
      { message: 'invalid request payload' },
      {
        status: 400,
      }
    );

  if (json.bette) {
    await client.set('bette', json.bette);
  }

  if (json.elsie) {
    await client.set('elsie', json.elsie);
  }

  await sendUpdateNotification(json);

  return NextResponse.json('ok');
}

export type UpdateDataRequest = Partial<Record<Name, SerializedData>>;

const isValidJson = (json: unknown): json is UpdateDataRequest => {
  if (!json || typeof json !== 'object') return false;

  if (!('bette' in json) && !('elsie' in json)) return false;

  return true;
};

async function sendUpdateNotification(update: UpdateDataRequest) {
  const tokens = await getTokens();

  const bette = deserialize(
    update.bette ?? (await client.get<SerializedData>('bette'))
  );
  const elsie = deserialize(
    update.elsie ?? (await client.get<SerializedData>('elsie'))
  );

  const message = [
    'Elsie: ' + getMilkAmountToday(elsie.milk),
    'Bette: ' + getMilkAmountToday(bette.milk),
  ].join(', ');

  await sendNotification(tokens, {
    body: '🍼 ' + message,
  });
}
