import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';

import * as cluster from 'node:cluster';
import * as os from 'os';

async function bootstrap() {
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

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
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

  // Enterprise Hardening: Dynamic Production & Vercel CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const frontendUrl = process.env.FRONTEND_URL || '';
      const isAllowed =
        origin.includes('localhost') ||
        (frontendUrl && origin.startsWith(frontendUrl)) ||
        /\.vercel\.app$/.test(origin) ||
        /\.rarenuts\.in$/.test(origin) ||
        /\.rarenuts\.com$/.test(origin) ||
        /\.auremont\.com$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin '${origin}' not allowed`), false);
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature', 'Accept', 'X-Requested-With'],
  });
  
  app.use(cookieParser());
  app.use(compression());

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

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  Logger.log(`Worker process ${process.pid} listening on port ${port}`, 'Bootstrap');
}
bootstrap();
