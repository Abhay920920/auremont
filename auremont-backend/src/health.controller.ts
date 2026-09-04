import { Controller, Get, HttpCode, HttpStatus, ServiceUnavailableException, Headers, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { PrismaService } from './prisma/prisma.service';

@Controller()
@SkipThrottle()
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get('favicon.ico')
  @HttpCode(HttpStatus.NO_CONTENT)
  getFavicon() {
    return;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getRoot(@Headers('accept') accept?: string, @Res() res?: Response) {
    if (accept && accept.includes('text/html') && res) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RARE NUTS — Luxury API Service</title>
  <style>
    body { background: #0A0A0A; color: #F5F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #141414; border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 40px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.8); }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 9999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #10B981; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); margin-bottom: 20px; font-weight: 600; }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: #10B981; }
    h1 { color: #D4AF37; font-family: 'Cinzel', Georgia, serif; font-size: 26px; margin: 0 0 10px; letter-spacing: 0.05em; }
    p { color: #A0A09C; font-size: 13px; line-height: 1.6; margin: 0 0 24px; }
    a.btn { display: inline-block; background: #D4AF37; color: #0A0A0A; text-decoration: none; padding: 12px 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 4px; transition: opacity 0.2s; }
    a.btn:hover { opacity: 0.9; }
    .meta { margin-top: 24px; font-family: monospace; font-size: 11px; color: #666; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> Online & Healthy</div>
    <h1>RARE NUTS API</h1>
    <p>This is the backend API service running on port 3001. The frontend customer storefront is running on port 3000.</p>
    <a href="http://localhost:3000" class="btn">Open Storefront (Port 3000)</a>
    <div class="meta">Status: 200 OK · Port: 3001 · Mode: Development</div>
  </div>
</body>
</html>`);
    }

    const payload = {
      name: 'RARE NUTS Luxury API',
      status: 'online',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    };

    if (res) {
      return res.json(payload);
    }
    return payload;
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth() {
    const mem = process.memoryUsage();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      memory: {
        rss_mb: Math.round(mem.rss / 1024 / 1024),
        heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
        heap_total_mb: Math.round(mem.heapTotal / 1024 / 1024),
      },
    };
  }

  @Get('health/liveness')
  @HttpCode(HttpStatus.OK)
  getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      pid: process.pid,
      uptime: Math.floor(process.uptime()),
    };
  }

  private lastDbPing: { status: 'connected'; latency_ms: number; timestamp: number } | null = null;
  private inflightDbPing: Promise<number> | null = null;
  private readonly DB_PING_TTL_MS = 3000;

  @Get('health/readiness')
  @HttpCode(HttpStatus.OK)
  async getReadiness() {
    const now = Date.now();
    let dbLatencyMs = 0;

    try {
      if (this.lastDbPing && now - this.lastDbPing.timestamp < this.DB_PING_TTL_MS) {
        dbLatencyMs = this.lastDbPing.latency_ms;
      } else {
        if (!this.inflightDbPing) {
          const pingStart = Date.now();
          this.inflightDbPing = (async () => {
            await this.prisma.$queryRaw`SELECT 1`;
            return Date.now() - pingStart;
          })().finally(() => {
            this.inflightDbPing = null;
          });
        }
        dbLatencyMs = await this.inflightDbPing;
        this.lastDbPing = {
          status: 'connected',
          latency_ms: dbLatencyMs,
          timestamp: Date.now(),
        };
      }

      const mem = process.memoryUsage();
      const heapUsedMb = Math.round(mem.heapUsed / 1024 / 1024);

      return {
        status: 'ready',
        database: {
          status: 'connected',
          latency_ms: dbLatencyMs,
        },
        memory: {
          heap_used_mb: heapUsedMb,
          status: heapUsedMb < 1500 ? 'healthy' : 'warning',
        },
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      this.lastDbPing = null;
      throw new ServiceUnavailableException({
        status: 'unready',
        database: {
          status: 'disconnected',
          error: err?.message || 'Database ping failed',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}
