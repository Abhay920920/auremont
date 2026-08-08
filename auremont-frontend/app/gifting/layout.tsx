import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxury Nut Gifts & Premium Gifting | RARE NUTS',
  description: 'Explore RARE NUTS luxury nut gifts, handcrafted wooden gift boxes, and bespoke corporate gifting packages. Exceptional almonds curated for unforgettable celebrations.',
  openGraph: {
    title: 'Luxury Nut Gifts & Premium Gifting | RARE NUTS',
    description: 'Explore RARE NUTS luxury nut gifts, handcrafted wooden gift boxes, and bespoke corporate gifting packages. Exceptional almonds curated for unforgettable celebrations.',
    url: 'https://rarenuts.in/gifting',
    images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: 'RARE NUTS Luxury Gifting' }],
  },
  alternates: {
    canonical: 'https://rarenuts.in/gifting',
  },
};

export default function GiftingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
