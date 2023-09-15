import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Common';
import { UserService } from './Services/UserService';
import { UserController } from './Controllers/UserController';

@Module({
  imports: [CommonModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
