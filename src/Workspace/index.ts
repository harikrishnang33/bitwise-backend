import { Module } from '@nestjs/common';
import AuthModule from '../Auth';
import { WorkspaceService } from './Services/WorkspaceService';
import { WorkspaceController } from './Controllers/WorkspaceController';

@Module({
  imports: [AuthModule],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
