import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

  try {
    const res = await fetch(`${apiUrl}/products`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch products');
    const { data: products } = await res.json();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    products.forEach((product: any) => {
      const url = `${siteUrl}/shop/${product.slug}`;
      const imageUrl = product.thumbnailUrl || product.images?.[0]?.imageUrl || `${siteUrl}/images/og-rarenuts.png`;
      
      xml += `
  <url>
    <loc>${url}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${product.seoTitle || product.name}</image:title>
      <image:caption>${product.seoDescription || product.shortDescription || 'RARE NUTS Luxury Almonds'}</image:caption>
    </image:image>
  </url>`;
    });

    xml += `\n</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (e) {
    return new NextResponse('<error>Failed to generate sitemap</error>', { status: 500 });
  }
}
