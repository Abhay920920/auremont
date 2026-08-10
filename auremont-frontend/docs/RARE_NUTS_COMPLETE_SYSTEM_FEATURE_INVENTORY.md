# RARE NUTS — Complete System Functional & Feature Inventory

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  
**Legal Entity:** RARE NUTS Private Limited  
**Tagline:** Exceptional by Nature. Distinct by Choice.  
**Tech Stack:** Next.js 15 (App Router) | NestJS 11 | PostgreSQL 16 (Prisma ORM) | Vercel  

---

## 🎨 1. Brand Identity & Visual Design System
- **100% Brand Unity**: Unified under **RARE NUTS** across all headers, footers, badges, and metadata.
- **Official Tagline**: `Exceptional by Nature. Distinct by Choice.` displayed on logo emblem and footer.
- **8K Commercial Product Photography**: 5 high-resolution studio photos with gold foil leaf typography (`california-almonds-250g.png`, `roasted-almonds-jar.png`, `royal-almonds-wooden-box.png`, `almonds-pouch-window.png`, `luxury-gift-box-unboxing.png`).
- **Authenticity Overlays**: Gold leaf `@RARENUTS` authenticity badges rendered on product cards.
- **Glassmorphic Aesthetic**: Deep black (`#050505`) backdrop-blur elements with metallic gold highlights (`#D4AF37`).

---

## 🛒 2. Storefront & Product Catalog Systems
- **Collection Storefront (`/shop`)**: Dynamic filtering by category, search query, price range, and weight variants (250g, 500g, 1kg).
- **Rich Product Detail Pages (`/shop/[slug]`)**:
  - **3D Packaging Vessel Inspector**: Interactive 3D vessel viewer with real-time text engraving preview (`Packaging3DViewer.tsx`).
  - **Botanical Flavor Radar Chart**: SVG radar chart illustrating crunch, buttery texture, aroma, and nuttiness (`FlavorRadarChart.tsx`).
  - **Volume Discount Tier Badges**: `🎁 Buy 2+ Units: 10% Extra Volume Discount Auto-Applied` promotional pill.
  - **Vault Stock Availability Badges**: Real-time stock status ("In Stock — Guaranteed Vault Dispatch" / "Only 4 Units Remaining").
- **Dynamic Search Drawer (`SearchDrawer.tsx`)**:
  - Auto-complete search with 1-click **Trending Search Chips** (`Raw Almonds`, `Sea Salt Roast`, `Mahogany Box`, `Window Pouch`, `Unboxing Set`).
- **Cart Drawer Progress Bar (`CartDrawer.tsx`)**:
  - Live threshold progress bar towards unlocking **Free Velvet Vault Packaging & Insured Shipping** at ₹1,500.

---

## 🎁 3. Interactive Customization Studios
- **Bespoke 4-Step Gift Box Builder (`/custom-gift-box`)**:
  - Step 1: Vessel Selection (Rigid Black Box, Glass Preserve Jar, Mahogany Chest).
  - Step 2: Compartment Allocation & Nut Selection (Raw, Roasted, Honey Glazed).
  - Step 3: 24k Gold Laser Engraving & Personalization Preview.
  - Step 4: Wax Seal & Velvet Ribbon Customization.
- **Corporate Bulk Quote Estimator (`/corporate-gifts`)**:
  - Interactive Quantity Slider (25 to 1,000+ units).
  - Tiered Volume Discounts (10% to 30% off).
  - Custom Brass Logo Plate Add-On.
  - Instant Quote Summary & GST Tax Credit Calculation.

---

## 💳 4. Cart, Checkout & Payment Validation
- **Vault Cart Page (`/cart`)** & **Slide-Out Cart Drawer (`CartDrawer.tsx`)**.
- **Multi-Currency Converter (`useCurrencyStore.ts`)**: Supports INR (₹), USD ($), EUR (€), and GBP (£).
- **Concierge Checkout (`/checkout`)**:
  - 2-Step Checkout (Address & Contact -> Payment).
  - Coupon Code Validation (`/coupons/validate`).
  - Safe `crypto.randomUUID()` fallback handling for browser idempotency keys.
- **2-Phase Strict Payment Validation**:
  - Gateway Modal Integration (Razorpay / Dev Mode Sandbox).
  - HMAC-SHA256 Signature Verification (`POST /payments/verify`).
  - Strict Modal Guard: Order Confirmation Modal ONLY opens AFTER HTTP 200 verification.
- **Automated E-Invoice & PDF Receipt Generator (`OrderInvoiceModal.tsx`)**:
  - Displays legal company name (**RARE NUTS Private Limited**), GSTIN (`27AABCR9912K1Z9`), HSN Code (`08021200`), 5% GST breakdown, and 1-click `Print / Save PDF` support.
- **Automated Abandoned Cart Email Recovery Engine (`CartRecoveryService.ts`)**:
  - Scans idle active carts (> 1 hour).
  - Emits `abandoned_cart_reminder` outbox events with personalized recovery URLs.
  - Auto-restores carts on `/checkout?recover=[cartId]`.

---

## 👤 5. Customer Accounts & Verification
- **Account Dashboard (`/account`)**:
  - Profile details management.
  - Address book management (Default address toggling).
  - Saved Wishlist items (`WishlistTab.tsx`).
- **Real-Time Order & Dispatch Tracking (`OrderHistoryTab.tsx`)**:
  - 5-Stage Dispatch Tracker: Order Placed -> Harvest Selection -> Velvet Packing -> Vault Dispatch -> Delivered.
  - Unique Vault Courier Tracking IDs (`RN-TRK-XXXXXX`).
  - 1-Click **View Tax Invoice** button on every order card.
- **Verified Customer Review Drawer (`ProductDetailClient.tsx`)**:
  - Sliding review drawer modal.
  - 1-5 Star Rating selector & text input.
  - Emerald `Verified Purchaser` badges on client entries.

---

## 📱 6. Mobile PWA & Concierge Support
- **PWA Integration**: Installable web app (`manifest.json` & `public/sw.js` Stale-While-Revalidate caching).
- **Mobile Bottom Bar (`MobileBottomBar.tsx`)**: Floating glassmorphic navigation bar for mobile viewports.
- **Concierge Chat Widget (`ConciergeChatWidget.tsx`)**:
  - Ultra-compact 36px circular floating badge (`w-9 h-9 sm:w-10 sm:h-10`).
  - Live online pulse indicator.
  - 270px popover drawer with instant FAQ topics.
  - 1-Click WhatsApp Business connection (`wa.me/919876543210`).

---

## 🔒 7. Security, ACID & Data Integrity Architecture
- **Prisma Interactive Transactions**: Order creation wrapped in `$transaction` with pessimistic row locking (`SELECT FOR UPDATE`).
- **Transactional Outbox Pattern**: `OutboxEvent` table guarantees async message delivery (emails, invoices) without lost events.
- **Webhook Idempotency**: `WebhookLog` deduplicates Razorpay webhooks by `eventId`.
- **Security Headers**: HSTS (`31536000`), CSP, X-Frame-Options (`SAMEORIGIN`), X-Content-Type-Options (`nosniff`).
- **Input Whitelisting**: NestJS `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` strips unexpected payload attributes.
- **Error Stack Masking**: Stack tracebacks are masked in production HTTP responses.

---

## 🔍 8. Advanced Enterprise SEO & Performance
- **Dynamic XML Sitemap (`/sitemap.xml`)** & **Crawler Directives (`/robots.txt`)**.
- **Google Sitelinks Search Box & Organization Schema (`WebSiteSchema.tsx`)**.
- **Google Shopping Product & AggregateRating Microdata (`ProductSchema.tsx`)**.
- **Google BreadcrumbList Schema (`BreadcrumbSchema.tsx`)**.
- **60 FPS Motion Smoothness**: GPU acceleration (`.gpu-accelerated`, `.smooth-gpu-hover`).
- **Instant Route Transition Loader (`PageProgressLoader.tsx`)**: Luxury gold top bar loader during client-side navigation.
- **Load Balancer Health Monitoring**: Rate-limit bypassed `/health` endpoint reporting process memory RSS and uptime.
