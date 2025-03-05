import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CatchAxiosExceptionFilter } from './error-handling/catch-axios-exceptions';
import { CatchHttpExceptionFilter } from './error-handling/catch-http-exceptions';
import { CatchPrismaExceptionFilter } from './error-handling/catch-prisma-exception';
import { CatchUnknownExceptions } from './error-handling/catch-unknown-exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapterHost = app.get(HttpAdapterHost);

  // Global filters do not change sequence of filters
  app.useGlobalFilters(new CatchUnknownExceptions(httpAdapterHost));
  app.useGlobalFilters(new CatchHttpExceptionFilter(httpAdapterHost));
  app.useGlobalFilters(new CatchAxiosExceptionFilter(httpAdapterHost));
  app.useGlobalFilters(new CatchPrismaExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3000);
  console.log(`Server is running on port ${process.env.PORT}`);
}
bootstrap();
