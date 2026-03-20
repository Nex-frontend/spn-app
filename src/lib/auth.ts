import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';

import { db } from '../server/db';

// TODO: REVIEW THIS, IT SEEMS TO BE CAUSING PROBLEMS WITH VITE

export const auth = betterAuth({
  database: drizzleAdapter(db.spn, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  advanced: {
    cookiePrefix: 'spn',
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), reactStartCookies()],
});
