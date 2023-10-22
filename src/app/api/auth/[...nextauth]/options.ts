import GoogleProvider from 'next-auth/providers/google';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId) throw new Error('Missing Google Client ID env var');
if (!clientSecret) throw new Error('Missing Google Client Secret env var');

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
};
