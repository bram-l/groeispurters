'use client';

import { initMessaging } from '@/data/firebase/client/messaging';
import { useEffect } from 'react';

export const Messaging = () => {
  useEffect(() => {
    initMessaging();
  }, []);

  return null;
};
