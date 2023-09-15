import { Module } from '@nestjs/common';
import Db from './Db';
import { UserModule } from './User';
import { GoogleModule } from './Google';
import { WorkspaceModule } from './Workspace';

@Module({
  imports: [Db, UserModule, GoogleModule, WorkspaceModule],
})
export class AppModule {}
