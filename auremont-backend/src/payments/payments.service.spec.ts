import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('PaymentsService Unit Tests', () => {
  let service: PaymentsService;

  const mockOrder = {
    id: 'ord-1234',
    orderNumber: 'ORD-2026-1234',
    paymentRef: 'order_mock_1234',
    paymentStatus: 'pending',
    total: '1299.00',
  };

  const mockPrismaService = {
    order: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      upsert: jest.fn(),
    },
    webhookLog: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    jest.clearAllMocks();
  });

  describe('createRazorpayOrder', () => {
    it('creates razorpay order session and attaches paymentRef to order', async () => {
      mockPrismaService.order.update.mockResolvedValue(mockOrder);

      const session = await service.createRazorpayOrder('ord-1234', 1299.00, 'INR');

      expect(session.paymentProvider).toBe('razorpay');
      expect(session.amount).toBe(129900); // 1299 * 100 paise
      expect(mockPrismaService.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ord-1234' },
        }),
      );
    });
  });

  describe('verifyPayment', () => {
    it('verifies razorpay signature and updates order status to paid inside $transaction', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(mockOrder);
      mockPrismaService.payment.upsert.mockResolvedValue({ id: 'pay-1' });
      mockPrismaService.order.update.mockResolvedValue({ ...mockOrder, paymentStatus: 'paid' });

      const secret = 'secret_12345';
      const orderId = 'order_mock_1234';
      const paymentId = 'pay_mock_5678';
      const validSignature = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const result = await service.verifyPayment(orderId, paymentId, validSignature);

      expect(result.success).toBe(true);
      expect(mockPrismaService.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ paymentStatus: 'paid', orderStatus: 'confirmed' }),
        }),
      );
    });

    it('rejects verification if double-spend is attempted on an already paid order', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue({
        ...mockOrder,
        paymentStatus: 'paid',
      });

      const result = await service.verifyPayment('order_mock_1234', 'pay_mock_5678', 'signature');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Already processed');
      expect(mockPrismaService.payment.upsert).not.toHaveBeenCalled();
    });
  });
});
