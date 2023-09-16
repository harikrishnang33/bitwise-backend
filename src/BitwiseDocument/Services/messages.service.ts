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
import { GoogleDoc } from 'src/Google/Entities/GoogleDoc';
import { Ticket } from 'src/Ticket/Entities/Ticket';

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
    const linkedDestinationMessages = await this.dataSource
      .getRepository(Message)
      .createQueryBuilder(Message.name)
      .whereInIds(
        linkedNodes.map((linkedNode: LinkedNode) => linkedNode.destinationId),
      )
      .getMany();

    const linkedDestinationGDoc = await this.dataSource
    .getRepository(GoogleDoc)
    .createQueryBuilder(GoogleDoc.name)
    .whereInIds(
      linkedNodes.map((linkedNode: LinkedNode) => linkedNode.destinationId),
    )
    .getMany();
    const linkedDestinationTicket = await this.dataSource
      .getRepository(Ticket)
      .createQueryBuilder(Ticket.name)
      .whereInIds(
        linkedNodes.map((linkedNode: LinkedNode) => linkedNode.destinationId),
      )
      .getMany();

    const linkedDestinationDocumentsMap: Map<string, string> = new Map();
    linkedDestinationMessages?.forEach((document: Message) => {
      linkedDestinationDocumentsMap.set(document.id, document.name);
    });

    linkedDestinationGDoc?.forEach((document: GoogleDoc) => {
      linkedDestinationDocumentsMap.set(document.id, document.name);
    });

    linkedDestinationTicket?.forEach((document: Ticket) => {
      linkedDestinationDocumentsMap.set(document.id, document.title);
    });
    return this.mapLinkedNodesToDocument(
      document,
      linkedNodes,
      linkedDestinationDocumentsMap,
    );
  }

  public async upsert(
    id: string,
    updateMessageDto: UpdateMessageDto,
    userId: string,
  ) {
    const document: Message = plainToClass(Message, {
      id: id ? id : v4(),
      message: updateMessageDto.message,
    });

    const isGoogleDoc = await this.googleService.checkIfGoogleDocExistsInSystem(
      id,
    );
    if (isGoogleDoc) {
      return this.googleService.updateGoogleDoc(
        id,
        updateMessageDto.message,
        userId,
      );
    }

    await this.dataSource.getRepository(Message).save(document);
    const savedDocument = await this.dataSource
      .getRepository(Message)
      .findOne({ where: { id } });
    await this.linkedNodeService.softDelete(id);
    console.log(updateMessageDto.linkedNodes);
    let linkedNodes: LinkedNode[] = [];
    if (!isEmpty(updateMessageDto.linkedNodes)) {
      linkedNodes = await this.linkedNodeService.insert(
        id,
        savedDocument.workspaceId,
        updateMessageDto.linkedNodes,
      );
    }

    const linkedDestinationMessages = await this.dataSource
      .getRepository(Message)
      .createQueryBuilder(Message.name)
      .whereInIds(
        linkedNodes.map((linkedNode: LinkedNode) => linkedNode.destinationId),
      )
      .getMany();

    const linkedDestinationGDoc = await this.dataSource
    .getRepository(GoogleDoc)
    .createQueryBuilder(GoogleDoc.name)
    .whereInIds(
      linkedNodes.map((linkedNode: LinkedNode) => linkedNode.destinationId),
    )
    .getMany();
    const linkedDestinationTicket = await this.dataSource
      .getRepository(Ticket)
      .createQueryBuilder(Ticket.name)
      .whereInIds(
        linkedNodes.map((linkedNode: LinkedNode) => linkedNode.destinationId),
      )
      .getMany();

    const linkedDestinationDocumentsMap: Map<string, string> = new Map();
    linkedDestinationMessages?.forEach((document: Message) => {
      linkedDestinationDocumentsMap.set(document.id, document.name);
    });

    linkedDestinationGDoc?.forEach((document: GoogleDoc) => {
      linkedDestinationDocumentsMap.set(document.id, document.name);
    });

    linkedDestinationTicket?.forEach((document: Ticket) => {
      linkedDestinationDocumentsMap.set(document.id, document.title);
    });
    return this.mapLinkedNodesToDocument(
      savedDocument,
      linkedNodes,
      linkedDestinationDocumentsMap,
    );
  }

  async softDeleteById(id: string) {
    await this.dataSource.getRepository(Message).softDelete({ id });
    await this.linkedNodeService.softDelete(id);
  }

  mapLinkedNodesToDocument(
    document: Message,
    linkedNodes: LinkedNode[],
    linkedDestinationDocumentsMap: Map<string, string> 
  ) {
    const linkedNodeModels = linkedNodes?.map((linkedNode) => ({
      id: linkedNode.destinationId,
      name: linkedDestinationDocumentsMap.get(linkedNode.destinationId),
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
