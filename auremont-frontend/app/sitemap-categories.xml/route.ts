import { NextResponse } from 'next/server';
import { generateSitemapResponse, generateSitemapError } from '../sitemap-helper';

const CATEGORY_SLUGS = [
  'almonds',
  'cashews',
  'pistachios',
  'walnuts',
  'macadamias',
  'pine-nuts',
  'truffle-cashews',
  'raw',
  'roasted',
  'gift',
];

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';
    const nowIso = new Date().toISOString();

    let categorySlugs: string[] = CATEGORY_SLUGS;
    try {
      const res = await fetch(`${apiUrl}/categories`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const json = await res.json();
        const cats = json.data || json || [];
        if (Array.isArray(cats) && cats.length > 0) {
          categorySlugs = Array.from(new Set([...cats.map((c: any) => c.slug), ...CATEGORY_SLUGS]));
        }
      }
    } catch {
      // Fallback to static slugs
    }

    const xmlUrls = categorySlugs
      .map(
        (slug: string) => `
    <url>
      <loc>${siteUrl}/shop/${slug}</loc>
      <lastmod>${nowIso}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.85</priority>
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
