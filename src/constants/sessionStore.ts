import { Postgres } from '@telegraf/session/pg';
import { config } from 'dotenv';
config();

export const store = Postgres({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});
