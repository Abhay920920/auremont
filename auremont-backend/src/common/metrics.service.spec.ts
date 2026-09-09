import { MetricsService } from './metrics.service';

describe('MetricsService — Low Cardinality & Reliability Specifications', () => {
  let service: MetricsService;

  beforeEach(() => {
    service = new MetricsService();
  });

  it('should normalize high-cardinality UUIDs and numeric IDs to prevent label explosion', () => {
    // Record requests with arbitrary UUIDs and query parameters
    service.recordHttpRequest('GET', '/orders/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d?token=secret123', 200, 45);
    service.recordHttpRequest('GET', '/orders/11111111-2222-3333-4444-555555555555?token=another', 200, 55);
    service.recordHttpRequest('GET', '/products/123/reviews?page=2', 200, 30);

    const summary = service.getMetricsSummary();
    const routes = Object.keys(summary.http.routes);

    // Both UUID order routes must collapse into the single normalized route 'GET /orders/:id'
    expect(routes).toContain('GET /orders/:id');
    expect(routes).toContain('GET /products/:id/reviews');

    // High-cardinality identifiers and query tokens must NOT exist in the metric route keys
    expect(routes.some((r) => r.includes('9b1deb4d'))).toBe(false);
    expect(routes.some((r) => r.includes('secret123'))).toBe(false);
    expect(routes.some((r) => r.includes('another'))).toBe(false);

    expect(summary.http.routes['GET /orders/:id'].total).toBe(2);
    expect(summary.http.routes['GET /orders/:id'].success).toBe(2);
  });

  it('should cap rolling latency buffer to prevent unbounded memory growth under high traffic', () => {
    // Push 350 samples into the service (limit is 200)
    for (let i = 1; i <= 350; i++) {
      service.recordHttpRequest('GET', '/health', 200, i);
    }

    const summary = service.getMetricsSummary();
    expect(summary.http.requests_total).toBe(350);

    // Internal recentLatencies must remain capped at 200
    expect((service as any).recentLatencies.length).toBe(200);

    // Oldest 150 samples (1..150) must have been shifted out; lowest remaining value should be 151
    expect(Math.min(...(service as any).recentLatencies)).toBe(151);
  });

  it('should accurately compute latency percentiles (p50, p95, p99)', () => {
    // Insert 100 uniformly spaced latencies: 1ms through 100ms
    for (let i = 1; i <= 100; i++) {
      service.recordHttpRequest('POST', '/orders', 201, i);
    }

    const summary = service.getMetricsSummary();
    expect(summary.http.latency_p50_ms).toBeGreaterThanOrEqual(50);
    expect(summary.http.latency_p50_ms).toBeLessThanOrEqual(52);
    expect(summary.http.latency_p95_ms).toBeGreaterThanOrEqual(95);
    expect(summary.http.latency_p99_ms).toBeGreaterThanOrEqual(99);
  });

  it('should record checkout stage timings and conflict metrics accurately', () => {
    service.recordCheckoutAttempt();
    service.recordCheckoutConflict();
    service.recordCheckoutSuccess({
      cart_lookup_ms: 12,
      inv_atomic_check_ms: 25,
      order_tx_ms: 40,
      total_service_ms: 77,
    });

    const summary = service.getMetricsSummary();
    expect(summary.checkout.attempts).toBe(1);
    expect(summary.checkout.conflicts).toBe(1);
    expect(summary.checkout.success).toBe(1);
    expect(summary.checkout.stage_p95_ms.cart).toBe(12);
    expect(summary.checkout.stage_p95_ms.inventory).toBe(25);
    expect(summary.checkout.stage_p95_ms.order).toBe(40);
  });

  it('should record payment reconciliation and webhook counts', () => {
    service.recordPaymentReconciled(5);
    service.recordWebhookReceived();
    service.recordWebhookProcessed();
    service.recordWebhookDuplicate();

    const summary = service.getMetricsSummary();
    expect(summary.payments.reconciled_orders).toBe(5);
    expect(summary.payments.webhook_received).toBe(1);
    expect(summary.payments.webhook_processed).toBe(1);
    expect(summary.payments.webhook_duplicate).toBe(1);
  });
});
