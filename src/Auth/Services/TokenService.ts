import { v4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../Common/Config/configService';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class TokenService {
  constructor(private readonly configService: ConfigService) {}
  generateAccessAndRefreshTokens(userId: string, currentTokenKey?: string) {
    const tokenKey = currentTokenKey ?? v4();

    const accessToken = this.generateAccessToken(tokenKey, userId);
    const refreshToken = this.generateRefreshToken(tokenKey);

    return { accessToken, refreshToken };
  }
  generateAccessToken(tokenKey: string, userId: string) {
    const data = { userId, tokenKey };
    const accessTokenExpiryInSec = this.configService.get<number>(
      'JWT_TOKEN_EXP_TIME',
    ) as number;
    return this.generateToken(data, accessTokenExpiryInSec);
  }
  generateRefreshToken(tokenKey: string) {
    const data = { tokenKey };
    const refershTokenExpiryInSec = this.configService.get<number>(
      'JWT_REFRESH_TOKEN_EXP_TIME',
    ) as number;
    return this.generateToken(data, refershTokenExpiryInSec);
  }

  generateToken(data: any, expiryInSec: number) {
    return jwt.sign(
      {
        data,
      },
      this.configService.get<string>('JWT_SECRET'),
      { expiresIn: Number(expiryInSec) },
    );
  }
}
