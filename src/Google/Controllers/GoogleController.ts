import {
    Body,
    Controller,
    Put,
    Post,
    Req,
    Res,
    Query,
    Get,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { formatResponse } from 'src/Common/Utils/formatResponse';
import { GoogleService } from '../Services/GoogleService';
import { CreateDocDto } from '../Dtos/CreateDoc.dto';
  
  @Controller('google')
  export class GoogleController {
    constructor(private readonly googleService: GoogleService) {}
  
    @Post('create')
    async create(
      @Req() req: Request,
      @Res() res: Response,
      @Body() userInput: CreateDocDto,
    ) {
      const result = await this.googleService.createDoc(userInput);
      const response = formatResponse(result, 'Google doc created successfully');
      return res.status(response.statusCode).send(response);
    }
  
    @Post('initiate-auth')
    async initiateAuth(@Req() req: Request, @Res() res: Response) {
      const result = await this.googleService.initiateAuthentication();
      const response = formatResponse(
        result,
        'Authentication initiated successfully',
      );
      return res.status(response.statusCode).send(response);
    }
  
    @Get('authenticate')
    async authenticate(
      @Req() req: Request,
      @Res() res: Response,
      @Query() queryParams: any,
    ) {
      const authCode = queryParams.code;
      const result = await this.googleService.authenticate(authCode);
      const response = formatResponse(result, 'Authenticated successfully');
      return res.status(response.statusCode).send(response);
    }
  }