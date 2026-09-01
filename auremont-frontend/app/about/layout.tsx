import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Our Heritage & Sourcing Story | RARE NUTS',
  description: 'Learn about RARE NUTS heritage — cultivating the world’s finest California almonds and artisanal nuts with sustainable farming, precision sorting, and European presentation craftsmanship.',
  keywords: [
    'RARE NUTS story',
    'California almond orchards',
    'luxury nut brand',
    'sustainable almond farming',
    'almond sourcing California',
    'gourmet food heritage',
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'Our Heritage & Sourcing Story | RARE NUTS',
    description: 'Learn about RARE NUTS heritage — cultivating the world’s finest California almonds and artisanal nuts with sustainable farming and luxury presentation.',
    url: `${siteUrl}/about`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: 'RARE NUTS Heritage' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Heritage & Sourcing Story | RARE NUTS',
    description: 'Learn about RARE NUTS heritage — cultivating the world’s finest California almonds and artisanal nuts.',
    images: ['/images/og-rarenuts.png'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about#about`,
    "name": "About RARE NUTS",
    "description": "The heritage, sustainable farming, and botanical excellence of RARE NUTS.",
    "url": `${siteUrl}/about`,
    "mainEntity": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "RARE NUTS",
      "url": siteUrl
    }
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Our Heritage", "item": `${siteUrl}/about` }
    ]
  };

  return (
    <>
      <JsonLd data={aboutSchema} />
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
