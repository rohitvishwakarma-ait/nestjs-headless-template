import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const method = req.method;
    // Normalise route: use Express matched route pattern, fall back to raw path
    const route = (req.route?.path as string | undefined) ?? req.path;

    // Start histogram timer
    const endTimer = this.metricsService.httpRequestDurationSeconds.startTimer({
      method,
      route,
    });

    // Track request size
    const contentLength = parseInt(
      req.headers['content-length'] ?? '0',
      10,
    );
    if (contentLength > 0) {
      this.metricsService.httpRequestSizeBytes.observe(
        { method, route },
        contentLength,
      );
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = String(res.statusCode);
          endTimer({ status_code: statusCode });
          this.metricsService.httpRequestsTotal.inc({
            method,
            route,
            status_code: statusCode,
          });
        },
        error: (err: { status?: number }) => {
          const statusCode = String(err?.status ?? 500);
          endTimer({ status_code: statusCode });
          this.metricsService.httpRequestsTotal.inc({
            method,
            route,
            status_code: statusCode,
          });
        },
      }),
    );
  }
}
