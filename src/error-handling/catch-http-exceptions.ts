import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { DomainException } from './domain-exception';
import { ErrorResponse } from './error-response';
import { handleSentryLog, SentryErrorType } from './sentry';

@Catch(HttpException)
export class CatchHttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(CatchHttpExceptionFilter.name);

  constructor(private readonly host: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    return this.handleException(host, exception);
  }

  private handleException(host: ArgumentsHost, exception: HttpException) {
    const { httpAdapter } = this.host;
    const context = host.switchToHttp();
    const httpStatus = (exception as HttpException).getStatus();
    const message =
      exception.getResponse() instanceof Object
        ? (exception.getResponse() as { message: string }).message
        : exception.getResponse();

    const responseBody: ErrorResponse = {
      statusCode: httpStatus,
      statusDescription: HttpStatus[httpStatus],
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(context.getRequest()),
      message: message,
      stack: exception.stack,
    };

    const errorType =
      exception instanceof DomainException ? SentryErrorType.SMOOTHLI : SentryErrorType.HTTP;

    this.logger.error(`ERROR TYPE: ${errorType} with MESSAGE: ${message}`);
    handleSentryLog(host, exception, responseBody, errorType);
    return httpAdapter.reply(context.getResponse(), responseBody, httpStatus);
  }
}
