import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRecoveryService } from './cart-recovery.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRecoveryService],
  exports: [CartService, CartRecoveryService],
})
export class CartModule { }
