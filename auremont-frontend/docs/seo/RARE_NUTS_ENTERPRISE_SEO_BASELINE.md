# RARE NUTS — Enterprise Technical & Content SEO Baseline

**Brand:** RARE NUTS  
**Official Domain:** https://rarenuts.in  
**Audit Date:** 2026-08-10  
**Stack:** Next.js 15 App Router | NestJS 11 | PostgreSQL 16 (Neon) | Vercel CDN  

---

## 📊 1. Technical SEO Audit Matrix

| Audit Item | Implementation Source Location | Verified Status | Audit Findings |
| :--- | :--- | :--- | :--- |
| **Production Canonical URL** | [layout.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/app/layout.tsx#L30) | 🟢 VERIFIED | Canonical URLs strictly output `https://rarenuts.in`. |
| **Dynamic XML Sitemap** | [app/sitemap.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/app/sitemap.ts) | 🟢 VERIFIED | Dynamic XML sitemap rendered at `https://rarenuts.in/sitemap.xml`. |
| **Robots Directives** | [app/robots.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/app/robots.ts) | 🟢 VERIFIED | Crawl directives rendered at `https://rarenuts.in/robots.txt`. |
| **Google Sitelinks Schema** | [WebSiteSchema.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/seo/WebSiteSchema.tsx) | 🟢 VERIFIED | JSON-LD WebSite & Organization schema with Sitelinks Search Box. |
| **Google Shopping Microdata**| [ProductSchema.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/seo/ProductSchema.tsx) | 🟢 VERIFIED | JSON-LD Product, Offer, and AggregateRating microdata. |
| **Breadcrumb Schema** | [BreadcrumbSchema.tsx](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/components/seo/BreadcrumbSchema.tsx) | 🟢 VERIFIED | JSON-LD BreadcrumbList schema on catalog and product routes. |
| **Merchant Feed RSS 2.0** | [google-merchant/route.ts](file:///c:/Users/adts-/Desktop/almonds/auremont-frontend/app/api/feeds/google-merchant/route.ts) | 🟢 VERIFIED | XML feed rendered at `https://rarenuts.in/api/feeds/google-merchant`. |
