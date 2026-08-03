import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
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
  async verifyPayment(
    @Body('razorpay_order_id') razorpayOrderId: string,
    @Body('razorpay_payment_id') razorpayPaymentId: string,
    @Body('razorpay_signature') razorpaySignature: string
  ) {
    return this.paymentsService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  }
}

