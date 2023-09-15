import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { formatResponse } from 'src/Common/Utils/formatResponse';
import { CreateWorkspaceDto } from '../Dto/CreateWorkspaceDto';
import { WorkspaceService } from '../Services/WorkspaceService';
import { AuthGuard } from '../../Auth/Guards/AuthGuard';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() workspaceInput: CreateWorkspaceDto,
    @Req() request: any,
  ) {
    const result = await this.workspaceService.create(
      workspaceInput,
      request.user.id,
    );
    return formatResponse(result, 'Workspace created successfully');
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Req() request: any) {
    const result = await this.workspaceService.getAllWorkspace();
    return formatResponse(result, 'Workspaces fetched successfully');
  }
}
