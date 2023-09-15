import { Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../Entities/User';
import { CreateUserDto } from '../Dto/CreateUser.dto';

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

  async getUserById(id: string) {
    return this.dataSource.getRepository(User).findOneBy({ id });
  }
}
