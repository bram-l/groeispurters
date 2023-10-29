import { client } from './client';

const key = 'fcm-tokens';

export async function addToken(token: string) {
  await client.sadd(key, token);
}

export async function getTokens() {
  return client.smembers(key);
}
