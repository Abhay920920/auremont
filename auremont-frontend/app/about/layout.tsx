import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'About Us | Auremont Luxury Almonds',
  description: 'Discover the heritage, craftsmanship, and commitment to quality behind Auremont, purveyors of the finest luxury California almonds.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About Us | Auremont Luxury Almonds',
    description: 'Discover the heritage, craftsmanship, and commitment to quality behind Auremont.',
    url: `${siteUrl}/about`,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": { "@type": "Organization", "name": "Auremont", "url": siteUrl }
  };
  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
