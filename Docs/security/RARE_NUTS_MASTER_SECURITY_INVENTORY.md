# RARE NUTS — Master Security Route & Endpoint Inventory

This document lists every active frontend route and backend API endpoint in the RARE NUTS e-commerce application, mapping their HTTP methods, authorization requirements, role constraints, validation schemas, and database entity scopes.

---

## 1. Frontend Route Inventory

All frontend pages reside under the Next.js App Router in [/auremont-frontend/app/](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/app/).

| Path | Description | Access Level | SEO Indexing | Security Considerations |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Brand Home & Cinematic Video | `PUBLIC` | `INDEXABLE` | Public product slider, search triggers. |
| `/shop` | Product catalog with filters | `PUBLIC` | `INDEXABLE` | Dynamic product fetching. |
| `/shop/[slug]` | Product Details & Nutrition facts | `PUBLIC` | `INDEXABLE` | Flavor profile visualization, related products slider. |
| `/about` | Brand narrative and history | `PUBLIC` | `INDEXABLE` | Static rendering. |
| `/faq` | Frequently asked questions | `PUBLIC` | `INDEXABLE` | Static rendering. |
| `/contact` | Inquiry submission form | `PUBLIC` | `INDEXABLE` | Rate limiting, input validation. |
| `/corporate-gifts`| Corporate inquiry catalog | `PUBLIC` | `INDEXABLE` | Form input checking. |
| `/login` | Customer login form | `PUBLIC` | `NOINDEX` | JWT generation, password encryption. |
| `/register` | Customer sign-up form | `PUBLIC` | `NOINDEX` | Validation check, duplicate account prevention. |
| `/forgot-password`| Request reset password token | `PUBLIC` | `NOINDEX` | Rate limit protection, reset token emails. |
| `/reset-password` | Form to set new password | `PUBLIC` | `NOINDEX` | Expiring verification keys. |
| `/cart` | Side-drawer cart visual list | `PUBLIC` | `NOINDEX` | Client-side Zustand synchronization. |
| `/checkout` | Multi-step checkout details | `PUBLIC/GUEST`| `NOINDEX` | Client idempotency key generation. |
| `/account` | Customer profile dashboard | `AUTHENTICATED`| `NOINDEX` | Session validations, CSRF protections. |
| `/admin/*` | Back-office administration pages| `ADMIN` | `NOINDEX` | Restricted RBAC role authorization. |

---

## 2. Backend API Endpoint Inventory

The API endpoints are handled by NestJS controllers under [/auremont-backend/src/](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/).

### 2.1 Customer & Public Domains

#### Authentication Controller (`/auth`)
* **`POST /auth/register`**
  * *Access:* `PUBLIC`
  * *Input DTO:* `RegisterDto`
  * *Database Scope:* `User` (insert)
  * *Actions:* Encrypts password, returns token, initializes profile.
* **`POST /auth/login`**
  * *Access:* `PUBLIC`
  * *Input DTO:* `LoginDto`
  * *Database Scope:* `User` (read/update for refresh token)
  * *Actions:* Validates login, merges cart sessions.
* **`POST /auth/refresh`**
  * *Access:* `PUBLIC`
  * *Input DTO:* `{ refreshToken: string }`
  * *Database Scope:* `User` (verify/rotate token)
  * *Actions:* Verifies refresh token signature, rotates tokens.
* **`POST /auth/forgot-password`**
  * *Access:* `PUBLIC`
  * *Input DTO:* `{ email: string }`
  * *Database Scope:* `User` (updates recovery token)
  * *Actions:* Generates Single-Use Reset Token, logs email payload.
* **`POST /auth/reset-password`**
  * *Access:* `PUBLIC`
  * *Input DTO:* `ResetPasswordDto`
  * *Database Scope:* `User` (updates password)
  * *Actions:* Verifies token and updates password hash.

#### Users Controller (`/users`)
* **`GET /users/me`**
  * *Access:* `AUTHENTICATED`
  * *Database Scope:* `User` (read)
  * *Audit Log:* Standard request logging.
* **`PATCH /users/me`**
  * *Access:* `AUTHENTICATED`
  * *Input DTO:* `UpdateProfileDto`
  * *Database Scope:* `User` (update)
* **`POST /users/me/change-password`**
  * *Access:* `AUTHENTICATED`
  * *Input DTO:* `ChangePasswordDto`
  * *Database Scope:* `User` (update)
* **`GET /users/me/addresses`**
  * *Access:* `AUTHENTICATED`
  * *Database Scope:* `Address` (filter where order counts are zero)
* **`POST /users/me/addresses`**
  * *Access:* `AUTHENTICATED`
  * *Input DTO:* `AddressDto`
  * *Database Scope:* `Address` (create)
* **`PATCH /users/me/addresses/:id`**
  * *Access:* `AUTHENTICATED`
  * *Input DTO:* `AddressDto`
  * *Database Scope:* `Address` (update)
* **`PATCH /users/me/addresses/:id/default`**
  * *Access:* `AUTHENTICATED`
  * *Database Scope:* `Address` (updates list defaults)
* **`DELETE /users/me/addresses/:id`**
  * *Access:* `AUTHENTICATED`
  * *Database Scope:* `Address` (delete where unused in orders)

#### Products Controller (`/products`)
* **`GET /products`**
  * *Access:* `PUBLIC`
  * *Database Scope:* `Product`, `Category`, `Collection` (reads list)
* **`GET /products/:slug`**
  * *Access:* `PUBLIC`
  * *Database Scope:* `Product`, `ProductImage`, `ProductAttribute` (reads detail)

#### Cart Controller (`/cart`)
* **`GET /cart`**
  * *Access:* `PUBLIC/AUTHENTICATED` (optional JWT verification)
  * *Database Scope:* `Cart`, `CartItem` (reads active list)
* **`POST /cart/items`**
  * *Access:* `PUBLIC/AUTHENTICATED`
  * *Input DTO:* `AddCartItemDto`
  * *Database Scope:* `CartItem` (create/update)
* **`POST /cart/merge`**
  * *Access:* `AUTHENTICATED`
  * *Input DTO:* `MergeCartDto`
  * *Database Scope:* `Cart`, `CartItem` (deletes guest cart, updates customer cart items)
* **`PATCH /cart/items/:id`**
  * *Access:* `PUBLIC/AUTHENTICATED`
  * *Input DTO:* `UpdateCartItemDto`
  * *Database Scope:* `CartItem` (updates item quantity)
* **`DELETE /cart/items/:id`**
  * *Access:* `PUBLIC/AUTHENTICATED`
  * *Database Scope:* `CartItem` (deletes item)

#### Orders Controller (`/orders`)
* **`POST /orders`**
  * *Access:* `PUBLIC/AUTHENTICATED` (creates guest user if no token)
  * *Input DTO:* `CreateOrderDto`
  * *Database Scope:* `Order`, `OrderItem`, `Address`, `Product`, `InventoryLog`, `OutboxEvent` (multi-table transaction write)
  * *Rate Limit:* Strict IP throttling (max 20 requests per 10 mins).
* **`GET /orders/me`**
  * *Access:* `AUTHENTICATED`
  * *Database Scope:* `Order`, `OrderItem` (reads caller profile list)
* **`GET /orders/:id`**
  * *Access:* `AUTHENTICATED` (checks ID ownership)
  * *Database Scope:* `Order`, `OrderItem` (reads single record)
* **`DELETE /orders/:id/cancel`**
  * *Access:* `AUTHENTICATED` (checks ownership, ensures correct status)
  * *Database Scope:* `Order`, `Product`, `InventoryLog` (transaction updates)

#### Wishlist Controller (`/wishlists`)
* **`GET /wishlists`**
  * *Access:* `AUTHENTICATED`
  * *Database Scope:* `Wishlist`, `Product` (reads profile list)
* **`POST /wishlists`**
  * *Access:* `AUTHENTICATED`
  * *Input DTO:* `{ productId: string }`
  * *Database Scope:* `Wishlist` (create)
* **`DELETE /wishlists/:productId`**
  * *Access:* `AUTHENTICATED`
  * *Database Scope:* `Wishlist` (delete)

#### Reviews Controller (`/reviews`)
* **`POST /reviews`**
  * *Access:* `AUTHENTICATED`
  * *Input DTO:* `CreateReviewDto`
  * *Database Scope:* `Review` (create)
* **`GET /reviews/product/:productId`**
  * *Access:* `PUBLIC`
  * *Database Scope:* `Review` (reads approved list)
* **`GET /reviews/user/:userId`**
  * *Access:* `AUTHENTICATED` (secured via guard check)
  * *Database Scope:* `Review` (reads caller profile reviews)

#### Payments Controller (`/payments`)
* **`POST /payments/verify`**
  * *Access:* `PUBLIC`
  * *Input:* `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`
  * *Database Scope:* `Payment`, `Order` (transaction updates)
  * *Actions:* Verifies payment signatures and updates status.
* **`POST /payments/webhook`**
  * *Access:* `WEBHOOK` (validated using Razorpay keys)
  * *Database Scope:* `Payment`, `Order`, `WebhookLog`, `OutboxEvent` (idempotent write transaction)

---

### 2.2 Back-Office Admin Domains (All endpoints require `ADMIN` authorization checks)

#### Admin Dashboard (`/admin/dashboard`)
* **`GET /admin/dashboard/metrics`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`, `MARKETING_MANAGER`
  * *Database Scope:* `Order`, `User` (reads aggregations)

#### Admin Customers (`/admin/customers`)
* **`GET /admin/customers`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`, `SUPPORT`
  * *Database Scope:* `User` (reads customer list)
* **`GET /admin/customers/:id`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`, `SUPPORT`
  * *Database Scope:* `User`, `Address`, `Order` (reads customer metrics)
* **`PATCH /admin/customers/:id/status`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`
  * *Input DTO:* `{ status: UserStatus }`
  * *Database Scope:* `User`, `AdminAuditLog` (updates status)

#### Admin Orders (`/admin/orders`)
* **`GET /admin/orders`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`, `SUPPORT`
  * *Database Scope:* `Order` (reads master orders list)
* **`GET /admin/orders/:id`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`, `SUPPORT`
  * *Database Scope:* `Order`, `OrderItem`, `Address`, `Payment`, `Coupon` (reads single record)
* **`PATCH /admin/orders/:id/status`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`
  * *Input DTO:* `{ status: OrderStatus }`
  * *Database Scope:* `Order`, `AdminAuditLog` (updates order status)
* **`PATCH /admin/orders/:id/payment`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`
  * *Input DTO:* `{ status: PayStatus }`
  * *Database Scope:* `Order`, `AdminAuditLog` (updates payment status)

#### Admin Inventory (`/admin/inventory`)
* **`GET /admin/inventory`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`, `INVENTORY_MANAGER`
  * *Database Scope:* `Product` (reads stock list)
* **`GET /admin/inventory/:id/logs`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`, `INVENTORY_MANAGER`
  * *Database Scope:* `InventoryLog` (reads log history)
* **`POST /admin/inventory/:id/adjust`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`, `INVENTORY_MANAGER`
  * *Input DTO:* `{ changeQty: number, reason: string }`
  * *Database Scope:* `Product`, `InventoryLog`, `AdminAuditLog` (updates inventory)

#### Admin Operations (`/admin/operations`)
* **`GET /admin/operations/coupons`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`, `MARKETING_MANAGER`
  * *Database Scope:* Non-db Mocked Coupons (reads configuration)
* **`POST /admin/operations/coupons`**
  * *Roles:* `SUPER_ADMIN`, `ADMIN`, `MARKETING_MANAGER`
  * *Database Scope:* Non-db Mocked Coupons (appends config)
* **`GET /admin/operations/audit-logs`**
  * *Roles:* `SUPER_ADMIN`
  * *Database Scope:* `AdminAuditLog` (reads system audit history)
