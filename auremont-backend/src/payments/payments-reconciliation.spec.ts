import { PaymentsService } from './payments.service';

describe('PaymentsService — Payment Reconciliation & Recovery Specifications', () => {
  let service: PaymentsService;
  let mockPrisma: any;

  const validOrderId = '11111111-1111-4111-a111-111111111111';
  const rzpOrderId = 'order_rzp_reconcile_999';

  beforeEach(() => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_reconcile_id';
    process.env.RAZORPAY_KEY_SECRET = 'rzp_test_reconcile_secret';

    mockPrisma = {
      order: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      payment: {
        upsert: jest.fn().mockResolvedValue({ id: 'payment-1' }),
      },
      outboxEvent: {
        create: jest.fn().mockResolvedValue({ id: 'outbox-1' }),
      },
      $queryRaw: jest.fn(),
      $transaction: jest.fn(async (cb) => cb(mockPrisma)),
    };

    service = new PaymentsService(mockPrisma as any);
  });

  it('should reconcile pending order when gateway captures payment (App Crash Recovery)', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-101',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins old
      },
    ]);

    // SELECT ... FOR UPDATE returns pending order
    mockPrisma.$queryRaw.mockResolvedValue([
      { id: validOrderId, payment_status: 'pending', order_number: 'ORD-REC-101' },
    ]);

    // Mock fetchPayments from gateway
    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockResolvedValue({
          items: [
            {
              id: 'pay_rzp_rec_success_1',
              order_id: rzpOrderId,
              amount: 150000, // exact integer paise for ₹1500.00
              currency: 'INR',
              status: 'captured',
            },
          ],
        }),
      },
    };

    const res = await service.reconcilePendingPayments(5, 10);

    expect(res.checkedCount).toBe(1);
    expect(res.reconciledCount).toBe(1);
    expect(res.alreadyPaidCount).toBe(0);
    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: validOrderId },
      data: { paymentStatus: 'paid', orderStatus: 'confirmed' },
    });
    expect(mockPrisma.payment.upsert).toHaveBeenCalled();
    expect(mockPrisma.outboxEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ eventType: 'order_paid' }),
      }),
    );
  });

  it('should handle already-paid order idempotently without updating or dispatching duplicate events', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-102',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    // Locked row already indicates 'paid' (e.g. concurrent webhook completed first)
    mockPrisma.$queryRaw.mockResolvedValue([
      { id: validOrderId, payment_status: 'paid', order_number: 'ORD-REC-102' },
    ]);

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockResolvedValue({
          items: [
            {
              id: 'pay_rzp_rec_success_2',
              order_id: rzpOrderId,
              amount: 150000,
              currency: 'INR',
              status: 'captured',
            },
          ],
        }),
      },
    };

    const res = await service.reconcilePendingPayments(5, 10);

    expect(res.checkedCount).toBe(1);
    expect(res.reconciledCount).toBe(0);
    expect(res.alreadyPaidCount).toBe(1);
    expect(mockPrisma.order.update).not.toHaveBeenCalled();
  });

  it('should preserve terminal payment status (cancelled/failed) and avoid downgrading or reopening', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-103',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    // Locked row shows cancelled
    mockPrisma.$queryRaw.mockResolvedValue([
      { id: validOrderId, payment_status: 'cancelled', order_number: 'ORD-REC-103' },
    ]);

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockResolvedValue({
          items: [
            {
              id: 'pay_rzp_rec_late_capture',
              order_id: rzpOrderId,
              amount: 150000,
              currency: 'INR',
              status: 'captured',
            },
          ],
        }),
      },
    };

    const res = await service.reconcilePendingPayments(5, 10);

    expect(res.reconciledCount).toBe(0);
    // Dispatches operational alert outbox event
    expect(mockPrisma.outboxEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ eventType: 'payment_received_for_terminal_order' }),
      }),
    );
    // Never marks cancelled order as paid
    expect(mockPrisma.order.update).not.toHaveBeenCalled();
  });

  it('should reject reconciliation if gateway amount does not match internal order total exactly', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-104',
        paymentRef: rzpOrderId,
        total: '1500.00', // expected 150,000 paise
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockResolvedValue({
          items: [
            {
              id: 'pay_rzp_underpaid',
              order_id: rzpOrderId,
              amount: 100000, // only 100,000 paise (underpayment)
              currency: 'INR',
              status: 'captured',
            },
          ],
        }),
      },
    };

    const res = await service.reconcilePendingPayments(5, 10);

    expect(res.reconciledCount).toBe(0);
    expect(res.results[0].status).toBe('amount_mismatch');
    expect(mockPrisma.order.update).not.toHaveBeenCalled();
  });

  it('should reject reconciliation if gateway currency is not INR', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-105',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockResolvedValue({
          items: [
            {
              id: 'pay_rzp_foreign_currency',
              order_id: rzpOrderId,
              amount: 150000,
              currency: 'USD',
              status: 'captured',
            },
          ],
        }),
      },
    };

    const res = await service.reconcilePendingPayments(5, 10);

    expect(res.reconciledCount).toBe(0);
    expect(res.results[0].status).toBe('currency_mismatch');
    expect(mockPrisma.order.update).not.toHaveBeenCalled();
  });

  it('should leave order pending if gateway has no captured payments', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-106',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockResolvedValue({
          items: [], // no payments on gateway
        }),
      },
    };

    const res = await service.reconcilePendingPayments(5, 10);

    expect(res.checkedCount).toBe(1);
    expect(res.reconciledCount).toBe(0);
    expect(res.results[0].status).toBe('unpaid_at_gateway');
    expect(mockPrisma.order.update).not.toHaveBeenCalled();
  });
});
