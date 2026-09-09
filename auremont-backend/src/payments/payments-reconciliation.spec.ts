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

  it('Case B: should reconcile pending order when payment is authorized (auto-capture pipeline)', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-CASE-B',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    mockPrisma.$queryRaw.mockResolvedValue([
      { id: validOrderId, payment_status: 'pending', order_number: 'ORD-REC-CASE-B' },
    ]);

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockResolvedValue({
          items: [
            {
              id: 'pay_rzp_authorized_1',
              order_id: rzpOrderId,
              amount: 150000,
              currency: 'INR',
              status: 'authorized', // authorized status
            },
          ],
        }),
      },
    };

    const res = await service.reconcilePendingPayments(5, 10);
    expect(res.reconciledCount).toBe(1);
    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: validOrderId },
      data: { paymentStatus: 'paid', orderStatus: 'confirmed' },
    });
  });

  it('Case D: should reject payment when gateway order_id does not match paymentRef', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-CASE-D',
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
              id: 'pay_rzp_wrong_order',
              order_id: 'order_rzp_DIFFERENT_123', // Mismatch
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
    expect(res.results[0].status).toBe('gateway_order_id_mismatch');
    expect(mockPrisma.order.update).not.toHaveBeenCalled();
  });

  it('Case G: Duplicate reconciliation executed twice produces exactly one logical payment transition', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-CASE-G',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    // Pass 1: Pending
    mockPrisma.$queryRaw.mockResolvedValueOnce([
      { id: validOrderId, payment_status: 'pending', order_number: 'ORD-REC-CASE-G' },
    ]);

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockResolvedValue({
          items: [
            {
              id: 'pay_rzp_dup_check',
              order_id: rzpOrderId,
              amount: 150000,
              currency: 'INR',
              status: 'captured',
            },
          ],
        }),
      },
    };

    const run1 = await service.reconcilePendingPayments(5, 10);
    expect(run1.reconciledCount).toBe(1);
    expect(mockPrisma.order.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.outboxEvent.create).toHaveBeenCalledTimes(1);

    // Pass 2: Order is now paid in DB
    mockPrisma.$queryRaw.mockResolvedValueOnce([
      { id: validOrderId, payment_status: 'paid', order_number: 'ORD-REC-CASE-G' },
    ]);

    const run2 = await service.reconcilePendingPayments(5, 10);
    expect(run2.reconciledCount).toBe(0);
    expect(run2.alreadyPaidCount).toBe(1);
    // order.update and outboxEvent.create must NOT be called again
    expect(mockPrisma.order.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.outboxEvent.create).toHaveBeenCalledTimes(1);
  });

  it('Case H: Gateway network timeout handled gracefully without corrupting state', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-CASE-H',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockRejectedValue(new Error('Gateway connection timed out')),
      },
    };

    const res = await service.reconcilePendingPayments(5, 10);
    expect(res.reconciledCount).toBe(0);
    expect(res.failedCount).toBe(1);
    expect(res.results[0].status).toBe('error');
    expect(res.results[0].error).toContain('timed out');
    expect(mockPrisma.order.update).not.toHaveBeenCalled();
  });

  it('Case I: Gateway malformed response handled safely without false payment success', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-CASE-I',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        // Malformed non-array or null items
        fetchPayments: jest.fn().mockResolvedValue(null),
      },
    };

    const res = await service.reconcilePendingPayments(5, 10);
    expect(res.reconciledCount).toBe(0);
    expect(res.results[0].status).toBe('unpaid_at_gateway');
    expect(mockPrisma.order.update).not.toHaveBeenCalled();
  });

  it('Case J: Database failure during transition records batch error and preserves order for retry', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-CASE-J',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    mockPrisma.$transaction.mockRejectedValue(new Error('P2024: Connection pool timeout'));

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockResolvedValue({
          items: [
            {
              id: 'pay_rzp_db_fail',
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
    expect(res.failedCount).toBe(1);
    expect(res.results[0].status).toBe('error');
    expect(res.results[0].error).toContain('Connection pool timeout');
  });

  it('Case K: Transaction atomicity guarantees order update and outbox creation succeed or fail together', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      {
        id: validOrderId,
        orderNumber: 'ORD-REC-CASE-K',
        paymentRef: rzpOrderId,
        total: '1500.00',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    mockPrisma.$queryRaw.mockResolvedValue([
      { id: validOrderId, payment_status: 'pending', order_number: 'ORD-REC-CASE-K' },
    ]);

    (service as any).isMock = false;
    (service as any).razorpay = {
      orders: {
        fetchPayments: jest.fn().mockResolvedValue({
          items: [
            {
              id: 'pay_rzp_atomic_test',
              order_id: rzpOrderId,
              amount: 150000,
              currency: 'INR',
              status: 'captured',
            },
          ],
        }),
      },
    };

    await service.reconcilePendingPayments(5, 10);

    // Verify both order.update and outboxEvent.create were called within the single transaction scope
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockPrisma.order.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.outboxEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          eventType: 'order_paid',
          payload: expect.objectContaining({
            orderId: validOrderId,
            source: 'reconciliation',
          }),
        }),
      }),
    );
  });
});
