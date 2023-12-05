import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { databaseCredentials } from './databaseCredentials';

export const ormSource: TypeOrmModuleOptions & PostgresConnectionOptions = {
  type: 'postgres',
  host: databaseCredentials.host,
  port: databaseCredentials.port,
  username: databaseCredentials.user,
  password: databaseCredentials.password,
  database: databaseCredentials.database,
  autoLoadEntities: true,
  synchronize: false,
};

export const dataSource = new DataSource({
  ...ormSource,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
});
