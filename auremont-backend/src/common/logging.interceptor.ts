import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { structuredLogger } from './structured-logger.service';
import { metricsService } from './metrics.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<any>();
    const res = ctx.getResponse<any>();

    const start = process.hrtime.bigint();
    const requestId =
      req.headers['x-request-id'] ||
      req.headers['x-correlation-id'] ||
      req.requestId ||
      'unknown';

    const method = req.method;
    const url = req.originalUrl || req.url;

    // Skip verbose logs for frequent liveness probes
    const isProbe = url === '/health/liveness' || url === '/favicon.ico';

    return next.handle().pipe(
      tap({
        next: () => {
          if (isProbe) return;

          const durationMs = Math.round((Number(process.hrtime.bigint() - start) / 1e6) * 100) / 100;
          const statusCode = res.statusCode || 200;
          metricsService.recordHttpRequest(method, url, statusCode, durationMs);

          const logContext = {
            service: 'auremont-api',
            operation: 'http_request',
            method,
            route: url,
            statusCode,
            durationMs,
            requestId: String(requestId),
            userId: req.user?.id,
          };

          if (statusCode >= 500) {
            structuredLogger.error(`HTTP ${method} ${url} ${statusCode}`, undefined, logContext);
          } else if (statusCode >= 400) {
            structuredLogger.warn(`HTTP ${method} ${url} ${statusCode}`, logContext);
          } else if (durationMs > 1000) {
            structuredLogger.warn(`SLOW HTTP ${method} ${url} ${statusCode} (${durationMs}ms)`, logContext);
          } else {
            structuredLogger.log(`HTTP ${method} ${url} ${statusCode}`, logContext);
          }
        },
        error: (err: any) => {
          if (isProbe) return;

          const durationMs = Math.round((Number(process.hrtime.bigint() - start) / 1e6) * 100) / 100;
          const statusCode = err?.status || err?.statusCode || 500;
          metricsService.recordHttpRequest(method, url, statusCode, durationMs);

          structuredLogger.error(
            `HTTP ${method} ${url} ${statusCode} - ${err?.message || 'Error'}`,
            err?.stack,
            {
              service: 'auremont-api',
              operation: 'http_request',
              method,
              route: url,
              statusCode,
              durationMs,
              requestId: String(requestId),
              userId: req.user?.id,
              errorType: err?.name || 'Error',
            },
          );
        },
      }),
    );
  }
}
