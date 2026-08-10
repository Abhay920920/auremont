# RARE NUTS — Production Observability Architecture Blueprint

**Brand:** RARE NUTS  
**Domain:** https://rarenuts.in  

---

## 🏗️ End-to-End Request Correlation & Observability Pipeline

```
[CUSTOMER ACTION ON STOREFRONT] ──► Generates requestId (rn_01HXXXX)
       │
       ▼
[NEXT.JS EDGE / FRONTEND]      ──► Captures RUM Core Web Vitals (LCP, INP, CLS) & GA4 events
       │                           └─► Passes X-Request-ID header to backend
       ▼
[NESTJS BACKEND CONTROLLER]     ──► Logger emits structured log: { requestId, route, method, duration }
       │                           └─► Filters sensitive payload fields (passwords, card data, tokens)
       ▼
[PRISMA DATABASE LAYER]         ──► Executes query inside $transaction with FOR UPDATE row locks
       │                           └─► Records query latency & inventory conflict events
       ▼
[OUTBOX EVENT & PAYMENT WEBHOOK]──► Writes OutboxEvent & WebhookLog(eventId) with requestId correlation
```
