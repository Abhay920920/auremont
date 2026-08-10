# RARE NUTS — Production Blockers & Defect Audit Report

**Brand:** RARE NUTS  
**Production Domain:** https://rarenuts.in  
**Audit Date:** 2026-08-10  
**Overall Release Gate:** 🟢 **CAN SHIP NOW (Zero Blocking Production Defects)**  

---

## 🚦 Master Production Blocker Audit Matrix

| Blocker Category | Evaluated System Risk | Empirical Verification Finding | Status |
| :--- | :--- | :--- | :--- |
| **Payment Verification Failure** | Unverified or double-spend orders | HMAC-SHA256 signature verification and `paymentStatus === 'paid'` check verified in `payments.service.ts`. | 🟢 NO BLOCKER |
| **Stock Overselling Defect** | Insufficient stock checkout | Pessimistic `FOR UPDATE` row locks and `stockQty` check verified in `orders.service.ts`. | 🟢 NO BLOCKER |
| **Price Manipulation Defect** | Client-modified subtotal | Live database product price lookup (`salePrice ?? price`) during order creation. | 🟢 NO BLOCKER |
| **Data Loss Defect** | Lost email or order outbox events | Transactional outbox pattern (`OutboxEvent`) and Prisma `$transaction` verified. | 🟢 NO BLOCKER |
| **Cross-User IDOR Defect** | Unauthorized user resource access | Explicit ownership checks (`where: { userId }`) throw `ForbiddenException`. | 🟢 NO BLOCKER |
| **Unsafe Bootstrap Secrets** | Hardcoded production admin credentials | Environment variable `JWT_SECRET` and bcrypt password hashing verified. Zero hardcoded admin passwords. | 🟢 NO BLOCKER |
| **Canonical Domain Leakage** | Incorrect canonical URL output | Canonical URLs strictly output `https://rarenuts.in` in `layout.tsx` and `WebSiteSchema.tsx`. | 🟢 NO BLOCKER |
