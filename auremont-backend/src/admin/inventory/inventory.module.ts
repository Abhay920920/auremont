import { Module } from '@nestjs/common';
import { AdminInventoryController } from './inventory.controller';
import { AdminInventoryService } from './inventory.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminInventoryController],
  providers: [AdminInventoryService],
})
export class AdminInventoryModule {}
