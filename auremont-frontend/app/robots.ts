import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/shop',
          '/shop/*',
          '/gifting',
          '/gifting/*',
          '/corporate-gifts',
          '/custom-gift-box',
          '/gift-boxes',
          '/journal',
          '/journal/*',
          '/terms',
          '/privacy-policy',
          '/shipping',
          '/returns',
          '/faq',
          '/contact',
          '/images/*',
        ],
        disallow: [
          '/admin/',
          '/admin/*',
          '/account/',
          '/account/*',
          '/checkout/',
          '/checkout/*',
          '/cart/',
          '/cart/*',
          '/login/',
          '/register/',
          '/api/',
          '/api/*',
          '/*?*search=*',
          '/*?*sort=*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
