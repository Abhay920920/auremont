import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Privacy Policy | RARE NUTS',
  description: 'How we protect your data and privacy at RARE NUTS.',
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  openGraph: {
    title: 'Privacy Policy | RARE NUTS',
    description: 'How we protect your data and privacy at RARE NUTS.',
    url: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage"
  };
  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
