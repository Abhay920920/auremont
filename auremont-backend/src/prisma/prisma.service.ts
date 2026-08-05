import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      Logger.log('Prisma connected to PostgreSQL successfully', 'PrismaService');
    } catch (e: any) {
      console.error('Prisma initial connection failed:', e.message || e);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
