import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Luxury Gift Boxes | RARE NUTS',
  description: 'Handcrafted wooden boxes and bespoke presentation cases filled with premium California almonds.',
  alternates: {
    canonical: `${siteUrl}/gift-boxes`,
  },
  openGraph: {
    title: 'Luxury Gift Boxes | RARE NUTS',
    description: 'Handcrafted wooden boxes filled with premium California almonds.',
    url: `${siteUrl}/gift-boxes`,
  },
};

export default function GiftBoxesLayout({ children }: { children: React.ReactNode }) {
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
