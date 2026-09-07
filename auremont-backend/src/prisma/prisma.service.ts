import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    let dbUrl = process.env.DATABASE_URL || '';
    if (dbUrl) {
      // Ensure clean base URL without query parameters before applying standard production pool flags
      const [baseUrl, query] = dbUrl.split('?');
      const params = new URLSearchParams(query || '');
      params.set('connection_limit', '25');
      params.set('pool_timeout', '60');
      params.set('connect_timeout', '30');
      params.set('pgbouncer', 'true');
      dbUrl = `${baseUrl}?${params.toString()}`;
    }
    super(dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined);
  }

  async onModuleInit() {
    this.$connect()
      .then(() => {
        Logger.log('Prisma connected to PostgreSQL successfully (pool: 25, PgBouncer)', 'PrismaService');
      })
      .catch((e: any) => {
        console.error('Prisma initial connection failed:', e.message || e);
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
