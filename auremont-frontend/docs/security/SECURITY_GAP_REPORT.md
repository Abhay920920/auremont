# RARE NUTS — OWASP Security & Vulnerability Gap Report

**Audit Purpose:** OWASP-Style Application Security Assessment across 10 security risk categories for **https://rarenuts.in**.

---

## 🛡️ OWASP Application Security Assessment Table

| OWASP Risk Category | Control Mechanism Implemented | Audit Finding | Status |
| :--- | :--- | :--- | :--- |
| **A01: Broken Access Control (IDOR)** | Ownership checks on Cart, Wishlist, Order queries (`where: { userId }`). `ForbiddenException` thrown on mismatch. | Cross-user cart or order access blocked. | 🟢 PASS |
| **A02: Cryptographic Failures** | Bcrypt password hashing (rounds = 10), Razorpay HMAC-SHA256 verification, HTTPS transport. | Zero plaintext passwords or un-signed webhooks. | 🟢 PASS |
| **A03: Injection (SQLi / XSS)** | Prisma ORM parameterization, DOMPurify HTML sanitization, NestJS `ValidationPipe`. | Immune to SQL injection and DOM XSS. | 🟢 PASS |
| **A04: Insecure Design** | Transactional Outbox Pattern, pessimistic `FOR UPDATE` row locks, server-authoritative pricing. | Double-spending and stock overselling prevented. | 🟢 PASS |
| **A05: Security Misconfiguration** | Helmet security headers (CSP, HSTS `31536000`, `X-Frame-Options: SAMEORIGIN`). Stack traces masked in production responses. | Hardened environment configuration. | 🟢 PASS |
| **A06: Vulnerable Dependencies** | `package.json` overrides for `multer`, `qs`, `body-parser`, `ajv`, `webpack`. Zero critical vulnerabilities. | Managed dependency tree. | 🟢 PASS |
| **A07: Authentication Failures** | Passport JWT with 15m access tokens and 7d HTTP-only refresh tokens. | Prevents session hijacking. | 🟢 PASS |
| **A08: Software & Data Integrity** | Webhook deduplication via `WebhookLog(eventId)`. Outbox event idempotency. | Message processing integrity verified. | 🟢 PASS |
| **A09: Logging & Monitoring** | NestJS `Logger` structured event logs with sensitive PII (passwords, card data) masked. | Compliant security logging. | 🟢 PASS |
| **A10: Server-Side Request Forgery** | External HTTP requests restricted to Razorpay API endpoints. | Zero SSRF vectors. | 🟢 PASS |
