import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { Message } from '../Entities/message.entity';
import { DataSource, DeepPartial } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../../User/Entities/User';

@Injectable()
export class MessagesService {
  constructor(private readonly dataSource: DataSource) {}

  async create(createDto: CreateMessageDto, user: User) {
    const document: DeepPartial<Message> = {
      id: v4(),
      workspaceId: createDto.workspaceId,
      ownerId: user.id,
    };
    return this.dataSource.getRepository(Message).save(document);
  }

  findAllByWorkspaceId(workspaceId: string) {
    return this.dataSource
      .getRepository(Message)
      .findBy({ workspaceId, deletedAt: null });
  }

  findOneById(id: string) {
    return this.dataSource.getRepository(Message).findOneBy({ id });
  }

  async upsert(id: string, updateMessageDto: UpdateMessageDto) {
    const document: DeepPartial<Message> = {
      id: id ? id : v4(),
      message: updateMessageDto.message ? updateMessageDto.message : null,
    };
    return this.dataSource.getRepository(Message).save(document);
  }

  softDeleteById(id: string) {
    const document: DeepPartial<Message> = {
      id,
      deletedAt: new Date(),
    };
    return this.dataSource.getRepository(Message).save(document);
  }
}
