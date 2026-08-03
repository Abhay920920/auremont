# AUREMONT: Detailed Implementation & Test Strategy

This document provides a comprehensive breakdown of every functional feature implemented in the Auremont E-Commerce application. It serves as a single source of truth for QA engineers, security researchers, and developers to generate test prompts and security audits.

---

## 1. Authentication & Authorization (Auth & Users)

### 1.1 Backend Implementation Details
- **Tech Stack:** `@nestjs/passport`, `passport-jwt`, `bcrypt`
- **Guards Implemented:** 
  - `JwtAuthGuard`: Protects routes requiring authenticated users.
  - `OptionalJwtAuthGuard`: Extracts `req.user.id` if a valid token is present, else allows anonymous access (used for Cart endpoints).
  - `RolesGuard`: Enforces role-based access control (e.g., `@Roles('admin')`).
- **Decorators:** `@GetUser()` securely injects the decoded JWT payload into the controller.
- **Endpoints:**
  - `POST /auth/register`: Hashes passwords via `bcrypt`, generates JWT.
  - `POST /auth/login`: Validates credentials, returns JWT, and triggers **Cart Merging**.
  - `GET /auth/me`: Returns the current user profile.

### 1.2 Security Principles Enforced
- **Zero Trust on Frontend Identifiers:** The frontend no longer dictates the `userId` in POST bodies or URL params for protected routes. `userId` is strictly derived from the decoded JWT payload via `@GetUser()`.
- **Password Security:** Plain text passwords are never stored. Passwords are hashed with `bcrypt` before hitting the database.
- **Token Security:** Short-lived access tokens with a secure secret (configured via `JWT_SECRET`).

### 1.3 Test Prompts for Auth
- *Prompt 1:* "Attempt to login with an invalid email/password combination. Expect a 401 Unauthorized."
- *Prompt 2:* "Attempt to hit `GET /orders/me` without an Authorization header. Expect a 401 Unauthorized."
- *Prompt 3:* "Register a new user and attempt to login. Extract the JWT and hit `GET /auth/me`. Verify the ID matches."
- *Prompt 4:* "Attempt to send a POST to a protected route with `{ "userId": "another-users-uuid" }`. Verify the backend ignores this and uses the JWT's `userId`."

---

## 2. Cart Management & Merging

### 2.1 Backend Implementation Details
- **Cart Resolution:** `OptionalJwtAuthGuard` checks for a Bearer token.
  - If anonymous, the cart is looked up via `cartId` (stored in frontend localStorage).
  - If authenticated, the cart is looked up primarily by `userId`.
- **Cart Merging Logic (`CartService.mergeCart`):**
  1. Triggered on `POST /auth/login` (via frontend `cartStore.mergeCart()`).
  2. The system checks if the anonymous `cartId` has items.
  3. If the user already has an active cart, items from the anonymous cart are moved to the user's cart (quantities are added, subtotals recalculated).
  4. The old anonymous cart is deleted from the DB.
- **Concurrency Protection:** The Prisma schema uses `@@unique([cartId, productId])` on `CartItem` to prevent race conditions causing duplicate rows for the same product in a cart.

### 2.2 Security Principles Enforced
- **Resource Ownership:** `PATCH /cart/items/:id` and `DELETE /cart/items/:id` check `item.cart.userId === req.user.id` to prevent cross-account modification.
- **Orphan Prevention:** Anonymous carts are securely adopted or merged to prevent database bloat and ensure seamless user experience across devices.

### 2.3 Test Prompts for Cart
- *Prompt 1:* "As an anonymous user, add 'California Almonds' to the cart. Then Login. Verify the cart now belongs to your user account and the old anonymous cart ID is voided."
- *Prompt 2:* "As User A, attempt to send a DELETE request to a CartItem ID belonging to User B. Expect a 403 Forbidden or 400 Bad Request."

---

## 3. Order Processing & E-Commerce Math

### 3.1 Backend Implementation Details
- **Atomic Transactions:** Order creation is wrapped in a Prisma `$transaction`. If any step (inventory check, pricing, DB insert) fails, the entire order is rolled back.
- **Authoritative Pricing:** The frontend's `subtotal` calculation is purely visual. The backend reconstructs the cart by querying `products` directly and using `product.sale_price ?? product.price` for mathematical accuracy.
- **Decimal Math:** Prisma's `Decimal` type is used for all monetary calculations (`subtotal`, `tax`, `shipping`, `discount`, `total`) to prevent JavaScript floating-point rounding errors.
- **Snapshotting:** `OrderItem` records save the `price`, `productName`, `sku`, and `imageUrl` at the exact moment of checkout. If a product's price or image changes later, historical orders remain unaffected.

### 3.2 Security Principles Enforced
- **Price Tampering Prevention:** It is physically impossible for a user to tamper with the payload to get a cheaper price. The backend recalculates everything.
- **Inventory Locking:** `SELECT ... FOR UPDATE` is used via raw SQL to lock the product rows during the transaction, preventing race conditions where two concurrent users buy the last item simultaneously.

### 3.3 Test Prompts for Orders
- *Prompt 1:* "Intercept the POST /orders request and change the `subtotal` or `total` in the payload (if it existed) to 0. Verify the backend completely ignores this and charges the correct DB price."
- *Prompt 2:* "With 1 item left in stock, simulate two concurrent checkout requests for the same item. Verify one succeeds and the other fails with an 'Insufficient stock' error."

---

## 4. Inventory Control & Idempotency

### 4.1 Backend Implementation Details
- **Stock Deduction:** `stockQty` is dynamically decremented during the checkout `$transaction`.
- **Inventory Logs:** An `InventoryLog` record is created for every stock deduction or increment, tied to the specific `orderId` via `referenceId`.
- **Idempotency Keys:** 
  - The frontend generates a unique `idempotencyKey` on the Checkout page load and sends it in the `POST /orders` payload.
  - The backend checks `Order.idempotencyKey`. If an order with that key already exists, it returns the existing order instead of charging the user again or deducting stock twice.

### 4.2 Security Principles Enforced
- **Double-Charge Protection:** Network timeouts or users mashing the "Place Order" button will not result in duplicate orders due to Idempotency checks.
- **Auditability:** Every stock movement is tracked in the `inventory_logs` table for accounting.

### 4.3 Test Prompts for Inventory
- *Prompt 1:* "Send the exact same POST /orders payload twice with the same `idempotencyKey`. Verify the second request returns the existing order and does NOT deduct stock a second time."
- *Prompt 2:* "Cancel an order via `DELETE /orders/:id/cancel`. Verify the `stockQty` increments back up and an `order_cancelled` InventoryLog is generated."

---

## 5. Coupon Integrity

### 5.1 Backend Implementation Details
- **Date Validation:** `OrdersService` checks if `now()` is between `startDate` and `endDate`.
- **Minimum Order:** Checks if the reconstructed `subtotal` is `>= minimumOrder`.
- **Usage Limits:** Counts the number of existing orders tied to the `couponId`. If `usageCount >= usageLimit`, the coupon is rejected.
- **Max Discount Caps:** Percentage discounts are capped at `maxDiscount`.

### 5.2 Security Principles Enforced
- **Strict Server Authority:** Like pricing, coupons are fully validated on the backend. The frontend validation is purely for UX.

### 5.3 Test Prompts for Coupons
- *Prompt 1:* "Apply a coupon with a `usageLimit` of 1. Place the order successfully. Attempt to use the same coupon again on a new order. Verify the backend rejects it."
- *Prompt 2:* "Apply a 50% discount coupon with a `maxDiscount` of ₹500 on a ₹2000 subtotal. Verify the discount applied is strictly ₹500, not ₹1000."

---

## 6. Rate Limiting & Global Validation

### 6.1 Backend Implementation Details
- **ThrottlerModule:** Configured in `AppModule` to limit requests (e.g., 100 requests per 60 seconds per IP).
- **ValidationPipe:** Configured globally in `main.ts` with `whitelist: true` and `forbidNonWhitelisted: true`.
- **AllExceptionsFilter:** Centralizes error handling so that all unhandled exceptions are caught and formatted consistently in JSON.

### 6.2 Security Principles Enforced
- **Brute Force Protection:** Throttling protects `/auth/login` from dictionary attacks and prevents DDoS on checkout routes.
- **Payload Sanitization:** `ValidationPipe` automatically strips out malicious or unexpected fields from incoming JSON payloads, preventing mass-assignment vulnerabilities.

### 6.3 Test Prompts for Infrastructure
- *Prompt 1:* "Send 150 requests to `/products` within 60 seconds. Verify the backend responds with a 429 Too Many Requests after the 100th request."
- *Prompt 2:* "Send a payload with an unexpected field (e.g., `{ "email": "test@test.com", "isAdmin": true }`) to `POST /auth/register`. Verify `ValidationPipe` strips `isAdmin` or throws a 400 Bad Request."

---

## 7. Webhooks & Payment Processing

### 7.1 Backend Implementation Details
- **PaymentsModule:** Created to handle external payment provider webhooks (e.g., Stripe, Razorpay).
- **Webhook Endpoint:** `POST /payments/webhook` receives payloads, verifies signatures (mocked currently), and safely transitions the `Order` from `placed` to `confirmed` or `failed`.
- **Payment Record:** Generates a `Payment` row linking the `transactionId` to the `Order`.

### 7.2 Security Principles Enforced
- **Asynchronous Status Updates:** Checkout only generates an order in `placed`/`pending` state. The actual financial state relies exclusively on cryptographic webhook signatures.

---

## 8. Frontend Hardening & UX

### 8.1 Implementation Details
- **Zustand Persistence:** State for cart and authentication is persisted to `localStorage` ensuring survival across page reloads.
- **Hydration Safety:** Uses `mounted` state (`useEffect`) to prevent React hydration errors when rendering `localStorage` dependent data (like Cart count and totals).
- **Checkout Lock:** The "Place Order" button is locked (`disabled={loading}`) to prevent double submissions.
- **Cross-Store Communication:** `authStore` seamlessly commands `cartStore` and `wishlistStore` to fetch/merge data upon successful login.

### 8.2 Security Principles Enforced
- **Graceful Failure:** `try/catch` blocks wrap all `api.post` and `api.get` calls, piping backend error messages (from `AllExceptionsFilter`) directly to localized UI error banners.

### 8.3 Test Prompts for Frontend
- *Prompt 1:* "Turn off the backend server. Attempt to log in. Verify the UI catches the network error and displays 'Login failed' gracefully without crashing the React app."
- *Prompt 2:* "Disable internet connection after loading the Checkout page, then click 'Place Order'. Verify the UI error state handles the network timeout."

---
*End of Document.*
