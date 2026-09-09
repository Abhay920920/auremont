import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { structuredLogger } from './common/structured-logger.service';
import { alertService } from './common/alert.service';

export enum ErrorCategory {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  IDEMPOTENCY_CONFLICT = 'IDEMPOTENCY_CONFLICT',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  PAYMENT_VERIFICATION_ERROR = 'PAYMENT_VERIFICATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATABASE_TIMEOUT = 'DATABASE_TIMEOUT',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId =
      (request.headers['x-request-id'] as string) ||
      (request.headers['x-correlation-id'] as string) ||
      (request as any).requestId ||
      `req_${crypto.randomBytes(8).toString('hex')}`;

    if (typeof response.setHeader === 'function') {
      response.setHeader('X-Request-ID', requestId);
      response.setHeader('x-correlation-id', requestId);
    }

    const isHttp = exception instanceof HttpException;
    const isDev = process.env.NODE_ENV !== 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: ErrorCategory | string = ErrorCategory.INTERNAL_ERROR;
    let message = 'An unexpected internal error occurred. Please try again later.';
    let details: any = undefined;

    const err = exception as any;
    const prismaCode = err?.code;
    const isPrismaError =
      Boolean(prismaCode && typeof prismaCode === 'string' && prismaCode.startsWith('P')) ||
      err?.name?.includes('Prisma');

    if (isHttp) {
      status = (exception as HttpException).getStatus();
      const exceptionResponse = (exception as HttpException).getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const respObj = exceptionResponse as Record<string, any>;
        message = respObj.message || 'Request failed';
        errorCode = respObj.code || this.mapStatusToErrorCode(status, respObj);
        details = respObj.error || respObj.errors || respObj.details;
      }
    } else if (isPrismaError) {
      // Prisma error taxonomy mapping
      if (prismaCode === 'P1001' || prismaCode === 'P2024' || prismaCode === 'P2028') {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        errorCode = ErrorCategory.DATABASE_TIMEOUT;
        message = 'Database service temporarily unavailable under heavy load. Please retry in a moment.';
      } else if (prismaCode === 'P2002') {
        status = HttpStatus.CONFLICT;
        errorCode = ErrorCategory.CONFLICT;
        message = 'A record with this identifier or unique property already exists.';
      } else if (prismaCode === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        errorCode = ErrorCategory.NOT_FOUND;
        message = 'The requested database record was not found.';
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorCode = ErrorCategory.DATABASE_ERROR;
        message = 'A database integrity operation failed.';
      }
    } else {
      const errStatus = err?.status || err?.statusCode;
      if (typeof errStatus === 'number' && errStatus >= 400 && errStatus < 600) {
        status = errStatus;
        message = err?.message || 'Request error';
        errorCode = this.mapStatusToErrorCode(status);
      } else if (err?.name === 'ThrottlerException') {
        status = HttpStatus.TOO_MANY_REQUESTS;
        errorCode = ErrorCategory.RATE_LIMIT;
        message = 'Too many requests. Please slow down and try again.';
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorCode = ErrorCategory.INTERNAL_ERROR;
        message = isDev ? `Internal server error: ${err?.message}` : 'Internal server error';
      }
    }

    // Server-side structured diagnostic logging with full redaction
    const logContext = {
      service: 'auremont-api',
      operation: 'http_exception',
      requestId,
      method: request.method,
      route: request.originalUrl || request.url,
      statusCode: status,
      errorCode,
      errorType: err?.name || 'Error',
      prismaCode: isPrismaError ? prismaCode : undefined,
      userId: (request as any).user?.id,
    };

    if (status >= 500) {
      structuredLogger.error(
        `[${requestId}] ${request.method} ${request.url} - ${status} [${errorCode}]: ${err?.message || message}`,
        err?.stack,
        logContext,
      );

      // Automated operational alert dispatch
      alertService
        .dispatchAlert(
          errorCode === ErrorCategory.DATABASE_TIMEOUT ? 'DATABASE_TIMEOUT' : 'HIGH_5XX_RATE',
          status === HttpStatus.SERVICE_UNAVAILABLE ? 'CRITICAL' : 'ERROR',
          `HTTP ${status} [${errorCode}] on ${request.method} ${request.url}`,
          err?.message || message,
          { requestId, route: request.url, method: request.method, statusCode: status, prismaCode },
        )
        .catch(() => {});
    } else {
      structuredLogger.warn(
        `[${requestId}] ${request.method} ${request.url} - ${status} [${errorCode}]: ${err?.message || message}`,
        logContext,
      );
    }

    // Client response payload (sanitized in production)
    const responsePayload: Record<string, any> = {
      statusCode: status,
      errorCode,
      message,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (details !== undefined && isHttp) {
      responsePayload.details = details;
    }

    if (isDev && err?.stack) {
      responsePayload.stack = err.stack;
    }

    return response.status(status).json(responsePayload);
  }

  private mapStatusToErrorCode(status: number, respObj?: Record<string, any>): ErrorCategory {
    if (respObj?.code) {
      return respObj.code;
    }
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCategory.VALIDATION_ERROR;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCategory.AUTHENTICATION_ERROR;
      case HttpStatus.FORBIDDEN:
        return ErrorCategory.AUTHORIZATION_ERROR;
      case HttpStatus.NOT_FOUND:
        return ErrorCategory.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCategory.CONFLICT;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ErrorCategory.RATE_LIMIT;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return ErrorCategory.DATABASE_TIMEOUT;
      case HttpStatus.BAD_GATEWAY:
        return ErrorCategory.EXTERNAL_SERVICE_ERROR;
      default:
        return ErrorCategory.INTERNAL_ERROR;
    }
  }
}
