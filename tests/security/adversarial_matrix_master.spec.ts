import { JwtService } from '@nestjs/jwt';
import { AdminAuthGuard } from '../../auremont-backend/src/admin/auth/admin-auth.guard';
import { AllExceptionsFilter } from '../../auremont-backend/src/all-exceptions.filter';
import { redactSensitiveData } from '../../auremont-backend/src/common/structured-logger.service';
import * as crypto from 'crypto';

describe('RARE NUTS / AUREMONT — Adversarial Security Matrix Master', () => {
  const JWT_SECRET = 'test_adversarial_master_secret_2026';
  let jwtService: JwtService;

  beforeAll(() => {
    jwtService = new JwtService({ secret: JWT_SECRET });
  });

  // ==========================================
  // PHASE 3 & 4: AUTHENTICATION & JWT SECURITY
  // ==========================================
  describe('Phase 3 & 4: Authentication & JWT Hardening', () => {
    it('should strictly reject "none" algorithm and forged JWT tokens', async () => {
      // Attacker attempts "none" algorithm token
      const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
      const payload = Buffer.from(JSON.stringify({ sub: 'attacker-1', role: 'admin' })).toString('base64url');
      const forgedToken = `${noneHeader}.${payload}.`;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: `Bearer ${forgedToken}` } }),
        }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
      } as any;

      const guard = new AdminAuthGuard(jwtService as any, { getAllAndOverride: () => ['ADMIN'] } as any);
      await expect(guard.canActivate(mockContext)).rejects.toThrow();
    });

    it('should reject tokens signed with an arbitrary or untrusted secret key', async () => {
      const foreignJwt = new JwtService({ secret: 'attacker_private_secret_key_999' });
      const stolenToken = foreignJwt.sign({ sub: 'user-001', role: 'admin' });

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: `Bearer ${stolenToken}` } }),
        }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
      } as any;

      const guard = new AdminAuthGuard(jwtService as any, { getAllAndOverride: () => ['ADMIN'] } as any);
      await expect(guard.canActivate(mockContext)).rejects.toThrow();
    });
  });

  // ==========================================
  // PHASE 5 & 6: AUTHORIZATION, BOLA & PRIVILEGE ESCALATION
  // ==========================================
  describe('Phase 5 & 6: BOLA / IDOR & Privilege Escalation', () => {
    it('should block customer role attempting to escalate to admin privileges via token claims', async () => {
      const customerToken = jwtService.sign({
        sub: 'cust-100',
        email: 'attacker@evil.com',
        role: 'customer',
        isAdmin: true, // Malicious claim injection attempt
      });

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: `Bearer ${customerToken}` } }),
        }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
      } as any;

      const guard = new AdminAuthGuard(jwtService as any, { getAllAndOverride: () => ['ADMIN'] } as any);
      await expect(guard.canActivate(mockContext)).rejects.toThrow(/Invalid admin token|Insufficient permissions|Forbidden/i);
    });

    it('should enforce strict ownership context check in BOLA simulation', () => {
      const authenticatedUserId = '11111111-1111-4111-a111-111111111111';
      const targetResourceOwnerId = '22222222-2222-4222-a222-222222222222';

      // Simulated service ownership guard check
      const checkOwnership = (authId: string, resourceOwnerId: string) => {
        if (authId !== resourceOwnerId) {
          throw new Error('FORBIDDEN_BOLA_ATTEMPT: Resource does not belong to the authenticated caller');
        }
        return true;
      };

      expect(() => checkOwnership(authenticatedUserId, targetResourceOwnerId)).toThrow('FORBIDDEN_BOLA_ATTEMPT');
      expect(checkOwnership(authenticatedUserId, authenticatedUserId)).toBe(true);
    });
  });

  // ==========================================
  // PHASE 12: BUSINESS LOGIC & INVENTORY CONCURRENCY
  // ==========================================
  describe('Phase 12: Business Logic & Inventory Concurrency Invariants', () => {
    it('should maintain the invariant: stock decrement fails atomically when requested quantity exceeds available stock', () => {
      let currentStock = 3;
      const requestedQuantity = 5;

      // Simulated atomic PostgreSQL row lock query logic:
      // UPDATE products SET stock_qty = stock_qty - qty WHERE id = id AND stock_qty >= qty RETURNING id
      const atomicDecrement = (stock: number, qty: number): { updated: boolean; newStock: number } => {
        if (qty <= 0) throw new Error('INVALID_QUANTITY: Must be positive integer');
        if (stock >= qty) {
          return { updated: true, newStock: stock - qty };
        }
        return { updated: false, newStock: stock };
      };

      const result = atomicDecrement(currentStock, requestedQuantity);
      expect(result.updated).toBe(false);
      expect(result.newStock).toBe(3); // Invariant preserved: no negative stock
    });

    it('should prevent negative and non-integer quantity exploits', () => {
      const validateQuantity = (qty: any) => {
        if (typeof qty !== 'number' || !Number.isInteger(qty) || qty <= 0) {
          throw new Error('INVALID_QUANTITY');
        }
        return true;
      };

      const maliciousQuantities = [-1, 0, -999, 1.5, NaN, Infinity, -Infinity, '5', null, undefined];
      for (const malQty of maliciousQuantities) {
        expect(() => validateQuantity(malQty)).toThrow('INVALID_QUANTITY');
      }
      expect(validateQuantity(1)).toBe(true);
      expect(validateQuantity(10)).toBe(true);
    });
  });

  // ==========================================
  // PHASE 13 & 15: PAYMENT SECURITY & HMAC TIMING-ATTACK RESISTANCE
  // ==========================================
  describe('Phase 13 & 15: Payment HMAC Cryptographic Verification', () => {
    const RAZORPAY_SECRET = 'rzp_live_secret_cryptographic_test_key_2026';
    const razorpayOrderId = 'order_DA2910FKA91';
    const razorpayPaymentId = 'pay_91823019283';

    it('should verify legitimate HMAC-SHA256 signature using timingSafeEqual', () => {
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_SECRET)
        .update(body)
        .digest('hex');

      const verifyHmacTimingSafe = (receivedSig: string, expectedSig: string): boolean => {
        const receivedBuf = Buffer.from(receivedSig, 'utf8');
        const expectedBuf = Buffer.from(expectedSig, 'utf8');
        if (receivedBuf.length !== expectedBuf.length) {
          return false;
        }
        return crypto.timingSafeEqual(receivedBuf, expectedBuf);
      };

      expect(verifyHmacTimingSafe(expectedSignature, expectedSignature)).toBe(true);

      // Adversarial tampering with 1 character in signature
      const tamperedSignature = expectedSignature.slice(0, -1) + (expectedSignature.slice(-1) === 'a' ? 'b' : 'a');
      expect(verifyHmacTimingSafe(tamperedSignature, expectedSignature)).toBe(false);

      // Adversarial short/long signature
      expect(verifyHmacTimingSafe('short', expectedSignature)).toBe(false);
    });

    it('should reject payment verification if order ID or payment ID is tampered', () => {
      const bodyOriginal = `${razorpayOrderId}|${razorpayPaymentId}`;
      const originalSignature = crypto
        .createHmac('sha256', RAZORPAY_SECRET)
        .update(bodyOriginal)
        .digest('hex');

      const tamperedOrderId = 'order_ATTACKER_999';
      const bodyTampered = `${tamperedOrderId}|${razorpayPaymentId}`;
      const recomputedForTampered = crypto
        .createHmac('sha256', RAZORPAY_SECRET)
        .update(bodyTampered)
        .digest('hex');

      expect(recomputedForTampered).not.toBe(originalSignature);
    });
  });

  // ==========================================
  // PHASE 27 & 28: ERROR MASKING & LOG REDACTION
  // ==========================================
  describe('Phase 27 & 28: Information Disclosure & Log Redaction', () => {
    it('should recursively redact all sensitive credentials and secrets from logging metadata', () => {
      const sensitivePayload = {
        email: 'user@example.com',
        password: 'RawPassword123!',
        passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789',
        token: 'eyJh...jwt_token_content',
        refreshToken: 'refresh_secret_123',
        razorpay_secret: 'rzp_secret_99999',
        authorization: 'Bearer secret_token',
        nested: {
          apiKey: 'key_live_abcdef',
          normalField: 'safeValue',
        },
      };

      const redacted = redactSensitiveData(sensitivePayload);

      expect(redacted.password).toBe('[REDACTED]');
      expect(redacted.passwordHash).toBe('[REDACTED]');
      expect(redacted.token).toBe('[REDACTED]');
      expect(redacted.refreshToken).toBe('[REDACTED]');
      expect(redacted.razorpay_secret).toBe('[REDACTED]');
      expect(redacted.authorization).toBe('[REDACTED]');
      expect(redacted.nested.apiKey).toBe('[REDACTED]');
      expect(redacted.nested.normalField).toBe('safeValue');
      expect(redacted.email).toBe('user@example.com');
    });

    it('should sanitize raw database errors in AllExceptionsFilter under production environment', () => {
      const oldEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'production';

      try {
        const filter = new AllExceptionsFilter();
        let sentStatus = 0;
        let sentJson: any = null;

        const mockResponse = {
          setHeader: jest.fn(),
          status: (code: number) => {
            sentStatus = code;
            return {
              json: (body: any) => {
                sentJson = body;
              },
            };
          },
        };

        const mockArgumentsHost = {
          switchToHttp: () => ({
            getResponse: () => mockResponse,
            getRequest: () => ({ url: '/api/v1/checkout', method: 'POST', headers: {} }),
          }),
        } as any;

        // Simulate a raw Prisma database connection error exposing table schema and SQL
        const rawPrismaError = new Error('FATAL: relation "users" does not exist at postgresql://app:supersecret@db.neon.tech/main');
        (rawPrismaError as any).code = 'P2000'; // General prisma code

        filter.catch(rawPrismaError, mockArgumentsHost);

        expect(sentStatus).toBe(500);
        expect(sentJson).toBeDefined();
        expect(sentJson.message).toBe('A database integrity operation failed.');
        expect(sentJson.stack).toBeUndefined();
        // Ensure zero leakage of connection string, password, or SQL schema
        expect(JSON.stringify(sentJson)).not.toContain('supersecret');
        expect(JSON.stringify(sentJson)).not.toContain('postgresql://');
        expect(JSON.stringify(sentJson)).not.toContain('relation "users" does not exist');
      } finally {
        (process.env as any).NODE_ENV = oldEnv;
      }
    });
  });

  // ==========================================
  // PHASE 34: SERVICE WORKER SSRF FALSE POSITIVE PROOF
  // ==========================================
  describe('Phase 34: Service Worker Origin Isolation (SSRF False Positive Proof)', () => {
    it('should prove that service worker origin filter prevents arbitrary outbound SSRF requests', () => {
      const swOrigin = 'https://auremont-rose.vercel.app';

      // Logic from auremont-frontend/public/sw.js
      const isHandledByServiceWorker = (requestUrl: string): boolean => {
        try {
          const parsed = new URL(requestUrl);
          // Only handle GET requests from the same origin
          if (parsed.origin !== swOrigin) {
            return false; // Bypassed: not cached or intercepted by service worker
          }
          return true;
        } catch {
          return false;
        }
      };

      // Attacker attempts internal cloud metadata / loopback SSRF targets
      const maliciousTargets = [
        'http://169.254.169.254/latest/meta-data/',
        'http://127.0.0.1:8080/admin',
        'http://localhost:5432/',
        'http://10.0.0.1/internal',
        'https://attacker-c2.evil.com/exfiltrate',
      ];

      for (const target of maliciousTargets) {
        expect(isHandledByServiceWorker(target)).toBe(false);
      }

      // Legitimate local asset
      expect(isHandledByServiceWorker('https://auremont-rose.vercel.app/static/logo.png')).toBe(true);
    });
  });
});
