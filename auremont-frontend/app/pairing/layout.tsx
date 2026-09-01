import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Sommelier Nut Pairings: Wine, Cheese & Luxury Almonds | RARE NUTS',
  description: 'Explore the sommelier guide to pairing California raw and slow-roasted almonds with fine vintage wines, artisanal aged cheeses, and dark single-origin chocolate.',
  keywords: [
    'almond wine pairings',
    'cheese and nut pairing guide',
    'sommelier dry fruit pairings',
    'gourmet food pairing California almonds',
  ],
  alternates: {
    canonical: `${siteUrl}/pairing`,
  },
  openGraph: {
    title: 'Sommelier Nut Pairings | RARE NUTS',
    description: 'The sommelier guide to pairing luxury almonds with fine wines and artisanal cheeses.',
    url: `${siteUrl}/pairing`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/roasted-almonds-jar.png', width: 1200, height: 630, alt: 'RARE NUTS Nut Pairing Guide' }],
    type: 'website',
  },
};

export default function PairingLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Sommelier Pairings", "item": `${siteUrl}/pairing` }
    ]
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
