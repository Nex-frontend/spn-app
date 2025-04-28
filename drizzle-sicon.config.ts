import type { Config } from 'drizzle-kit';

import 'dotenv/config';

export default {
  out: './.drizzle-sicon',
  dialect: 'mysql',
  breakpoints: true,
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.SICON_BD_URL!,
  },
} as Config;
