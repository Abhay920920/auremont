import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Shipping Policy | Auremont',
  description: 'Information regarding our luxury shipping options, international delivery, and handling of delicate products.',
  alternates: {
    canonical: `${siteUrl}/shipping`,
  },
  openGraph: {
    title: 'Shipping Policy | Auremont',
    description: 'Information regarding our luxury shipping options.',
    url: `${siteUrl}/shipping`,
  },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
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
