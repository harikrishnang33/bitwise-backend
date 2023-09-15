import { Module } from '@nestjs/common';
import Db from './Db';
import { GoogleModule } from './Google';
import { UserModule } from './User';
import { WorkspaceModule } from './Workspace';
import { TicketModule } from './Ticket';

@Module({
  imports: [Db, GoogleModule, UserModule, WorkspaceModule, TicketModule],
})
export class AppModule {}
