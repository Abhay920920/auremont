import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Luxury Corporate Gifting & Executive Hampers | RARE NUTS',
  description: 'Elevate VIP client relationships with bespoke RARE NUTS corporate gift sets. Solid mahogany chests, laser-engraved brass company logos, and white-glove multi-destination fulfillment.',
  keywords: [
    'luxury corporate gifting',
    'executive gift boxes India',
    'corporate dry fruit hampers',
    'custom branded almond gifts',
    'VIP corporate gifts',
    'B2B holiday gifting',
    'corporate gifts with logo engraving',
  ],
  alternates: {
    canonical: `${siteUrl}/corporate-gifts`,
  },
  openGraph: {
    title: 'Luxury Corporate Gifting & Executive Hampers | RARE NUTS',
    description: 'Elevate VIP client relationships with bespoke RARE NUTS corporate gift sets. Solid mahogany chests, custom logo engraving, and white-glove fulfillment.',
    url: `${siteUrl}/corporate-gifts`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/royal-almonds-wooden-box.png', width: 1200, height: 630, alt: 'RARE NUTS Corporate Gifting' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Corporate Gifting | RARE NUTS',
    description: 'Bespoke corporate gifting with mahogany chests, custom logo engraving, and white-glove fulfillment.',
    images: ['/images/royal-almonds-wooden-box.png'],
  },
};

export default function CorporateGiftsLayout({ children }: { children: React.ReactNode }) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/corporate-gifts#service`,
    "name": "Luxury Corporate Gifting Concierge",
    "serviceType": "Corporate Gifting & VIP Hamper Curation",
    "provider": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "RARE NUTS",
      "url": siteUrl
    },
    "description": "Bespoke corporate dry fruit and almond gifting with personalized laser engraving, velvet lining, and nationwide multi-destination logistics.",
    "areaServed": "India",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Corporate Gifting", "item": `${siteUrl}/corporate-gifts` }
    ]
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
