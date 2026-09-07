import { Injectable, LoggerService, Scope } from '@nestjs/common';

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'access_token',
  'refresh_token',
  'refreshtoken',
  'resettoken',
  'secret',
  'signature',
  'authorization',
  'cookie',
  'key_secret',
  'razorpay_secret',
  'razorpay_signature',
  'cvv',
  'cardnumber',
]);

export function redactSensitiveData(obj: any, depth = 0): any {
  if (depth > 5 || obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitiveData(item, depth + 1));
  }

  const redacted: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey) || lowerKey.includes('secret') || lowerKey.includes('password') || lowerKey.includes('signature')) {
      redacted[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      redacted[key] = redactSensitiveData(val, depth + 1);
    } else {
      redacted[key] = val;
    }
  }
  return redacted;
}

export interface StructuredLogContext {
  service?: string;
  requestId?: string;
  correlationId?: string;
  operation?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  userId?: string;
  orderId?: string;
  cartId?: string;
  paymentId?: string;
  razorpayOrderId?: string;
  idempotencyKeyHash?: string;
  errorCode?: string;
  errorType?: string;
  retryAttempt?: number;
  [key: string]: any;
}

@Injectable({ scope: Scope.DEFAULT })
export class StructuredLogger implements LoggerService {
  private readonly isProd = process.env.NODE_ENV === 'production';
  private readonly defaultService = 'auremont-api';

  private formatMessage(level: string, message: any, context?: string | StructuredLogContext): string {
    const timestamp = new Date().toISOString();
    const meta: StructuredLogContext = typeof context === 'object' && context !== null ? redactSensitiveData(context) : {};
    const contextName = typeof context === 'string' ? context : meta.service || this.defaultService;

    if (this.isProd) {
      const entry = {
        timestamp,
        level,
        service: this.defaultService,
        context: contextName,
        message: typeof message === 'object' ? redactSensitiveData(message) : message,
        ...meta,
      };
      return JSON.stringify(entry);
    }

    // Dev format: human-readable
    const dur = meta.durationMs !== undefined ? ` +${meta.durationMs}ms` : '';
    const reqId = meta.requestId ? ` [${meta.requestId}]` : '';
    const msgStr = typeof message === 'object' ? JSON.stringify(redactSensitiveData(message)) : message;
    const extraMeta = Object.entries(meta).filter(
      ([k]) => k !== 'service' && k !== 'durationMs' && k !== 'requestId',
    );
    const metaStr = extraMeta.length > 0 ? ` ${JSON.stringify(Object.fromEntries(extraMeta))}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${contextName}]${reqId} ${msgStr}${dur}${metaStr}`;
  }

  log(message: any, context?: string | StructuredLogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  error(message: any, trace?: string, context?: string | StructuredLogContext) {
    const formatted = this.formatMessage('error', message, context);
    console.error(formatted);
    if (trace && !this.isProd) {
      console.error(trace);
    }
  }

  warn(message: any, context?: string | StructuredLogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  debug(message: any, context?: string | StructuredLogContext) {
    if (!this.isProd) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  verbose(message: any, context?: string | StructuredLogContext) {
    if (!this.isProd) {
      console.log(this.formatMessage('verbose', message, context));
    }
  }
}

export const structuredLogger = new StructuredLogger();
