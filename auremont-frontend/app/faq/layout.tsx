import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions & Customer Service | RARE NUTS',
  description: 'Find answers to common questions about RARE NUTS California almond sourcing, artisanal slow-roasting, worldwide shipping, custom gift boxes, and our 100% satisfaction guarantee.',
  keywords: [
    'RARE NUTS FAQ',
    'California almond sourcing questions',
    'luxury dry fruit shelf life',
    'corporate gifting turnaround times',
    'white glove nut delivery',
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: 'Frequently Asked Questions | RARE NUTS',
    description: 'Find answers to questions about sourcing, shelf life, white-glove shipping, and custom gift sets.',
    url: `${siteUrl}/faq`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: 'RARE NUTS FAQ' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions | RARE NUTS',
    description: 'Find answers to questions about sourcing, shelf life, and custom gift sets.',
    images: ['/images/og-rarenuts.png'],
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/faq#faq`,
    "name": "RARE NUTS Frequently Asked Questions",
    "description": "Comprehensive customer questions and answers about products, sourcing, and ordering.",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where do your almonds come from?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All RARE NUTS almonds are exclusively grown in partner family-owned orchards in California's Central Valley, ensuring absolute traceability and quality control."
        }
      },
      {
        "@type": "Question",
        "name": "How long do RARE NUTS almonds stay fresh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When kept in our airtight luxury packaging in a cool, dry place away from direct sunlight, our raw and slow-roasted almonds maintain peak flavor and crispness for up to 6 months."
        }
      },
      {
        "@type": "Question",
        "name": "Can I personalize gift boxes with corporate logos or names?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our Bespoke Gift Box Builder and Corporate Concierge service enable custom brass plate laser engraving with corporate logos, individual recipient names, or personalized greetings."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer nationwide and international delivery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide express white-glove delivery across all pin codes in India, as well as insured global shipping via DHL Express."
        }
      }
    ]
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "FAQ", "item": `${siteUrl}/faq` }
    ]
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
