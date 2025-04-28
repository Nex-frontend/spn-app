import type { Config } from 'drizzle-kit';

// dotenv.config();

import 'dotenv/config';

export default {
  schema: './src/server/db/spn/schema.ts',
  out: './.drizzle',
  dialect: 'postgresql',
  breakpoints: true,
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.SPN_BD_URL!,
    // url: "postgresql://postgres:postgres@localhost:5432/test_db"
  },
} as Config;
