import { Module } from '@nestjs/common';
import AuthModule from '../Auth';
import { WorkspaceService } from './Services/WorkspaceService';
import { WorkspaceController } from './Controllers/WorkspaceController';
import { WorkspaceUsersService } from './Services/WorkspaceUsersService';

@Module({
  imports: [AuthModule],
  providers: [WorkspaceService, WorkspaceUsersService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
