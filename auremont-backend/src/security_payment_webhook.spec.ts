import { PaymentsService } from './payments/payments.service';
import { PrismaService } from './prisma/prisma.service';
import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';

describe('Payment & Webhook Security Unit Tests', () => {
  let service: PaymentsService;
  let mockPrisma: any;

  beforeEach(() => {
    process.env.RAZORPAY_WEBHOOK_SECRET = 'test_webhook_secret_for_tests';
    process.env.RAZORPAY_KEY_SECRET = 'test_key_secret_for_tests';
    process.env.ORDER_TOKEN_SECRET = 'test_order_token_secret_for_tests';
    process.env.JWT_SECRET = 'test_jwt_secret_for_tests';
    delete process.env.ALLOW_MOCK_PAYMENTS;

    mockPrisma = {
      order: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      webhookLog: {
        create: jest.fn(),
        update: jest.fn(),
      },
      payment: {
        upsert: jest.fn(),
      },
      outboxEvent: {
        create: jest.fn(),
      },
      notification: {
        create: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation((cb) => cb(mockPrisma)),
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'order-uuid', payment_status: 'pending', user_id: 'user-uuid', order_number: 'ORD-123' }]),
    };

    service = new PaymentsService(mockPrisma as any);
  });

  test('DENY: Webhook rejects invalid signature', async () => {
    const payload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            order_id: 'order_123',
            id: 'pay_123',
            amount: 100000,
            currency: 'INR',
          },
        },
      },
    };

    await expect(
      service.processPaymentWebhook(payload, 'invalid_signature_hex', Buffer.from(JSON.stringify(payload))),
    ).rejects.toThrow(BadRequestException);
  });

  test('DENY: Webhook rejects missing signature', async () => {
    const payload = { event: 'payment.captured' };
    await expect(
      service.processPaymentWebhook(payload, '', Buffer.from(JSON.stringify(payload))),
    ).rejects.toThrow(BadRequestException);
  });

  test('DENY: Webhook rejects tampered payload with mismatched signature', async () => {
    const originalPayload = {
      event: 'payment.captured',
      id: 'evt_1',
      payload: {
        payment: { entity: { order_id: 'order_1', id: 'pay_1', amount: 1000, currency: 'INR' } },
      },
    };
    const rawBuffer = Buffer.from(JSON.stringify(originalPayload));
    const validSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBuffer)
      .digest('hex');

    // Tampered payload
    const tamperedPayload = {
      ...originalPayload,
      payload: {
        payment: { entity: { order_id: 'order_1', id: 'pay_1', amount: 9999999, currency: 'INR' } },
      },
    };
    const tamperedBuffer = Buffer.from(JSON.stringify(tamperedPayload));

    await expect(
      service.processPaymentWebhook(tamperedPayload, validSignature, tamperedBuffer),
    ).rejects.toThrow(BadRequestException);
  });

  test('DENY: verifyPayment rejects missing parameters', async () => {
    await expect(service.verifyPayment('', 'pay_123', 'sig_123')).rejects.toThrow(BadRequestException);
    await expect(service.verifyPayment('ord_123', '', 'sig_123')).rejects.toThrow(BadRequestException);
    await expect(service.verifyPayment('ord_123', 'pay_123', '')).rejects.toThrow(BadRequestException);
  });

  test('DENY: verifyPayment rejects invalid HMAC signature', async () => {
    await expect(
      service.verifyPayment('order_rzp_123', 'pay_rzp_456', 'bad_signature_hex'),
    ).rejects.toThrow(BadRequestException);
  });

  test('ALLOW: verifyPayment passes with correct HMAC signature', async () => {
    const orderId = 'order_rzp_123';
    const paymentId = 'pay_rzp_456';
    const validSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    mockPrisma.order.findFirst.mockResolvedValue({
      id: 'internal-order-uuid',
      paymentRef: orderId,
      paymentStatus: 'paid', // fast path for unit test
      total: 1000,
    });

    mockPrisma.order.findUnique.mockResolvedValue({
      id: 'internal-order-uuid',
      orderNumber: 'ORD-123',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      total: 1000,
      items: [],
      address: {},
    });

    const res = await service.verifyPayment(orderId, paymentId, validSig);
    expect(res.success).toBe(true);
    expect(res.order.paymentStatus).toBe('paid');
  });

  test('SECURITY: Mock payment mode throws if attempted in production', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.ALLOW_MOCK_PAYMENTS = 'true';

    expect(() => new PaymentsService(mockPrisma as any)).toThrow(
      /ALLOW_MOCK_PAYMENTS cannot be enabled in production or staging mode/,
    );
  });
});
