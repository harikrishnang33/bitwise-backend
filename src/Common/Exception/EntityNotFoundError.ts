import { HttpStatus } from '@nestjs/common';
import BitwiseBaseError from './BitwiseBaseError';

export default class EntityNotFoundError extends BitwiseBaseError {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.name = EntityNotFoundError.name;
  }
}
