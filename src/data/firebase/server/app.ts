import { credential } from 'firebase-admin';
import {
  ServiceAccount,
  getApp,
  getApps,
  initializeApp,
} from 'firebase-admin/app';

const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!privateKey) throw new Error('Missing env var: FIREBASE_PRIVATE_KEY');

const config: ServiceAccount = {
  projectId: 'groeispurters',
  privateKey,
  clientEmail: 'firebase-adminsdk-u0hll@groeispurters.iam.gserviceaccount.com',
};
const current = getApps()[0];

export const app =
  current ??
  initializeApp({
    credential: credential.cert(config),
  });
