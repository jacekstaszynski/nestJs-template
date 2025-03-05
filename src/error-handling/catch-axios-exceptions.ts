import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AxiosError } from 'axios';

import { ErrorResponse } from './error-response';
import { handleSentryLog, SentryErrorType } from './sentry';

@Catch(AxiosError)
export class CatchAxiosExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(CatchAxiosExceptionFilter.name);

  constructor(private readonly host: HttpAdapterHost) {}

  catch(exception: AxiosError, host: ArgumentsHost) {
    return this.handleException(host, exception);
  }

  private handleException(host: ArgumentsHost, exception: AxiosError) {
    const { httpAdapter } = this.host;
    const context = host.switchToHttp();
    const httpStatus = (exception as AxiosError).response.status;

    const responseBody: ErrorResponse = {
      statusCode: httpStatus,
      statusDescription: exception.code,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(context.getRequest()),
      message: (exception.response.data as { message: string }).message,
      stack: exception.stack,
    };

    this.logger.error(responseBody.message);
    handleSentryLog(host, exception, responseBody, SentryErrorType.AXIOS);
    return httpAdapter.reply(context.getResponse(), responseBody, httpStatus);
  }
}
