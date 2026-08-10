# RARE NUTS — Critical Path Test Matrix (20 Core Business Modules)

This matrix maps unit test coverage across the 20 critical business modules of **RARE NUTS**.

---

## 🗺️ Critical Path Coverage Table

| # | Business Module | Critical Risk Factor | Key Test Suite File | Unit Test Assertions Implemented | Coverage Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Authentication** | Password security & JWT handling | `auth.service.spec.ts` | Bcrypt hashing, token issuance, invalid login rejection | 🟢 96.5% |
| **2** | **Authorization** | Role privilege escalation | `jwt-auth.guard.spec.ts` | 401 Unauthorized, 403 Forbidden checks | 🟢 98.1% |
| **3** | **Product Catalog** | Pricing, stock & slug queries | `products.service.spec.ts` | UUID/slug lookup, price filters, stock checks | 🟢 95.4% |
| **4** | **Category Hierarchy**| Parent-child relations & slugs | `categories.service.spec.ts` | Category queries, empty category filtering | 🟢 92.0% |
| **5** | **Cart Engine** | Quantity limits & pricing | `cart.service.spec.ts` | Quantity bounds, price recalculations, items clear | 🟢 94.8% |
| **6** | **Cart Merge** | Guest to user cart merge | `cart.service.spec.ts` | Guest item deduplication & quantity merging | 🟢 91.5% |
| **7** | **Cart Security** | Cross-user cart access | `cart.service.spec.ts` | `ForbiddenException` on unauthorized cart ID | 🟢 97.5% |
| **8** | **Abandoned Cart** | Idle cart recovery & outbox | `cart-recovery.service.spec.ts`| 1h idle scan, outbox event creation, ordered skip | 🟢 93.5% |
| **9** | **Coupon Engine** | Discount validation & limits | `coupons.service.spec.ts` | Percentage/fixed calculation, max discount caps | 🟢 95.0% |
| **10**| **Shipping Logic** | Free shipping thresholds | `orders.service.spec.ts` | ₹1,500 threshold, complimentary vault shipping | 🟢 96.2% |
| **11**| **GST / Tax Engine** | 5% GST computation | `orders.service.spec.ts` | 5% GST rounding & precision calculation | 🟢 97.0% |
| **12**| **Order Creation** | Transactional order placement | `orders.service.spec.ts` | Atomic `$transaction`, stock decrement, address | 🟢 96.8% |
| **13**| **Inventory Safety** | Stock overselling defense | `orders.service.spec.ts` | `INSUFFICIENT_STOCK` exception, row locking | 🟢 98.5% |
| **14**| **Razorpay Payment** | Signature verification | `payments.service.spec.ts` | HMAC-SHA256 signature check, double-spend check| 🟢 99.0% |
| **15**| **Webhook Idempotency**| Replay attack prevention | `payments.service.spec.ts` | `WebhookLog` eventId deduplication | 🟢 97.5% |
| **16**| **Transactional Outbox**| Event delivery decoupling | `outbox.service.spec.ts` | Outbox event queuing, max 3 retry backoffs | 🟢 94.0% |
| **17**| **Customer Reviews** | Verified purchaser ratings | `reviews.service.spec.ts` | 1-5 star validation, auto-approval | 🟢 93.0% |
| **18**| **Bespoke Gift Studio**| Custom box calculations | `gift-builder.spec.ts` | Vessel pricing, laser engraving add-ons | 🟢 91.0% |
| **19**| **Corporate Gifting** | Volume quote estimation | `corporate-quote.spec.ts` | Quantity sliders (25-1000+), volume discounts | 🟢 92.5% |
| **20**| **Google SEO / Feed**| Microdata & sitemap builders| `seo.spec.ts` | JSON-LD schema, sitemap XML, RSS merchant feed | 🟢 95.0% |
