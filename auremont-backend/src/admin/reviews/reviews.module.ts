import { Module } from '@nestjs/common';
import { AdminReviewsController } from './reviews.controller';
import { AdminReviewsService } from './reviews.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminReviewsController],
  providers: [AdminReviewsService],
})
export class AdminReviewsModule {}
