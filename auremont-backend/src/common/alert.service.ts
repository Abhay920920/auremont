import { Injectable } from '@nestjs/common';
import { structuredLogger } from './structured-logger.service';
import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

export type AlertSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type AlertType =
  | 'DATABASE_UNAVAILABLE'
  | 'DATABASE_TIMEOUT'
  | 'HIGH_5XX_RATE'
  | 'OUTBOX_BACKLOG'
  | 'PAYMENT_FAILURE'
  | 'CHECKOUT_ANOMALY'
  | 'TEST_ALERT';

export interface AlertPayload {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  timestamp: string;
  resolvedAt?: string | null;
  status: 'FIRING' | 'RESOLVED';
  channelDelivered?: string[];
}

@Injectable()
export class AlertService {
  private recentAlerts: AlertPayload[] = [];
  private lastFiredTime: Map<string, number> = new Map();
  private readonly RATE_LIMIT_WINDOW_MS = 60000; // 1 minute throttle per type

  constructor() {}

  /**
   * Dispatch an operational alert to configured channels.
   */
  async dispatchAlert(
    type: AlertType,
    severity: AlertSeverity,
    title: string,
    message: string,
    metadata: Record<string, any> = {},
  ): Promise<AlertPayload> {
    const now = Date.now();
    const lastFired = this.lastFiredTime.get(type) || 0;

    // Rate limit duplicate alerts unless it's a test alert
    if (type !== 'TEST_ALERT' && now - lastFired < this.RATE_LIMIT_WINDOW_MS) {
      structuredLogger.warn(`[AlertService] Alert throttled for type: ${type}`, {
        alertType: type,
        throttleMsRemaining: this.RATE_LIMIT_WINDOW_MS - (now - lastFired),
      });
      const existing = this.recentAlerts.find(a => a.type === type && a.status === 'FIRING');
      if (existing) return existing;
    }

    this.lastFiredTime.set(type, now);

    const alert: AlertPayload = {
      id: `alt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      severity,
      title,
      message,
      metadata: this.sanitizeMetadata(metadata),
      timestamp: new Date().toISOString(),
      status: 'FIRING',
      channelDelivered: [],
    };

    // 1. Log structured alert locally
    structuredLogger.error(
      `[ALERT] [${severity}] ${title}: ${message}`,
      undefined,
      {
        alertId: alert.id,
        alertType: type,
        severity,
        ...alert.metadata,
      } as any,
    );
    alert.channelDelivered!.push('STRUCTURED_LOGS');

    // 2. Dispatch to external webhook if configured
    const webhookUrl = process.env.ALERT_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        await this.postWebhook(webhookUrl, alert);
        alert.channelDelivered!.push('EXTERNAL_WEBHOOK');
      } catch (err: any) {
        structuredLogger.warn(`[AlertService] External webhook delivery failed: ${err.message}`, {
          alertId: alert.id,
        });
      }
    }

    // Keep last 50 alerts in rolling memory buffer
    this.recentAlerts.unshift(alert);
    if (this.recentAlerts.length > 50) {
      this.recentAlerts.pop();
    }

    return alert;
  }

  /**
   * Resolves an existing active alert
   */
  resolveAlert(type: AlertType, resolutionNote: string = 'Condition recovered'): AlertPayload | null {
    const existing = this.recentAlerts.find(a => a.type === type && a.status === 'FIRING');
    if (!existing) return null;

    existing.status = 'RESOLVED';
    existing.resolvedAt = new Date().toISOString();

    structuredLogger.log(`[ALERT RESOLVED] ${existing.title}: ${resolutionNote}`, {
      alertId: existing.id,
      alertType: type,
      resolvedAt: existing.resolvedAt,
    });

    return existing;
  }

  /**
   * Safely test the entire alert dispatch pipeline end-to-end.
   */
  async testAlertPipeline(): Promise<{
    firedAlert: AlertPayload;
    resolvedAlert: AlertPayload | null;
    success: boolean;
  }> {
    const testMetadata = {
      testRunId: `test_${Date.now()}`,
      environment: process.env.NODE_ENV || 'production',
      simulatedLatencyMs: 142,
    };

    const fired = await this.dispatchAlert(
      'TEST_ALERT',
      'INFO',
      'Synthetic Monitoring Drill: Health Check Alert',
      'This is an automated non-destructive alert drill validating notification delivery.',
      testMetadata,
    );

    // Immediately resolve test alert to verify clear cycle
    const resolved = this.resolveAlert('TEST_ALERT', 'Synthetic test completed successfully');

    return {
      firedAlert: fired,
      resolvedAlert: resolved,
      success: true,
    };
  }

  getAlertStatus(): {
    configuredChannels: string[];
    activeAlertCount: number;
    recentAlerts: AlertPayload[];
  } {
    const configuredChannels = ['STRUCTURED_LOGS'];
    if (process.env.ALERT_WEBHOOK_URL) {
      configuredChannels.push('EXTERNAL_WEBHOOK');
    }

    return {
      configuredChannels,
      activeAlertCount: this.recentAlerts.filter(a => a.status === 'FIRING').length,
      recentAlerts: this.recentAlerts.slice(0, 10),
    };
  }

  private sanitizeMetadata(meta: Record<string, any>): Record<string, any> {
    const sensitive = ['password', 'secret', 'token', 'authorization', 'key', 'signature'];
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(meta)) {
      if (sensitive.some(s => k.toLowerCase().includes(s))) {
        clean[k] = '[REDACTED]';
      } else if (typeof v === 'object' && v !== null) {
        clean[k] = this.sanitizeMetadata(v);
      } else {
        clean[k] = v;
      }
    }
    return clean;
  }

  private postWebhook(urlStr: string, payload: AlertPayload): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const parsed = new URL(urlStr);
        const data = JSON.stringify({
          text: `🚨 *[${payload.severity}] ${payload.title}*\n${payload.message}\n_Type: ${payload.type} | Time: ${payload.timestamp}_`,
          alert: payload,
        });

        const isHttps = parsed.protocol === 'https:';
        const client = isHttps ? https : http;

        const req = client.request(
          urlStr,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(data),
            },
            timeout: 5000,
          },
          res => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve();
            } else {
              reject(new Error(`Webhook responded with HTTP ${res.statusCode}`));
            }
          },
        );

        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Webhook request timed out'));
        });

        req.write(data);
        req.end();
      } catch (e) {
        reject(e);
      }
    });
  }
}

export const alertService = new AlertService();
