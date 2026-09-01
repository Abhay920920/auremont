import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'The Art of Luxury Nut Gifting & Curated Hampers | RARE NUTS',
  description: 'Discover the art of gifting with RARE NUTS. Explore our signature mahogany chests, gold foil window pouches, and festive hampers curated with supreme California almonds and artisanal dry fruits.',
  keywords: [
    'luxury nut gifts',
    'premium dry fruit gifting',
    'Diwali dry fruit gift box',
    'wedding gift hampers India',
    'luxury food gifts',
    'mahogany almond gift box',
  ],
  alternates: {
    canonical: `${siteUrl}/gifting`,
  },
  openGraph: {
    title: 'The Art of Luxury Nut Gifting | RARE NUTS',
    description: 'Explore signature mahogany chests and festive hampers curated with supreme California almonds and artisanal dry fruits.',
    url: `${siteUrl}/gifting`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/luxury-gift-box-unboxing.png', width: 1200, height: 630, alt: 'RARE NUTS Luxury Gifting' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Art of Luxury Nut Gifting | RARE NUTS',
    description: 'Explore signature mahogany chests and festive hampers curated with supreme California almonds.',
    images: ['/images/luxury-gift-box-unboxing.png'],
  },
};

export default function GiftingLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Luxury Gifting", "item": `${siteUrl}/gifting` }
    ]
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
