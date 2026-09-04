import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

const cookieParser = require('cookie-parser');
const compression = require('compression');
import helmet from 'helmet';

import * as cluster from 'node:cluster';
import * as os from 'os';
import * as crypto from 'crypto';

import { validateEnvironment } from './config/env.validation';

async function bootstrap() {
  validateEnvironment();

  const isCluster = process.env.CLUSTER_MODE === 'true';
  const numWorkers = Number(process.env.WORKERS) || Math.min(os.cpus().length, 4);

  // If cluster mode is enabled and this is the primary master process
  if (isCluster && (cluster as any).isPrimary) {
    Logger.log(`Master cluster process ${process.pid} is running. Forking ${numWorkers} worker instances...`, 'ClusterBootstrap');
    for (let i = 0; i < numWorkers; i++) {
      (cluster as any).fork();
    }

    (cluster as any).on('exit', (worker: any, code: number, signal: string) => {
      Logger.warn(`Worker ${worker.process.pid} died (signal: ${signal || code}). Auto-respawning replacement worker...`, 'ClusterBootstrap');
      (cluster as any).fork();
    });
    return;
  }

  console.log(`[Bootstrap] Process ${process.pid} initializing NestFactory...`);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: ['error', 'warn', 'log'],
  });
  console.log(`[Bootstrap] NestFactory initialized. Binding port...`);  
  // Enable Trust Proxy for Render / Vercel / Nginx / Cloudflare load balancers
  app.set('trust proxy', 1);

  // Enterprise Hardening: Helmet Security Headers
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // Enterprise Hardening: Explicit Production & Approved Staging CORS
  const isDev = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging';
  const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '';
  const customAllowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim().replace(/\/$/, ''))
    : [];

  const trustedOrigins = new Set([
    'https://rarenuts.in',
    'https://www.rarenuts.in',
    'https://rarenuts.com',
    'https://www.rarenuts.com',
    'https://auremont.com',
    'https://www.auremont.com',
    'https://auremont-rose.vercel.app',
    'https://auremont.vercel.app',
    ...(frontendUrl ? [frontendUrl] : []),
    ...customAllowedOrigins,
  ]);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, '');
      const isLocalhost = isDev && (/^http:\/\/localhost(:\d+)?$/.test(normalizedOrigin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(normalizedOrigin));
      const isVercel = /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(normalizedOrigin);
      if (trustedOrigins.has(normalizedOrigin) || isLocalhost || isVercel) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin '${origin}' not allowed`), false);
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature', 'x-worker-secret', 'Accept', 'X-Requested-With', 'x-correlation-id'],
  });
  
  app.use(typeof cookieParser === 'function' ? cookieParser() : (cookieParser as any).default());
  app.use(typeof compression === 'function' ? compression() : (compression as any).default());

  // Observability & Request Correlation Tracking
  app.use((req: any, res: any, next: any) => {
    const correlationId =
      req.headers['x-correlation-id'] ||
      req.headers['x-request-id'] ||
      `req_${crypto.randomBytes(8).toString('hex')}`;
    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
  });

  // Security: Enforce 1MB body size limit to prevent DoS via large payloads
  app.useBodyParser('json', { limit: '1mb' });
  app.useBodyParser('urlencoded', { limit: '1mb', extended: true });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enterprise Hardening: Enable Graceful Shutdown Hooks
  app.enableShutdownHooks();

  const server = app.getHttpServer();
  server.keepAliveTimeout = 65000; // 65 seconds for reverse proxies / ALB / Cloudflare
  server.headersTimeout = 66000;   // Must be greater than keepAliveTimeout

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  Logger.log(`Worker process ${process.pid} listening on port ${port}`, 'Bootstrap');
}
bootstrap().catch((err) => {
  console.error('FATAL BOOTSTRAP ERROR:', err);
  process.exit(1);
});
