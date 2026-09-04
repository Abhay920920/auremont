import { MetadataRoute } from 'next';
import { FALLBACK_PRODUCTS } from '@/lib/productData';
import { FALLBACK_ARTICLES } from '@/lib/journalData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const now = new Date();

  // 1. Static Core Public Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/custom-gift-box`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/corporate-gifts`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gifting`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/gift-boxes`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pairing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/press`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Dynamic Products (from API with Verified Fallback)
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/products?limit=100`, { 
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      const products = data.data || [];
      productRoutes = products
        .filter((p: CatalogProduct & { isIndexable?: boolean; status?: string }) => p.isIndexable !== false && p.status !== 'INACTIVE')
        .map((p: CatalogProduct & { updatedAt?: string; createdAt?: string }) => ({
          url: `${baseUrl}/shop/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
          changeFrequency: 'daily' as const,
          priority: 0.9,
        }));
    }
  } catch {
    // Graceful fallback to verified products
  }

  if (productRoutes.length === 0) {
    productRoutes = Object.keys(FALLBACK_PRODUCTS).map((slug) => ({
      url: `${baseUrl}/shop/${slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  }

  // 3. Dynamic Blogs / Articles (from API with Verified Fallback)
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/blogs?limit=50`, { 
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      const blogs = data.data || [];
      blogRoutes = blogs
        .filter((b: BlogArticle & { isIndexable?: boolean; published?: boolean }) => b.isIndexable !== false && b.published !== false)
        .map((b: BlogArticle & { updatedAt?: string }) => ({
          url: `${baseUrl}/journal/${b.slug}`,
          lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        }));
    }
  } catch {
    // Graceful fallback
  }

  if (blogRoutes.length === 0) {
    blogRoutes = Object.keys(FALLBACK_ARTICLES).map((slug) => ({
      url: `${baseUrl}/journal/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));
  }

  return [
    ...staticRoutes,
    ...productRoutes,
    ...blogRoutes,
  ];
}
