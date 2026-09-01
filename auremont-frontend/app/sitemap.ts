import { MetadataRoute } from 'next';

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

const JOURNAL_HUB_SLUGS = [
  'buying-guides',
  'health-benefits',
  'comparisons',
  'corporate-gifting',
  'festival-gifting',
  'gift-guides',
  'nutrition',
  'recipes',
];

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

  // 2. Category / Collection Landing Pages
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((cat) => ({
    url: `${baseUrl}/shop/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. Journal Topical Hub Routes
  const journalHubRoutes: MetadataRoute.Sitemap = JOURNAL_HUB_SLUGS.map((hub) => ({
    url: `${baseUrl}/journal/${hub}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 4. Dynamic Products (from API with Fallback)
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/products?limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const products = data.data || [];
      productRoutes = products
        .filter((p: any) => p.isIndexable !== false && p.status !== 'INACTIVE')
        .map((p: any) => ({
          url: `${baseUrl}/shop/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
          changeFrequency: 'daily',
          priority: 0.9,
        }));
    }
  } catch {
    // Graceful fallback to verified slugs
  }

  if (productRoutes.length === 0) {
    productRoutes = FALLBACK_PRODUCT_SLUGS.map((slug) => ({
      url: `${baseUrl}/shop/${slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  }

  // 5. Dynamic Blogs / Articles (from API with Fallback)
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/blogs?limit=50`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const blogs = data.data || [];
      blogRoutes = blogs
        .filter((b: any) => b.isIndexable !== false && b.published !== false)
        .map((b: any) => ({
          url: `${baseUrl}/journal/${b.slug}`,
          lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.75,
        }));
    }
  } catch {
    // Graceful fallback
  }

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...journalHubRoutes,
    ...productRoutes,
    ...blogRoutes,
  ];
}
