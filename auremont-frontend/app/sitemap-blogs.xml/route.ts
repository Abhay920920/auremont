import { NextResponse } from 'next/server';
import { generateSitemapResponse, generateSitemapError } from '../sitemap-helper';

const EDITORIAL_GUIDE_HUBS = [
  'buying-guides',
  'health-benefits',
  'comparisons',
  'corporate-gifting',
  'festival-gifting',
  'gift-guides',
  'nutrition',
  'recipes',
];

const FEATURED_ARTICLES = [
  'art-of-slow-roasting',
  'california-sourcing-orchards-of-gold',
  'bespoke-packaging-heritage',
];

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';
    const nowIso = new Date().toISOString();

    let dynamicBlogs: any[] = [];
    try {
      const res = await fetch(`${apiUrl}/blogs?limit=50`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        dynamicBlogs = data.data || data || [];
      }
    } catch {
      // Fallback
    }

    const hubUrls = EDITORIAL_GUIDE_HUBS.map(
      (hub) => `
    <url>
      <loc>${siteUrl}/journal/${hub}</loc>
      <lastmod>${nowIso}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    );

    const articleSlugs = new Set([
      ...FEATURED_ARTICLES,
      ...dynamicBlogs.filter((b: any) => b.isIndexable !== false && b.published !== false).map((b: any) => b.slug),
    ]);

    const articleUrls = Array.from(articleSlugs).map(
      (slug) => `
    <url>
      <loc>${siteUrl}/journal/${slug}</loc>
      <lastmod>${nowIso}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.75</priority>
    </url>`
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/journal</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
  ${hubUrls.join('')}
  ${articleUrls.join('')}
</urlset>`;

    return generateSitemapResponse(sitemap);
  } catch (e) {
    return generateSitemapError();
  }
}
