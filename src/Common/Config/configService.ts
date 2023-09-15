import { Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { configuration } from './appConfig';

export interface ConfigInterface {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  get<T extends any>(key: string, defaultValue?: T): T;
}

@Injectable()
export class ConfigService implements ConfigInterface {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}
  /**
   * Get a configuration value based on a configuration key. It is able to access
   * a deep nested value, by using dot notation for the configuration key.
   */

  get<T = any>(key: string, defaultValue: T | null = null): T | any {
    return get(configuration, key, defaultValue);
  }
}
