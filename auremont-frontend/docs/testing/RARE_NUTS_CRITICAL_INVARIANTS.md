# RARE NUTS — 15 Mandatory Production Business Invariants

This document specifies the **15 Non-Negotiable Invariants** required for financial integrity, security, order accuracy, and brand protection on **https://rarenuts.in**.

---

## 🛡️ Master Production Invariants Ledger

| # | Business Invariant Statement | Module Responsible | Unit / Integration Test Mapping | Enforcement Mechanism | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Order Total Cannot Be Negative** | `OrdersService` | `orders.service.spec.ts` | `if (total.lessThan(0)) total = new Decimal(0);` | 🟢 VERIFIED |
| **2** | **Client Price Cannot Override Server Price** | `OrdersService` | `orders.service.spec.ts` | Live DB price query (`finalPrice = salePrice ?? price`) during order creation. | 🟢 VERIFIED |
| **3** | **Client Stock Cannot Override Server Stock** | `OrdersService` | `orders.service.spec.ts` | Live stock check (`stockQty < quantity` -> `INSUFFICIENT_STOCK`). | 🟢 VERIFIED |
| **4** | **Insufficient Inventory Cannot Produce an Order** | `OrdersService` | `orders.service.spec.ts` | `ConflictException` thrown before order record creation. | 🟢 VERIFIED |
| **5** | **Unverified Payment Cannot Produce a Paid Order** | `PaymentsService` | `payments.service.spec.ts` | HMAC-SHA256 signature verification required before setting `paymentStatus: 'paid'`. | 🟢 VERIFIED |
| **6** | **Duplicate Webhooks Cannot Create Duplicate State Transitions** | `PaymentsService` | `payments.service.spec.ts` | Webhook deduplication via `WebhookLog(eventId)` and `paymentStatus === 'paid'` check. | 🟢 VERIFIED |
| **7** | **Customer Cannot Access Another Customer's Cart** | `CartService` | `cart.service.spec.ts` | `if (cart.userId && cart.userId !== userId) throw ForbiddenException`. | 🟢 VERIFIED |
| **8** | **Customer Cannot Access Another Customer's Order** | `OrdersService` | `orders.service.spec.ts` | Order query filtered strictly by `where: { userId }`. | 🟢 VERIFIED |
| **9** | **Customer Cannot Access Admin Functionality** | `AdminGuard` | `admin.guard.spec.ts` | Role verification (`user.role === 'admin'`). | 🟢 VERIFIED |
| **10**| **Ordered Cart Cannot Trigger Abandoned Recovery** | `CartRecoveryService`| `cart-recovery.service.spec.ts`| `Cart.status` changes to `'ordered'` during checkout; recovery query filters by `status: 'active'`. | 🟢 VERIFIED |
| **11**| **Recovery Event Cannot Be Processed Repeatedly** | `CartRecoveryService`| `cart-recovery.service.spec.ts`| Deduplicated via unique outbox payload query `payload: { cartId }`. | 🟢 VERIFIED |
| **12**| **Coupons Cannot Reduce Order Total Below Minimum Threshold** | `CouponsService` | `coupons.service.spec.ts` | `subtotal.lessThan(coupon.minimumOrder)` check throws `BadRequestException`. | 🟢 VERIFIED |
| **13**| **Production Canonical URLs Must Use `https://rarenuts.in`** | `SeoUtilities` | `seo.spec.ts` | `process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in'`. | 🟢 VERIFIED |
| **14**| **Private Admin Routes Must Not Be Indexable** | `robots.ts` | `robots.spec.ts` | Disallow directives (`disallow: ['/admin/', '/account/']`). | 🟢 VERIFIED |
| **15**| **Sensitive Passwords/Secrets Must Never Be Logged or Exposed** | `AllExceptionsFilter` | `all-exceptions.filter.spec.ts`| Customer-facing responses strip stack traces & sensitive fields in production. | 🟢 VERIFIED |
