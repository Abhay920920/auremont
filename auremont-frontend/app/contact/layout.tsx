import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Contact Concierge & Client Support | RARE NUTS',
  description: 'Connect with RARE NUTS private client concierge for bespoke gift curation, corporate order inquiries, delivery assistance, or private sommelier consultations.',
  keywords: [
    'contact RARE NUTS',
    'luxury nut concierge',
    'corporate gifting contact',
    'gourmet dry fruit support',
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Concierge & Client Support | RARE NUTS',
    description: 'Connect with RARE NUTS private client concierge for bespoke curation and corporate gifting.',
    url: `${siteUrl}/contact`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: 'RARE NUTS Concierge' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Concierge | RARE NUTS',
    description: 'Connect with RARE NUTS private client concierge for bespoke curation.',
    images: ['/images/og-rarenuts.png'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact#contact`,
    "name": "Contact RARE NUTS Concierge",
    "description": "Private client concierge and corporate inquiry desk for RARE NUTS.",
    "url": `${siteUrl}/contact`,
    "mainEntity": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "RARE NUTS",
      "email": "concierge@rarenuts.com"
    }
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Contact Concierge", "item": `${siteUrl}/contact` }
    ]
  };

  return (
    <>
      <JsonLd data={contactSchema} />
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
