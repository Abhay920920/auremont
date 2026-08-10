# RARE NUTS — Marketing Attribution & UTM Tracking Model

**Brand:** RARE NUTS  
**Domain:** https://rarenuts.in  
**Model Strategy:** First-Touch & Last Non-Direct Click Attribution  

---

## 🎯 UTM Parameter Persistence Workflow

```
[CUSTOMER CLICKS CAMPAIGN LINK] ──► https://rarenuts.in/shop?utm_source=instagram&utm_medium=paid_social&utm_campaign=reserve_harvest
       │
       ▼
[URL PARAMETER PARSING] ──► Client reads utm_source, utm_medium, utm_campaign, utm_content, utm_term
       │
       ▼
[SESSION PERSISTENCE]   ──► Stores attribution object in sessionStorage & Zustand store
       │
       ▼
[CHECKOUT ATTACHMENT]   ──► Attaches attribution metadata to POST /orders order payload
       │
       ▼
[REVENUE ATTRIBUTION]   ──► Order record stores marketing channel for ROI reporting
```

---

## 📊 Supported Marketing Channels

1. **Organic Search**: `utm_source=google`, `utm_medium=organic`
2. **Paid Social**: `utm_source=instagram`, `utm_medium=paid_social`
3. **Email Recovery**: `utm_source=abandoned_cart_email`, `utm_medium=email`
4. **Corporate Referral**: `utm_source=linkedin`, `utm_medium=b2b_referral`
5. **Direct Traffic**: Default fallback when no UTM parameters exist.
