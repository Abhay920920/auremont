import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/corporate-gifts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/gift-boxes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const productsRes = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
    if (productsRes.ok) {
      const json = await productsRes.json();
      const products = json.data || [];
      products.forEach((p: any) => {
        if (p.slug) {
          routes.push({
            url: `${baseUrl}/shop/${p.slug}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
          });
        }
      });
    }
  } catch (e) {
    // Fallback if API offline during build
  }

  try {
    const blogsRes = await fetch(`${apiUrl}/blogs`, { cache: 'no-store' });
    if (blogsRes.ok) {
      const json = await blogsRes.json();
      const blogs = Array.isArray(json) ? json : json.data || [];
      blogs.forEach((b: any) => {
        if (b.slug) {
          routes.push({
            url: `${baseUrl}/journal/${b.slug}`,
            lastModified: b.publishedAt ? new Date(b.publishedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }
  } catch (e) {
    // Fallback
  }

  return routes;
}
