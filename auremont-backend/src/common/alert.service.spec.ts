import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    service = new AlertService();
  });

  it('should dispatch structured alert and record firing status', async () => {
    const alert = await service.dispatchAlert(
      'DATABASE_TIMEOUT',
      'CRITICAL',
      'Database Timeout Exceeded',
      'Query exceeded pool timeout',
      { query: 'SELECT 1', durationMs: 5200 },
    );

    expect(alert).toBeDefined();
    expect(alert.status).toBe('FIRING');
    expect(alert.type).toBe('DATABASE_TIMEOUT');
    expect(alert.severity).toBe('CRITICAL');
    expect(alert.channelDelivered).toContain('STRUCTURED_LOGS');

    const status = service.getAlertStatus();
    expect(status.activeAlertCount).toBe(1);
    expect(status.recentAlerts[0].id).toBe(alert.id);
  });

  it('should sanitize sensitive metadata before logging or sending alert', async () => {
    const alert = await service.dispatchAlert(
      'PAYMENT_FAILURE',
      'ERROR',
      'Payment Verification Failed',
      'Razorpay verification error',
      {
        orderId: 'ord_123',
        razorpay_secret: 'super_secret_key',
        passwordHash: 'hash1234',
        nested: { api_key: 'key_xyz', normalField: 'safeValue' },
      },
    );

    expect(alert.metadata?.orderId).toBe('ord_123');
    expect(alert.metadata?.razorpay_secret).toBe('[REDACTED]');
    expect(alert.metadata?.passwordHash).toBe('[REDACTED]');
    expect(alert.metadata?.nested?.api_key).toBe('[REDACTED]');
    expect(alert.metadata?.nested?.normalField).toBe('safeValue');
  });

  it('should safely resolve an active alert', async () => {
    await service.dispatchAlert(
      'OUTBOX_BACKLOG',
      'WARNING',
      'Outbox Backlog Detected',
      'Pending events > 50',
    );

    const resolved = service.resolveAlert('OUTBOX_BACKLOG', 'Backlog cleared');
    expect(resolved).not.toBeNull();
    expect(resolved?.status).toBe('RESOLVED');
    expect(resolved?.resolvedAt).toBeDefined();

    const status = service.getAlertStatus();
    expect(status.activeAlertCount).toBe(0);
  });

  it('should execute end-to-end synthetic test drill cleanly', async () => {
    const drill = await service.testAlertPipeline();
    expect(drill.success).toBe(true);
    expect(drill.firedAlert.type).toBe('TEST_ALERT');
    expect(drill.firedAlert.status).toBe('RESOLVED'); // Resolved right after firing in drill
    expect(drill.resolvedAlert).toBeDefined();
  });

  it('should suppress duplicate alerts during rate limit window (Storm Prevention)', async () => {
    const alert1 = await service.dispatchAlert(
      'HIGH_5XX_RATE',
      'ERROR',
      'High 5xx Spike',
      '5xx error count exceeded threshold',
    );

    const alert2 = await service.dispatchAlert(
      'HIGH_5XX_RATE',
      'ERROR',
      'High 5xx Spike 2',
      'Second spike within 60s',
    );

    // Duplicate alert within window must return the existing firing alert and suppress re-firing
    expect(alert2.id).toBe(alert1.id);
    const status = service.getAlertStatus();
    expect(status.activeAlertCount).toBe(1);
  });

  it('should survive external webhook failure without throwing or blocking caller', async () => {
    process.env.ALERT_WEBHOOK_URL = 'https://fake-hooks.slack.com/services/FAIL/WEBHOOK';
    // Mock postWebhook to simulate 500 error from external alert webhook
    jest.spyOn(service as any, 'postWebhook').mockRejectedValue(new Error('Webhook responded with HTTP 500'));

    let threw = false;
    let alert: any;
    try {
      alert = await service.dispatchAlert(
        'PAYMENT_FAILURE',
        'CRITICAL',
        'Payment Gateway Failure',
        'Razorpay API unavailable',
      );
    } catch {
      threw = true;
    }

    expect(threw).toBe(false);
    expect(alert).toBeDefined();
    expect(alert.status).toBe('FIRING');
    // STRUCTURED_LOGS still delivered even if external webhook fails
    expect(alert.channelDelivered).toContain('STRUCTURED_LOGS');
    expect(alert.channelDelivered).not.toContain('EXTERNAL_WEBHOOK');

    delete process.env.ALERT_WEBHOOK_URL;
  });

  it('should survive external webhook timeout without blocking caller', async () => {
    process.env.ALERT_WEBHOOK_URL = 'https://fake-hooks.slack.com/services/TIMEOUT';
    jest.spyOn(service as any, 'postWebhook').mockRejectedValue(new Error('Connection timed out'));

    const alert = await service.dispatchAlert(
      'CHECKOUT_ANOMALY',
      'WARNING',
      'Checkout Anomaly',
      'High conflict rate',
    );

    expect(alert).toBeDefined();
    expect(alert.status).toBe('FIRING');

    delete process.env.ALERT_WEBHOOK_URL;
  });
});
