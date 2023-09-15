import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  Query,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { formatResponse } from '../../Common/Utils/formatResponse';
import { GoogleService } from '../Services/GoogleService';
import { CreateDocDto } from '../Dtos/CreateDoc.dto';
import { ConfigService } from '../../Common/Config/configService';
import { AuthGuard } from '../../Auth/Guards/AuthGuard';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly configService: ConfigService,
  ) { }

  @Post('doc')
  @UseGuards(AuthGuard)
  async create(
    @Req() req: any,
    @Res() res: Response,
    @Body() userInput: CreateDocDto,
  ) {
    const userId = req.user.id;
    const result = await this.googleService.createDoc(userInput, userId);
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
    const redirectUrl = `${this.configService.get(
      `FE_BASE_URL`,
    )}/${this.configService.get(`FE_SUCCESS_PATH`)}`;
    res.redirect(redirectUrl);
  }

  @Get('doc/workspace/:id')
  async getDocsByWorkspaceId(@Req() req: any, @Res() res: Response) {
    const result = await this.googleService.getGoogleDocsByWorkspaceId(
      req.params.id,
    );
    const response = formatResponse(result);
    return res.status(response.statusCode).send(response);
  }

  @Get('doc/:id')
  @UseGuards(AuthGuard)
  async getDoc(@Req() req: any, @Res() res: Response) {
    const userId = req.user.id;
    const result = await this.googleService.getDocById(
      req.params.id,
      userId,
    );
    const response = formatResponse(result);
    return res.status(response.statusCode).send(response);
  }

}
