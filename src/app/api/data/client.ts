import { createClient } from '@vercel/kv';

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

if (!url) throw new Error('Missing KV URL');
if (!token) throw new Error('Missing KV TOKEN');

export const client = createClient({
  url,
  token,
});
