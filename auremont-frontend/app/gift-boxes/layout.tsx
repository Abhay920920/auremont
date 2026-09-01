import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Luxury Presentation Gift Boxes & Wooden Hampers | RARE NUTS',
  description: 'Experience an unforgettable reveal with handcrafted European oak and mahogany gift cases by RARE NUTS. Featuring solid brass hinges, velvet-lined compartments, and gold-embossed crests.',
  keywords: [
    'luxury presentation boxes',
    'wooden dry fruit boxes',
    'oak gift box almonds',
    'luxury food packaging',
    'unboxing experience gift box',
  ],
  alternates: {
    canonical: `${siteUrl}/gift-boxes`,
  },
  openGraph: {
    title: 'Luxury Presentation Gift Boxes | RARE NUTS',
    description: 'Experience an unforgettable reveal with handcrafted European oak and mahogany gift cases by RARE NUTS.',
    url: `${siteUrl}/gift-boxes`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/royal-almonds-wooden-box.png', width: 1200, height: 630, alt: 'RARE NUTS Presentation Boxes' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Presentation Gift Boxes | RARE NUTS',
    description: 'Handcrafted European oak and mahogany gift cases with velvet lining.',
    images: ['/images/royal-almonds-wooden-box.png'],
  },
};

export default function GiftBoxesLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Gift Boxes", "item": `${siteUrl}/gift-boxes` }
    ]
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
