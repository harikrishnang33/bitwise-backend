import { Module } from '@nestjs/common';
import { MessagesService } from './Services/messages.service';
import { MessagesGateway } from './Gateways/messages.gateway';
import { DocumentsController } from './Controllers/documents.controller';
import { CommonModule } from 'src/Common';
import { LinkedNodeModule } from 'src/LinkedNodes';
import AuthModule from 'src/Auth';

@Module({
  imports: [CommonModule, LinkedNodeModule, AuthModule],
  providers: [MessagesGateway, MessagesService],
  controllers: [DocumentsController],
  exports: [MessagesService],
})
export class MessagesModule {}
