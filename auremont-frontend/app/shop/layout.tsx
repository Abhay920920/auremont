import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Shop Luxury Nuts & Bespoke Dry Fruit Gifts',
  description: 'Explore the Royal Botanical Collection by RARE NUTS — hand-selected California raw almonds, slow-roasted sea salt almonds, Mangalore jumbo cashews, Persian Akbari pistachios, Kashmiri walnuts, and bespoke mahogany gift chests.',
  keywords: [
    'luxury almonds',
    'premium nuts',
    'gourmet dry fruits',
    'California raw almonds',
    'roasted almonds sea salt',
    'jumbo cashews',
    'Akbari pistachios',
    'Kashmiri walnuts',
    'luxury gift boxes',
    'corporate dry fruit gifts',
  ],
  alternates: {
    canonical: `${siteUrl}/shop`,
  },
  openGraph: {
    title: 'The Royal Botanical Collection | RARE NUTS',
    description: 'Explore the world’s finest hand-selected botanical nuts, artisanal slow-roasted reserves, and luxury mahogany gift packaging.',
    url: `${siteUrl}/shop`,
    siteName: 'RARE NUTS',
    images: [
      {
        url: '/images/og-rarenuts.png',
        width: 1200,
        height: 630,
        alt: 'RARE NUTS — Royal Botanical Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Royal Botanical Collection | RARE NUTS',
    description: 'Explore the world’s finest hand-selected botanical nuts, artisanal slow-roasted reserves, and luxury mahogany gift packaging.',
    images: ['/images/og-rarenuts.png'],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/shop#collection`,
    "name": "The Royal Botanical Collection",
    "description": "Explore the world’s finest hand-selected botanical nuts, artisanal slow-roasted reserves, and luxury mahogany gift packaging.",
    "url": `${siteUrl}/shop`,
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "name": "RARE NUTS",
      "url": siteUrl
    },
    "about": {
      "@type": "Thing",
      "name": "Gourmet Luxury Nuts & Gifting"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": `${siteUrl}/shop`
      }
    ]
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
