import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(private readonly prisma: PrismaService) {
    // In production, these should be in .env (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
    // Using a fallback only if they are missing so it doesn't crash in dev.
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_12345';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'secret_12345';
    
    this.razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  }

  /**
   * Creates a Razorpay order right after internal Order creation.
   * amount is expected to be in standard units (INR) and will be converted to paise (amount * 100).
   */
  async createRazorpayOrder(orderId: string, amount: number, currency: string = 'INR') {
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: orderId,
    };

    try {
      let rpOrder;
      
      // If we are using the fallback dummy keys, mock the response instead of hitting the real API
      if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_12345') {
        rpOrder = {
          id: `order_mock_${Date.now()}`,
          amount: options.amount,
          currency: options.currency,
        };
      } else {
        rpOrder = await this.razorpay.orders.create(options);
      }
      
      // Save the razorpay order id to our database as paymentRef
      await this.prisma.order.update({
        where: { id: orderId },
        data: { paymentRef: rpOrder.id },
      });

      return {
        paymentProvider: 'razorpay',
        razorpayOrderId: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new BadRequestException('Failed to initialize payment gateway.');
    }
  }

  /**
   * Handles the Razorpay Webhook with WebhookLog Idempotency.
   * Expects 'payment.captured' or 'order.paid' events.
   */
  async processPaymentWebhook(payload: any, signature: string) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_12345';
    
    // 1. Verify Signature (in production or when secret present)
    if (process.env.NODE_ENV === 'production' || process.env.RAZORPAY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new BadRequestException('Invalid webhook signature');
      }
    }

    const { event } = payload;
    const eventId = payload.id || `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const db = this.prisma as any;

    // 2. Webhook Idempotency Check via WebhookLog
    const existingLog = await db.webhookLog.findUnique({
      where: { eventId },
    });

    if (existingLog) {
      return { received: true, message: 'Event already processed' };
    }

    // 3. Process Event
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const transactionId = paymentEntity?.id;
      const amount = paymentEntity ? paymentEntity.amount / 100 : 0;

      const order = await this.prisma.order.findFirst({
        where: { paymentRef: razorpayOrderId }
      });

      if (!order) {
        await db.webhookLog.create({
          data: { provider: 'razorpay', eventId, eventType: event, payload, status: 'ignored' }
        });
        throw new NotFoundException(`Order with paymentRef ${razorpayOrderId} not found`);
      }

      if (order.paymentStatus === 'paid') {
        await db.webhookLog.create({
          data: { provider: 'razorpay', eventId, eventType: event, payload, status: 'already_paid' }
        });
        return { received: true, message: 'Already processed' };
      }

      // Financial validation
      const expectedAmount = Number(order.total);
      if (Math.abs(amount - expectedAmount) > 0.01) {
        await db.webhookLog.create({
          data: { provider: 'razorpay', eventId, eventType: event, payload, status: 'amount_mismatch' }
        });
        throw new BadRequestException(`Amount mismatch. Expected ${expectedAmount}, received ${amount}`);
      }

      // 4. Atomic Transaction for Payment & Outbox Event
      await this.prisma.$transaction(async (tx) => {
        await tx.payment.upsert({
          where: { orderId: order.id },
          update: {
            transactionId,
            status: 'completed',
            paidAt: new Date(),
          },
          create: {
            orderId: order.id,
            provider: 'razorpay',
            transactionId,
            amount: amount,
            currency: paymentEntity?.currency || 'INR',
            status: 'completed',
            paidAt: new Date(),
          }
        });

        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
          }
        });

        await (tx as any).webhookLog.create({
          data: { provider: 'razorpay', eventId, eventType: event, payload, status: 'processed' }
        });

        await (tx as any).outboxEvent.create({
          data: {
            eventType: 'order_paid',
            payload: { orderId: order.id, transactionId, amount }
          }
        });
      });
    }

    return { received: true };
  }

  /**
   * Synchronous frontend payment verification
   */
  async verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, signature: string) {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_12345';

    // Mock bypass
    const isMock = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_12345';
    if (!isMock) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new BadRequestException('Invalid payment signature');
      }
    }

    const order = await this.prisma.order.findFirst({
      where: { paymentRef: razorpayOrderId }
    });

    if (!order) {
      throw new NotFoundException(`Order with paymentRef ${razorpayOrderId} not found`);
    }

    // SECURITY: Double-spend prevention
    if (order.paymentStatus === 'paid') {
      return { success: true, message: 'Already processed' };
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.upsert({
        where: { orderId: order.id },
        update: {
          transactionId: razorpayPaymentId,
          status: 'completed',
          paidAt: new Date(),
        },
        create: {
          orderId: order.id,
          provider: 'razorpay',
          transactionId: razorpayPaymentId,
          amount: Number(order.total),
          currency: 'INR',
          status: 'completed',
          paidAt: new Date(),
        }
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
        }
      });
    });

    return { success: true };
  }
}

