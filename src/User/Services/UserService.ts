import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../Entities/User';
import { Credentials } from 'google-auth-library';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(private readonly dataSource: DataSource) { }

  async create(userEntity: User) {
    return await this.dataSource.getRepository(User).save(userEntity);
  }

  async getAllUser() {
    return this.dataSource.getRepository(User).findAndCount();
  }

  async getUserByEmail(email: string) {
    return this.dataSource.getRepository(User).findOneBy({ email });
  }

  async getUserById(id: string) {
    return this.dataSource.getRepository(User).findOneBy({ id });
  }

  async setGoogleToken(id: string, credentials: Credentials) {
    return this.dataSource.getRepository(User)
      .createQueryBuilder(User.name)
      .update()
      .set({ googleTokenData: credentials })
      .where({ id })
      .execute();
  }
}
