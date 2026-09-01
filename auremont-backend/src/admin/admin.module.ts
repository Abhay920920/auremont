import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminDashboardController } from './dashboard/dashboard.controller';
import { AdminDashboardService } from './dashboard/dashboard.service';
import { AdminProductsController } from './products/admin-products.controller';
import { AdminProductsService } from './products/admin-products.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AdminOrdersModule } from './orders/orders.module';
import { AdminCustomersModule } from './customers/customers.module';
import { AdminInventoryModule } from './inventory/inventory.module';
import { AdminReviewsModule } from './reviews/reviews.module';
import { AdminOperationsModule } from './operations/operations.module';

@Module({
  imports: [
    PrismaModule,
    AdminOrdersModule,
    AdminCustomersModule,
    AdminInventoryModule,
    AdminReviewsModule,
    AdminOperationsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'AUREMONT_LUXURY_SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AdminDashboardController, AdminProductsController],
  providers: [AdminDashboardService, AdminProductsService],
})
export class AdminModule {}
