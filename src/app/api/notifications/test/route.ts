import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { getTokens } from '@/data/kv/messaging-tokens';
import { NextResponse } from 'next/server';
import { sendNotification } from '@/data/firebase/server/messaging';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const tokens = await getTokens();

  await sendNotification(tokens, {
    body: 'test: ' + new Date().toLocaleTimeString(),
  });

  return NextResponse.json('ok');
}
