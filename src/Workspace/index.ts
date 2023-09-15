import { Module } from '@nestjs/common';
import AuthModule from '../Auth';
import { WorkspaceService } from './Services/WorkspaceService';
import { WorkspaceController } from './Controllers/WorkspaceController';
import { WorkspaceUsersService } from './Services/WorkspaceUsersService';
import { UserModule } from 'src/User';
import { MessagesModule } from '../BitwiseDocument';
import { TicketModule } from '../Ticket';
import { LinkedNodeModule } from '../LinkedNodes';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MessagesModule,
    TicketModule,
    LinkedNodeModule,
  ],
  providers: [WorkspaceService, WorkspaceUsersService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
