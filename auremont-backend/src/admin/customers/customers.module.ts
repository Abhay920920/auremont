import { Module } from '@nestjs/common';
import { AdminCustomersController } from './customers.controller';
import { AdminCustomersService } from './customers.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminCustomersController],
  providers: [AdminCustomersService],
})
export class AdminCustomersModule {}
