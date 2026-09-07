import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('Payment Gating & Authoritative Verification Specifications', () => {
  let service: PaymentsService;
  const SECRET = 'test_secret_for_payment_gating_12345';

  const mockOrder = {
    id: 'ord-gating-1234',
    orderNumber: 'ORD-2026-GATING',
    paymentRef: 'order_rzp_gating_123',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    total: '1000.00', // ₹1,000.00 = 100,000 paise
    subtotal: '952.38',
    discount: '0.00',
    shipping: '0.00',
    tax: '47.62',
    createdAt: new Date(),
    items: [],
    address: null,
  };

  let mockPrismaService: any;
  let mockRazorpayFetch: jest.Mock;

  beforeAll(() => {
    process.env.RAZORPAY_KEY_SECRET = SECRET;
    process.env.RAZORPAY_KEY_ID = 'rzp_test_gating_key';
  });

  beforeEach(async () => {
    mockRazorpayFetch = jest.fn();

    mockPrismaService = {
      order: {
        findFirst: jest.fn().mockResolvedValue({ ...mockOrder }),
        findUnique: jest.fn().mockResolvedValue({ ...mockOrder }),
        update: jest.fn().mockImplementation(({ data }) => Promise.resolve({ ...mockOrder, ...data })),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      payment: {
        upsert: jest.fn().mockResolvedValue({ id: 'pay-1' }),
      },
      product: {
        update: jest.fn().mockResolvedValue({ id: 'prod-1', stockQty: 10 }),
      },
      webhookLog: {
        findUnique: jest.fn(),
        create: jest.fn().mockResolvedValue({ id: 'log-1' }),
        update: jest.fn().mockResolvedValue({ id: 'log-1' }),
      },
      outboxEvent: {
        create: jest.fn().mockResolvedValue({ id: 'outbox-1' }),
      },
      notification: {
        create: jest.fn().mockResolvedValue({ id: 'notif-1' }),
      },
      $queryRaw: jest.fn().mockResolvedValue([{ id: mockOrder.id, payment_status: 'pending', order_number: mockOrder.orderNumber }]),
      $transaction: jest.fn((callback) => callback(mockPrismaService)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    (service as any).razorpay = {
      payments: {
        fetch: mockRazorpayFetch,
      },
    };
  });

  function generateValidSignature(orderId: string, paymentId: string): string {
    return crypto
      .createHmac('sha256', SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
  }

  // ── PHASE 7 & 13: CORE PAYMENT VERIFICATION TESTS ───────────────────────────

  describe('Scenario 1: Valid Payment Verification', () => {
    it('authoritatively marks order as PAID only when signature, amount, currency and capture status match', async () => {
      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_valid_999';
      const signature = generateValidSignature(orderId, paymentId);

      mockRazorpayFetch.mockResolvedValueOnce({
        id: paymentId,
        order_id: orderId,
        amount: 100000, // 100,000 paise = ₹1,000.00
        currency: 'INR',
        status: 'captured',
      });

      const response = await service.verifyPayment(orderId, paymentId, signature, mockOrder.id);

      expect(response.success).toBe(true);
      expect(mockRazorpayFetch).toHaveBeenCalledWith(paymentId);
      expect(mockPrismaService.payment.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { orderId: mockOrder.id },
          create: expect.objectContaining({
            status: 'completed',
            verifiedAmount: 1000,
          }),
        }),
      );
      expect(mockPrismaService.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockOrder.id },
          data: expect.objectContaining({
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
          }),
        }),
      );
      expect(mockPrismaService.outboxEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            eventType: 'order_paid',
          }),
        }),
      );
    });
  });

  describe('Scenario 2: Cryptographic Signature Tampering', () => {
    it('rejects verification if signature is forged or invalid, leaving order unpaid', async () => {
      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_valid_999';
      const forgedSignature = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

      await expect(
        service.verifyPayment(orderId, paymentId, forgedSignature),
      ).rejects.toThrow(BadRequestException);

      expect(mockRazorpayFetch).not.toHaveBeenCalled();
      expect(mockPrismaService.payment.upsert).not.toHaveBeenCalled();
      expect(mockPrismaService.order.update).not.toHaveBeenCalled();
    });
  });

  describe('Scenario 3: Amount Mismatch (Underpayment & Overpayment)', () => {
    it('rejects underpayment (expected ₹1000, received ₹999) with AMOUNT_MISMATCH', async () => {
      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_underpay_111';
      const signature = generateValidSignature(orderId, paymentId);

      mockRazorpayFetch.mockResolvedValueOnce({
        id: paymentId,
        order_id: orderId,
        amount: 99900, // 999.00 INR = 99,900 paise (1 rupee short)
        currency: 'INR',
        status: 'captured',
      });

      await expect(
        service.verifyPayment(orderId, paymentId, signature),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.order.update).not.toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ paymentStatus: 'paid' }) }),
      );
    });

    it('rejects overpayment (expected ₹1000, received ₹1001) with AMOUNT_MISMATCH', async () => {
      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_overpay_222';
      const signature = generateValidSignature(orderId, paymentId);

      mockRazorpayFetch.mockResolvedValueOnce({
        id: paymentId,
        order_id: orderId,
        amount: 100100, // 1001.00 INR = 100,100 paise
        currency: 'INR',
        status: 'captured',
      });

      await expect(
        service.verifyPayment(orderId, paymentId, signature),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.order.update).not.toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ paymentStatus: 'paid' }) }),
      );
    });
  });

  describe('Scenario 4: Order ID Mismatches', () => {
    it('rejects payment if Razorpay gateway order does not match internal checkout order', async () => {
      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_mismatch_333';
      const signature = generateValidSignature(orderId, paymentId);

      mockRazorpayFetch.mockResolvedValueOnce({
        id: paymentId,
        order_id: 'order_DIFFERENT_GATEWAY_ID',
        amount: 100000,
        currency: 'INR',
        status: 'captured',
      });

      await expect(
        service.verifyPayment(orderId, paymentId, signature),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects verification if provided internal orderId does not match order record', async () => {
      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_valid_999';
      const signature = generateValidSignature(orderId, paymentId);

      await expect(
        service.verifyPayment(orderId, paymentId, signature, 'wrong-internal-order-uuid'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Scenario 5: Uncaptured Payment Status', () => {
    it('rejects payment if status is authorized but not captured', async () => {
      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_authorized_444';
      const signature = generateValidSignature(orderId, paymentId);

      mockRazorpayFetch.mockResolvedValueOnce({
        id: paymentId,
        order_id: orderId,
        amount: 100000,
        currency: 'INR',
        status: 'authorized', // Not captured
      });

      await expect(
        service.verifyPayment(orderId, paymentId, signature),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Scenario 6: Currency Mismatch', () => {
    it('rejects non-INR currency payments', async () => {
      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_usd_555';
      const signature = generateValidSignature(orderId, paymentId);

      mockRazorpayFetch.mockResolvedValueOnce({
        id: paymentId,
        order_id: orderId,
        amount: 100000,
        currency: 'USD',
        status: 'captured',
      });

      await expect(
        service.verifyPayment(orderId, paymentId, signature),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Scenario 7: Gateway Fetch Failure / Network Timeout', () => {
    it('reverts order to pending and throws GATEWAY_FETCH_FAILED upon gateway error', async () => {
      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_timeout_666';
      const signature = generateValidSignature(orderId, paymentId);

      mockRazorpayFetch.mockRejectedValueOnce(new Error('Gateway timeout'));

      await expect(
        service.verifyPayment(orderId, paymentId, signature),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.order.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockOrder.id, paymentStatus: 'processing' },
          data: { paymentStatus: 'pending' },
        }),
      );
    });
  });

  describe('Scenario 8: Terminal Order States (Cancelled / Failed)', () => {
    it('blocks verification on cancelled orders before initiating gateway query', async () => {
      mockPrismaService.order.findFirst.mockResolvedValueOnce({
        ...mockOrder,
        paymentStatus: 'cancelled',
      });

      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_cancelled_777';
      const signature = generateValidSignature(orderId, paymentId);

      await expect(
        service.verifyPayment(orderId, paymentId, signature),
      ).rejects.toThrow(BadRequestException);

      expect(mockRazorpayFetch).not.toHaveBeenCalled();
    });
  });

  // ── PHASE 8: DUPLICATE VERIFICATION IDEMPOTENCY ─────────────────────────────

  describe('Phase 8: Duplicate Verification Idempotency', () => {
    it('handles 3 consecutive verification calls identically without duplicate side effects', async () => {
      const orderId = 'order_rzp_gating_123';
      const paymentId = 'pay_rzp_duplicate_888';
      const signature = generateValidSignature(orderId, paymentId);

      mockRazorpayFetch.mockResolvedValue({
        id: paymentId,
        order_id: orderId,
        amount: 100000,
        currency: 'INR',
        status: 'captured',
      });

      // Call 1: transitions pending -> paid
      const res1 = await service.verifyPayment(orderId, paymentId, signature);
      expect(res1.success).toBe(true);

      // Simulate that DB order is now 'paid'
      mockPrismaService.order.findFirst.mockResolvedValue({
        ...mockOrder,
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
      });
      mockPrismaService.$queryRaw.mockResolvedValue([
        { id: mockOrder.id, payment_status: 'paid', order_number: mockOrder.orderNumber },
      ]);

      // Call 2: idempotent return
      const res2 = await service.verifyPayment(orderId, paymentId, signature);
      expect(res2.success).toBe(true);

      // Call 3: idempotent return
      const res3 = await service.verifyPayment(orderId, paymentId, signature);
      expect(res3.success).toBe(true);

      // Exactly 1 payment upsert and 1 outbox event occurred in Call 1
      expect(mockPrismaService.payment.upsert).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.outboxEvent.create).toHaveBeenCalledTimes(1);
    });
  });

  // ── PHASE 9: WEBHOOK RECONCILIATION & SAFETY ─────────────────────────────────

  describe('Phase 9: Webhook Safety & Idempotency', () => {
    const webhookSecret = 'test_webhook_secret_99999';

    beforeAll(() => {
      process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;
    });

    function generateWebhookSignature(body: Buffer): string {
      return crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
    }

    it('processes valid payment.captured webhook and marks order paid', async () => {
      const payload = {
        event: 'payment.captured',
        id: 'evt_test_001',
        payload: {
          payment: {
            entity: {
              id: 'pay_hook_001',
              order_id: 'order_rzp_gating_123',
              amount: 100000,
              currency: 'INR',
            },
          },
        },
      };

      const rawBody = Buffer.from(JSON.stringify(payload));
      const signature = generateWebhookSignature(rawBody);

      await service.processPaymentWebhook(payload, signature, rawBody);

      expect(mockPrismaService.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ paymentStatus: 'paid' }),
        }),
      );
    });

    it('rejects webhook with invalid signature', async () => {
      const payload = { event: 'payment.captured', id: 'evt_test_002' };
      const rawBody = Buffer.from(JSON.stringify(payload));

      await expect(
        service.processPaymentWebhook(payload, 'bad_signature_hex', rawBody),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects webhook with amount mismatch', async () => {
      const payload = {
        event: 'payment.captured',
        id: 'evt_test_003',
        payload: {
          payment: {
            entity: {
              id: 'pay_hook_003',
              order_id: 'order_rzp_gating_123',
              amount: 50000, // ₹500 vs ₹1000 expected
              currency: 'INR',
            },
          },
        },
      };

      const rawBody = Buffer.from(JSON.stringify(payload));
      const signature = generateWebhookSignature(rawBody);

      await expect(
        service.processPaymentWebhook(payload, signature, rawBody),
      ).rejects.toThrow(BadRequestException);
    });

    it('is idempotent on duplicate webhook events (P2002 duplicate key)', async () => {
      const payload = {
        event: 'payment.captured',
        id: 'evt_duplicate_004',
        payload: {
          payment: {
            entity: {
              id: 'pay_hook_004',
              order_id: 'order_rzp_gating_123',
              amount: 100000,
              currency: 'INR',
            },
          },
        },
      };

      const rawBody = Buffer.from(JSON.stringify(payload));
      const signature = generateWebhookSignature(rawBody);

      // Simulate Prisma throwing P2002 on duplicate webhookLog eventId
      mockPrismaService.$transaction.mockRejectedValueOnce({ code: 'P2002' });

      const result = await service.processPaymentWebhook(payload, signature, rawBody);
      expect(result).toEqual({ received: true, message: 'Event already processed' });
    });
  });
});
