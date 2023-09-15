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
  JWT_SECRET: getEnvValue('JWT_SECRET'),
  JWT_TOKEN_EXP_TIME: getEnvValue('JWT_TOKEN_EXP_TIME'),
  JWT_REFRESH_TOKEN_EXP_TIME: getEnvValue('JWT_REFRESH_TOKEN_EXP_TIME'),
  FE_BASE_URL: getEnvValue('FE_BASE_URL'),
  FE_SUCCESS_PATH: getEnvValue('FE_SUCCESS_PATH'),
};
