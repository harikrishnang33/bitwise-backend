import { Module } from '@nestjs/common';
import Db from './Db';
import { GoogleModule } from './Google';
import { UserModule } from './User';
import { MessagesModule } from './BitwiseDocument';

@Module({
  imports: [
    Db,
    GoogleModule,
    UserModule,
    MessagesModule,
  ],})
export class AppModule {}
