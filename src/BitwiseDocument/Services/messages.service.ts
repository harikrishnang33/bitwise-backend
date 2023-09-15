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
import { GoogleService } from 'src/Google/Services/GoogleService';
const HTMLtoDOCX = require('html-to-docx');
// import U8 from 'uint8-encoding';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MessagesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly linkedNodeService: LinkedNodeService,
    private readonly googleService: GoogleService,
  ) {}

  async create(createDto: CreateMessageDto, user: User) {
    const document = plainToClass(Message, {
      id: v4(),
      name: createDto.name,
      workspaceId: createDto.workspaceId,
      ownerId: user.id,
    });
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
      .findOne({ where: { id } });
    const linkedNodes = await this.linkedNodeService.getLinkedNodes(
      document.workspaceId,
      document.id,
    );
    const linkedDestinationDocuments = await this.dataSource
      .getRepository(Message)
      .createQueryBuilder(Message.name)
      .whereInIds(
        linkedNodes.map((linkedNode: LinkedNode) => linkedNode.destinationId),
      )
      .getMany();
    return this.mapLinkedNodesToDocument(
      document,
      linkedNodes,
      linkedDestinationDocuments,
    );
  }

  public async upsert(id: string, updateMessageDto: UpdateMessageDto, userId: string) {
    const document: Message = plainToClass(Message, {
      id: id ? id : v4(),
      message: updateMessageDto.message,
    });
    await this.dataSource.getRepository(Message).save(document);
    const savedDocument = await this.dataSource
      .getRepository(Message)
      .findOne({ where: { id } });
    await this.linkedNodeService.softDelete(id);
    let linkedNodes: LinkedNode[] = [];
    if (!isEmpty(updateMessageDto.linkedNodes)) {
      linkedNodes = await this.linkedNodeService.insert(
        id,
        savedDocument.workspaceId,
        updateMessageDto.linkedNodes,
      );
    }

    const isGoogleDoc = await this.googleService.checkIfGoogleDocExistsInSystem(
      id,
    );
    if (isGoogleDoc) {
      return this.googleService.updateGoogleDoc(id, updateMessageDto.message, userId);
    }

    const linkedDestinationDocuments = await this.dataSource
      .getRepository(Message)
      .createQueryBuilder(Message.name)
      .whereInIds(
        linkedNodes.map((linkedNode: LinkedNode) => linkedNode.destinationId),
      )
      .getMany();
    return this.mapLinkedNodesToDocument(
      savedDocument,
      linkedNodes,
      linkedDestinationDocuments,
    );
  }

  async softDeleteById(id: string) {
    await this.dataSource.getRepository(Message).softDelete({ id });
    await this.linkedNodeService.softDelete(id);
  }

  mapLinkedNodesToDocument(
    document: Message,
    linkedNodes: LinkedNode[],
    linkedDestinationDocuments: Message[],
  ) {
    const linkedDestinationDocumentsMap: Map<string, Message> = new Map();
    linkedDestinationDocuments?.forEach((document: Message) => {
      linkedDestinationDocumentsMap.set(document.id, document);
    });
    const linkedNodeModels = linkedNodes?.map((linkedNode) => ({
      id: linkedNode.destinationId,
      name: linkedDestinationDocumentsMap.get(linkedNode.destinationId).name,
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

  public async temp() {
    const message =
      '<p>Hello</p><p><strong>bold</strong></p><p><u>underline</u></p><p></p><p><em>italic</em></p>';
    const googleId = '1YzDfXKHS82t8hYCat0bukhAKUeg-ZumDMoYfmMyeio0';

    // const text = await this.convertHtmlToBodyElements(message);
    // const val = U8.decode(text);
    // return await this.googleService.updateGoogleDoc(googleId, val);

    // return this.dataSource.getRepository(Message).save(document);
  }

  public async convertHtmlToBodyElements(htmlContent: string) {
    const result = await HTMLtoDOCX(htmlContent);
    return result;
  }
}
