import { Controller, Post, Body, Headers, HttpCode, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() payload: any, 
    @Headers('x-razorpay-signature') signature: string
  ) {
    return this.paymentsService.processPaymentWebhook(payload, signature);
  }

  @Post('verify')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Max 5 verifications per minute per IP
  async verifyPayment(
    @Body('razorpay_order_id') razorpayOrderId: string,
    @Body('razorpay_payment_id') razorpayPaymentId: string,
    @Body('razorpay_signature') razorpaySignature: string
  ) {
    return this.paymentsService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  }
}

