import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Request & Correlation Tracking
    const requestId =
      (request.headers['x-request-id'] as string) ||
      (request.headers['x-correlation-id'] as string) ||
      `req_${crypto.randomBytes(8).toString('hex')}`;

    response.setHeader('X-Request-ID', requestId);

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? (exception as HttpException).getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttp ? (exception as HttpException).getResponse() : null;

    // Server-side structured diagnostic logging
    if (status >= 500) {
      this.logger.error(
        `[${requestId}] ${request.method} ${request.url} - ${status} Error: ${(exception as any)?.message}`,
        (exception as any)?.stack,
      );
    } else {
      this.logger.warn(
        `[${requestId}] ${request.method} ${request.url} - ${status} Client Error: ${(exception as any)?.message}`,
      );
    }

    if (isHttp) {
      const responseBody: Record<string, any> = {
        statusCode: status,
        requestId,
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      if (typeof exceptionResponse === 'string') {
        responseBody.message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        Object.assign(responseBody, exceptionResponse);
        responseBody.statusCode = status;
        responseBody.requestId = requestId;
      }

      return response.status(status).json(responseBody);
    }

    // Check if error has status / statusCode (e.g. from body-parser 413 PayloadTooLarge)
    const errStatus = (exception as any)?.status || (exception as any)?.statusCode;
    if (typeof errStatus === 'number' && errStatus >= 400 && errStatus < 600) {
      return response.status(errStatus).json({
        statusCode: errStatus,
        requestId,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: (exception as any)?.message || 'Request error',
      });
    }

    // Non-HTTP exception — safe 500
    const isDev = process.env.NODE_ENV !== 'production';
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: isDev
        ? `Internal server error: ${(exception as any)?.message}`
        : 'Internal server error',
      ...(isDev && { stack: (exception as any)?.stack }),
    });
  }
}
