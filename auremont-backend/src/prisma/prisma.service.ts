import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { structuredLogger } from '../common/structured-logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly poolConfig: {
    connectionLimit: number;
    poolTimeout: number;
    connectTimeout: number;
    pgbouncer: boolean;
  };

  constructor() {
    let dbUrl = process.env.DATABASE_URL || '';
    const poolConfig = {
      connectionLimit: 25,
      poolTimeout: 60,
      connectTimeout: 30,
      pgbouncer: true,
    };

    if (dbUrl) {
      // Ensure clean base URL without query parameters before applying standard production pool flags
      const [baseUrl, query] = dbUrl.split('?');
      const params = new URLSearchParams(query || '');
      params.set('connection_limit', String(poolConfig.connectionLimit));
      params.set('pool_timeout', String(poolConfig.poolTimeout));
      params.set('connect_timeout', String(poolConfig.connectTimeout));
      params.set('pgbouncer', String(poolConfig.pgbouncer));
      dbUrl = `${baseUrl}?${params.toString()}`;
    }

    super(
      dbUrl
        ? {
            datasources: { db: { url: dbUrl } },
            log: [
              { emit: 'event', level: 'error' },
              { emit: 'event', level: 'warn' },
            ],
          }
        : undefined,
    );

    this.poolConfig = poolConfig;
  }

  async onModuleInit() {
    // Attach error & warn event listeners if available
    try {
      (this as any).$on?.('error', (e: any) => {
        structuredLogger.error(`Prisma Client Error: ${e.message}`, undefined, {
          service: 'prisma',
          operation: 'db_error',
        });
      });

      (this as any).$on?.('warn', (e: any) => {
        structuredLogger.warn(`Prisma Client Warning: ${e.message}`, {
          service: 'prisma',
          operation: 'db_warning',
        });
      });
    } catch {
      // Best-effort event hook
    }

    this.$connect()
      .then(() => {
        structuredLogger.log('Prisma connected to PostgreSQL successfully', {
          service: 'prisma',
          operation: 'db_connect',
          poolConfig: this.poolConfig,
        });
      })
      .catch((e: any) => {
        structuredLogger.error(`Prisma initial connection failed: ${e.message || e}`, e?.stack, {
          service: 'prisma',
          operation: 'db_connect_failed',
        });
      });
  }

  getPoolConfig() {
    return { ...this.poolConfig };
  }

  async onModuleDestroy() {
    structuredLogger.log('Prisma disconnecting from PostgreSQL...', {
      service: 'prisma',
      operation: 'db_disconnect',
    });
    await this.$disconnect();
  }
}
