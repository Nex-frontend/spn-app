import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

import 'dotenv/config';

const pool = mysql.createPool(process.env.SICON_BD_URL!);

const db_sicon = drizzle(pool, { schema, mode: 'default' });


export { db_sicon };
