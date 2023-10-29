import { getMessaging } from 'firebase-admin/messaging';
import { app } from './app';

export async function sendNotification(
  tokens: string[],
  notification: Partial<Notification>
) {
  const messaging = getMessaging(app);

  await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title: 'Groeispurters 👯‍♀️',
      ...notification,
    },
  });
}
