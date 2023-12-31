import { Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial } from 'typeorm';
import { CreateTicketDto } from '../Dto/CreateTicket.dto';
import { Ticket } from '../Entities/Ticket';
import { v4 } from 'uuid';
import { TicketStatus } from '../Enums/TicketStatusEnum';
import { User } from '../../User/Entities/User';

@Injectable()
export class TicketService {
  private logger: Logger = new Logger(TicketService.name);

  constructor(private readonly dataSource: DataSource) {}

  async createTicket(input: CreateTicketDto, user: User): Promise<Ticket> {
    const ticket: DeepPartial<Ticket> = {
      id: v4(),
      title: input.title,
      createdById: user.id,
      status: TicketStatus.OPEN,
      description: input.description,
      workspaceId: input.workspaceId,
    };
    return this.dataSource.getRepository(Ticket).save(ticket);
  }

  async getAllTickets(workspaceId: string): Promise<Ticket[]> {
    return this.dataSource
      .getRepository(Ticket)
      .find({ where: { workspaceId } });
  }

  async getTicketById(id: string): Promise<Ticket> {
    return this.dataSource.getRepository(Ticket).findOne({ where: { id } });
  }

  async updateStatus(id: string, status: TicketStatus) {
    return this.dataSource.getRepository(Ticket).update(id, { status });
  }
}
