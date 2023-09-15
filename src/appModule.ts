import { Module } from '@nestjs/common';
import Db from './Db';
import { GoogleModule } from './Google';

@Module({
  imports: [
    Db,
    GoogleModule,
  ],})
export class AppModule {}
