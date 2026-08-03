import { Module } from '@nestjs/common';
import { AdminOperationsController } from './operations.controller';
import { AdminOperationsService } from './operations.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminOperationsController],
  providers: [AdminOperationsService],
})
export class AdminOperationsModule {}
