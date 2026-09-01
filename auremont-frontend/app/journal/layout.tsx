import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'The Journal: Editorial Guides, Sourcing Stories & Nut Mastery | RARE NUTS',
  description: 'Explore the RARE NUTS Journal — authoritative guides on California almond sourcing, health & longevity benefits, gourmet comparisons, chef recipes, and luxury gift curation.',
  keywords: [
    'almond buying guide',
    'health benefits of California almonds',
    'luxury dry fruit guide',
    'slow roasting nuts',
    'almond nutrition facts',
    'gourmet nut recipes',
    'RARE NUTS journal',
  ],
  alternates: {
    canonical: `${siteUrl}/journal`,
  },
  openGraph: {
    title: 'The Journal: Editorial Guides & Nut Mastery | RARE NUTS',
    description: 'Authoritative guides on California almond sourcing, health benefits, chef recipes, and luxury gift curation.',
    url: `${siteUrl}/journal`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: 'RARE NUTS Journal' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Journal | RARE NUTS',
    description: 'Authoritative guides on California almond sourcing, health benefits, and luxury gifting.',
    images: ['/images/og-rarenuts.png'],
  },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}/journal#blog`,
    "name": "RARE NUTS Journal",
    "description": "Editorial guides, health insights, culinary recipes, and sourcing stories about gourmet nuts and almonds.",
    "url": `${siteUrl}/journal`,
    "publisher": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "RARE NUTS",
      "logo": `${siteUrl}/images/og-rarenuts.png`
    }
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "The Journal", "item": `${siteUrl}/journal` }
    ]
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
