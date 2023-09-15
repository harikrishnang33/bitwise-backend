import { Module } from '@nestjs/common';
import Db from './Db';
import { GoogleModule } from './Google';
import { UserModule } from './User';

@Module({
  imports: [Db, GoogleModule, UserModule],
})
export class AppModule {}
