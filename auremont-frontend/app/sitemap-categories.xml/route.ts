import { NextResponse } from 'next/server';
import { generateSitemapResponse, generateSitemapError } from '../sitemap-helper';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/categories`, { next: { revalidate: 3600 } });
    let categories = [];
    if (res.ok) {
      const data = await res.json();
      categories = data.data || [];
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${categories.map((category: any) => `
        <url>
          <loc>${siteUrl}/shop/category/${category.slug}</loc>
          <lastmod>${new Date(category.updatedAt || new Date()).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`;

    return generateSitemapResponse(sitemap);
  } catch (e) {
    return generateSitemapError();
  }
}
