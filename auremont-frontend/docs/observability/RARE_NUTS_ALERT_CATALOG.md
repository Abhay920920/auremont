# RARE NUTS — Alert Catalog & Severity Threshold Definitions

**Brand:** RARE NUTS  
**Domain:** https://rarenuts.in  

---

## 🚨 Operational Alert Threshold Matrix

| Severity Level | Alert Name | Condition Threshold | Action Protocol |
| :--- | :--- | :--- | :--- |
| **P0 — CRITICAL** | **Payment Verification Failure Spike** | Payment verification failure rate > 1.0% over 15 mins. | SRE On-Call inspects Razorpay webhook signature discrepancies. |
| **P0 — CRITICAL** | **Database / Health Unavailability** | `/health` endpoint returns non-200 or 5xx rate > 1.0%. | Inspect Neon database pooler connections and memory RSS. |
| **P1 — HIGH** | **Checkout Failure Rate Spike** | Order creation failure rate > 5.0% over 15 mins. | Verify stock availability, pricing, and address validation logs. |
| **P1 — HIGH** | **Outbox Recovery Mail Failures** | Outbox table records > 10 events in `status = 'failed'`. | Inspect transactional SMTP mail worker credentials and rate limits. |
| **P2 — MEDIUM** | **Core Web Vitals Degradation** | Sustained LCP > 2.5s or TTFB > 500ms over 30 mins. | Inspect Vercel CDN cache hit ratios and image payload sizes. |
| **P3 — LOW** | **Non-Critical Analytics Drop** | Minor GA4 client event tracking drop. | Non-blocking triage during next business day. |
