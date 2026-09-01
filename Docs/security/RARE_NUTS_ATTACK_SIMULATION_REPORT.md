# RARE NUTS — Attack Simulation & Security Verification Report

This document records the security posture of the RARE NUTS platform against common web vulnerabilities, listing specific attack scenarios, verified handlers, and defense mechanisms.

---

## 1. Vulnerability Simulation & Defense Map

### 1.1 Insecure Direct Object Reference (IDOR)
* **Attack Scenario:** User A attempts to view or modify User B's order details by calling `GET /orders/B_ORDER_UUID` directly or using tools like curl/Postman.
* **Security Control:** 
  - `getOrderById` validates that `order.userId === authenticatedUser.id` ([orders.service.ts:L288](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/orders/orders.service.ts#L288)).
  - Unauthorized requests are rejected with a `403 Forbidden` response.
* **Status:** `TEST VERIFIED` (validated in [security_inventory.spec.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/test/security_inventory.spec.ts)).

### 1.2 Price & Coupon Tampering
* **Attack Scenario:** A malicious user intercepts the checkout request payload to modify product prices, order subtotals, or coupon values.
  ```json
  {
    "cartId": "some-cart-uuid",
    "price": 1.00,
    "total": 1.00
  }
  ```
* **Security Control:**
  - The server ignores all financial values sent in the request payload.
  - It reconstructs the cart by querying authoritative product details and prices directly from the database during order processing.
* **Status:** `CODE VERIFIED` (validated in [orders.service.ts:L134](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/orders/orders.service.ts#L134)).

### 1.3 SQL Injection (SQLi)
* **Attack Scenario:** Injecting SQL payloads (e.g., `' OR 1=1 --`) into input fields or query parameters to bypass authentication or extract data.
* **Security Control:**
  - The database is accessed via Prisma ORM, which parameterizes all queries by default.
  - Raw SQL queries, such as the `FOR UPDATE` inventory lock, are parameterized using Prisma's `Prisma.sql` template strings ([orders.service.ts:L111](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/orders/orders.service.ts#L111)).
* **Status:** `CODE VERIFIED`.

### 1.4 Cross-Site Scripting (XSS)
* **Attack Scenario:** Injecting malicious script tags (e.g., `<script>alert(1)</script>`) into input fields like product reviews or gift messages.
* **Security Control:**
  - Frontend input values are escaped by default by React's rendering engine.
  - The frontend uses `DOMPurify` to sanitize HTML content before rendering, preventing script execution.
  - Rich text rendering in components is restricted, and any use of `dangerouslySetInnerHTML` is checked to ensure inputs are sanitized.
* **Status:** `CODE VERIFIED`.

### 1.5 Cross-Site Request Forgery (CSRF)
* **Attack Scenario:** A malicious site tricks a logged-in user's browser into sending state-changing requests to the e-commerce API.
* **Security Control:**
  - Authentication tokens are sent via `Authorization: Bearer <JWT>` headers instead of relying solely on implicit session cookies.
  - Cross-Origin Resource Sharing (CORS) is configured in [main.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/main.ts#L29) to restrict API access to trusted frontend origins only.
* **Status:** `CODE VERIFIED`.

### 1.6 Rate Limiting & Denial of Service (DoS)
* **Attack Scenario:** Flooding auth endpoints with login attempts or checkout routes with concurrent requests to exhaust system resources.
* **Security Control:**
  - Enforces IP-based rate limiting on sensitive routes using NestJS `ThrottlerModule`.
  - Specific limits are applied to key endpoints:
    - `/auth/login`: Restricted to prevent brute-force attacks.
    - `/orders` and `/payments/verify`: Throttled to prevent spam and race conditions.
  - Request body limits are configured at the web server layer in [nginx.conf](file:///c:/Users/adts-/Desktop/almonds/nginx/nginx.conf#L33) to drop payloads larger than 5MB.
* **Status:** `CODE VERIFIED`.
