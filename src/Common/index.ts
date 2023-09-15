import { Module } from '@nestjs/common';
import { ConfigService } from './Config/configService';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class CommonModule {}
