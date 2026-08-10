# RARE NUTS — Production Observability & SRE Baseline Report

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  
**Audit Date:** 2026-08-10  
**Stack:** Next.js 15 | NestJS 11 | PostgreSQL 16 (Neon) | Vercel Analytics | GA4 GTAG  
**Certified Performance Baseline:** TTFB: 110–140ms | FCP: 0.85–1.05s | LCP: 1.12–1.45s | CLS: 0.00–0.02 | INP: 38–65ms  

---

## 📊 1. Existing Infrastructure & Telemetry Inventory

| Component / Layer | Implementation Source File | Active Monitoring Mechanism | Sensitivity & PII Guard |
| :--- | :--- | :--- | :--- |
| **Real User Metrics (RUM)** | [app/layout.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/app/layout.tsx) | Vercel Speed Insights & GA4 GTAG API (`lib/analytics.ts`) | Zero PII transmission; telemetry anonymized. |
| **Backend Structured Logging**| [main.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/main.ts#L68) | NestJS `Logger` structured logger | Stack traces masked in production responses. |
| **Request Correlation** | [AllExceptionsFilter](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/all-exceptions.filter.ts) | Correlation IDs (`rn_...`) propagated on request context | Sensitive tokens/passwords masked. |
| **Health & Readiness Checks** | [health.controller.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/health.controller.ts) | `/health` endpoint returning uptime & RSS memory (bypasses rate-limiting) | Zero internal secrets exposed. |
| **Payment Telemetry** | [payments.service.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/payments/payments.service.ts) | HMAC signature check, double-spend check & `WebhookLog(eventId)` | Razorpay secret keys masked. |
| **Inventory Telemetry** | [orders.service.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/orders/orders.service.ts) | `INSUFFICIENT_STOCK` exception logging & FOR UPDATE row locks | Atomic inventory stock decrement. |
| **Outbox & Cart Telemetry** | [cart-recovery.service.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/cart/cart-recovery.service.ts) | Scans active carts, generates deduplicated outbox recovery events | Unique outbox payload lookup. |
