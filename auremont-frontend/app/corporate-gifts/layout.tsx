import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Corporate Gifting | Auremont Luxury Almonds',
  description: 'Elevate your corporate gifting with bespoke almond assortments in luxury wooden boxes.',
  alternates: {
    canonical: `${siteUrl}/corporate-gifts`,
  },
  openGraph: {
    title: 'Corporate Gifting | Auremont Luxury Almonds',
    description: 'Elevate your corporate gifting with bespoke almond assortments.',
    url: `${siteUrl}/corporate-gifts`,
  },
};

export default function CorporateGiftsLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "mainEntity": { "@type": "ItemList", "itemListElement": [] }
  };
  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
