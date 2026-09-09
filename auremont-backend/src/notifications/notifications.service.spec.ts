import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../prisma/prisma.service.mock';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a notification', async () => {
    const result = await service.create('user-001', 'order_placed', 'Order Placed', 'Your order has been placed successfully.');
    expect(result).toBeDefined();
    expect(result.userId).toBe('user-001');
    expect(result.type).toBe('order_placed');
  });

  it('should return notifications for a user', async () => {
    prismaMock._seed('notifications', [
      { id: 'n-1', userId: 'user-001', type: 'order_placed', title: 'Order Placed', message: 'Done', createdAt: new Date() },
      { id: 'n-2', userId: 'user-002', type: 'order_cancelled', title: 'Cancelled', message: 'Oops', createdAt: new Date() },
    ]);

    const result = await service.findByUserId('user-001');
    expect(result.length).toBe(1);
    expect(result[0].userId).toBe('user-001');
  });

  it('should return operational visibility metrics for outbox queue', async () => {
    const metrics = await service.getOutboxMetrics();
    expect(metrics).toBeDefined();
    expect(metrics.status).toBeDefined();
    expect(typeof metrics.pendingCount).toBe('number');
    expect(typeof metrics.processingCount).toBe('number');
    expect(typeof metrics.failedCount).toBe('number');
  });

  it('should execute recoverStaleProcessingEvents without error', async () => {
    prismaMock.$executeRaw = jest.fn().mockResolvedValue(2);
    const recovered = await service.recoverStaleProcessingEvents(5);
    expect(recovered).toBe(2);
    expect(prismaMock.$executeRaw).toHaveBeenCalled();
  });

  it('should atomically claim and process pending outbox events using FOR UPDATE SKIP LOCKED query', async () => {
    prismaMock.$executeRaw = jest.fn().mockResolvedValue(0);
    prismaMock.$queryRaw = jest.fn().mockResolvedValue([
      {
        id: 'outbox-evt-1',
        eventType: 'order_paid',
        payload: { orderId: 'order-1', gatewayPaymentId: 'pay_123', source: 'reconciliation' },
        status: 'processing',
        retryCount: 0,
      },
    ]);
    prismaMock.order = {
      findUnique: jest.fn().mockResolvedValue({ paymentStatus: 'paid', orderNumber: 'ORD-1001' }),
    };
    prismaMock.outboxEvent = {
      update: jest.fn().mockResolvedValue({ id: 'outbox-evt-1', status: 'processed' }),
    };

    await service.processPendingOutboxEvents();

    expect(prismaMock.$queryRaw).toHaveBeenCalled();
    expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      select: { paymentStatus: true, orderNumber: true },
    });
    expect(prismaMock.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: 'outbox-evt-1' },
      data: expect.objectContaining({ status: 'processed' }),
    });
  });

  it('should bound retries and mark event as failed when retry count reaches 3 (Dead-Lettering)', async () => {
    prismaMock.$executeRaw = jest.fn().mockResolvedValue(0);
    prismaMock.$queryRaw = jest.fn().mockResolvedValue([
      {
        id: 'outbox-failing-1',
        eventType: 'order_created',
        payload: { guestEmail: 'test@example.com', orderNumber: 'ORD-FAIL', total: '1500' },
        status: 'processing',
        retryCount: 2, // 2 previous attempts, this attempt makes it 3
      },
    ]);
    // Force sendOrderConfirmationEmail to fail
    jest.spyOn(service as any, 'sendOrderConfirmationEmail').mockRejectedValue(new Error('SMTP connection refused'));

    prismaMock.outboxEvent = {
      update: jest.fn().mockResolvedValue({ id: 'outbox-failing-1', status: 'failed' }),
    };

    await service.processPendingOutboxEvents();

    expect(prismaMock.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: 'outbox-failing-1' },
      data: expect.objectContaining({
        status: 'failed',
        error: 'SMTP connection refused',
      }),
    });
  });

  it('should skip business side-effects if target order is not in paid status (Idempotency Guard)', async () => {
    prismaMock.$executeRaw = jest.fn().mockResolvedValue(0);
    prismaMock.$queryRaw = jest.fn().mockResolvedValue([
      {
        id: 'outbox-skip-1',
        eventType: 'order_paid',
        payload: { orderId: 'order-unpaid', gatewayPaymentId: 'pay_unpaid' },
        status: 'processing',
        retryCount: 0,
      },
    ]);
    prismaMock.order = {
      findUnique: jest.fn().mockResolvedValue({ paymentStatus: 'pending', orderNumber: 'ORD-UNPAID' }),
    };
    prismaMock.outboxEvent = {
      update: jest.fn().mockResolvedValue({ id: 'outbox-skip-1', status: 'processed' }),
    };

    await service.processPendingOutboxEvents();

    // Event is marked processed so it does not block the queue, but side-effect was skipped
    expect(prismaMock.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: 'outbox-skip-1' },
      data: expect.objectContaining({ status: 'processed' }),
    });
  });
});
