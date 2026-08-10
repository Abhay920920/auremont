# RARE NUTS — Analytics Architecture & Data Pipeline Blueprint

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  

---

## 🏗️ Technical Architecture Diagram

```
[CUSTOMER ACTION ON STOREFRONT] 
       │
       ├─► Client Event Tracker ──► lib/analytics.ts ──► Google Analytics 4 (GA4 GTAG)
       │                                                 └─► Real-Time Ecommerce Funnel
       │
       └─► Backend Server Outbox ──► CartRecoveryService ──► OutboxEvent Table ──► Async Email Worker
                                                                                  └─► Recovery Revenue Attribution
```

---

## 📑 Core Pipeline Components

1. **Client Event Wrapper ([lib/analytics.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/lib/analytics.ts))**: Single entry point for all GA4 events (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`).
2. **Server Outbox Event Engine ([CartRecoveryService.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/cart/cart-recovery.service.ts))**: Transactional outbox pattern for asynchronous email recovery without blocking shopper requests.
3. **Database Audit & Analytics Queries**: Prisma relational queries for real-time admin revenue reporting.
