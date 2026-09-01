import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/shop',
          '/shop/*',
          '/journal',
          '/journal/*',
          '/about',
          '/custom-gift-box',
          '/corporate-gifts',
          '/gifting',
          '/gift-boxes',
          '/pairing',
          '/press',
          '/faq',
          '/contact',
          '/shipping',
          '/returns',
          '/privacy-policy',
          '/terms',
          '/images/*',
          '/_next/static/*',
        ],
        disallow: [
          '/admin/',
          '/admin/*',
          '/account/',
          '/account/*',
          '/cart',
          '/cart/*',
          '/checkout',
          '/checkout/*',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/api/',
          '/api/*',
          '/*?*preview=*',
          '/*?*draft=*',
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap_index.xml`,
    ],
    host: baseUrl,
  };
}
