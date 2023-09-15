import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from '../Dto/CreateUser.dto';
import { UserService } from '../Services/UserService';
import { formatResponse } from 'src/Common/Utils/formatResponse';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAll(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.getAllUser();
    const response = formatResponse(result, 'Users fetched successfully');
    return res.status(response.statusCode).send(response);
  }
}
