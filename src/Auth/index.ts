import { Module } from '@nestjs/common';
import TokenService from './Services/TokenService';
import { CommonModule } from '../Common';

@Module({
  imports: [CommonModule],
  exports: [TokenService],
  providers: [TokenService],
})
export default class AuthModule {}
