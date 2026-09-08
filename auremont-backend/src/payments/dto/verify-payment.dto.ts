import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class VerifyPaymentDto {
  @IsString({ message: 'razorpay_order_id must be a string' })
  @IsNotEmpty({ message: 'razorpay_order_id is required' })
  razorpay_order_id: string;

  @IsString({ message: 'razorpay_payment_id must be a string' })
  @IsNotEmpty({ message: 'razorpay_payment_id is required' })
  razorpay_payment_id: string;

  @IsString({ message: 'razorpay_signature must be a string' })
  @IsNotEmpty({ message: 'razorpay_signature is required' })
  razorpay_signature: string;

  @IsOptional()
  @IsUUID('all', { message: 'order_id must be a valid UUID' })
  order_id?: string;
}
