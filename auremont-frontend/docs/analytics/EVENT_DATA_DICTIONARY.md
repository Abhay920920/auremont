# RARE NUTS — Master Event Data Dictionary & Taxonomy

**Brand:** RARE NUTS  
**Domain:** https://rarenuts.in  
**Version:** 1.0.0 (Canonical GA4 + Server Outbox Event Contract)  

---

## 📖 Canonical Event Data Contracts

### 1. `view_item`
- **When Triggered**: Product Detail Page load (`/shop/[slug]`).
- **Required Parameters**: `currency` (String: "INR"), `value` (Number: price), `items` (Array of Product objects: `item_id`, `item_name`, `price`).
- **Data Sensitivity**: Public product metadata (No PII).
- **Client/Server**: Client-side (`lib/analytics.ts`).

### 2. `add_to_cart`
- **When Triggered**: Customer clicks "Add to Cart" on storefront or product detail modal.
- **Required Parameters**: `currency` ("INR"), `value` (Number: subtotal), `items` (Array: `item_id`, `item_name`, `price`, `quantity`).
- **Data Sensitivity**: Public product metadata (No PII).
- **Client/Server**: Client-side (`lib/analytics.ts`).

### 3. `begin_checkout`
- **When Triggered**: Customer navigates to `/checkout`.
- **Required Parameters**: `currency` ("INR"), `value` (Number: cart subtotal), `items_count` (Number).
- **Data Sensitivity**: Non-sensitive aggregate value (No PII).
- **Client/Server**: Client-side (`lib/analytics.ts`).

### 4. `purchase`
- **When Triggered**: Successful server payment verification (`POST /payments/verify` returns HTTP 200).
- **Required Parameters**: `transaction_id` (String: order ID), `value` (Number: total paid), `currency` ("INR").
- **Deduplication Strategy**: Deduplicated by `transaction_id` (`orderId`). Replayed browser refreshes skip firing duplicate `purchase` events.
- **Data Sensitivity**: Non-sensitive transaction ID (No credit card or address PII).
- **Client/Server**: Client-side (`lib/analytics.ts`).

### 5. `abandoned_cart_reminder`
- **When Triggered**: Backend background job scans active carts idle > 1 hour.
- **Required Parameters**: `cartId` (UUID), `email` (String), `customerName` (String), `itemsSummary` (String), `recoveryLink` (URL).
- **Deduplication Strategy**: Outbox payload lookup `payload: { cartId }` guarantees max 1 outbox record per idle cycle.
- **Data Sensitivity**: Internal outbox event queue (Encrypted in transit).
- **Client/Server**: Server-side (`CartRecoveryService.ts`).
