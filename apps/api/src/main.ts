import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppLogger } from '../../../libs/utils/src/logger.util';
import { LoggingInterceptor } from '../../../libs/common/src/interceptors/logging.interceptor';
import { ResponseInterceptor } from '../../../libs/common/src/interceptors/response.interceptor';
import { GlobalExceptionFilter } from '../../../libs/common/src/filters/global-exception.filter';

async function bootstrap() {
  const logger = new AppLogger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });

  app.setGlobalPrefix('v1');

  // 1. Exception filter — catches everything, formats error response
  //    { success: false, message: "...", errorCode: "..." }
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 2. Validation pipe — rejects bad DTOs before hitting handlers
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. Response interceptor — wraps all success responses
  //    { success: true, data: {} }
  // 4. Logging interceptor — logs every request/response
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application running on http://localhost:${port}/v1`);
}

bootstrap();
