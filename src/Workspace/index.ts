import { Module } from '@nestjs/common';
import AuthModule from '../Auth';
import { WorkspaceService } from './Services/WorkspaceService';
import { WorkspaceController } from './Controllers/WorkspaceController';
import { MessagesModule } from '../BitwiseDocument';
import { TicketModule } from '../Ticket';
import { LinkedNodeModule } from '../LinkedNodes';

@Module({
  imports: [AuthModule, MessagesModule, TicketModule, LinkedNodeModule],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
