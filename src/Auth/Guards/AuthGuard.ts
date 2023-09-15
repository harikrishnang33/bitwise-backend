import { SetMetadata } from '@nestjs/common';

export const AuthGuard = () => SetMetadata('isCookieProtected', true);
