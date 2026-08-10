# RARE NUTS — Existing Analytics Implementation Audit

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  
**Audit Date:** 2026-08-10  
**Stack:** GA4 GTAG API (`lib/analytics.ts`) | Outbox Event Tracker (`OutboxEvent`) | NestJS Logger  

---

## 📊 1. Codebase Event Audit Matrix

| Event Name | Source File | Trigger Condition | Status Classification |
| :--- | :--- | :--- | :--- |
| **`view_item`** | [lib/analytics.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/lib/analytics.ts#L25-L39) | Triggered when a customer loads a product detail page (`/shop/[slug]`). | 🟢 IMPLEMENTED |
| **`add_to_cart`** | [lib/analytics.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/lib/analytics.ts#L41-L54) | Triggered when a customer clicks "Add to Cart" on product cards or detail pages. | 🟢 IMPLEMENTED |
| **`begin_checkout`** | [lib/analytics.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/lib/analytics.ts#L56-L62) | Triggered when a customer enters the `/checkout` page. | 🟢 IMPLEMENTED |
| **`purchase`** | [lib/analytics.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/lib/analytics.ts#L64-L70) | Triggered when `/payments/verify` returns HTTP 200 `{ success: true }`. | 🟢 IMPLEMENTED |
| **`gift_builder_start`** | [lib/analytics.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/lib/analytics.ts#L72-L76) | Triggered when a customer enters the Bespoke Gift Box Studio (`/custom-gift-box`). | 🟢 IMPLEMENTED |
| **`gift_builder_complete`** | [lib/analytics.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/lib/analytics.ts#L78-L82) | Triggered when a customer adds a customized gift box to their cart. | 🟢 IMPLEMENTED |
| **`corporate_gifting_inquiry`**| [lib/analytics.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/lib/analytics.ts#L84-L88) | Triggered when a bulk corporate quote is calculated (`/corporate-gifts`). | 🟢 IMPLEMENTED |
| **`search`** | [lib/analytics.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/lib/analytics.ts#L96-L100) | Triggered when a search query is submitted in `SearchDrawer.tsx`. | 🟢 IMPLEMENTED |
| **`add_to_wishlist`** | [lib/analytics.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/lib/analytics.ts#L102-L107)| Triggered when a customer toggles the heart icon on any product. | 🟢 IMPLEMENTED |
| **`abandoned_cart_reminder`** | [cart-recovery.service.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/cart/cart-recovery.service.ts#L45-L58) | Triggered by backend outbox worker when cart is idle > 1 hour. | 🟢 IMPLEMENTED |

---

## 🔍 2. Audit Summary Findings
- **Zero Duplicate Event Listeners**: All GA4 ecommerce events route through the centralized `trackEvent` wrapper in `lib/analytics.ts`.
- **Zero PII Exposure**: Event payloads transmit product IDs, quantities, and numeric subtotal values without sending user passwords, credit card numbers, or full street addresses.
- **Deduplicated Purchase Tracking**: `purchase` event requires server-verified `orderId` (`transaction_id`), preventing browser refreshes from double-counting revenue.
