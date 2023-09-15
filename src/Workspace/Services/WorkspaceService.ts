import { Injectable, Logger } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { CreateWorkspaceDto } from '../Dto/CreateWorkspaceDto';
import { plainToClass } from 'class-transformer';
import { Workspace } from '../Entities/Workspace';
import EntityAlreadyExistError from '../../Common/Exception/EntityAlreadyExistError';
import { User } from '../../User/Entities/User';
import { MessagesService } from '../../BitwiseDocument/Services/messages.service';
import { TicketService } from '../../Ticket/Services/TicketService';
import { LinkedNodeService } from '../../LinkedNodes/Services/LinkedNodeService';
import { Message } from '../../BitwiseDocument/Entities/message.entity';
import { Ticket } from '../../Ticket/Entities/Ticket';
import { LinkedNode } from '../../LinkedNodes/Entities/LinkedNode';
import { LinkedNodeType } from '../../LinkedNodes/Enums/LinkedNodeType';

@Injectable()
export class WorkspaceService {
  private logger: Logger = new Logger(WorkspaceService.name);

  constructor(private readonly dataSource: DataSource, private readonly messagesService: MessagesService

    , private readonly ticketService: TicketService
    , private readonly linkedNodeService: LinkedNodeService) { }

  async create(workspaceDto: CreateWorkspaceDto, user: User) {
    const workspace: Workspace = plainToClass(Workspace, {
      ...workspaceDto,
      adminUserId: user.id,
    });

    try {
      const savedWorkspace = await this.dataSource
        .getRepository(Workspace)
        .save(workspace);
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

  async getAllWorkspace() {
    return this.dataSource.getRepository(Workspace).findAndCount({
      where: { deletedAt: null },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllByWorkspaceId(workspaceId: string) {
    const messages = await this.messagesService.findAllByWorkspaceId(workspaceId);
    const tickets = await this.ticketService.getAllTickets(workspaceId);
    // const gDocs = await 

    const linkedNodes = await this.linkedNodeService.getLinkedNodes(workspaceId);
    return this.buildAllByWorkspaceIdResponse(messages, tickets, linkedNodes)
  }

  buildAllByWorkspaceIdResponse(messages: Message[], tickets: Ticket[], linkedNodes: LinkedNode[]) {
    let nodes: { id: string, name: string, type: LinkedNodeType }[] = [];
    let links: { source: string, target: string }[] = []
    messages.forEach(message => {
      nodes.push({
        id: message.id,
        name: message.name,
        type: LinkedNodeType.BITWISE_DOC
      })
    })
    tickets.forEach(ticket => {
      nodes.push({
        id: ticket.id,
        name: ticket.title,
        type: LinkedNodeType.BITWISE_TICKET
      })
    })
    linkedNodes.forEach(linkedNode => {
      links.push({
        source: linkedNode.sourceId,
        target: linkedNode.destinationId
      })
    })
    return { nodes, links };
  }
}
