import { initializeApp } from 'firebase/app';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!apiKey) throw new Error('Missing env var: FIREBASE_API_KEY');

const firebaseConfig = {
  apiKey,
  authDomain: 'groeispurters.firebaseapp.com',
  projectId: 'groeispurters',
  storageBucket: 'groeispurters.appspot.com',
  messagingSenderId: '47224855041',
  appId: '1:47224855041:web:acd34ab1131dee079ebe00',
};

export const firebase = initializeApp(firebaseConfig);
