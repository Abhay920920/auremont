# RARE NUTS — Post-Launch Operational Monitoring Protocol

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  

---

## 📊 Post-Launch Real-Time Metrics & Alert Thresholds

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. PAYMENT INTEGRITY MONITORING                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Alert Trigger: Payment verification failure rate > 1.0% over 15 mins       │
│ • Action Protocol: Inspect Razorpay webhook log signature discrepancies.     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. OUTBOX EVENT & MAIL DELIVERY MONITORING                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Alert Trigger: Outbox table records > 10 events in status = 'failed'      │
│ • Action Protocol: Inspect SMTP provider credentials and delivery limits.  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. INFRASTRUCTURE & LOAD BALANCER HEALTH                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Alert Trigger: HTTP 5xx error rate > 0.5% or GET /health latency > 500ms   │
│ • Action Protocol: Check Neon database connection pooler RSS memory.        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 External Platform Setup Directives

1. **Google Search Console Indexation**:
   - Canonical Sitemap URL: `https://rarenuts.in/sitemap.xml`
   - Purpose: Organic page indexation and Search Console performance tracking.
   - Status: 🟠 PENDING EXTERNAL VERIFICATION (Manual GSC DNS property ownership verification required).

2. **Google Merchant Center Feed**:
   - Canonical Product Feed URL: `https://rarenuts.in/api/merchant-feed`
   - Purpose: Google Shopping feed sync (title, price, SKU, availability, image URL).
   - Status: 🟠 PENDING EXTERNAL VERIFICATION (Manual Merchant Center feed submission required).
