import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Auremont',
  description: 'Find answers to common questions about Auremont luxury almonds, sourcing, shipping, and corporate gifting.',
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: 'Frequently Asked Questions | Auremont',
    description: 'Find answers to common questions about Auremont luxury almonds.',
    url: `${siteUrl}/faq`,
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{ "@type": "Question", "name": "Where are your almonds sourced?", "acceptedAnswer": { "@type": "Answer", "text": "Our almonds are sourced from the finest orchards in California." } }]
  };
  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
