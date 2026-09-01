import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Privacy Policy & Customer Data Protection | RARE NUTS',
  description: 'Read the RARE NUTS privacy policy. Learn how we safeguard your personal information, address data, and transaction security under strict data protection protocols.',
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": `${siteUrl}/privacy-policy` }
    ]
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
