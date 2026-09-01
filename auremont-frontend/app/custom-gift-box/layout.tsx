import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Bespoke Gift Box Builder & Personalization Studio | RARE NUTS',
  description: 'Design and handcraft your personalized luxury nut gift box. Choose solid mahogany or oak presentation cases, select gourmet almond and cashew fillings, and personalize with 24k gold laser engraving.',
  keywords: [
    'custom gift box builder',
    'personalized dry fruit box',
    'bespoke almond gift box',
    'luxury gift box customization',
    'laser engraved gift box',
    'custom wedding nut hampers',
  ],
  alternates: {
    canonical: `${siteUrl}/custom-gift-box`,
  },
  openGraph: {
    title: 'Bespoke Gift Box Builder | RARE NUTS',
    description: 'Design and handcraft your personalized luxury nut gift box with custom mahogany cases and gold laser engraving.',
    url: `${siteUrl}/custom-gift-box`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/luxury-gift-box-unboxing.png', width: 1200, height: 630, alt: 'RARE NUTS Bespoke Gift Box Builder' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bespoke Gift Box Builder | RARE NUTS',
    description: 'Design and handcraft your personalized luxury nut gift box with custom mahogany cases.',
    images: ['/images/luxury-gift-box-unboxing.png'],
  },
};

export default function CustomGiftBoxLayout({ children }: { children: React.ReactNode }) {
  const customGiftSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${siteUrl}/custom-gift-box#app`,
    "name": "RARE NUTS Bespoke Gift Box Customizer",
    "applicationCategory": "ShoppingApplication",
    "operatingSystem": "All",
    "description": "Interactive studio to configure luxury wood boxes, nut assortments, and custom laser-engraved plates.",
    "url": `${siteUrl}/custom-gift-box`
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Shop", "item": `${siteUrl}/shop` },
      { "@type": "ListItem", "position": 3, "name": "Bespoke Gift Builder", "item": `${siteUrl}/custom-gift-box` }
    ]
  };

  return (
    <>
      <JsonLd data={customGiftSchema} />
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
