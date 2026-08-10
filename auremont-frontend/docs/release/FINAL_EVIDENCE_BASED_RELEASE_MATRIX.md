# RARE NUTS — Final Evidence-Based Release Matrix

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  
**Audit Date:** 2026-08-10  
**Overall Release Gate:** 🟢 **CAN SHIP NOW**  
**Language Standard:** Evidence-Based ("No issue identified within tested scope")  

---

## 📊 Master Evidence-Based Release Matrix

| Domain | Claimed Capability | Source Code Evidence Location | Test Type | Empirical Result | Confidence Level | Status Classification | Required Operational Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Unity** | 100% RARE NUTS branding & tagline | `SquirrelLogo.tsx`, `Footer.tsx` | Manual / Visual | `Exceptional by Nature. Distinct by Choice.` verified. | High | 🟢 VERIFIED | None |
| **Payment Security** | HMAC-SHA256 2-phase signature check | `payments.service.ts` | Unit / Spec | No issue identified within tested scope. | High | 🟢 VERIFIED | None |
| **Double-Spend Defense** | Already paid orders reject re-verification | `payments.service.ts` | Unit / Spec | `paymentStatus === 'paid'` check verified. | High | 🟢 VERIFIED | None |
| **Stock Oversell Defense** | Row locking & stock verification | `orders.service.ts` | Unit / Spec | Pessimistic `FOR UPDATE` query verified. | High | 🟢 VERIFIED | None |
| **Price Tampering Defense** | Server-authoritative price calculation | `orders.service.ts` | Unit / Spec | Live DB product price (`salePrice ?? price`) verified. | High | 🟢 VERIFIED | None |
| **IDOR Cross-User Guard** | Unauthorized user resource blocking | `cart.service.ts`, `orders.service.ts` | Unit / Spec | `ForbiddenException` thrown on mismatch. | High | 🟢 VERIFIED | None |
| **Abandoned Cart Outbox** | Idle cart scan & deduplicated outbox | `cart-recovery.service.ts` | Unit / Spec | 1h idle scan & outbox payload lookup verified. | High | 🟢 VERIFIED | None |
| **Canonical SEO Domain** | Production canonical uses `https://rarenuts.in` | `layout.tsx`, `WebSiteSchema.tsx` | Unit / Spec | `https://rarenuts.in` strictly output. | High | 🟢 VERIFIED | None |
| **Google Search Console** | DNS Search Console property verification | `app/sitemap.ts` (`/sitemap.xml`) | External | Sitemap XML route active; pending manual DNS claim. | Medium | 🟠 PENDING EXTERNAL VERIFICATION | Add DNS record in domain registrar |
| **Google Merchant Feed** | Product listing XML feed | `app/api/merchant-feed/route.ts` | External | XML feed route active; pending manual Merchant Center claim. | Medium | 🟠 PENDING EXTERNAL VERIFICATION | Submit `/api/merchant-feed` in Merchant Center |

---

## 🏷️ Brand Reference Audit Ledger

| Legacy / Brand String | Occurrence Location | Audit Classification | Operational Impact | Action Taken |
| :--- | :--- | :--- | :--- | :--- |
| `auremont-frontend` | Folder name & `package.json` | SAFE INTERNAL | Directory path only (No user exposure) | Retained as safe internal identifier |
| `auremont-backend` | Folder name & `package.json` | SAFE INTERNAL | Directory path only (No user exposure) | Retained as safe internal identifier |
| `https://rarenuts.in` | Storefront, metadata, schemas, footers | PRODUCTION CONFIG | 100% Customer-facing production domain | Verified active |

---

## 📋 Executive Launch Decision Summary

1. **What is Genuinely Proven**:
   - Transactional order creation, 2-phase Razorpay payment signature verification, double-spend defense, stock row locking, IDOR access controls, abandoned cart recovery outbox generation, and `https://rarenuts.in` canonical SEO schema outputs.
2. **What is Pending External Verification**:
   - Google Search Console DNS verification (`/sitemap.xml`) and Google Merchant Center feed submission (`/api/merchant-feed`).
3. **Release Gate Decision**:
   - 🟢 **CAN SHIP NOW** — All critical business, security, payment, and inventory protections are verified with zero blocking defects.
