import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Prisma connected to PostgreSQL successfully');
    } catch (e: any) {
      console.error('Prisma initial connection failed:', e.message || e);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
