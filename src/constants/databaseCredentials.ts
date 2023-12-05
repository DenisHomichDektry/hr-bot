import { config } from 'dotenv';

config();

export const databaseCredentials = {
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
} as const;
