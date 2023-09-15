import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from '../Services/messages.service';
import { formatResponse } from 'src/Common/Utils/formatResponse';
import { CreateMessageDto } from '../dto/create-message.dto';

@Controller('document')
export class DocumentsController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('create')
  async createDocument(@Body() requestDto: CreateMessageDto) {
    const result = await this.messagesService.create(requestDto);
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

  @Get('temp')
  async temp() {
    const result = await this.messagesService.temp();
    const response = formatResponse(result, 'Documents fetched successfully');
    return response;
  }
}
