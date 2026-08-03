import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Returns & Guarantee | Auremont',
  description: 'Our uncompromising guarantee and white-glove return policy.',
  alternates: {
    canonical: `${siteUrl}/returns`,
  },
  openGraph: {
    title: 'Returns & Guarantee | Auremont',
    description: 'Our uncompromising guarantee and white-glove return policy.',
    url: `${siteUrl}/returns`,
  },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
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
