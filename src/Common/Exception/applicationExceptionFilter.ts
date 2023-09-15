import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch()
export class ApplicationExceptionFilter implements ExceptionFilter {
  private logger = new Logger(ApplicationExceptionFilter.name);

  private getValidationErrors(exception: BadRequestException): string[] {
    const validationErrorList: string[] = [];
    const response = exception.getResponse() as { message: ValidationError[] };
    if (
      response &&
      Array.isArray(response.message) &&
      response.message.length
    ) {
      response.message.forEach((msg) => {
        validationErrorList.push(...Object.values(msg.constraints));
      });
      return Array.from(new Set(validationErrorList));
    }
    if (response && typeof response.message === 'string') {
      return [response.message];
    }

    return null;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { method, path } = request;

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException || exception instanceof Error
        ? exception.message
        : 'Something went wrong!';

    const stack =
      exception instanceof HttpException || exception instanceof Error
        ? exception.stack
        : null;

    const validationErrors: string[] =
      exception instanceof BadRequestException
        ? this.getValidationErrors(exception)
        : null;

    this.logger.error(
      `[Application Error] request: ${JSON.stringify({
        method,
        path,
      })}, error: ${JSON.stringify({
        statusCode,
        message,
        error: exception,
      })} errorStack: ${stack}`,
    );

    response.status(statusCode).json({
      statusCode,
      message,
      ...(validationErrors && validationErrors.length && { validationErrors }),
    });
  }
}
