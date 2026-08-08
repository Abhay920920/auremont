import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/gifting`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/gifting/diwali`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/gifting/weddings`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/gifting/corporate`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/gifting/anniversary`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/corporate-gifts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/custom-gift-box`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/gift-boxes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/journal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = [
    'almonds',
    'raw',
    'roasted',
    'gift',
    'pistachios',
    'walnuts',
    'cashews',
    'hazelnuts',
    'pecans',
  ].map((slug) => ({
    url: `${baseUrl}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productSlugs = [
    'california-reserve-raw',
    'roasted-sea-salt-almonds',
    'royal-almonds-wooden-box',
    'window-pouch-almonds-250g',
    'grand-unboxing-luxury-box',
  ];

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const blogSlugs = [
    'art-of-slow-roasting',
    'heritage-of-rarenuts-unboxing',
    'california-valley-terroir',
    'bespoke-pairing-guide',
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/journal/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
