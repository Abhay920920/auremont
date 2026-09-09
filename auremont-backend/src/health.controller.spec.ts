import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma/prisma.service';
import { NotificationsService } from './notifications/notifications.service';
import { AlertService } from './common/alert.service';

describe('HealthController (Observability & Production Hardening)', () => {
  let controller: HealthController;
  let mockPrisma: any;
  let mockNotifications: any;
  let alertService: AlertService;

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
        AlertService,
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    alertService = module.get<AlertService>(AlertService);
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

  it('should report alert status and channels', () => {
    const alerts = controller.getAlerts();
    expect(alerts.status).toBe('ok');
    expect(alerts.alerts.configuredChannels).toContain('STRUCTURED_LOGS');
  });

  it('should execute non-destructive synthetic alert test drill', async () => {
    const res = await controller.testAlert();
    expect(res.status).toBe('ok');
    expect(res.drill.success).toBe(true);
    expect(res.drill.firedAlert.type).toBe('TEST_ALERT');
  });

  it('should return operational metrics summary from getMetrics', () => {
    const metrics = controller.getMetrics();
    expect(metrics.status).toBe('ok');
    expect(metrics).toHaveProperty('http');
    expect(metrics).toHaveProperty('checkout');
    expect(metrics).toHaveProperty('payments');
    expect(metrics).toHaveProperty('database');
  });

  describe('Production Access Control Boundary', () => {
    const originalEnv = process.env.NODE_ENV;
    const testKey = 'test_internal_production_metrics_key_999';

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      delete process.env.INTERNAL_METRICS_KEY;
    });

    it('should keep /health, /health/liveness, and /health/readiness fully public in production', async () => {
      process.env.NODE_ENV = 'production';
      process.env.INTERNAL_METRICS_KEY = testKey;

      expect(controller.getHealth().status).toBe('ok');
      expect(controller.getLiveness().status).toBe('alive');
      const readiness = await controller.getReadiness();
      expect(readiness.status).toBe('ready');
    });

    it('should deny unauthorized access to /health/outbox and /health/metrics in production', async () => {
      process.env.NODE_ENV = 'production';
      process.env.INTERNAL_METRICS_KEY = testKey;

      // Without headers or with wrong token
      await expect(controller.getOutboxHealth({})).rejects.toThrow(UnauthorizedException);
      expect(() => controller.getMetrics({})).toThrow(UnauthorizedException);
      expect(() => controller.getAlerts({})).toThrow(UnauthorizedException);
      await expect(controller.testAlert({})).rejects.toThrow(UnauthorizedException);
    });

    it('should permit authorized access to internal endpoints in production with valid key', async () => {
      process.env.NODE_ENV = 'production';
      process.env.INTERNAL_METRICS_KEY = testKey;

      const validHeaders = { 'x-internal-key': testKey };
      const outbox = await controller.getOutboxHealth(validHeaders);
      expect(outbox.status).toBe('healthy');

      const metrics = controller.getMetrics(validHeaders);
      expect(metrics.status).toBe('ok');
    });
  });
});

