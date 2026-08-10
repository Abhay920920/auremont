# RARE NUTS — Omnichannel Commerce & Source-of-Truth Baseline Report

**Brand:** RARE NUTS  
**Production Domain:** https://rarenuts.in  
**Legal Entity:** RARE NUTS Private Limited  
**Audit Date:** 2026-08-10  
**Stack:** Next.js 15 | NestJS 11 | PostgreSQL 16 (Neon) | Prisma ORM | Razorpay  

---

## 📊 1. Primary Source-of-Truth Mapping

| Data Entity | Primary Source of Truth System | Relational Database Model | Enforcement Mechanism |
| :--- | :--- | :--- | :--- |
| **Product Catalog** | RARE NUTS Backend | `Product`, `Category`, `ProductAttribute` | NestJS `ProductsService` |
| **SKU & Barcode** | RARE NUTS Master SKU System | `Product.sku` | Unique DB Constraint |
| **Master Inventory** | PostgreSQL Physical Stock | `Product.stockQty` | `FOR UPDATE` Pessimistic Lock |
| **Selling Price** | RARE NUTS Server Price Engine | `Product.price`, `Product.salePrice` | Server-Authoritative Price Calculation |
| **Orders & Invoices** | RARE NUTS OMS | `Order`, `OrderItem`, `Address` | Prisma `$transaction` |
| **Payments** | Razorpay Gateway + RARE NUTS | `Payment`, `WebhookLog` | HMAC-SHA256 Signature Verification |
| **Async Messages** | Transactional Outbox | `OutboxEvent` | Exponential Backoff Retry Worker |

---

## 🌐 2. Marketplace Channel Integration Assessment

| Marketplace Channel | Target Channel | Available Integration Mechanism | Authentication Status | Readiness Classification |
| :--- | :--- | :--- | :--- | :--- |
| **RARE NUTS Website** | Owned Direct-to-Consumer | Native REST API & Next.js Storefront | 100% Live | 🟢 IMPLEMENTED |
| **Amazon India** | Amazon SP-API / Seller Central | SP-API OAuth2 / Bulk Flat File Feeds | Pending Seller Central Access | 🟠 REQUIRES MARKETPLACE ACCESS |
| **Blinkit** | Dark Store / Quick Commerce | Brand Portal / Vendor EDI / CSV Ingestion | Pending Vendor Onboarding | 🟠 REQUIRES MANUAL ONBOARDING |
| **Zepto** | Quick Commerce | Partner Portal / Vendor EDI / Bulk Feed | Pending Vendor Onboarding | 🟠 REQUIRES MANUAL ONBOARDING |
