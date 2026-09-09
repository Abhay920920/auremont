import { Injectable } from '@nestjs/common';

export interface RouteMetric {
  route: string;
  method: string;
  total: number;
  success: number;
  clientErrors: number;
  serverErrors: number;
  latencies: number[];
}

@Injectable()
export class MetricsService {
  private readonly maxLatencySamples = 200;

  // HTTP Request Metrics
  private totalRequests = 0;
  private total4xx = 0;
  private total5xx = 0;
  private recentLatencies: number[] = [];
  private routeMetrics: Map<string, RouteMetric> = new Map();

  // Checkout Metrics
  private checkoutAttempts = 0;
  private checkoutSuccess = 0;
  private checkoutConflicts = 0;
  private checkoutFailures = 0;
  private checkoutStageLatencies: Record<string, number[]> = {
    cart: [],
    inventory: [],
    user: [],
    coupon: [],
    order: [],
    total: [],
  };

  // Payment Metrics
  private paymentCreationAttempts = 0;
  private paymentCreationSuccess = 0;
  private paymentCreationFailure = 0;
  private paymentVerificationAttempts = 0;
  private paymentVerificationSuccess = 0;
  private paymentVerificationFailure = 0;
  private webhookReceived = 0;
  private webhookProcessed = 0;
  private webhookDuplicate = 0;
  private webhookFailed = 0;
  private paymentReconciled = 0;

  // Database Metrics
  private dbQueryCount = 0;
  private dbConnectionFailures = 0;
  private dbTimeouts = 0;

  recordHttpRequest(method: string, route: string, statusCode: number, durationMs: number) {
    this.totalRequests++;
    if (statusCode >= 500) {
      this.total5xx++;
    } else if (statusCode >= 400) {
      this.total4xx++;
    }

    this.pushSample(this.recentLatencies, durationMs);

    // Normalize route to avoid high-cardinality ID explosion
    const normalizedRoute = this.normalizeRoute(route);
    const key = `${method} ${normalizedRoute}`;

    let rm = this.routeMetrics.get(key);
    if (!rm) {
      rm = {
        route: normalizedRoute,
        method,
        total: 0,
        success: 0,
        clientErrors: 0,
        serverErrors: 0,
        latencies: [],
      };
      this.routeMetrics.set(key, rm);
    }

    rm.total++;
    if (statusCode >= 500) rm.serverErrors++;
    else if (statusCode >= 400) rm.clientErrors++;
    else rm.success++;

    this.pushSample(rm.latencies, durationMs);
  }

  recordCheckoutAttempt() {
    this.checkoutAttempts++;
  }

  recordCheckoutSuccess(timings: Record<string, number> = {}) {
    this.checkoutSuccess++;
    this.recordCheckoutTimings(timings);
  }

  recordCheckoutConflict() {
    this.checkoutConflicts++;
  }

  recordCheckoutFailure(timings: Record<string, number> = {}) {
    this.checkoutFailures++;
    this.recordCheckoutTimings(timings);
  }

  private recordCheckoutTimings(timings: Record<string, number>) {
    if (timings.cart_lookup_ms) this.pushSample(this.checkoutStageLatencies.cart, timings.cart_lookup_ms);
    if (timings.inv_atomic_check_ms) this.pushSample(this.checkoutStageLatencies.inventory, timings.inv_atomic_check_ms);
    if (timings.guest_user_ms) this.pushSample(this.checkoutStageLatencies.user, timings.guest_user_ms);
    if (timings.coupon_apply_ms) this.pushSample(this.checkoutStageLatencies.coupon, timings.coupon_apply_ms);
    if (timings.order_tx_ms) this.pushSample(this.checkoutStageLatencies.order, timings.order_tx_ms);
    if (timings.total_service_ms) this.pushSample(this.checkoutStageLatencies.total, timings.total_service_ms);
  }

  recordPaymentCreationAttempt() {
    this.paymentCreationAttempts++;
  }

  recordPaymentCreationSuccess() {
    this.paymentCreationSuccess++;
  }

  recordPaymentCreationFailure() {
    this.paymentCreationFailure++;
  }

  recordPaymentVerificationAttempt() {
    this.paymentVerificationAttempts++;
  }

  recordPaymentVerificationSuccess() {
    this.paymentVerificationSuccess++;
  }

  recordPaymentVerificationFailure() {
    this.paymentVerificationFailure++;
  }

  recordWebhookReceived() {
    this.webhookReceived++;
  }

  recordWebhookProcessed() {
    this.webhookProcessed++;
  }

  recordWebhookDuplicate() {
    this.webhookDuplicate++;
  }

  recordWebhookFailed() {
    this.webhookFailed++;
  }

  recordPaymentReconciled(count: number = 1) {
    this.paymentReconciled += count;
  }

  recordDatabaseQuery() {
    this.dbQueryCount++;
  }

  recordDatabaseConnectionFailure() {
    this.dbConnectionFailures++;
  }

  recordDatabaseTimeout() {
    this.dbTimeouts++;
  }

  getMetricsSummary() {
    const latenciesSorted = [...this.recentLatencies].sort((a, b) => a - b);
    const p50 = this.getPercentile(latenciesSorted, 50);
    const p95 = this.getPercentile(latenciesSorted, 95);
    const p99 = this.getPercentile(latenciesSorted, 99);

    const routes: Record<string, any> = {};
    for (const [k, rm] of this.routeMetrics.entries()) {
      const sorted = [...rm.latencies].sort((a, b) => a - b);
      routes[k] = {
        total: rm.total,
        success: rm.success,
        clientErrors: rm.clientErrors,
        serverErrors: rm.serverErrors,
        p50: this.getPercentile(sorted, 50),
        p95: this.getPercentile(sorted, 95),
      };
    }

    return {
      timestamp: new Date().toISOString(),
      http: {
        requests_total: this.totalRequests,
        requests_4xx: this.total4xx,
        requests_5xx: this.total5xx,
        latency_p50_ms: p50,
        latency_p95_ms: p95,
        latency_p99_ms: p99,
        routes,
      },
      checkout: {
        attempts: this.checkoutAttempts,
        success: this.checkoutSuccess,
        conflicts: this.checkoutConflicts,
        failures: this.checkoutFailures,
        success_rate_pct: this.checkoutAttempts > 0 ? Math.round((this.checkoutSuccess / this.checkoutAttempts) * 1000) / 10 : 100,
        stage_p95_ms: {
          cart: this.getPercentile(this.checkoutStageLatencies.cart, 95),
          inventory: this.getPercentile(this.checkoutStageLatencies.inventory, 95),
          order: this.getPercentile(this.checkoutStageLatencies.order, 95),
          total: this.getPercentile(this.checkoutStageLatencies.total, 95),
        },
      },
      payments: {
        creation_attempts: this.paymentCreationAttempts,
        creation_success: this.paymentCreationSuccess,
        creation_failure: this.paymentCreationFailure,
        verification_attempts: this.paymentVerificationAttempts,
        verification_success: this.paymentVerificationSuccess,
        verification_failure: this.paymentVerificationFailure,
        webhook_received: this.webhookReceived,
        webhook_processed: this.webhookProcessed,
        webhook_duplicate: this.webhookDuplicate,
        webhook_failed: this.webhookFailed,
        reconciled_orders: this.paymentReconciled,
      },
      database: {
        queries_recorded: this.dbQueryCount,
        connection_failures: this.dbConnectionFailures,
        timeouts: this.dbTimeouts,
      },
    };
  }

  private pushSample(arr: number[], val: number) {
    arr.push(val);
    if (arr.length > this.maxLatencySamples) {
      arr.shift();
    }
  }

  private getPercentile(sortedArr: number[], p: number): number {
    if (sortedArr.length === 0) return 0;
    const sorted = sortedArr.length === 1 ? sortedArr : [...sortedArr].sort((a, b) => a - b);
    const index = Math.min(Math.floor((p / 100) * sorted.length), sorted.length - 1);
    return Math.round(sorted[index] * 10) / 10;
  }

  private normalizeRoute(rawUrl: string): string {
    const cleanUrl = rawUrl.split('?')[0];
    // Replace UUIDs with :id
    return cleanUrl
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, ':id')
      .replace(/\/[0-9]+(\/|$)/g, '/:id$1');
  }
}

export const metricsService = new MetricsService();
