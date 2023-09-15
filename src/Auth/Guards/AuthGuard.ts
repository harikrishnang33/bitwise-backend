import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import TokenService from '../Services/TokenService';
import UnAuthorizedError from '../../Common/Exception/UnAuthorizedError';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) { }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies?.accessToken;
    if (accessToken) {
      const tokenData = this.tokenService.verifyToken(accessToken) as any;
      if (tokenData?.data?.userId) {
        const userContext = { id: tokenData.data.userId }
        request.user = userContext;
        return true;
      }
    }
    throw new UnAuthorizedError(`Unauthorized request`);
  }
}
