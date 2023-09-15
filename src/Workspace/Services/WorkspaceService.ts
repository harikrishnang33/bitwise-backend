import { Injectable, Logger } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { CreateWorkspaceDto } from '../Dto/CreateWorkspaceDto';
import { plainToClass } from 'class-transformer';
import { Workspace } from '../Entities/Workspace';
import EntityAlreadyExistError from '../../Common/Exception/EntityAlreadyExistError';
import { User } from '../../User/Entities/User';
import { WorkspaceUsersService } from './WorkspaceUsersService';

@Injectable()
export class WorkspaceService {
  private logger: Logger = new Logger(WorkspaceService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly workspaceUsersService: WorkspaceUsersService,
  ) {}

  async create(workspaceDto: CreateWorkspaceDto, user: User) {
    const workspace: Workspace = plainToClass(Workspace, {
      ...workspaceDto,
      adminUserId: user.id,
    });

    try {
      const savedWorkspace = await this.dataSource
        .getRepository(Workspace)
        .save(workspace);
      await this.workspaceUsersService.createWorkspaceUsers(savedWorkspace.id, [
        user.id,
      ]);
      if (workspaceDto.emails && workspaceDto.emails.length > 0) {
        await this.workspaceUsersService.createWorkspaceUsersFromEmailIds(
          savedWorkspace.id,
          workspaceDto.emails,
        );
      }
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

  async updateWorkspace(workspaceId: string, emails: string[]) {
    this.workspaceUsersService.update(workspaceId, emails);
  }

  async getAllWorkspace() {
    return this.dataSource.getRepository(Workspace).findAndCount({
      where: { deletedAt: null },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }
}
