import {
    Body,
    Controller,
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
import { ConfigService } from '../../Common/Config/configService';
  
  @Controller('google')
  export class GoogleController {
    constructor(
      private readonly googleService: GoogleService,
      private readonly configService: ConfigService,
    ) {}
  
    @Post('doc')
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
      @Res({ passthrough: true }) res: Response,
      @Query() queryParams: any,
    ) {
      const authCode = queryParams.code;
      const result = await this.googleService.authenticate(authCode);
      res.cookie('accessToken', result.accessToken);
      res.cookie('refreshToken', result.refreshToken);
      const redirectUrl = `${this.configService.get(`FE_BASE_URL`)}/${this.configService.get(`FE_SUCCESS_PATH`)}`;
      res.redirect(redirectUrl);
    }

    @Get('doc/:id')
    async getDoc(
      @Req() req: Request,
      @Res() res: Response,
    ) {
      const result = await this.googleService.getDocByGoogleId(req.params.id);
      const response = formatResponse(result);
      return res.status(response.statusCode).send(response);
    }
  }
