import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';
import { addToken, getTokens } from '@/data/kv/messaging-tokens';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const tokens = await getTokens();

  return NextResponse.json({ tokens });
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

  await addToken(json.token);

  return NextResponse.json('ok');
}

const isValidJson = (json: unknown): json is SubscribeRequest => {
  if (!json || typeof json !== 'object') return false;

  return 'token' in json && typeof json.token === 'string';
};

interface SubscribeRequest {
  token: string;
}
