import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Terms of Service & Purchase Conditions | RARE NUTS',
  description: 'Review the terms of service and purchase conditions for RARE NUTS online store, corporate orders, and bespoke gift box customization.',
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Terms of Service", "item": `${siteUrl}/terms` }
    ]
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
