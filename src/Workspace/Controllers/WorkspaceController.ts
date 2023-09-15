import { Body, Controller, Get, Post } from '@nestjs/common';
import { formatResponse } from 'src/Common/Utils/formatResponse';
import { CreateWorkspaceDto } from '../Dto/CreateWorkspaceDto';
import { WorkspaceService } from '../Services/WorkspaceService';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Body() workspaceInput: CreateWorkspaceDto) {
    const result = await this.workspaceService.create(workspaceInput);
    return formatResponse(result, 'Workspace created successfully');
  }

  @Get()
  async getAll() {
    const result = await this.workspaceService.getAllWorkspace();
    return formatResponse(result, 'Workspaces fetched successfully');
  }
}
