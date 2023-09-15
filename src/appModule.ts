import { Module } from '@nestjs/common';
import Db from './Db';
import { GoogleModule } from './Google';
import { UserModule } from './User';
import { WorkspaceModule } from './Workspace';
import { TicketModule } from './Ticket';
import { MessagesModule } from './BitwiseDocument';

@Module({
  imports: [
    Db,
    GoogleModule,
    UserModule,
    WorkspaceModule,
    TicketModule,
    MessagesModule,
  ],
})
export class AppModule {}
