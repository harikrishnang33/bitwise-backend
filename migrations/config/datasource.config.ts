import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSourceOptions } from 'typeorm';
import { configuration } from '../../src/Common/Config/appConfig';

const { type, host, port, username, password, database } = configuration.db;

const migrationConfig = {
  type,
  host,
  port,
  username,
  password,
  database,
  migrations: ['dist/migrations/scripts/*.js'],
  entities: ['dist/src/**/Entities/*.js'],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  ssl: false,
} as DataSourceOptions;

export default migrationConfig;
