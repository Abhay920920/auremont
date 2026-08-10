# RARE NUTS — Complete System Functional Verification Report

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  
**Audit Date:** 2026-08-10  
**Stack:** Next.js 15 App Router | NestJS 11 | PostgreSQL 16 (Neon Serverless) | Razorpay | Vercel  

---

## 📊 1. System Inventory Verification Matrix

| Documented Feature | Source Code Location | Verification Findings | Status Classification |
| :--- | :--- | :--- | :--- |
| **Brand Unity & Tagline** | [SquirrelLogo.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/ui/SquirrelLogo.tsx), [Footer.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/Footer.tsx) | `Exceptional by Nature. Distinct by Choice.` displayed on logo emblem and footer. | 🟢 IMPLEMENTED |
| **Product Catalog & Filters** | [products.service.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/products/products.service.ts) | Filters by min/max price, category, and weight variants (250g, 500g, 1kg). | 🟢 IMPLEMENTED |
| **3D Vessel Inspector** | [Packaging3DViewer.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/products/Packaging3DViewer.tsx) | Interactive 3D model viewer with gold laser engraving text preview. | 🟢 IMPLEMENTED |
| **Botanical Flavor Radar Chart**| [FlavorRadarChart.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/products/FlavorRadarChart.tsx) | SVG radar chart rendering crunch, buttery texture, aroma, and nuttiness metrics. | 🟢 IMPLEMENTED |
| **Search Drawer & Chips** | [SearchDrawer.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/SearchDrawer.tsx) | Auto-complete search with 1-click trending chips (`Raw Almonds`, `Sea Salt Roast`, `Mahogany Box`). | 🟢 IMPLEMENTED |
| **Free Packaging Progress Bar**| [CartDrawer.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/CartDrawer.tsx) | Live threshold bar towards unlocking free velvet vault packaging at ₹1,500. | 🟢 IMPLEMENTED |
| **Bespoke Gift Box Builder** | [GiftBoxBuilder.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/app/custom-gift-box/page.tsx) | 4-step customization studio (Vessel -> Compartments -> Engraving -> Wax Seal). | 🟢 IMPLEMENTED |
| **Corporate Bulk Estimator** | [CorporateQuoteEstimator.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/app/corporate-gifts/page.tsx)| Interactive quantity sliders (25 to 1,000+ units) and volume discount calculations. | 🟢 IMPLEMENTED |
| **2-Phase Payment Verification**| [payments.service.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/payments/payments.service.ts) | HMAC-SHA256 signature verification & double-spend check inside `$transaction`. | 🟢 IMPLEMENTED |
| **Automated E-Invoice PDF** | [OrderInvoiceModal.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/account/OrderInvoiceModal.tsx)| Legal GST tax invoices with GSTIN (`27AABCR9912K1Z9`), HSN (`08021200`), 5% GST, and `window.print()`. | 🟢 IMPLEMENTED |
| **Abandoned Cart Recovery** | [cart-recovery.service.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-backend/src/cart/cart-recovery.service.ts)| Scans idle carts, creates outbox events, and auto-restores carts via `?recover=[cartId]`. | 🟢 IMPLEMENTED |
| **Real-Time Dispatch Tracker** | [OrderHistoryTab.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/account/OrderHistoryTab.tsx) | 5-stage dispatch tracker (Order Placed -> Harvest Selection -> Velvet Packing -> Vault Dispatch -> Delivered). | 🟢 IMPLEMENTED |
| **Verified Customer Reviews** | [ProductDetailClient.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/app/shop/[slug]/ProductDetailClient.tsx) | 1-5 star ratings with emerald `Verified Purchaser` badges. | 🟢 IMPLEMENTED |
| **PWA & Mobile Navigation** | [MobileBottomBar.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/MobileBottomBar.tsx) | Standalone PWA (`manifest.json`) with glassmorphic bottom bar navigation. | 🟢 IMPLEMENTED |
| **Concierge Chat Widget** | [ConciergeChatWidget.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/ConciergeChatWidget.tsx)| 36px circular badge with 1-click WhatsApp Business connection. | 🟢 IMPLEMENTED |
| **Google Sitelinks Schema** | [WebSiteSchema.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/seo/WebSiteSchema.tsx) | JSON-LD Sitelinks Search Box & Organization schema targeting `https://rarenuts.in`. | 🟢 IMPLEMENTED |

---

## 🛣️ 2. User Journeys Audit Matrix

| Journey ID | Customer Journey Description | Source Code Traced | Key Invariant Checked | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **J-1** | **New Customer Complete Flow** | `Storefront -> Cart -> Checkout -> Razorpay -> Order -> Account Invoice` | Full lifecycle calculation & 5% GST verified. | 🟢 VERIFIED |
| **J-2** | **Guest Customer Cart Merge** | `Guest Cart -> Add Items -> Login -> Merge Cart` | Guest items merge with account cart without duplicate SKU rows. | 🟢 VERIFIED |
| **J-3** | **Abandoned Cart Recovery** | `Idle Cart -> Outbox Event -> Recovery Link -> Restore -> Checkout -> Order` | Order creation sets `cart.status = 'ordered'`, stopping future recovery emails. | 🟢 VERIFIED |
| **J-4** | **Payment Retry Handling** | `Order -> Razorpay Fail -> Retried Payment -> Verified HTTP 200` | Re-attempting payment does not create duplicate order records. | 🟢 VERIFIED |
| **J-5** | **Duplicate Webhook Defense** | `Replayed Razorpay Webhook -> WebhookLog(eventId) Deduplication` | `WebhookLog` deduplicates replayed webhooks; order state unchanged. | 🟢 VERIFIED |
| **J-6** | **Stock Oversell Defense** | `Pessimistic FOR UPDATE Row Lock` | Stock = 1 allows 1 checkout to succeed; 2nd receives `INSUFFICIENT_STOCK`. | 🟢 VERIFIED |
| **J-7** | **Coupon Abuse Defense** | `CouponsService.validate` | Server recalculates minimum subtotal requirements; client payload ignored. | 🟢 VERIFIED |
| **J-8** | **Cart Price Manipulation** | `OrdersService.createOrder` | Live database prices (`salePrice ?? price`) override client prices. | 🟢 VERIFIED |
