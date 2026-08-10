# RARE NUTS — Master Testing Inventory & Test Matrix

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  
**Audit Date:** 2026-08-10  
**Test Frameworks:** Jest 29 (`@nestjs/testing`, `ts-jest`, `@testing-library/react`) & Playwright  

---

## 📊 1. Repository Source Inventory

### Backend Modules (`auremont-backend/src`)
1. **Products Module** (`src/products/`): Product catalog queries, category/collection filtering, SKU generation, inventory adjustments, 3D vessel inspector configs.
2. **Orders Module** (`src/orders/`): Transactional order creation, address snapshots, subtotal & tax calculation, outbox event generation.
3. **Payments Module** (`src/payments/`): Razorpay session creation, HMAC-SHA256 signature verification, webhook log idempotency.
4. **Cart & Recovery Module** (`src/cart/`): Cart CRUD, guest-to-user cart merging, abandoned cart detection, recovery outbox queuing.
5. **Coupons Module** (`src/coupons/`): Code validation, percentage/fixed discount computation, minimum subtotal thresholds, usage limits.
6. **Users & Auth Module** (`src/users/`, `src/auth/`): JWT access token issuance, refresh token rotation, bcrypt password hashing, address management.
7. **Reviews Module** (`src/reviews/`): Review submission, 1-5 star validation, auto-approval status.
8. **Health Module** (`src/health.controller.ts`): Throttler-bypassed memory RSS & uptime metrics.

### Frontend Components & Stores (`auremont-frontend/`)
1. **Zustand Stores** (`store/`): `useCartStore`, `useAuthStore`, `useWishlistStore`, `useCurrencyStore`.
2. **Interactive Studios** (`components/`): `GiftBoxBuilder.tsx`, `CorporateQuoteEstimator.tsx`, `Packaging3DViewer.tsx`, `FlavorRadarChart.tsx`.
3. **Checkout & Accounts** (`app/checkout/`, `app/account/`): `OrderConfirmationModal.tsx`, `OrderInvoiceModal.tsx`, `OrderHistoryTab.tsx`.
4. **SEO Utilities** (`components/seo/`, `app/sitemap.ts`, `app/robots.ts`): `WebSiteSchema.tsx`, `ProductSchema.tsx`, `BreadcrumbSchema.tsx`.

---

## 🗺️ 2. Comprehensive Module Unit Test Matrix

| Backend/Frontend Module | Tested Component | Business Responsibility | Risk Level | Required Unit Test Coverage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Products Service** | `ProductsService` | Querying, filtering, price/stock retrieval, slug fallback. | HIGH | 95%+ | ✅ TESTED |
| **Orders Service** | `OrdersService` | Atomic order creation, tax/shipping computation, outbox event creation. | CRITICAL | 95%+ | ✅ TESTED |
| **Payments Service** | `PaymentsService` | Razorpay session creation, HMAC signature verification, webhook deduplication. | CRITICAL | 95%+ | ✅ TESTED |
| **Cart Recovery** | `CartRecoveryService` | Scans idle carts, generates outbox events, prevents duplicate reminders. | HIGH | 90%+ | ✅ TESTED |
| **Coupons Service** | `CouponsService` | Percentage/fixed discount calculations, usage limit enforcement. | HIGH | 90%+ | ✅ TESTED |
| **Auth Guard** | `JwtAuthGuard` | Token parsing, 401 Unauthorized handling, payload decoding. | CRITICAL | 95%+ | ✅ TESTED |
| **Cart Store** | `useCartStore` | Add/remove items, quantity updating, cartId persistence. | HIGH | 85%+ | ✅ TESTED |
| **Currency Store** | `useCurrencyStore` | Currency state switching (INR, USD, EUR, GBP) & price formatting. | MEDIUM | 85%+ | ✅ TESTED |
| **E-Invoice Modal** | `OrderInvoiceModal` | GST calculation, HSN code formatting, printable layout rendering. | HIGH | 85%+ | ✅ TESTED |
| **Google SEO Schema** | `WebSiteSchema` | JSON-LD Sitelinks Search Box & Organization schema output. | MEDIUM | 90%+ | ✅ TESTED |
