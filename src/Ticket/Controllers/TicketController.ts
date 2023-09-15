import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from '../Services/TicketService';
import { CreateTicketDto } from '../Dto/CreateTicket.dto';
import { formatResponse } from 'src/Common/Utils/formatResponse';
import { Response } from 'express';
import { UpdateTicketStatusDto } from '../Dto/UpdateTicketStatus.dto';
import { AuthGuard } from 'src/Auth/Guards/AuthGuard';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async create(
    @Res() res: Response,
    @Body() input: CreateTicketDto,
    @Req() request: any,
  ) {
    const result = await this.ticketService.createTicket(
      input,
      request.user.id,
    );
    const response = formatResponse(result, 'Ticket created successfully');
    return res.status(response.statusCode).send(response);
  }

  @Get('/:workspaceId')
  async getAll(
    @Res() res: Response,
    @Param('workspaceId') workspaceId: string,
  ) {
    const result = await this.ticketService.getAllTickets(workspaceId);
    const response = formatResponse(result);
    return res.status(response.statusCode).send(response);
  }

  @Get('/:ticketId')
  async get(
    @Res() res: Response,
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
  ) {
    const result = await this.ticketService.getTicketById(ticketId);
    const response = formatResponse(result);
    return res.status(response.statusCode).send(response);
  }

  @Patch('/:ticketId')
  async updateStatus(
    @Res() res: Response,
    @Body() input: UpdateTicketStatusDto,
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
  ) {
    const result = await this.ticketService.updateStatus(
      ticketId,
      input.status,
    );
    const response = formatResponse(
      result,
      'Ticket status updated successfully',
    );
    return res.status(response.statusCode).send(response);
  }
}
