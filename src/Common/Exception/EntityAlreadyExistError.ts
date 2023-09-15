import { HttpStatus } from '@nestjs/common';
import BitwiseBaseError from './BitwiseBaseError';

export default class EntityAlreadyExistError extends BitwiseBaseError {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
    this.name = EntityAlreadyExistError.name;
  }
}
