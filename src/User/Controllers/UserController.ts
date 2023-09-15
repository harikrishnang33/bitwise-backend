import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from '../Dto/CreateUser.dto';
import { UserService } from '../Services/UserService';
import { formatResponse } from 'src/Common/Utils/formatResponse';
import { AuthGuard } from '../../Auth/Guards/AuthGuard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async create(@Res() res: Response, @Body() userInput: CreateUserDto) {
    const result = await this.userService.create(userInput);
    const response = formatResponse(result, 'User created successfully');
    return res.status(response.statusCode).send(response);
  }

  @Get('/')
  async getAll(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.getAllUser();
    const response = formatResponse(result, 'Users fetched successfully');
    return res.status(response.statusCode).send(response);
  }

  @Get('/:userId')
  async getUserById(@Res() res: Response, @Param('userId') userId: string) {
    const result = await this.userService.getUserById(userId);
    const response = formatResponse(result, 'User fetched successfully');
    return res.status(response.statusCode).send(response);
  }

  @Get('me/profile')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: any) {
    const userId = req.user.id;
    const result = await this.userService.getUserById(userId);
    return formatResponse(result, 'User fetched successfully');
  }
}
