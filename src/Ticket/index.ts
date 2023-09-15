import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Common';
import { TicketService } from './Services/TicketService';
import { TicketController } from './Controllers/TicketController';

@Module({
  imports: [CommonModule],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
