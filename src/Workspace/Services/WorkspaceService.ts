import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateWorkspaceDto } from '../Dto/CreateWorkspaceDto';
import { plainToClass } from 'class-transformer';
import { Workspace } from '../Entities/Workspace';
import EntityAlreadyExistError from '../../Common/Exception/EntityAlreadyExistError';

@Injectable()
export class WorkspaceService {
  private logger: Logger = new Logger(WorkspaceService.name);

  constructor(private readonly dataSource: DataSource) {}

  async create(workspaceDto: CreateWorkspaceDto) {
    const workspace: Workspace = plainToClass(Workspace, {
      ...workspaceDto,
      adminUserId: '00000000-0000-0000-0000-000000000000',
    });

    try {
      const savedWorkspace = await this.dataSource
        .getRepository(Workspace)
        .save(workspace);
      return savedWorkspace;
    } catch (error) {
      this.logger.error(`Error creating workspace | ${error.message}`);
      if (error.code === '23505') {
        throw new EntityAlreadyExistError(
          'Workspace with the same name already exists.',
        );
      }
    }
  }

  async getAllWorkspace() {
    return this.dataSource.getRepository(Workspace).findAndCount();
  }
}
