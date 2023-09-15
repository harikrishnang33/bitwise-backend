import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CommonModule } from '../Common';
import { ConfigService } from '../Common/Config/configService';
import { DbConfig } from './Models/dbConfig';

export default TypeOrmModule.forRootAsync({
  imports: [CommonModule],
  inject: [ConfigService],
  async useFactory(config: ConfigService) {
    const { type, database, username, password, host, port, logging } =
      config.get<DbConfig>('db');
    return {
      type,
      host,
      port,
      database,
      username,
      password,
      entities: [`${__dirname}/../**/Entities/**{.ts,.js}`],
      synchronize: false,
      logging,
      namingStrategy: new SnakeNamingStrategy(),
      ssl: false,
    };
  },
} as TypeOrmModuleOptions);
