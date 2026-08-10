# RARE NUTS — Google Merchant Center SEO Health Audit

> [!NOTE]
> Merchant Center product feeds expand eligibility for Google Shopping, Free Product Listings, Image Search Product Badges, and Google Lens search experiences.

---

## 📊 Product Feed & Schema Synchronization Audit

| Audit Parameter | Storefront DB Value | Schema.org Microdata | Merchant Feed API (`/api/merchant-feed`) | Synchronization Status |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Name** | `RARE NUTS` | `RARE NUTS` | `RARE NUTS` | ✅ 100% Synchronized |
| **Currency** | `INR` | `INR` | `INR` | ✅ 100% Synchronized |
| **Price Format** | Standard Decimal | Number (`799.00`) | Number (`799.00`) | ✅ 100% Synchronized |
| **Availability** | `stockQty > 0` | `https://schema.org/InStock` | `in_stock` | ✅ 100% Synchronized |
| **Product Images** | `/images/*.png` | Full Absolute URL (`https://rarenuts.in/images/*`) | Full Absolute URL | ✅ 100% Synchronized |
| **Condition** | New | `https://schema.org/NewCondition` | `new` | ✅ 100% Synchronized |
| **Shipping** | Complimentary | Standard Postal Class | Free Domestic Shipping | ✅ 100% Synchronized |

---

## 🛠️ Google Merchant Feed Endpoint Configuration
The Google Merchant XML/RSS feed is served live via Next.js App Router:
- **Endpoint URL**: `https://rarenuts.in/api/merchant-feed`
- **Format**: RSS 2.0 with `g:` Google Shopping namespace tags.
- **Attributes Included**:
  - `g:id`: Product UUID / SKU
  - `g:title`: Optimized product title with brand prefix (`RARE NUTS - California Reserve Raw Almonds 250g`)
  - `g:description`: Full botanical description & weight specifications
  - `g:link`: Canonical product URL (`https://rarenuts.in/shop/[slug]`)
  - `g:image_link`: High-res 8K product photo URL
  - `g:price`: `{price} INR`
  - `g:availability`: `in_stock` / `out_of_stock`
  - `g:brand`: `RARE NUTS`
  - `g:condition`: `new`
  - `g:identifier_exists`: `no` (for custom artisan/heirloom products) or `yes` when GTIN present.

---

## 🚦 Merchant Error Monitoring & Prevention Checklist
1. **Price Mismatch Prevention**: All database prices automatically format in standard units. The API endpoint and frontend JSON-LD read from the exact same single source of truth in PostgreSQL (`Product.price` / `Product.salePrice`).
2. **Discontinued Product Handling**: When stock reaches 0, `g:availability` converts to `out_of_stock` instantly without removing the URL from Google index.
3. **Image Link Integrity**: All product image links resolve to high-resolution PNGs hosted directly on Vercel CDN under HTTPS.
