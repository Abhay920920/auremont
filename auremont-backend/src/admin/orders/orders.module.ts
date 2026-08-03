import { Module } from '@nestjs/common';
import { AdminOrdersController } from './orders.controller';
import { AdminOrdersService } from './orders.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminOrdersController],
  providers: [AdminOrdersService],
})
export class AdminOrdersModule {}
