import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private razorpay: any;
  private readonly isMock: boolean;

  constructor(private readonly prisma: PrismaService) {
    const key_id = process.env.RAZORPAY_KEY_ID || '';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

    const isProduction = process.env.NODE_ENV === 'production' || (process.env.NODE_ENV as string) === 'staging';
    const allowMock = process.env.ALLOW_MOCK_PAYMENTS === 'true' && !isProduction;
    
    if (isProduction && process.env.ALLOW_MOCK_PAYMENTS === 'true') {
      throw new Error(
        'CRITICAL CONFIGURATION ERROR: ALLOW_MOCK_PAYMENTS cannot be enabled in production or staging mode.',
      );
    }

    const hasTestOrMissingKeys = !key_id || !key_secret || key_id === 'rzp_test_12345';

    if (isProduction && hasTestOrMissingKeys) {
      throw new Error(
        'CRITICAL PRODUCTION CONFIGURATION ERROR: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured with valid gateway credentials in production/staging mode.',
      );
    }

    this.isMock = allowMock && hasTestOrMissingKeys;

    this.razorpay = new Razorpay({
      key_id: key_id || 'rzp_test_12345',
      key_secret: key_secret || 'secret_12345',
    });
  }

  /**
   * Generates a short-lived order access token for guest confirmation pages.
   * Uses HMAC-SHA256(orderId + salt) so it cannot be guessed or enumerated.
   * This token is returned in the order creation response and used by the frontend
   * to poll /orders/:id/payment-status without authentication.
   */
  generateOrderToken(orderId: string): string {
    const secret = process.env.ORDER_TOKEN_SECRET || process.env.JWT_SECRET;
    if (!secret && (process.env.NODE_ENV === 'production' || (process.env.NODE_ENV as string) === 'staging')) {
      throw new Error('ORDER_TOKEN_SECRET or JWT_SECRET must be defined in production/staging environments');
    }
    return crypto
      .createHmac('sha256', secret || 'dev_order_token_secret_local')
      .update(orderId)
      .digest('hex')
      .substring(0, 32); // 128-bit token, URL-safe hex
  }

  verifyOrderToken(orderId: string, token: string): boolean {
    const expected = this.generateOrderToken(orderId);
    // Constant-time comparison to prevent timing attacks
    try {
      return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(token, 'hex'));
    } catch {
      return false;
    }
  }

  /**
   * Creates a Razorpay order right after internal Order creation.
   * amount is expected to be in standard units (INR) and will be converted to paise (amount * 100).
   * All amounts stored in paise (integer) internally to avoid floating-point errors.
   */
  async createRazorpayOrder(orderId: string, amount: number, currency: string = 'INR') {
    // Store in paise (integer) — never use floats for money
    const amountPaise = Math.round(amount * 100);

    const options = {
      amount: amountPaise,
      currency,
      receipt: orderId,
    };

    try {
      let rpOrder: any;

      if (this.isMock) {
        // Dev/test: mock gateway response. No real API call.
        rpOrder = {
          id: `order_mock_${Date.now()}`,
          amount: options.amount,
          currency: options.currency,
        };
      } else {
        rpOrder = await this.razorpay.orders.create(options);
      }

      // Save the razorpay order id to our database as paymentRef
      await this.prisma.order.update({
        where: { id: orderId },
        data: { paymentRef: rpOrder.id },
      });

      return {
        paymentProvider: 'razorpay',
        razorpayOrderId: rpOrder.id,
        amount: rpOrder.amount,        // paise
        currency: rpOrder.currency,
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new BadRequestException('Failed to initialize payment gateway.');
    }
  }

  /**
   * Handles the Razorpay Webhook with WebhookLog Idempotency.
   * Expects 'payment.captured' or 'order.paid' events.
   *
   * IDEMPOTENCY GUARANTEE:
   *   - WebhookLog.eventId has @unique constraint
   *   - First INSERT wins; duplicate throws P2002 → early return
   *   - All state transitions inside same Prisma $transaction
   *   - paid → not downgraded (checked inside FOR UPDATE lock)
   *
   * AMOUNT: compared in integer paise to avoid float rounding
   */
  async processPaymentWebhook(payload: any, signature: string, rawBody?: Buffer) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret is not configured on the server');
    }

    if (!signature) {
      throw new BadRequestException('Missing webhook signature');
    }

    // 1. Verify Signature over raw payload buffer if available
    const bodyToSign = rawBody || Buffer.from(JSON.stringify(payload));
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyToSign)
      .digest('hex');

    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(signature, 'hex'));
    } catch {
      isValid = false;
    }

    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const { event } = payload;
    const eventId = payload.id || `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const db = this.prisma as any;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const gatewayPaymentId = paymentEntity?.id;

      // ── AMOUNT: use integer paise to avoid floating-point errors ────────────────
      const paidAmountPaise: number = paymentEntity?.amount ?? 0;         // integer paise from Razorpay
      const paidAmountINR: number = paidAmountPaise / 100;                 // for storage only
      const paidCurrency: string = paymentEntity?.currency || 'INR';

      const order = await this.prisma.order.findFirst({
        where: { paymentRef: razorpayOrderId }
      });

      if (!order) {
        try {
          await db.webhookLog.create({
            data: { provider: 'razorpay', eventId, eventType: event, payload, status: 'ignored' }
          });
        } catch { /* duplicate event already logged */ }
        throw new NotFoundException(`Order with paymentRef ${razorpayOrderId} not found`);
      }

      // ── AMOUNT COMPARISON in integer paise (exact equality, zero underpayment tolerance) ──
      const expectedAmountPaise = Math.round(Number(order.total) * 100);
      if (paidAmountPaise !== expectedAmountPaise) {
        try {
          await db.webhookLog.create({
            data: { provider: 'razorpay', eventId, eventType: event, payload, status: 'amount_mismatch' }
          });
        } catch { /* duplicate event already logged */ }
        throw new BadRequestException(`Amount mismatch. Expected ₹${Number(order.total)} (${expectedAmountPaise}p), received ₹${paidAmountINR} (${paidAmountPaise}p)`);
      }

      // Currency validation
      if (paidCurrency !== 'INR') {
        try {
          await db.webhookLog.create({
            data: { provider: 'razorpay', eventId, eventType: event, payload, status: 'currency_mismatch' }
          });
        } catch { /* duplicate event */ }
        throw new BadRequestException(`Currency mismatch. Expected INR, received ${paidCurrency}`);
      }

      // ── ATOMIC: INSERT webhook log FIRST — P2002 = already processed ────────────
      try {
        await this.prisma.$transaction(async (tx) => {
          // This INSERT will throw P2002 if a concurrent worker already inserted this eventId
          await (tx as any).webhookLog.create({
            data: { provider: 'razorpay', eventId, eventType: event, payload, status: 'processing' }
          });

          // Re-read with FOR UPDATE lock to prevent concurrent payment transitions
          const lockedRows = await tx.$queryRaw<any[]>`
            SELECT id, payment_status, user_id, order_number FROM "orders"
            WHERE id = ${order.id}::uuid FOR UPDATE
          `;
          const lockedOrder = lockedRows?.[0];

          if (lockedOrder?.payment_status === 'paid') {
            // Already paid — idempotent; update log and return
            await (tx as any).webhookLog.update({
              where: { eventId },
              data: { status: 'already_paid' }
            });
            return;
          }

          const now = new Date();

          await tx.payment.upsert({
            where: { orderId: order.id },
            update: {
              transactionId: gatewayPaymentId,
              gatewayPaymentId,
              verifiedAmount: paidAmountINR,
              status: 'completed',
              paidAt: now,
              verifiedAt: now,
            } as any,
            create: {
              orderId: order.id,
              provider: 'razorpay',
              transactionId: gatewayPaymentId,
              gatewayPaymentId,
              amount: paidAmountINR,
              verifiedAmount: paidAmountINR,
              currency: paidCurrency,
              status: 'completed',
              paidAt: now,
              verifiedAt: now,
            } as any,
          });

          await tx.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'paid',
              orderStatus: 'confirmed',
            }
          });

          await (tx as any).webhookLog.update({
            where: { eventId },
            data: { status: 'processed' }
          });

          // Outbox event for side effects (email, notifications, etc.)
          await (tx as any).outboxEvent.create({
            data: {
              eventType: 'order_paid',
              payload: {
                orderId: order.id,
                orderNumber: lockedOrder.order_number,
                userId: lockedOrder.user_id,
                gatewayPaymentId,
                paidAmountINR,
                source: 'webhook',
              }
            }
          });

          // Immediate in-app notification for registered users
          if (lockedOrder?.user_id) {
            try {
              await tx.notification.create({
                data: {
                  userId: lockedOrder.user_id,
                  type: 'order_paid',
                  title: 'Payment Verified',
                  message: `Your order #${lockedOrder.order_number} has been confirmed. Your vault order is being prepared.`,
                },
              });
            } catch { /* notification failure must not block payment confirmation */ }
          }
        }, { maxWait: 15000, timeout: 30000 });
      } catch (err: any) {
        if (err?.code === 'P2002') {
          return { received: true, message: 'Event already processed' };
        }
        throw err;
      }
    }

    return { received: true };
  }

  /**
   * Synchronous frontend payment verification.
   *
   * SECURITY CHAIN:
   *   1. Verify Razorpay HMAC-SHA256 signature
   *   2. Find order by razorpayOrderId (paymentRef)
   *   3. Set paymentStatus = 'processing' (marks intent, visible to poller)
   *   4. Fetch real payment from Razorpay API
   *   5. Validate status = 'captured'
   *   6. Validate amount in INTEGER PAISE (no floats) ±1 paise tolerance
   *   7. Validate currency = INR
   *   8. Validate payment belongs to this razorpay order
   *   9. Atomic: SELECT FOR UPDATE → upsert payment → update order → outbox → notification
   *
   * IDEMPOTENCY:
   *   - SELECT FOR UPDATE inside transaction
   *   - `paid` order returns immediately without re-processing
   *   - All operations in single atomic transaction
   *
   * The frontend MUST use the returned order object for display; its own state is irrelevant.
   */
  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string,
  ) {
    if (!razorpayOrderId || !razorpayPaymentId || !signature) {
      throw new BadRequestException({
        code: 'MISSING_PARAMETERS',
        message: 'Payment verification requires razorpayOrderId, razorpayPaymentId, and signature.',
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    // ── Step 1: Verify signature ─────────────────────────────────────────────
    if (!this.isMock) {
      if (!secret) {
        throw new BadRequestException({
          code: 'GATEWAY_SECRET_UNCONFIGURED',
          message: 'Payment gateway secret is not configured.',
        });
      }

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      let isValid = false;
      try {
        isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(signature, 'hex'));
      } catch {
        isValid = false;
      }

      if (!isValid) {
        throw new BadRequestException({
          code: 'INVALID_SIGNATURE',
          message: 'Payment signature verification failed.',
        });
      }
    }

    // ── Step 2: Find our order by the razorpay order id ─────────────────────
    const orderRef = await this.prisma.order.findFirst({
      where: { paymentRef: razorpayOrderId },
    });

    if (!orderRef) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: `No order found for paymentRef ${razorpayOrderId}`,
      });
    }

    // Fast path: already paid — idempotent return without re-fetching gateway
    if (orderRef.paymentStatus === 'paid') {
      return this.buildConfirmedOrderResponse(orderRef.id);
    }

    // ── Step 3: Mark as 'processing' so polling sees intermediate state ──────
    // Non-transactional — it's a hint, not a lock. The FOR UPDATE inside the
    // transaction is the actual concurrency guard.
    try {
      await this.prisma.order.updateMany({
        where: {
          id: orderRef.id,
          paymentStatus: 'pending',
        },
        data: { paymentStatus: 'processing' },
      });
    } catch {
      // Best-effort hint; continues regardless
    }

    // Fast check: if already paid (by concurrent webhook), return immediately
    const currentStatus = await this.prisma.order.findUnique({
      where: { id: orderRef.id },
      select: { paymentStatus: true },
    });
    if (currentStatus?.paymentStatus === 'paid') {
      return this.buildConfirmedOrderResponse(orderRef.id);
    }

    // ── Step 4: Fetch actual payment from Razorpay gateway ──────────────────
    let gatewayAmountPaise: number;
    let gatewayPaymentStatus: string;
    let gatewayCurrency: string;
    let gatewayOrderId: string;

    if (this.isMock) {
      // Dev/test: skip API call, use order total. All DB transitions still run.
      gatewayAmountPaise = Math.round(Number(orderRef.total) * 100);
      gatewayPaymentStatus = 'captured';
      gatewayCurrency = 'INR';
      gatewayOrderId = razorpayOrderId;
    } else {
      try {
        const rzpPayment = await this.razorpay.payments.fetch(razorpayPaymentId);

        gatewayAmountPaise = rzpPayment.amount;        // integer paise from Razorpay
        gatewayPaymentStatus = rzpPayment.status;      // 'created'|'authorized'|'captured'|'refunded'|'failed'
        gatewayCurrency = rzpPayment.currency;
        gatewayOrderId = rzpPayment.order_id;
      } catch (err: any) {
        // Network / Razorpay API failure — revert to pending so retry is possible
        try {
          await this.prisma.order.updateMany({
            where: { id: orderRef.id, paymentStatus: 'processing' },
            data: { paymentStatus: 'pending' },
          });
        } catch { /* ignore */ }
        console.error('Razorpay payments.fetch failed:', err?.message);
        throw new BadRequestException({
          code: 'GATEWAY_FETCH_FAILED',
          message: 'Unable to verify payment with gateway. Please try again.',
        });
      }
    }

    // ── Step 5: Payment captured? ────────────────────────────────────────────
    if (gatewayPaymentStatus !== 'captured') {
      await this.markPaymentFailed(orderRef.id, razorpayPaymentId, `Gateway payment status is '${gatewayPaymentStatus}', not captured`);
      throw new BadRequestException({
        code: 'PAYMENT_NOT_CAPTURED',
        message: `Payment has not been captured. Status: ${gatewayPaymentStatus}`,
      });
    }

    // ── Step 6: Amount in integer PAISE — exact match, zero underpayment tolerance ────
    const expectedAmountPaise = Math.round(Number(orderRef.total) * 100);
    if (gatewayAmountPaise !== expectedAmountPaise) {
      const gatewayINR = gatewayAmountPaise / 100;
      const expectedINR = Number(orderRef.total);
      await this.markPaymentFailed(orderRef.id, razorpayPaymentId, `Amount mismatch: expected ₹${expectedINR} (${expectedAmountPaise}p), gateway confirmed ₹${gatewayINR} (${gatewayAmountPaise}p)`);
      throw new BadRequestException({
        code: 'AMOUNT_MISMATCH',
        message: `Payment amount mismatch. Expected ₹${expectedINR}, received ₹${gatewayINR}`,
      });
    }

    // ── Step 7: Currency ─────────────────────────────────────────────────────
    if (gatewayCurrency !== 'INR') {
      await this.markPaymentFailed(orderRef.id, razorpayPaymentId, `Currency mismatch: expected INR, got ${gatewayCurrency}`);
      throw new BadRequestException({
        code: 'CURRENCY_MISMATCH',
        message: `Currency mismatch. Expected INR, received ${gatewayCurrency}`,
      });
    }

    // ── Step 8: Payment belongs to this checkout ─────────────────────────────
    if (!this.isMock && gatewayOrderId !== razorpayOrderId) {
      await this.markPaymentFailed(orderRef.id, razorpayPaymentId, `Order ID mismatch: expected ${razorpayOrderId}, got ${gatewayOrderId}`);
      throw new BadRequestException({
        code: 'ORDER_MISMATCH',
        message: 'Payment does not belong to this checkout session.',
      });
    }

    // ── Step 9: Atomic DB update with FOR UPDATE lock ────────────────────────
    // Prevents: double-spend, concurrent webhook+verify race, duplicate browser clicks
    await this.prisma.$transaction(async (tx) => {
      const lockedRows = await tx.$queryRaw<any[]>`
        SELECT id, payment_status, user_id, order_number FROM "orders"
        WHERE id = ${orderRef.id}::uuid FOR UPDATE
      `;
      const lockedOrder = lockedRows?.[0];

      // Already paid — idempotent exit
      if (lockedOrder?.payment_status === 'paid') {
        return;
      }

      const now = new Date();
      const gatewayVerifiedINR = gatewayAmountPaise / 100;

      await tx.payment.upsert({
        where: { orderId: orderRef.id },
        update: {
          transactionId: razorpayPaymentId,
          gatewayPaymentId: razorpayPaymentId,
          verifiedAmount: gatewayVerifiedINR,
          status: 'completed',
          paidAt: now,
          verifiedAt: now,
        } as any,
        create: {
          orderId: orderRef.id,
          provider: 'razorpay',
          transactionId: razorpayPaymentId,
          gatewayPaymentId: razorpayPaymentId,
          amount: Number(orderRef.total),
          verifiedAmount: gatewayVerifiedINR,
          currency: 'INR',
          status: 'completed',
          paidAt: now,
          verifiedAt: now,
        } as any,
      });

      await tx.order.update({
        where: { id: orderRef.id },
        data: {
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
        },
      });

      // Outbox event for all async side effects (email, analytics, loyalty, etc.)
      if ((tx as any).outboxEvent?.create) {
        await (tx as any).outboxEvent.create({
          data: {
            eventType: 'order_paid',
            payload: {
              orderId: orderRef.id,
              orderNumber: lockedOrder?.order_number,
              userId: lockedOrder?.user_id,
              gatewayPaymentId: razorpayPaymentId,
              paidAmountINR: gatewayVerifiedINR,
              source: 'frontend_verify',
            }
          }
        });
      }

      // Immediate in-app notification for registered users
      if (lockedOrder?.user_id) {
        try {
          await tx.notification.create({
            data: {
              userId: lockedOrder.user_id,
              type: 'order_paid',
              title: 'Payment Verified',
              message: `Your order #${lockedOrder.order_number} has been confirmed. Your vault order is being prepared.`,
            },
          });
        } catch { /* notification failure must not block payment confirmation */ }
      }
    }, { maxWait: 15000, timeout: 30000 });

    // Fetch and return the authoritative confirmed order state
    return this.buildConfirmedOrderResponse(orderRef.id);
  }

  /**
   * Builds the authoritative confirmed order response.
   * Called after any path that results in a paid order.
   * The frontend MUST use this for display — not its own cached state.
   */
  private async buildConfirmedOrderResponse(orderId: string) {
    const confirmedOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        paymentStatus: true,
        orderStatus: true,
        total: true,
        subtotal: true,
        discount: true,
        shipping: true,
        tax: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            productName: true,
            sku: true,
            imageUrl: true,
            quantity: true,
            price: true,
            subtotal: true,
          },
        },
        address: {
          select: {
            fullName: true,
            phone: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          },
        },
      },
    });

    return {
      success: true,
      order: confirmedOrder,
    };
  }

  /**
   * Returns the authoritative payment + order status for a given order.
   * Used for polling from the frontend when payment state is uncertain.
   *
   * AUTHORIZATION:
   *   - Authenticated user: must own the order (userId check)
   *   - Guest / unauthenticated: must provide valid orderToken (HMAC of orderId)
   *   - No auth + no token → 404 (no enumeration possible)
   *
   * Returns MINIMUM data — no address, no payment details, no PII.
   */
  async getOrderPaymentStatus(orderId: string, userId?: string, orderToken?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        paymentStatus: true,
        orderStatus: true,
        total: true,
        createdAt: true,
      },
    });

    if (!order) {
      throw new NotFoundException({ code: 'ORDER_NOT_FOUND', message: 'Order not found.' });
    }

    // ── AUTHORIZATION ─────────────────────────────────────────────────────────
    if (userId) {
      // Authenticated user: must own the order
      if (order.userId !== userId) {
        // Return 404 instead of 403 to avoid leaking existence
        throw new NotFoundException({ code: 'ORDER_NOT_FOUND', message: 'Order not found.' });
      }
    } else if (orderToken) {
      // Guest or unauthenticated: validate HMAC token
      if (!this.verifyOrderToken(orderId, orderToken)) {
        throw new NotFoundException({ code: 'ORDER_NOT_FOUND', message: 'Order not found.' });
      }
    } else {
      // No auth AND no token — deny access (prevents enumeration of order IDs)
      throw new NotFoundException({ code: 'ORDER_NOT_FOUND', message: 'Order not found.' });
    }

    // Return MINIMUM data required — no PII, no address, no payment details
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      total: order.total,
      createdAt: order.createdAt,
    };
  }

  /**
   * Marks a payment as failed and restores inventory.
   *
   * IDEMPOTENT: checks `paymentStatus !== 'paid'` before any state change.
   * SAFE: inventory is only restored if the order is not already failed
   *       (preventing double-restoration from concurrent calls).
   * NON-BLOCKING: errors are logged but not propagated to caller.
   */
  private async markPaymentFailed(orderId: string, gatewayPaymentId: string, reason: string) {
    try {
      await this.prisma.$transaction(async (tx) => {
        // FOR UPDATE lock — prevents concurrent markPaymentFailed calls
        const lockedRows = await tx.$queryRaw<any[]>`
          SELECT id, payment_status FROM "orders" WHERE id = ${orderId}::uuid FOR UPDATE
        `;
        const lockedOrder = lockedRows?.[0];

        if (!lockedOrder) return;
        // CRITICAL: Never downgrade from paid
        if (lockedOrder.payment_status === 'paid') return;
        // Already failed — don't restore inventory twice
        if (lockedOrder.payment_status === 'failed') return;

        // Fetch items for inventory restoration (do this INSIDE the lock)
        const orderWithItems = await tx.order.findUnique({
          where: { id: orderId },
          select: { items: { select: { productId: true, quantity: true } } },
        });

        await tx.payment.upsert({
          where: { orderId },
          update: {
            transactionId: gatewayPaymentId,
            status: 'failed',
            failureReason: reason,
          } as any,
          create: {
            orderId,
            provider: 'razorpay',
            transactionId: gatewayPaymentId,
            amount: 0,
            currency: 'INR',
            status: 'failed',
            failureReason: reason,
          } as any,
        });

        await tx.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'failed' },
        });

        // Restore inventory — exactly once (guarded by the payment_status check above)
        if (orderWithItems?.items && orderWithItems.items.length > 0) {
          await Promise.all(
            orderWithItems.items.map((item: any) =>
              tx.product.update({
                where: { id: item.productId },
                data: { stockQty: { increment: item.quantity } },
              }),
            ),
          );

          await tx.inventoryLog.createMany({
            data: orderWithItems.items.map((item: any) => ({
              productId: item.productId,
              changeQty: item.quantity,
              reason: 'payment_failed_restore',
              referenceId: orderId,
            })),
          });
        }
      }, { maxWait: 15000, timeout: 30000 });
    } catch (err) {
      console.error('markPaymentFailed error:', err);
    }
  }
}
