import { ArgumentsHost } from '@nestjs/common';
import * as Sentry from '@sentry/node';

import { ErrorResponse } from './error-response';

export enum SentryErrorType {
  UNKNOWN = 'UNKNOWN',
  HTTP = 'HTTP',
  AXIOS = 'AXIOS',
  PRISMA = 'PRISMA',
  SMOOTHLI = 'SMOOTHLI',
}

enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export const handleSentryLog = (
  host: ArgumentsHost,
  error: Error,
  errorResponse: ErrorResponse,
  type: SentryErrorType,
) => {
  const user = host.switchToHttp().getRequest()?.user?.userData;

  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
    });
  }

  Sentry.setTag('type', type);

  Sentry.setTag('priority', setPriority(errorResponse, type));
  Sentry.setContext('ErrorResponse', {
    statusCode: errorResponse.statusCode,
    timestamp: errorResponse.timestamp,
    path: errorResponse.path,
    message:
      typeof errorResponse.message === 'string'
        ? errorResponse.message
        : JSON.stringify(errorResponse.message),
    stack: errorResponse.stack,
    prismaCode: errorResponse.prismaCode,
    statusDescription: errorResponse.statusDescription,
  });

  Sentry.captureException(error);
};

const setPriority = (
  errorResponse: ErrorResponse,
  type: SentryErrorType,
): Priority => {
  if ([SentryErrorType.PRISMA, SentryErrorType.AXIOS].includes(type)) {
    return Priority.HIGH;
  }

  if ([SentryErrorType.SMOOTHLI].includes(type)) {
    return Priority.MEDIUM;
  }

  if (errorResponse.statusCode >= 500) {
    return Priority.HIGH;
  }
  if (errorResponse.statusCode >= 400) {
    return Priority.LOW;
  }

  return Priority.HIGH;
};
