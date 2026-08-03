import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Terms of Service | Auremont',
  description: 'Terms and conditions for using the Auremont luxury boutique.',
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    title: 'Terms of Service | Auremont',
    description: 'Terms and conditions for using the Auremont luxury boutique.',
    url: `${siteUrl}/terms`,
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
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
