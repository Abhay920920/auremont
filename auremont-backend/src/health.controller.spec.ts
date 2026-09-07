import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma/prisma.service';
import { NotificationsService } from './notifications/notifications.service';

describe('HealthController (Observability & Production Hardening)', () => {
  let controller: HealthController;
  let mockPrisma: any;
  let mockNotifications: any;

  beforeEach(async () => {
    mockPrisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
      getPoolConfig: jest.fn().mockReturnValue({
        connectionLimit: 25,
        poolTimeout: 60,
        connectTimeout: 30,
        pgbouncer: true,
      }),
    };

    mockNotifications = {
      getOutboxMetrics: jest.fn().mockResolvedValue({
        status: 'healthy',
        pendingCount: 0,
        processingCount: 0,
        failedCount: 0,
        processedCount: 15,
        oldestPendingAgeSeconds: 0,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return pure liveness without touching database', () => {
    const liveness = controller.getLiveness();
    expect(liveness.status).toBe('alive');
    expect(liveness.uptime).toBeGreaterThanOrEqual(0);
    expect(mockPrisma.$queryRaw).not.toHaveBeenCalled();
  });

  it('should return basic health metadata', () => {
    const health = controller.getHealth();
    expect(health.status).toBe('ok');
    expect(health.memory).toHaveProperty('heap_used_mb');
  });

  it('should return readiness with database latency', async () => {
    const readiness = await controller.getReadiness();
    expect(readiness.status).toBe('ready');
    expect(readiness.database.status).toBe('connected');
    expect(readiness.database).toHaveProperty('latency_ms');
  });

  it('should report outbox health metrics', async () => {
    const outbox = await controller.getOutboxHealth();
    expect(outbox.status).toBe('healthy');
    expect(outbox.outbox.processedCount).toBe(15);
    expect(mockNotifications.getOutboxMetrics).toHaveBeenCalled();
  });

  it('should report composite detailed health', async () => {
    const detailed = await controller.getDetailedHealth();
    expect(detailed.status).toBe('healthy');
    expect(detailed.readiness.status).toBe('ready');
    expect(detailed.outbox.status).toBe('healthy');
    expect(detailed.pool.connectionLimit).toBe(25);
  });
});
