import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  title: 'Shop California Almonds',
  description: 'Browse our signature collection of premium California almonds. Perfectly roasted, salted, and raw almonds for the discerning taste.',
  alternates: {
    canonical: `${siteUrl}/shop`,
  }
};

import JsonLd from '@/components/JsonLd';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shop California Almonds",
    "description": "Browse our signature collection of premium California almonds. Perfectly roasted, salted, and raw almonds for the discerning taste.",
    "url": `${siteUrl}/shop`
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
