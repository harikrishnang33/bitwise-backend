import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../Services/messages.service';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { FindMessageDto } from '../dto/find-message.dto';

@WebSocketGateway(3001, { cors: true })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('updateMessage')
  async update(
    @MessageBody() updateMessageDto: string,
    @ConnectedSocket() client: Socket,
  ) {
    const updateMessageDtoObject: UpdateMessageDto =
      JSON.parse(updateMessageDto);
    const updatedMessage = await this.messagesService.upsert(
      updateMessageDtoObject.id,
      updateMessageDtoObject,
    );
    client.broadcast.emit('messageUpdated', JSON.stringify(updatedMessage));
    return updatedMessage;
  }

  @SubscribeMessage('findOne')
  async findOne(
    @MessageBody() findMessageDto: string,
    @ConnectedSocket() client: Socket,
  ) {
    const findMessageDtoObject: FindMessageDto = JSON.parse(findMessageDto);
    const message = await this.messagesService.findOneById(
      findMessageDtoObject.id,
    );
    client.broadcast.emit('messageUpdated', JSON.stringify(message));
    return message;
  }
}
