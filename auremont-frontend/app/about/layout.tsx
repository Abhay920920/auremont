import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Our Heritage & Story | RARE NUTS',
  description: 'Discover the heritage, craftsmanship, and commitment to quality behind RARE NUTS — purveyors of exceptionally curated luxury nuts.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'Our Heritage & Story | RARE NUTS',
    description: 'Discover the heritage, craftsmanship, and commitment to quality behind RARE NUTS.',
    url: `${siteUrl}/about`,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": { "@type": "Organization", "name": "RARE NUTS", "url": siteUrl }
  };
  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
