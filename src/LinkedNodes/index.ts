import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Common';
import { LinkedNodeService } from './Services/LinkedNodeService';

@Module({
  imports: [CommonModule],
  providers: [LinkedNodeService],
  controllers: [],
  exports: [LinkedNodeService],
})
export class LinkedNodeModule {}
