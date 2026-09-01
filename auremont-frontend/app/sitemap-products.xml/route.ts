import { NextResponse } from 'next/server';
import { generateSitemapResponse, generateSitemapError } from '../sitemap-helper';

const FALLBACK_PRODUCT_SLUGS = [
  'california-reserve-raw',
  'roasted-sea-salt-almonds',
  'royal-almonds-wooden-box',
  'window-pouch-almonds-250g',
  'grand-unboxing-luxury-box',
  'royal-mangalore-jumbo-cashews-250g',
  'royal-mangalore-jumbo-cashews-500g',
  'persian-akbari-salted-pistachios-250g',
  'persian-akbari-salted-pistachios-500g',
  'kashmiri-snow-walnut-halves-250g',
  'kashmiri-snow-walnut-halves-500g',
  'australian-style-roasted-macadamias-250g',
  'australian-style-roasted-macadamias-500g',
  'himalayan-wild-chilgoza-pine-nuts-100g',
  'himalayan-wild-chilgoza-pine-nuts-200g',
  'black-truffle-sea-salt-cashews-250g',
  'black-truffle-sea-salt-cashews-500g',
];

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';
    const nowIso = new Date().toISOString();

    let products: any[] = [];
    try {
      const res = await fetch(`${apiUrl}/products?limit=100`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const json = await res.json();
        products = json.data || [];
      }
    } catch {
      // Fallback
    }

    if (products.length === 0) {
      products = FALLBACK_PRODUCT_SLUGS.map((slug) => ({
        slug,
        updatedAt: nowIso,
        isIndexable: true,
      }));
    }

    const xmlUrls = products
      .filter((p: any) => p.isIndexable !== false)
      .map(
        (product: any) => `
    <url>
      <loc>${siteUrl}/shop/${product.slug}</loc>
      <lastmod>${new Date(product.updatedAt || product.createdAt || nowIso).toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>`
      )
      .join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${xmlUrls}
</urlset>`;

    return generateSitemapResponse(sitemap);
  } catch (e) {
    return generateSitemapError();
  }
}
