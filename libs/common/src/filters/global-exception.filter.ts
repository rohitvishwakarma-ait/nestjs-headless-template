import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppLogger } from '../../../utils/src/logger.util';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new AppLogger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;

    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Pull the message — HttpException can carry a string or an object
    const exceptionResponse = isHttp ? exception.getResponse() : null;
    const message =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
        ? (exceptionResponse as { message: string | string[] }).message
        : isHttp
          ? exception.message
          : 'Internal server error';

    // Derive a machine-readable error code
    const errorCode = isHttp
      ? exception.constructor.name.replace('Exception', '').toUpperCase()
      : 'INTERNAL_SERVER_ERROR';

    // Log 5xx as error, 4xx as warn — no noise for expected client errors
    const logMessage = `${request.method} ${request.url} → ${status}`;
    if (status >= 500) {
      const trace =
        exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(logMessage, trace);
    } else {
      this.logger.warn(`${logMessage} — ${JSON.stringify(message)}`);
    }

    response.status(status).json({
      success: false,
      message,
      errorCode,
    });
  }
}
