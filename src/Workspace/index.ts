import { Module } from '@nestjs/common';
import AuthModule from '../Auth';
import { WorkspaceService } from './Services/WorkspaceService';
import { WorkspaceController } from './Controllers/WorkspaceController';
import { WorkspaceUsersService } from './Services/WorkspaceUsersService';
import { UserModule } from 'src/User';

@Module({
  imports: [AuthModule, UserModule],
  providers: [WorkspaceService, WorkspaceUsersService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
