# RARE NUTS — Daily Channel Reconciliation Protocol

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  

---

## 🔍 Daily Reconciliation Workflow

```
[END OF DAY AUDIT JOB] ──► Runs daily at 23:59 UTC
       │
       ▼
[1. ORDER RECONCILIATION]   ──► Compares internal OMS order count vs channel settlement feeds.
       │
       ▼
[2. INVENTORY RECONCILIATION]──► Compares physical PostgreSQL stock vs channel allocated stock balances.
       │
       ▼
[3. DISCREPANCY ALERT]      ──► Emits alert if stock variance or un-reconciled orders exist.
```
