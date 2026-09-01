import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'White-Glove Shipping & Climate-Controlled Delivery | RARE NUTS',
  description: 'Read our white-glove shipping policy. RARE NUTS delivers across India with temperature-monitored packaging, tamper-proof luxury seals, and express courier tracking.',
  keywords: [
    'RARE NUTS shipping',
    'luxury food delivery India',
    'temperature controlled dry fruit delivery',
    'express gift box delivery',
  ],
  alternates: {
    canonical: `${siteUrl}/shipping`,
  },
  openGraph: {
    title: 'White-Glove Shipping & Delivery | RARE NUTS',
    description: 'Express nationwide delivery with temperature-monitored packaging and tamper-proof seals.',
    url: `${siteUrl}/shipping`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: 'RARE NUTS Shipping' }],
    type: 'website',
  },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Shipping Policy", "item": `${siteUrl}/shipping` }
    ]
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
