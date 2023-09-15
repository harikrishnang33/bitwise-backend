import { Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager, In } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../Entities/User';
import { Credentials } from 'google-auth-library';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(private readonly dataSource: DataSource) {}

  async create(userEntity: User) {
    return await this.dataSource.getRepository(User).save(userEntity);
  }

  async getAllUser() {
    return this.dataSource.getRepository(User).findAndCount();
  }

  async getUserByEmail(email: string) {
    return this.dataSource.getRepository(User).findOneBy({ email });
  }

  async getUserIdsFromEmailIds(emailIds: string[]) {
    return Promise.all(
      await this.dataSource
        .getRepository(User)
        .find({ where: { email: In(emailIds) } }),
    );
  }

  async updateUser(user: User) {
    return this.dataSource.getRepository(User).save(user);
  }

  async getUserById(id: string) {
    return this.dataSource.getRepository(User).findOneBy({ id });
  }

  async setGoogleToken(id: string, credentials: Credentials) {
    return this.dataSource
      .getRepository(User)
      .createQueryBuilder(User.name)
      .update()
      .set({ googleTokenData: credentials })
      .where({ id })
      .execute();
  }
}
