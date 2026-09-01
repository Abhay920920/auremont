import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartRecoveryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CartRecoveryService.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    // Run automated recovery check every 30 minutes in background
    const intervalMs = parseInt(process.env.CART_RECOVERY_INTERVAL_MS || '1800000', 10);
    this.timer = setInterval(async () => {
      try {
        await this.processAbandonedCarts();
      } catch (err: any) {
        this.logger.warn(`Automated cart recovery job encountered an error: ${err.message}`);
      }
    }, intervalMs);

    // Unref timer so it doesn't block process exit during tests/shutdown
    if (this.timer && typeof this.timer.unref === 'function') {
      this.timer.unref();
    }
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Scans for active carts with items that have been idle for > 1 hour.
   * Generates outbox events for recovery email processing.
   */
  async processAbandonedCarts(): Promise<{ scanned: number; recovered: number }> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const abandonedCarts = await this.prisma.cart.findMany({
      where: {
        status: 'active',
        updatedAt: { lte: oneHourAgo },
        items: { some: {} },
      },
      include: {
        user: true,
        items: { include: { product: true } },
      },
      take: 25,
    });

    let recoveredCount = 0;

    for (const cart of abandonedCarts) {
      const email = cart.user?.email;
      if (!email) continue;

      const db = this.prisma as any;
      try {
        // Check if recovery email was already sent for this cart update cycle
        const existingEvent = await db.outboxEvent?.findFirst({
          where: {
            eventType: 'abandoned_cart_reminder',
            payload: { path: ['cartId'], equals: cart.id },
          },
        });

        if (existingEvent) continue;

        const recoveryLink = `https://rarenuts.in/checkout?recover=${cart.id}`;
        const itemsSummary = cart.items.map((i: any) => `${i.quantity}x ${i.product?.name || 'Almonds'}`).join(', ');

        await db.outboxEvent?.create({
          data: {
            eventType: 'abandoned_cart_reminder',
            payload: {
              cartId: cart.id,
              userId: cart.userId,
              email,
              customerName: cart.user ? `${cart.user.firstName} ${cart.user.lastName}` : 'Valued Client',
              itemsSummary,
              itemCount: cart.items.length,
              recoveryLink,
            },
          },
        });

        recoveredCount++;
        this.logger.log(`Created abandoned cart recovery outbox event for cart ${cart.id}`);
      } catch (err: any) {
        this.logger.warn(`Failed to process cart recovery for ${cart.id}: ${err.message}`);
      }
    }

    return { scanned: abandonedCarts.length, recovered: recoveredCount };
  }
}
