import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { AxiosError } from 'axios';
import { ErrorResponse } from './error-response';
import { handleSentryLog, SentryErrorType } from './sentry';

@Catch()
export class CatchUnknownExceptions implements ExceptionFilter {
  private readonly logger: Logger = new Logger(CatchUnknownExceptions.name);

  constructor(private readonly host: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof HttpException || exception instanceof AxiosError) {
      throw exception;
    }
    return this.handleException(host, exception, exception.status);
  }

  private handleException(host: ArgumentsHost, exception: any, status?: HttpStatus) {
    const { httpAdapter } = this.host;
    const context = host.switchToHttp();
    const httpStatus = status || HttpStatus.BAD_REQUEST;
    const message = exception?.response?.message
      ? [exception?.response?.message]
      : exception?.message;
    const responseBody: ErrorResponse = {
      statusCode: httpStatus,
      statusDescription: exception.cause?.toString(),
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(context.getRequest()),
      message: message,
      stack: exception.stack,
    };
    this.logger.error(`ERROR TYPE: ${SentryErrorType.UNKNOWN} with MESSAGE: ${message}`);
    handleSentryLog(host, exception, responseBody, SentryErrorType.UNKNOWN);
    return httpAdapter.reply(context.getResponse(), responseBody, httpStatus);
  }
}
