import { Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../Entities/User';
import { CreateUserDto } from '../Dto/CreateUser.dto';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(private readonly dataSource: DataSource) {}

  async create(userInput: CreateUserDto) {
    const { name, email = null } = userInput;

    const user: DeepPartial<User> = {
      name,
      email,
      id: v4(),
    };

    const saveduser = await this.dataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const userRepository = transactionalEntityManager.getRepository(User);
        const newUser = userRepository.create(user);
        await userRepository.save(user);
        return newUser;
      },
    );
    return saveduser;
  }

  async getAllUser() {
    return this.dataSource.getRepository(User).findAndCount();
  }

  async getUserById(userId: string) {
    return this.dataSource.getRepository(User).findOneBy({ id: userId });
  }
}
