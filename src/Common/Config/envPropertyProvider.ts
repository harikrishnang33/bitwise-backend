import dotenvSafe from 'dotenv-safe';
import path from 'path';

dotenvSafe.config({
  path: path.join(process.cwd(), '/.env'),
  example: path.join(process.cwd(), '/.env.template'),
});

const getEnvValue = (key: string, defaultValue: string = null): string => {
  if (typeof process.env[key] !== 'undefined') {
    return String(process.env[key]);
  }
  return defaultValue;
};

const getNumericValue = (key: string, defaultValue: number = null): number => {
  const value: string = getEnvValue(key);
  if (value != null) {
    const numericValue = Number(value);
    if (!Number.isNaN(numericValue)) {
      return numericValue;
    }
  }
  return defaultValue;
};

const getBooleanValue = (
  key: string,
  defaultValue: boolean = null,
): boolean => {
  const value: string = getEnvValue(key);
  return value != null ? value === 'true' : defaultValue;
};

export { getEnvValue, getNumericValue, getBooleanValue };
