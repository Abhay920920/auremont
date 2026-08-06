import { NextResponse } from 'next/server';
import { generateSitemapResponse, generateSitemapError } from '../sitemap-helper';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/products`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch products');
    const { data: products } = await res.json();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${products.filter((p: any) => p.isIndexable !== false).map((product: any) => `
        <url>
          <loc>${siteUrl}/shop/${product.slug}</loc>
          <lastmod>${new Date(product.updatedAt || product.createdAt).toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `).join('')}
    </urlset>`;

    return generateSitemapResponse(sitemap);
  } catch (e) {
    return generateSitemapError();
  }
}
