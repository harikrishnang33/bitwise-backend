import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial } from 'typeorm';
import { WorkspaceUsers } from '../Entities/WorkspaceUsers';
import { User } from 'src/User/Entities/User';
import { UserService } from 'src/User/Services/UserService';
import { itemsToAddAndRemove } from 'src/Common/Utils/ItemsToAddAndRemove';

@Injectable()
export class WorkspaceUsersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
  ) {}

  async getWorkspaceUser(workspaceId: string) {
    return this.dataSource
      .getRepository(WorkspaceUsers)
      .createQueryBuilder('workSpaceUser')
      .innerJoin(User, 'user', 'workSpaceUser.userId = user.id')
      .where('workSpaceUser.workspaceId = :workspaceId', { workspaceId })
      .getMany();
  }

  async createWorkspaceUsersFromEmailIds(
    workspaceId: string,
    emailIds: string[],
  ) {
    const userIds = await this.userService.getUserIdsFromEmailIds(emailIds);
    this.createWorkspaceUsers(workspaceId, userIds);
  }

  async createWorkspaceUsers(workspaceId: string, userIds: string[]) {
    const repo = this.dataSource.getRepository(WorkspaceUsers);
    for (const userId of userIds) {
      await repo.save({ userId, workspaceId });
    }
  }

  async update(workspaceId: string, emails: string[]) {
    const existingIds = (await this.getWorkspaceUser(workspaceId)).map(
      (workspaceUser) => workspaceUser.userId,
    );
    const newIds = await this.userService.getUserIdsFromEmailIds(emails);

    const { itemsToAdd, itemsToRemove } = itemsToAddAndRemove(
      existingIds,
      newIds,
      (id) => id,
    );

    await this.removeWorkspaceUsers(workspaceId, itemsToRemove);
    await this.createWorkspaceUsers(workspaceId, itemsToAdd);
  }

  async removeWorkspaceUsers(workspaceId: string, userIds: string[]) {
    const repo = this.dataSource.getRepository(WorkspaceUsers);
    for (const userId of userIds) {
      repo.softDelete({ workspaceId, userId });
    }
  }
}
