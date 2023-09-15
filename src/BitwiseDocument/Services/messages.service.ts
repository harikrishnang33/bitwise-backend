import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { Message } from '../Entities/message.entity';
import { DataSource, DeepPartial } from 'typeorm';
import { v4 } from 'uuid';
import { GoogleService } from 'src/Google/Services/GoogleService';
// const HTMLtoDOCX = require('html-to-docx');
// import U8 from 'uint8-encoding';

@Injectable()
export class MessagesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly googleService: GoogleService,
  ) { }

  async create(createDto: CreateMessageDto) {
    const document: DeepPartial<Message> = {
      id: v4(),
      workspaceId: createDto.workspaceId,
      ownerId: createDto.ownerId,
    };
    return this.dataSource.getRepository(Message).save(document);
  }

  findAllByWorkspaceId(workspaceId: string) {
    return this.dataSource
      .getRepository(Message)
      .findBy({ workspaceId, deletedAt: null });
  }

  findOneById(id: string) {
    return this.dataSource.getRepository(Message).findOneBy({ id });
  }

  public async upsert(id: string, updateMessageDto: UpdateMessageDto) {
    // const message = '<p>Hello</p><p><strong>bold</strong></p><p><u>underline</u></p><p></p><p><em>italic</em></p>';
    // const docId = '1YzDfXKHS82t8hYCat0bukhAKUeg-ZumDMoYfmMyeio0';
    const document: DeepPartial<Message> = {
      id: id ? id : v4(),
      message: updateMessageDto.message ? updateMessageDto.message : null,
    };
    const isGoogleDoc = await this.googleService.checkIfGoogleDocExistsInSystem(id);
    if (isGoogleDoc) {
      // return await this.googleService.updateGoogleDoc();
      // this.convertHtmlToBodyElements(document.message);
    }
    return this.dataSource.getRepository(Message).save(document);
  }

  public async temp() {
    const message = '<p>Hello</p><p><strong>bold</strong></p><p><u>underline</u></p><p></p><p><em>italic</em></p>';
    const googleId = '1YzDfXKHS82t8hYCat0bukhAKUeg-ZumDMoYfmMyeio0';

    // const text = await this.convertHtmlToBodyElements(message);
    // const val = U8.decode(text);
    // return await this.googleService.updateGoogleDoc(googleId, val);

    // return this.dataSource.getRepository(Message).save(document);
  }

  async softDeleteById(id: string) {
    const document: DeepPartial<Message> = {
      id,
      deletedAt: new Date(),
    };
    return this.dataSource.getRepository(Message).save(document);
  }

  public async convertHtmlToBodyElements(htmlContent: string) {
    const result = await HTMLtoDOCX(htmlContent);
    return result;
  }
}
