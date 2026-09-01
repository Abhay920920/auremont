# RARE NUTS — Master Security & Quality Certification Scorecard

This document evaluates the RARE NUTS platform across key security domains, mapping compliance statuses and identifying areas for improvement.

---

## 1. Security Compliance Scorecard

| Security Domain | Status | Verification Method | Verification Type | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | 🟢 PASS | JWT expiration & bcrypt tests | `CODE VERIFIED` | Validates JWT signatures and uses bcrypt for passwords. |
| **Authorization** | 🟢 PASS | RBAC guards and IDOR tests | `CODE VERIFIED` | Restricts access using `@GetUser().id`. |
| **IDOR Protection** | 🟢 PASS | Cart and Order ownership tests | `TEST VERIFIED` | Verified in [security_inventory.spec.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/test/security_inventory.spec.ts). |
| **Input Validation**| 🟢 PASS | class-validator DTO checks | `CODE VERIFIED` | Enforces whitelisting and rejects unexpected parameters. |
| **SQL Injection** | 🟢 PASS | Prisma parameterization checks | `CODE VERIFIED` | Parameterizes queries by default. |
| **XSS Protection** | 🟢 PASS | React escaping & DOMPurify checks | `CODE VERIFIED` | Escapes inputs and sanitizes HTML. |
| **CSRF Protection** | 🟢 PASS | CORS origin whitelisting checks | `CODE VERIFIED` | Validates origins and uses Bearer tokens. |
| **Rate Limiting** | 🟢 PASS | Throttler configuration checks | `CODE VERIFIED` | Enforces rate limits on sensitive endpoints. |
| **PII & Privacy** | 🟢 PASS | Audit logs sanitization checks | `CODE VERIFIED` | Excludes credentials and PII from logs. |
| **Payments** | 🟢 PASS | Webhook signature checks | `CODE VERIFIED` | Verifies webhooks cryptographically. |
| **Webhooks** | 🟢 PASS | Webhook log idempotency checks | `CODE VERIFIED` | Prevents duplicate event processing. |
| **Transactions** | 🟢 PASS | Prisma order transaction checks | `CODE VERIFIED` | Rolls back changes if order creation fails. |
| **Outbox Queue** | 🟢 PASS | Prisma outbox transaction checks | `CODE VERIFIED` | Writes events atomically inside transactions. |
| **Error Handling** | 🟢 PASS | Exceptions filter checks | `CODE VERIFIED` | Sanitizes error messages in production. |

---

## 2. Findings and Remediation

### 2.1 Remediated Issues
- **User Review Enumeration:**
  - *Risk:* `MEDIUM`
  - *Issue:* Unauthenticated users could view all reviews by any user ID.
  - *Fix:* Applied `JwtAuthGuard` to `GET /reviews/user/:userId` and verified the user's identity ([reviews.controller.ts:L30](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/reviews/reviews.controller.ts#L30)).
- **Unvalidated Contact Form Submissions:**
  - *Risk:* `LOW`
  - *Issue:* The contact endpoint accepted arbitrary payloads without validation.
  - *Fix:* Enforced type and length checks using `CreateContactDto` ([contact.controller.ts:L11](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/contact/contact.controller.ts#L11)).
- **Unvalidated Blog Uploads:**
  - *Risk:* `LOW`
  - *Issue:* Blog creation and update endpoints accepted raw `any` payloads.
  - *Fix:* Enforced validation checks using `CreateBlogDto` and `UpdateBlogDto` ([blogs.controller.ts:L30](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/blogs/blogs.controller.ts#L30)).

### 2.2 Remaining Risks
- **Global Coupon Usage Limit Race Conditions:**
  - *Risk:* `LOW`
  - *Issue:* Multiple concurrent checkouts could apply a coupon after its limit is reached if requests are processed simultaneously.
  - *Remediation:* Implement database-level row locks on the `Coupon` table during validation.

---

## 3. Release Status

### **RELEASE STATUS:** 🟢 SECURITY VERIFIED WITHIN TESTED SCOPE
The application follows zero-trust security practices, implements data validation at trust boundaries, and uses database transactions to protect integrity.
