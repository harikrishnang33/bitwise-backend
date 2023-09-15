import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { formatResponse } from 'src/Common/Utils/formatResponse';
import { CreateWorkspaceDto } from '../Dto/CreateWorkspaceDto';
import { WorkspaceService } from '../Services/WorkspaceService';
import { AuthGuard } from '../../Auth/Guards/AuthGuard';
import { UpdateWorkspaceDto } from '../Dto/UpdateWorksapceDto';

@Controller('workspace')
@UseGuards(AuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(
    @Body() workspaceInput: CreateWorkspaceDto,
    @Req() request: any,
  ) {
    const result = await this.workspaceService.create(
      workspaceInput,
      request.user,
    );
    return formatResponse(result, 'Workspace created successfully');
  }

  @Patch('/:workspaceId')
  async update(
    @Body() workspaceInput: UpdateWorkspaceDto,
    @Param('workspaceId') workspaceId: string,
    @Req() request: any,
  ) {
    const result = await this.workspaceService.updateWorkspace(
      workspaceId,
      workspaceInput.emails,
    );
    return formatResponse(result, 'Workspace updated successfully');
  }

  @Get()
  async getAll(@Req() request: any) {
    const result = await this.workspaceService.getAllWorkspace(request.user);
    return formatResponse(result, 'Workspaces fetched successfully');
  }

  @Get(`/:id/all`)
  async getAllByWorkspaceId(@Param('id') workspaceId: string) {
    return formatResponse(
      await this.workspaceService.getAllByWorkspaceId(workspaceId),
    );
  }
}
