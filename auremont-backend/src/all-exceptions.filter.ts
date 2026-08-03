import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // --- Server-side diagnostic log (dev only, never sent to client) ---
    console.error('================ EXCEPTION ================');
    console.error('TYPE       :', (exception as any)?.constructor?.name);
    console.error('MESSAGE    :', (exception as any)?.message);
    console.error('HTTP?      :', exception instanceof HttpException);
    if (exception instanceof HttpException) {
      console.error('HTTP STATUS:', exception.getStatus());
      console.error('RESPONSE   :', exception.getResponse());
    }
    console.error('STACK      :', (exception as any)?.stack);
    console.error('===========================================');

    if (exception instanceof HttpException) {
      // NestJS HTTP exception — preserve status and response exactly
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const responseBody: Record<string, any> = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      if (typeof exceptionResponse === 'string') {
        responseBody.message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        Object.assign(responseBody, exceptionResponse);
        // Always keep statusCode correct
        responseBody.statusCode = status;
      }

      return response.status(status).json(responseBody);
    }

    // Non-HTTP exception — return 500, expose message in dev
    const isDev = process.env.NODE_ENV !== 'production';
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: isDev
        ? `Internal server error: ${(exception as any)?.message}`
        : 'Internal server error',
      ...(isDev && { stack: (exception as any)?.stack }),
    });
  }
}
