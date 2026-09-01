import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Culinary Satisfaction Guarantee & Returns Policy | RARE NUTS',
  description: 'Our 100% Culinary Excellence Promise. Learn about RARE NUTS replacement and return policies for gourmet almond and nut selections.',
  keywords: [
    'RARE NUTS returns',
    'satisfaction guarantee',
    'luxury food refund policy',
  ],
  alternates: {
    canonical: `${siteUrl}/returns`,
  },
  openGraph: {
    title: 'Satisfaction Guarantee & Returns | RARE NUTS',
    description: 'Our 100% Culinary Excellence Promise and replacement policy.',
    url: `${siteUrl}/returns`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: 'RARE NUTS Returns' }],
    type: 'website',
  },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Returns Policy", "item": `${siteUrl}/returns` }
    ]
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
