/// <reference lib="webworker" />

import { UpdateDataRequest } from '@/app/api/data/route';
import { Data, serialize } from '@/domain/data';
import { getMilkPerDay, parseLine } from '@/domain/milk';
import { Name } from '@/domain/name';

// https://github.com/microsoft/TypeScript/issues/14877
const worker = globalThis.self as unknown as ServiceWorkerGlobalScope;

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

function parseText(input: string) {
  const lines = input
    .split(/\n/)
    .filter((line) => !!line.trim())
    .map(parseLine);

  const milk = getMilkPerDay(lines);

  return { milk };
}
