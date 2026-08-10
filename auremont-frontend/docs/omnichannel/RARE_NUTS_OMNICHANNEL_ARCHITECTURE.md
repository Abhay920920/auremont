# RARE NUTS — Omnichannel Architecture & Adapter Blueprint

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  

---

## 🏗️ Master Channel Adapter Pipeline

```
                                  ┌───────────────────────────────┐
                                  │   RARE NUTS MASTER CATALOG    │
                                  │   & PHYSICAL INVENTORY POOL   │
                                  └───────────────┬───────────────┘
                                                  │
         ┌────────────────────────────────────────┼────────────────────────────────────────┐
         ▼                                        ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐                      ┌─────────────────┐
│ WEBSITE ADAPTER │                      │ AMAZON SP-API   │                      │ QUICK COMMERCE  │
│ Native Next.js  │                      │    ADAPTER      │                      │ (BLINKIT/ZEPTO) │
└────────┬────────┘                      └────────┬────────┘                      └────────┬────────┘
         │                                        │                                        │
         ▼                                        ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐                      ┌─────────────────┐
│ Direct Orders   │                      │ Channel Orders  │                      │ Bulk Dark Store │
│ & Checkout      │                      │ & Amazon Sync   │                      │ Inventory Sync  │
└─────────────────┘                      └─────────────────┘                      └─────────────────┘
```

---

## 🛡️ Isolation Principle
Failure or API rate-limiting on Amazon, Blinkit, or Zepto sync processes **NEVER** interrupts checkout or stock validation on the primary RARE NUTS website (`https://rarenuts.in`).
