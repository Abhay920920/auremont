# RARE NUTS — Adversarial Security Audit Report

This report documents adversarial tests and defenses verifying system boundaries, validation pipelines, and threat mitigation.

---

## 1. Threat Scenarios & Verification Matrix

| Vulnerability Domain | Adversarial Vector / Attempt | Defense Handler | Verification Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **IDOR Check** | Attempt to fetch User B's profile, wishlist, address, or orders | `@GetUser().id` token resolution, ownership checks | `TEST VERIFIED` | Profile retrieved strictly from token context. Checked in [security_inventory.spec.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/test/security_inventory.spec.ts). |
| **Role Escalation** | Attempt to patch user role to `admin` in register payload or token | Global ValidationPipe, whitelisted DTOS | `TEST VERIFIED` | Invalid fields stripped. Checked in [controllers.e2e-spec.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/test/controllers.e2e-spec.ts). |
| **SQL Injection** | Inject SQL escapes (`' OR 1=1 --`) in inputs/parameters | Prisma parameterized query parser | `CODE VERIFIED` | Param inputs sanitized by ORM. |
| **Stored XSS** | Inject scripts in reviews or gift messages | React DOM escaping, DOMPurify sanitization | `CODE VERIFIED` | HTML tags escaped in visual rendering. |
| **CORS Bypass** | Origin spoofing (`evil.com`) with credentials | Origin Whitelisting in `main.ts` | `CODE VERIFIED` | Restricts access to trusted domains only. |
| **Rate Limit Bypass**| Send rapid concurrent requests | NestJS Throttler configuration | `CODE VERIFIED` | Rejects requests with a `429 Too Many Requests` status. |
| **Review Enumeration**| Read another user's reviews directly | `JwtAuthGuard` owner validations | `TEST VERIFIED` | Blocks requests where the ID does not match the token context. Checked in [security_remediation.spec.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/test/security_remediation.spec.ts). |

---

## 2. Adversarial Test Coverage Detail

### 2.1 Access Control Check Validation
- **Authentication Bypass Attempts:** Simulated requests with missing, malformed, or expired JWT tokens are rejected with a `401 Unauthorized` response.
- **Admin Endpoint Exploitation:** Standard user tokens attempting to access `/admin/*` routes are rejected with a `403 Forbidden` response.
- **Cross-Customer Address Leak:** Direct calls to delete or modify saved address entries check that `Address.userId === req.user.id`, preventing unauthorized modifications.
