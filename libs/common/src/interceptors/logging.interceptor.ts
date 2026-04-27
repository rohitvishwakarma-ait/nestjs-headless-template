import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger } from '../../../utils/src/logger.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new AppLogger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const { method, url } = req;
    const start = Date.now();

    this.logger.log(`→ ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            `← ${method} ${url} ${res.statusCode} +${Date.now() - start}ms`,
          );
        },
        error: (err: { status?: number; message?: string }) => {
          this.logger.error(
            `← ${method} ${url} ${err?.status ?? 500} +${Date.now() - start}ms — ${err?.message ?? 'Unknown error'}`,
          );
        },
      }),
    );
  }
}
