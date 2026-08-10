# RARE NUTS — SEO Test & Optimization Changelog

This changelog records all title, meta description, structured data, and content tests executed on **https://rarenuts.in** to measure impact on Search Engine Results Page (SERP) CTR and organic positions.

---

## 📝 Change Log Ledger

### Log #001 — Brand Migration & Metadata Baseline
- **Date**: 2026-08-10
- **Target URL**: `https://rarenuts.in/` (Homepage)
- **Change Implemented**:
  - Replaced legacy brand metadata with **RARE NUTS**.
  - Title: `RARE NUTS | Exceptional California Almonds & Luxury Gifting`
  - Meta Description: `Discover RARE NUTS — purveyors of sun-drenched California reserve almonds, artisanal sea salt roasts, and bespoke heirloom gift chests.`
  - Added `WebSite` JSON-LD schema with `SearchAction` for Google Sitelinks Search Box.
- **Hypothesis**: Establishing explicit brand entity signals will secure #1 rankings for branded terms within 14 days.
- **Status**: ✅ Deployed & Active.

### Log #002 — Product Schema & Microdata Enhancement
- **Date**: 2026-08-10
- **Target URLs**: All Product Pages (`/shop/[slug]`)
- **Change Implemented**:
  - Implemented `ProductSchema.tsx` emitting `Product`, `Offer`, `AggregateRating`, and `InStock` JSON-LD.
  - Added safe fallback for `crypto.randomUUID()` in checkout to eliminate console errors.
- **Hypothesis**: Adding star ratings and INR price tags in Google Search listings will increase organic CTR by 15%-25%.
- **Status**: ✅ Deployed & Active.

### Log #003 — XML Sitemap & Robots Directive Automated Indexing
- **Date**: 2026-08-10
- **Target URLs**: `https://rarenuts.in/sitemap.xml` & `https://rarenuts.in/robots.txt`
- **Change Implemented**:
  - Created Next.js dynamic `app/sitemap.ts` listing all static pages and product routes.
  - Configured `app/robots.ts` blocking `/admin/` and `/account/` routes.
- **Hypothesis**: Providing clear crawler directives will accelerate Google bot indexing of newly launched product collections.
- **Status**: ✅ Deployed & Active.

### Log #004 — Navigation & Sitelinks Optimization
- **Date**: 2026-08-10
- **Target URLs**: `https://rarenuts.in/` Header & Footer
- **Change Implemented**:
  - Cleaned navigation structure (`Shop`, `Bespoke Custom Box`, `Corporate Gifts`).
  - Added `PageProgressLoader` top progress bar for sub-250ms route transition feel.
- **Hypothesis**: Faster client-side navigation will lower bounce rates and improve Core Web Vitals (INP).
- **Status**: ✅ Deployed & Active.
