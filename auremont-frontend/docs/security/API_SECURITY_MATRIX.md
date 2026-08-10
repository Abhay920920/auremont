# RARE NUTS — API Security & Endpoint Audit Matrix

**Brand:** RARE NUTS  
**Domain:** https://rarenuts.in  
**Framework:** NestJS 11 + Passport JWT + Helmet  

---

## 🔒 Master API Endpoint Audit Table

| HTTP Method | Endpoint Route | Authentication Required | Role Authorization | DTO Validation Pipe | Rate Limiting | Input Sanitization | Sensitivity / Masking | Security Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/products` | None (Public) | Anyone | Query DTO (`whitelist: true`) | Default Throttler | Sanitized via Prisma | Public catalog data | 🟢 PASS |
| **GET** | `/products/:slug` | None (Public) | Anyone | Slug String validation | Default Throttler | Sanitized via Prisma | Public product data | 🟢 PASS |
| **POST** | `/products` | Bearer JWT | Admin | `CreateProductDto` | Strict Throttler | Whitelisted DTO attributes | Admin action logged | 🟢 PASS |
| **GET** | `/cart` | Optional JWT | Guest / Customer | `QueryCartDto` | Default Throttler | Handled via Zustand/Prisma | Masked customer cart | 🟢 PASS |
| **POST** | `/cart/items` | Optional JWT | Guest / Customer | `AddCartItemDto` | Default Throttler | Whitelisted DTO attributes | No sensitive data | 🟢 PASS |
| **POST** | `/cart/merge` | Bearer JWT | Customer | `MergeCartDto` | Strict Throttler | Whitelisted DTO attributes | Customer isolation | 🟢 PASS |
| **POST** | `/orders` | Optional JWT | Guest / Customer | `CreateOrderDto` | Strict Throttler | Whitelisted DTO attributes | Address masked | 🟢 PASS |
| **GET** | `/orders` | Bearer JWT | Customer / Admin | IDOR Filter (`userId`) | Default Throttler | Whitelisted DTO attributes | User isolation enforced | 🟢 PASS |
| **POST** | `/payments/verify` | Bearer JWT | Customer | `VerifyPaymentDto` | Strict Throttler | HMAC-SHA256 signature check | Secret key masked | 🟢 PASS |
| **POST** | `/coupons/validate`| Optional JWT | Anyone | `ValidateCouponDto` | Strict Throttler | Whitelisted DTO attributes | Coupon rules masked | 🟢 PASS |
| **GET** | `/health` | None (Internal) | Anyone | None | Bypassed (Load Balancer) | None | System uptime & memory | 🟢 PASS |
