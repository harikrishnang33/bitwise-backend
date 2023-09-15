import { getEnvValue, getNumericValue } from './envPropertyProvider';

export const configuration = {
  server: {
    port: getNumericValue('SERVER_PORT'),
    env: getEnvValue('ENVIRONMENT'),
  },
  db: {
    type: 'postgres',
    database: getEnvValue('DB_NAME'),
    username: getEnvValue('DB_USER'),
    password: getEnvValue('DB_PASSWORD'),
    host: getEnvValue('DB_HOST'),
    port: getNumericValue('DB_PORT'),
    logging: true,
  },
};
