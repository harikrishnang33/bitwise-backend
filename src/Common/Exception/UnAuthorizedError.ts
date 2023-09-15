import { HttpStatus } from '@nestjs/common';
import BitwiseBaseError from './BitwiseBaseError';

export default class UnAuthorizedError extends BitwiseBaseError {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = UnAuthorizedError.name;
  }
}
