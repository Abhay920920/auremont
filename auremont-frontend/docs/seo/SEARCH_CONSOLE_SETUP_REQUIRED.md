# RARE NUTS — Google Search Console Connection Protocol

## Current Status: Manual Authorization Required

> [!IMPORTANT]
> Google Search Console API access requires domain owner OAuth2 consent or Service Account key delegation for `https://rarenuts.in`.
> No live Search Console credentials were found in `.env`. To prevent data fabrication, real baseline queries, clicks, impressions, and CTR metrics must be ingested following this setup protocol.

---

## 📋 4-Step Search Console Onboarding Guide

### Step 1: Claim & Verify Domain Property
1. Log in to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** and select **Domain**:
   - Domain: `rarenuts.in`
3. Add the TXT record to your DNS provider (Cloudflare / GoDaddy / Namecheap):
   ```
   google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
4. Click **Verify**.

### Step 2: Submit Sitemap & Feed URLs
1. Navigate to **Index > Sitemaps**.
2. Submit main XML sitemap:
   `https://rarenuts.in/sitemap.xml`
3. Submit Google Merchant product feed URL:
   `https://rarenuts.in/api/merchant-feed`

### Step 3: Service Account Setup (For Automated CLI Tracking)
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a service account named `rarenuts-seo-tracker@appspot.gserviceaccount.com`.
3. Enable **Google Search Console API**.
4. In Search Console, add `rarenuts-seo-tracker@appspot.gserviceaccount.com` as a **Full User** under **Settings > Users & Permissions**.

### Step 4: Add Service Key to `.env`
Add the following line to `auremont-backend/.env` or `auremont-frontend/.env.local`:
```env
GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL="rarenuts-seo-tracker@appspot.gserviceaccount.com"
GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

---

## 🎯 Target Tracking Metrics (Post-Connection)
Once connected, the automated reporting pipeline will track:
- **Branded Clicks**: Queries matching `"RARE NUTS"`, `"rarenuts"`, `"rare nuts almonds"`.
- **Non-Branded Commercial Clicks**: Queries matching `"buy premium almonds"`, `"luxury dry fruit gift box"`, `"corporate dry fruit hampers India"`.
- **CTR Optimization Targets**: Pages ranking in positions **4–10** with CTR < 3%.
- **Striking Distance Targets**: Keywords ranking in positions **11–20** with high impression counts (> 500 impressions/mo).
