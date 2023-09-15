import { Module } from '@nestjs/common';
import { GoogleService } from './Services/GoogleService';
import { CommonModule } from 'src/Common';
import { GoogleController } from './Controllers/GoogleController';
import { UserModule } from '../User';
import AuthModule from '../Auth';

@Module({
  imports: [CommonModule, UserModule, AuthModule],
  controllers: [GoogleController],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
