import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Press & Media Center | RARE NUTS Official Brand Assets',
  description: 'Access official RARE NUTS press releases, media kits, verified corporate information, and high-resolution product photography for editorial publications.',
  keywords: [
    'RARE NUTS press kit',
    'luxury food brand media room',
    'gourmet almond press releases',
  ],
  alternates: {
    canonical: `${siteUrl}/press`,
  },
  openGraph: {
    title: 'Press & Media Center | RARE NUTS',
    description: 'Official RARE NUTS brand factsheet, media kits, and verified press assets.',
    url: `${siteUrl}/press`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: 'RARE NUTS Press Room' }],
    type: 'website',
  },
};

export default function PressLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Press Room", "item": `${siteUrl}/press` }
    ]
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
