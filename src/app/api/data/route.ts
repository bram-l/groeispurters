import { Data, SerializedData } from '@/domain/data';
import { Name } from '@/domain/name';
import { NextRequest, NextResponse } from 'next/server';
import { client } from './client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const bette = await client.get<Data>('bette');
  const elsie = await client.get<Data>('elsie');

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

  return NextResponse.json('ok');
}

const isValidJson = (json: unknown): json is Partial<Record<Name, Data>> => {
  if (!json || typeof json !== 'object') return false;

  if (Object.keys(json).length !== 2) return false;

  if (!('bette' in json) && !('elsie' in json)) return false;

  return true;
};
