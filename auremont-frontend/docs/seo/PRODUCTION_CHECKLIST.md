# RARE NUTS — Production Launch & Live Go-Live Checklist

> **Primary Domain**: `https://rarenuts.in`  
> **Brand**: RARE NUTS (`RARE NUTS Private Limited`)  
> **Official Tagline**: *"Exceptional by Nature. Distinct by Choice."*  

---

## 1. What Is 100% Completed in Code (Ready to Deploy)

- [x] **Full E-Commerce Application**: Homepage, About, Shop Catalog, Product Detail (with 3D Packaging Viewer & Nutrition modal), Luxury Gifting Hubs (Diwali, Weddings), Executive Corporate Gifting, Press Room, Custom Gift Box Builder, Cart, Checkout, and User Account Dashboard.
- [x] **Brand Alignment**: 100% RARE NUTS copy with Metallic Champagne Gold Squirrel emblem (`SquirrelLogo.tsx`), vector monogram favicons, and 8K product photo catalog.
- [x] **Production Domain Configuration**: Primary domain set to `https://rarenuts.in` across metadata, canonicals, OpenGraph, JSON-LD schemas, sitemaps, robots.txt, and merchant feeds.
- [x] **Redirect Engine**: Permanent 301 path-preserving redirects in `next.config.mjs` for `auremont-rose.vercel.app`, `www.rarenuts.in`, and `rarenuts.com`.
- [x] **Backend & Database**: NestJS 11 backend with JWT auth, cart item validation, Razorpay signature verification, and Prisma database seed.
- [x] **Automated Tests**: Playwright E2E test suite (`npm run test:seo`) and pre-deploy CI check (`npm run seo:pre-deploy`).

---

## 2. External Production Go-Live Action Steps (For Admin / Deployment)

### Step 1: Vercel Production Domain Attachment
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Select the `auremont-frontend` project -> Go to **Settings** -> **Domains**.
3. Add `rarenuts.in` and set it as the **Primary Domain**.
4. Add `www.rarenuts.in` and select **Redirect to rarenuts.in**.

### Step 2: DNS Records Entry (at your Domain Registrar)
Configure the following DNS records for `rarenuts.in`:

| Record Type | Host / Name | Target Value / IP | Purpose |
|---|---|---|---|
| **A Record** | `@` | `76.76.21.21` | Apex domain (`rarenuts.in`) pointing to Vercel Edge. |
| **CNAME Record** | `www` | `cname.vercel-dns.com` | `www` subdomain redirect to apex domain. |
| **TXT Record** | `@` | `google-site-verification=...` | Google Search Console domain verification. |

### Step 3: Production Environment Variables (in Vercel Dashboard)
In Vercel Project Settings -> **Environment Variables**, set:

```env
NEXT_PUBLIC_SITE_URL=https://rarenuts.in
NEXT_PUBLIC_API_URL=https://api.rarenuts.in
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 4: Google Search Console (GSC) Verification
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Choose **Domain Property** and enter `rarenuts.in`.
3. Add the TXT verification record to your DNS registrar.
4. Click **Verify** -> Go to **Sitemaps** -> Submit: `https://rarenuts.in/sitemap.xml`.

### Step 5: Google Merchant Center Feed Submission
1. Log into [Google Merchant Center](https://merchants.google.com/).
2. Verify website ownership for `https://rarenuts.in`.
3. Go to **Products** -> **Feeds** -> **Add Feed**.
4. Enter Scheduled Fetch URL: `https://rarenuts.in/api/feeds/google-merchant`.
5. Set fetch schedule to **Daily**.

---

## 3. Post-Launch Verification Command

After pointing DNS and deploying to Vercel, run the Playwright SEO test suite against live production:

```bash
BASE_URL=https://rarenuts.in npm run test:seo
```
