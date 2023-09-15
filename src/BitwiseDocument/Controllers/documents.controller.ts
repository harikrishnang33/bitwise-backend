import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from '../Services/messages.service';
import { formatResponse } from 'src/Common/Utils/formatResponse';
import { CreateMessageDto } from '../dto/create-message.dto';
import { AuthGuard } from '../../Auth/Guards/AuthGuard';

@UseGuards(AuthGuard)
@Controller('document')
export class DocumentsController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('create')
  async createDocument(@Body() requestDto: CreateMessageDto, @Req() req) {
    const result = await this.messagesService.create(requestDto, req.user);
    const response = formatResponse(result, 'Document created successfully');
    return response;
  }

  @Get('workspace/:workspaceId')
  async findAllByWorkspaceId(@Param('workspaceId') workspaceId: string) {
    const result = await this.messagesService.findAllByWorkspaceId(workspaceId);
    const response = formatResponse(result, 'Documents fetched successfully');
    return response;
  }

  @Delete(':id')
  async softDeleteDocument(@Param('id') id: string) {
    const result = await this.messagesService.softDeleteById(id);
    const response = formatResponse(
      result,
      'Document soft deleted successfully',
    );
    return response;
  }
}
