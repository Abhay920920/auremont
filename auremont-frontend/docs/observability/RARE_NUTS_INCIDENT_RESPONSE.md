# RARE NUTS — Incident Response & Triage Protocol

**Brand:** RARE NUTS  
**Domain:** https://rarenuts.in  

---

## 🛠️ Incident Triage Workflow

```
[ALERT TRIGGERED] ──► P0 / P1 / P2 Alert received by SRE On-Call
       │
       ▼
[1. INITIAL IDENTIFICATION] ──► Query logs by requestId (rn_01HXXXX) or error category
       │
       ▼
[2. CONTAINMENT]           ──► If payment/stock issue, preserve FOR UPDATE locks and rate limit offending route
       │
       ▼
[3. MITIGATION]            ──► Rollback deployment (if release regression) or restart service
       │
       ▼
[4. POSTMORTEM]            ──► Publish root-cause analysis (RCA) and add regression unit test
```

---

## 📖 Specific Outage Playbooks

1. **Razorpay Payment Gateway Outage**:
   - Verify payment signature status in `WebhookLog`.
   - Ensure frontend preserves active user cart state for 1-click payment retry.

2. **Neon Database Connection Pool Depletion**:
   - Check process memory RSS on `/health`.
   - Verify serverless connection pooling parameters (`DIRECT_URL`).
