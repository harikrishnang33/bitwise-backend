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
      adminUserId: '54087a6f-b78a-4e97-a6a7-70f0db52d799',
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
