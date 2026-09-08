import { Controller, Post, Body, Headers, HttpCode, Req, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() payload: any, 
    @Headers('x-razorpay-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.paymentsService.processPaymentWebhook(payload, signature, req.rawBody);
  }

  @Post('verify')
  @HttpCode(200)
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // Allow retries: 30 verifications per minute per IP
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(
      dto.razorpay_order_id,
      dto.razorpay_payment_id,
      dto.razorpay_signature,
      dto.order_id,
    );
  }
}

