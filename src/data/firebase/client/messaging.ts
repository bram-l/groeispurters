import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebase } from './app';

const messagingPublicKey =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_PUBLIC_KEY;
if (!messagingPublicKey)
  throw new Error('Missing env var: FIREBASE_MESSAGING_PUBLIC_KEY');

const messaging = getMessaging(firebase);

const tokenKey = 'fcm-token';

export async function initMessaging() {
  if (typeof window === 'undefined') return;

  const serviceWorker = await getServiceWorker();

  if (!serviceWorker) {
    console.log('No service worker registration found');
    return;
  }

  const currentToken = localStorage.getItem(tokenKey);

  if (!!currentToken) {
    console.log('Current token', currentToken);
    subscribe();
    return;
  }

  getToken(messaging, {
    vapidKey: messagingPublicKey,
    serviceWorkerRegistration: serviceWorker,
  })
    .then((token) => {
      if (token) {
        return handleToken(token);
      } else {
        console.log('No token');

        return requestPermission();
      }
    })
    .catch((error) => {
      console.log('An error occurred while retrieving token. ', error);
    });
}

async function handleToken(token: string) {
  console.log('Token', token);

  localStorage.setItem(tokenKey, token);

  await fetch('/api/notifications', {
    method: 'POST',
    body: JSON.stringify({
      token,
    }),
  });

  subscribe();
}

function requestPermission() {
  console.log('Requesting permission...');
  return Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.error('No notification permission granted.');
    }
  });
}

async function subscribe() {
  onMessage(messaging, (payload) => {
    console.log('Received foreground message ', payload);
  });
}

function getServiceWorker() {
  return navigator.serviceWorker.getRegistration('sw.js');
}
