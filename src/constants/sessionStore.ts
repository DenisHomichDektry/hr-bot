import { Postgres } from '@telegraf/session/pg';
import { databaseCredentials } from './databaseCredentials';

export const store = Postgres({
  ...databaseCredentials,
});
