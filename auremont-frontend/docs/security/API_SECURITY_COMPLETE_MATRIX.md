# RARE NUTS — Complete API Security & Endpoint Audit Matrix

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  
**Audit Scope:** 100% Enumeration of all 15 NestJS Controller Modules  
**Language Standard:** Evidence-Based ("No issue identified within tested scope")  

---

## 🔒 Master API Endpoint Security Matrix

| Method | Endpoint Route | Auth Guard | Role Check | DTO Validation Pipe | Rate Limiting | Ownership / IDOR Guard | Data Sensitivity | Tested Scope Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/products` | None (Public) | Anyone | `QueryProductDto` | Default Throttler | N/A (Public Catalog) | Public catalog data | No issue identified within tested scope |
| **GET** | `/products/:slug` | None (Public) | Anyone | String Validation | Default Throttler | N/A (Public Catalog) | Public product data | No issue identified within tested scope |
| **POST** | `/products` | Bearer JWT | `Admin` | `CreateProductDto` | Strict Throttler | Role check (`user.role === 'admin'`) | Audit logged | No issue identified within tested scope |
| **PATCH** | `/products/:id` | Bearer JWT | `Admin` | `UpdateProductDto` | Strict Throttler | Role check (`user.role === 'admin'`) | Audit logged | No issue identified within tested scope |
| **GET** | `/categories` | None (Public) | Anyone | `QueryCategoryDto` | Default Throttler | N/A (Public Catalog) | Public category hierarchy | No issue identified within tested scope |
| **GET** | `/cart` | Optional JWT | Guest / User | `QueryCartDto` | Default Throttler | Cart `userId` ownership check | User cart items | No issue identified within tested scope |
| **POST** | `/cart/items` | Optional JWT | Guest / User | `AddCartItemDto` | Default Throttler | Cart `userId` ownership check | Cart item quantity | No issue identified within tested scope |
| **POST** | `/cart/merge` | Bearer JWT | Customer | `MergeCartDto` | Strict Throttler | Target cart `userId === user.id` | User cart session | No issue identified within tested scope |
| **POST** | `/cart/recovery` | Optional JWT | Anyone | None | Strict Throttler | Outbox event deduplication | Internal event queue | No issue identified within tested scope |
| **POST** | `/orders` | Optional JWT | Guest / User | `CreateOrderDto` | Strict Throttler | Server-authoritative price check | Shipping address masked | No issue identified within tested scope |
| **GET** | `/orders` | Bearer JWT | Customer / Admin | `QueryOrderDto` | Default Throttler | `where: { userId: user.id }` | User order history | No issue identified within tested scope |
| **GET** | `/orders/:id` | Bearer JWT | Customer / Admin | String UUID Validation | Default Throttler | `where: { id, userId: user.id }` | Individual order details | No issue identified within tested scope |
| **POST** | `/payments/verify` | Bearer JWT | Customer | `VerifyPaymentDto` | Strict Throttler | HMAC-SHA256 signature match | Payment secret masked | No issue identified within tested scope |
| **POST** | `/payments/webhook`| Razorpay HMAC Header | Gateway | Raw Signature Verification | Strict Throttler | `WebhookLog(eventId)` deduplication | Webhook payload | No issue identified within tested scope |
| **POST** | `/coupons/validate`| Optional JWT | Anyone | `ValidateCouponDto` | Strict Throttler | Server subtotal recalculation | Coupon rules masked | No issue identified within tested scope |
| **GET** | `/reviews` | None (Public) | Anyone | `QueryReviewDto` | Default Throttler | N/A (Public Reviews) | Product review ratings | No issue identified within tested scope |
| **POST** | `/reviews` | Bearer JWT | Customer | `CreateReviewDto` | Strict Throttler | Verified purchaser check | Review text & 1-5 rating | No issue identified within tested scope |
| **GET** | `/wishlists` | Bearer JWT | Customer | None | Default Throttler | `where: { userId: user.id }` | Saved wishlist items | No issue identified within tested scope |
| **POST** | `/wishlists` | Bearer JWT | Customer | `CreateWishlistDto` | Default Throttler | `where: { userId: user.id }` | Saved wishlist items | No issue identified within tested scope |
| **POST** | `/contact` | None (Public) | Anyone | `CreateContactDto` | Strict Throttler | HTML DOMPurify sanitization | Contact message | No issue identified within tested scope |
| **GET** | `/health` | None (Internal) | Anyone | None | Bypassed (Load Balancer) | N/A (Health Monitor) | Process memory RSS | No issue identified within tested scope |
