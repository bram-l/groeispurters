/// <reference lib="webworker" />

import { UpdateDataRequest } from '@/app/api/data/route';
import { firebase } from '@/data/firebase/client/app';
import { Data } from '@/data/kv/data';
import { serialize } from '@/data/kv/serialize';
import { Name } from '@/domain/name';

// https://github.com/microsoft/TypeScript/issues/14877
const worker = globalThis.self as unknown as ServiceWorkerGlobalScope;

import { MessagePayload, getMessaging } from 'firebase/messaging/sw';
import { onBackgroundMessage } from 'firebase/messaging/sw';
import { parseText } from '@/domain/parse-text';

const messaging = getMessaging(firebase);

worker.addEventListener('push', (event) => {
  event.waitUntil(handlePushEvent(event));
});

async function handlePushEvent(event: PushEvent) {
  const payload: MessagePayload = await event.data?.json();
  console.log('push', event, payload);

  const title = payload.data?.title ?? '';
  const tag = 'update';
  const options: NotificationOptions = {
    body: payload.data?.body,
    tag,
  };

  const current = await worker.registration.getNotifications({
    tag,
  });

  current.forEach((notification) => {
    notification.close();
  });

  await worker.registration.showNotification(title, options);
}

worker.addEventListener('notificationclick', (event) => {
  console.log('notificationclick', event);

  const urlToOpen = new URL('/', worker.location.origin).href;

  const promiseChain = worker.clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return worker.clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});

onBackgroundMessage(messaging, (payload) => {
  console.log('[worker/index.ts] Received background message ', payload);
});

worker.addEventListener('fetch', (event) => {
  if (!isShareRequest(event)) {
    return passthrough(event);
  }

  event.respondWith(
    (async () => {
      const formData = await event.request.formData();

      const name = parseName(formData);

      if (!name) return errorRedirect('invalid-name');

      const data = await parseData(name, formData);

      if (!data) return errorRedirect('invalid-file');

      const result = await fetch('/api/data', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
      }).catch((error) => {
        console.error(error);
      });

      if (!result) return errorRedirect('api-error');

      const message = await result.text();

      console.log(result.status, message);

      return Response.redirect('/', 303);
    })()
  );
});

function isShareRequest({ request }: FetchEvent) {
  return request.method === 'POST' && request.url.endsWith('/share');
}

function passthrough(event: FetchEvent) {
  event.respondWith(fetch(event.request));
}

function errorRedirect(reason: string) {
  const url = new URL('/share/error');

  url.searchParams.set('reason', reason);

  return Response.redirect(url, 303);
}

function parseName(input: FormData): Name | undefined {
  const title = input.get('title');

  if (!(typeof title === 'string')) return undefined;

  if (title.toLowerCase().includes('elsie')) return 'elsie';
  if (title.toLowerCase().includes('bette')) return 'bette';

  return undefined;
}

async function parseData(
  name: Name,
  input: FormData
): Promise<UpdateDataRequest | undefined> {
  const file = input.get('data');

  if (!(file instanceof File)) return undefined;

  const data = await parseFile(file);

  return {
    [name]: serialize(data),
  };
}

function parseFile(file: File): Promise<Data> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const text = e.target?.result;

      if (typeof text !== 'string') return reject(new Error('Invalid file'));

      const result = parseText(text);

      resolve(result);
    };

    fileReader.readAsText(file);
  });
}
