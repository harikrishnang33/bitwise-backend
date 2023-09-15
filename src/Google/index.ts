import { Module } from '@nestjs/common';
import { GoogleService } from './Services/GoogleService';
import { CommonModule } from 'src/Common';
import { GoogleController } from './Controllers/GoogleController';

@Module({
  imports: [CommonModule],
  controllers: [GoogleController],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}