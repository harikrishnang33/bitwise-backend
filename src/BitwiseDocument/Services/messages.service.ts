import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { Message } from '../Entities/message.entity';
import { DataSource, DeepPartial } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../../User/Entities/User';
import { isEmpty } from 'lodash';
import { LinkedNodeService } from 'src/LinkedNodes/Services/LinkedNodeService';
import { LinkedNode } from 'src/LinkedNodes/Entities/LinkedNode';
import { DocumentResponseModel } from '../Models/DocumentResponseModel';

@Injectable()
export class MessagesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly linkedNodeService: LinkedNodeService,
  ) {}

  async create(createDto: CreateMessageDto, user: User) {
    const document: DeepPartial<Message> = {
      id: v4(),
      name: createDto.name,
      workspaceId: createDto.workspaceId,
      ownerId: user.id,
    };
    return this.dataSource.getRepository(Message).save(document);
  }

  async findAllByWorkspaceId(workspaceId: string) {
    return this.dataSource
      .getRepository(Message)
      .find({ where: { workspaceId, deletedAt: null } });
  }

  async findOneById(id: string) {
    const document = await this.dataSource
      .getRepository(Message)
      .findOneBy({ id });
    const linkedNodes = await this.linkedNodeService.getLinkedNodes(
      document.workspaceId,
      document.id,
    );
    return this.mapLinkedNodesToDocument(document, linkedNodes);
  }

  async upsert(id: string, updateMessageDto: UpdateMessageDto) {
    const document: DeepPartial<Message> = {
      id: id ? id : v4(),
      message: updateMessageDto.message,
    };
    await this.dataSource.getRepository(Message).save(document);
    const savedDocument = await this.dataSource
      .getRepository(Message)
      .findOneBy({ id });
    await this.linkedNodeService.softDelete(id);
    let linkedNodes: LinkedNode[] = [];
    if (!isEmpty(updateMessageDto.linkedNodes)) {
      linkedNodes = await this.linkedNodeService.insert(
        id,
        savedDocument.workspaceId,
        updateMessageDto.linkedNodes,
      );
    }

    return this.mapLinkedNodesToDocument(savedDocument, linkedNodes);
  }

  async softDeleteById(id: string) {
    await this.dataSource.getRepository(Message).softDelete({ id });
    await this.linkedNodeService.softDelete(id);
  }

  mapLinkedNodesToDocument(document: Message, linkedNodes: LinkedNode[]) {
    const linkedNodeModels = linkedNodes?.map((linkedNode) => ({
      id: linkedNode.destinationId,
      type: linkedNode.type,
    }));

    const resultDoc: DocumentResponseModel = {
      id: document.id,
      name: document.name,
      message: document.message,
      workspaceId: document.workspaceId,
      ownerId: document.ownerId,
      linkedNodes: linkedNodeModels,
    };
    return resultDoc;
  }
}
