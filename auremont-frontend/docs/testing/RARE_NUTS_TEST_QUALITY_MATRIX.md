# RARE NUTS — Second-Level Test Quality Matrix

**Audit Type:** Second-Level Test Quality & Failure Path Audit  
**Audit Date:** 2026-08-10  
**Target Systems:** RARE NUTS E-Commerce Engine & Storefront  

---

## 📊 1. Quality Matrix Classification Legend
- 🟢 **STRONG**: Tests meaningful business contracts, boundary paths, failure conditions, and assertions.
- 🟡 **WEAK**: Covers happy path only; missing edge cases, negative assertions, or explicit error validation.
- 🔴 **MISSING**: Business rule has zero unit test coverage.
- ⚠️ **MISLEADING**: Test passes by asserting mock returns rather than validating actual business logic contracts.

---

## 🗺️ 2. Comprehensive Test Quality Matrix

| Module | Test File | Test Case Description | Business Rule Evaluated | Happy Path | Negative Path | Boundary Path | Security Path | Concurrency Path | Assertion Quality | Mock Dependency | Risk Level | Quality Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Products** | `products.service.spec.ts` | `findAll` pagination & price filters | Product catalog queries apply min/max price bounds & limit caps. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟡 Single Thread | 🟢 STRONG | Low | HIGH | 🟢 STRONG |
| **Products** | `products.service.spec.ts` | `findBySlug` UUID / slug fallback | Slug routes support both UUID IDs and slugs without DB exceptions. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟡 Single Thread | 🟢 STRONG | Low | HIGH | 🟢 STRONG |
| **Orders** | `orders.service.spec.ts` | `createOrder` atomic placement | Orders calculate 5% tax, snapshot address & set `cart.status = ordered`. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟡 Integration Required | 🟢 STRONG | Low | CRITICAL | 🟢 STRONG |
| **Orders** | `orders.service.spec.ts` | Empty cart rejection | Orders cannot be created from empty carts (`BadRequestException`). | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | CRITICAL | 🟢 STRONG |
| **Payments** | `payments.service.spec.ts` | `verifyPayment` signature check | HMAC-SHA256 signature verification validates payment payload authenticity. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | CRITICAL | 🟢 STRONG |
| **Payments** | `payments.service.spec.ts` | Double-spend replay defense | Orders with `paymentStatus = paid` reject repeated payment verification. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | CRITICAL | 🟢 STRONG |
| **Cart Recovery**| `cart-recovery.service.spec.ts` | `processAbandonedCarts` scan | Carts idle > 1h generate `abandoned_cart_reminder` outbox events. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | HIGH | 🟢 STRONG |
| **Cart Recovery**| `cart-recovery.service.spec.ts` | Duplicate outbox event skip | Unique outbox event payload checks prevent duplicate reminder emails. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | HIGH | 🟢 STRONG |
| **Coupons** | `coupons.service.spec.ts` | Minimum subtotal threshold | Coupons below `minimumOrder` subtotal throw `BadRequestException`. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | HIGH | 🟢 STRONG |
| **Cart Security**| `cart.service.spec.ts` | Cross-user cart access guard | `CartService.getCart` throws `ForbiddenException` for unauthorized cart IDs. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | CRITICAL | 🟢 STRONG |
| **SEO Schema** | `seo.spec.ts` | Production canonical URL | Canonical URLs must always use `https://rarenuts.in`. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | MEDIUM | 🟢 STRONG |
| **Currency** | `currencyStore.spec.ts` | Price formatting & conversion | Format prices into INR (₹), USD ($), EUR (€), GBP (£). | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | MEDIUM | 🟢 STRONG |
| **E-Invoice** | `OrderInvoiceModal.spec.ts` | GST & HSN calculation | Calculates 5% GST and renders legal HSN code (`08021200`). | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | HIGH | 🟢 STRONG |
| **Auth Guard** | `jwt-auth.guard.spec.ts` | Unauthenticated route guard | Unauthenticated guest requests to protected routes return HTTP 401. | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🟢 Yes | N/A | 🟢 STRONG | Low | CRITICAL | 🟢 STRONG |
