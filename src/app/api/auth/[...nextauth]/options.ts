import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId) throw new Error('Missing Google Client ID env var');
if (!clientSecret) throw new Error('Missing Google Client Secret env var');

const emailAllowList = [
  'info@bramloogman.nl',
  'bramloogman@gmail.com',
  'aaltjekramer@gmail.com',
];

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  callbacks: {
    signIn({ user }) {
      console.log('Sign in', user);
      return !!user.email && emailAllowList.includes(user.email);
    },
  },
};
