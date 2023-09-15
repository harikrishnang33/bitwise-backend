import { Module } from '@nestjs/common';
import Db from './Db';

@Module({
  imports: [Db],
})
export class AppModule {}
