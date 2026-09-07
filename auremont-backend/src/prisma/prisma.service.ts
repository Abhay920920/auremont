import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    let dbUrl = process.env.DATABASE_URL || '';
    if (dbUrl && !dbUrl.includes('connection_limit=')) {
      const sep = dbUrl.includes('?') ? '&' : '?';
      dbUrl = `${dbUrl}${sep}connection_limit=25&pool_timeout=45&pgbouncer=true`;
    } else if (dbUrl && dbUrl.includes('connection_limit=50')) {
      dbUrl = dbUrl.replace('connection_limit=50', 'connection_limit=25');
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
