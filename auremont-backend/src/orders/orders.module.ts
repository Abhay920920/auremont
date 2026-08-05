import { Module } from '@nestjs/common';
import { OrdersController, AdminOrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuditModule } from '../audit/audit.module';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [AuditModule, PaymentsModule, NotificationsModule],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule { }
