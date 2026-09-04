// Server Component — no "use client" — products load at request time, no skeleton on first paint
import { Metadata } from 'next';
import ShopClient from './ShopClient';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Shop All Reserve Harvests & Confections | RARE NUTS',
  description: 'Discover the Royal Botanical Collection — single-origin California almonds, slow-roasted sea salt reserves, and artisanal gift sets.',
  alternates: {
    canonical: `${siteUrl}/shop`,
  },
  openGraph: {
    title: 'Shop All Reserve Harvests & Confections | RARE NUTS',
    description: 'Single-origin California Nonpareil almonds and artisanal wood-convection roasts.',
    url: `${siteUrl}/shop`,
    siteName: 'RARE NUTS',
    images: [{ url: `${siteUrl}/images/og-rarenuts.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Reserve Harvests & Confections | RARE NUTS',
    description: 'Single-origin California Nonpareil almonds and artisanal wood-convection roasts.',
    images: [`${siteUrl}/images/og-rarenuts.png`],
  },
};

const FALLBACK_META = { total: 0, page: 1, limit: 9, lastPage: 1 };

async function getShopData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  try {
    // Fetch categories + initial products in parallel with 3s timeout resilience
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${apiUrl}/products?sort=recommended&limit=9&page=1`, {
        next: { revalidate: 30 }, // ISR: revalidate every 30s
        signal: AbortSignal.timeout(3000),
      }).catch(() => null),
      fetch(`${apiUrl}/categories`, {
        next: { revalidate: 120 }, // ISR: categories change rarely
        signal: AbortSignal.timeout(3000),
      }).catch(() => null),
    ]);

    const [productsJson, categoriesJson] = await Promise.all([
      productsRes && productsRes.ok ? productsRes.json().catch(() => null) : null,
      categoriesRes && categoriesRes.ok ? categoriesRes.json().catch(() => null) : null,
    ]);

    return {
      products: productsJson?.data || [],
      meta: productsJson?.meta || FALLBACK_META,
      categories: categoriesJson?.data || categoriesJson || [],
    };
  } catch {
    return { products: [], meta: FALLBACK_META, categories: [] };
  }
}

export default async function Shop() {
  const { products, meta, categories } = await getShopData();

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ShopClient
        initialProducts={products}
        initialCategories={categories}
        initialMeta={meta}
      />
    </>
  );
}
