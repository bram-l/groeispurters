import { getMessaging } from 'firebase-admin/messaging';
import { app } from './app';

interface Data {
  title?: string;
  body: string;
}

export async function sendNotification(tokens: string[], data: Data) {
  const messaging = getMessaging(app);

  await messaging.sendEachForMulticast({
    tokens,
    data: {
      title: 'Groeispurters 👯‍♀️',
      ...data,
    },
  });
}
