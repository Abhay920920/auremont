import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../prisma/prisma.service.mock';
import * as crypto from 'crypto';

describe('PaymentsService Unit Tests', () => {
  let paymentsService: PaymentsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  describe('createRazorpayOrder', () => {
    it('should generate razorpay order session details', async () => {
      const order = { id: 'ord-123', total: '1499.00', paymentStatus: 'pending' };
      prismaMock._seed('orders', [order]);

      const result = await paymentsService.createRazorpayOrder('ord-123', 1499);
      expect(result).toBeDefined();
      expect(result.amount).toBe(149900); // 1499 in paise
      expect(result.currency).toBe('INR');
      expect(result.razorpayOrderId).toBeDefined();
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment signature and update order status to paid', async () => {
      const mockRazorpayOrderId = 'order_mock_123';
      const mockPaymentId = 'pay_mock_456';
      const order = { id: 'order-001', paymentRef: mockRazorpayOrderId, total: '1499.00', paymentStatus: 'pending', orderStatus: 'placed' };
      prismaMock._seed('orders', [order]);

      const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_12345';
      
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${mockRazorpayOrderId}|${mockPaymentId}`)
        .digest('hex');

      const result = await paymentsService.verifyPayment(
        mockRazorpayOrderId,
        mockPaymentId,
        generatedSignature
      );

      expect(result.success).toBe(true);
      
      const updatedOrder = await prismaMock.order.findUnique({ where: { id: 'order-001' } });
      expect(updatedOrder.paymentStatus).toBe('paid');
      expect(updatedOrder.orderStatus).toBe('confirmed');
    });
  });
});
