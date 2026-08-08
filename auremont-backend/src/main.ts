import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
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
      // Allow requests with no origin (server-to-server, mobile apps)
      if (!origin) return callback(null, true);
      const frontendUrl = process.env.FRONTEND_URL || '';
      const isAllowed =
        origin.includes('localhost') ||
        (frontendUrl && origin.startsWith(frontendUrl)) ||
        /\.vercel\.app$/.test(origin) ||
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
  Logger.log(`Backend listening on port ${port}`, 'Bootstrap');
}
bootstrap();
