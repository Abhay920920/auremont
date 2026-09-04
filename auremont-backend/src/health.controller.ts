import { Controller, Get, HttpCode, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from './prisma/prisma.service';

@Controller()
@SkipThrottle()
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getRoot() {
    return {
      name: 'RARE NUTS Luxury API',
      status: 'online',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    };
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
