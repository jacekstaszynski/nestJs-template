import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { Response } from 'express';

import { ErrorResponse } from './error-response';
import { handleSentryLog, SentryErrorType } from './sentry';

@Catch(PrismaClientKnownRequestError, PrismaClientUnknownRequestError)
export class CatchPrismaExceptionFilter implements ExceptionFilter {
  //Codes description https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
  regex1000To1999 = /^P1\d{3}$/;
  regex2000To2999 = /^P2\d{3}$/;
  regex3000To3999 = /^P3\d{3}$/;
  private readonly logger: Logger = new Logger(CatchPrismaExceptionFilter.name);

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const message = this.convertMessage(exception.message);
    handleSentryLog(
      host,
      exception,
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        prismaCode: exception.code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: `${message}`,
        stack: exception.stack,
      },
      SentryErrorType.PRISMA,
    );
    return this.handleException(
      exception as PrismaClientKnownRequestError,
      response,
      request,
      message,
    );
  }

  private handleException(
    exception: PrismaClientKnownRequestError,
    response: Response,
    request: Request,
    message: string,
  ) {
    this.logger.error(
      `PRISMA ERROR: ${exception.code} for PATH: ${request.url} with MESSAGE: ${message}`,
    );
    switch (true) {
      case this.regex1000To1999.test(exception.code): {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          prismaCode: exception.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: `${message}`,
          stack: exception.stack,
        } as ErrorResponse);
      }
      case this.regex2000To2999.test(exception.code): {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          prismaCode: exception.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: `${message}`,
          stack: exception.stack,
        } as ErrorResponse);
      }
      case this.regex3000To3999.test(exception.code): {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          prismaCode: exception.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: `${message}`,
          stack: exception.stack,
        } as ErrorResponse);
      }
      default: {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          prismaCode: exception.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: `${message}`,
          stack: exception.stack,
        } as ErrorResponse);
      }
    }
  }
  private convertMessage(message: string): string {
    const lastLineBreakIndex = message.lastIndexOf('\n');
    const lastPart = message.slice(Math.max(0, lastLineBreakIndex + 1));
    return lastPart.trim();
  }
}
