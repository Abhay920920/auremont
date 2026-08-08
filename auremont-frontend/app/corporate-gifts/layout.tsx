import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxury Corporate Gifting & Executive Gifts | RARE NUTS',
  description: 'Elevate executive relationships with RARE NUTS luxury corporate gifts. Custom-engraved wooden chests, bespoke client hampers, and employee appreciation gifting across India.',
  openGraph: {
    title: 'Luxury Corporate Gifting & Executive Gifts | RARE NUTS',
    description: 'Elevate executive relationships with RARE NUTS luxury corporate gifts. Custom-engraved wooden chests, bespoke client hampers, and employee appreciation gifting across India.',
    url: 'https://rarenuts.in/corporate-gifts',
    images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: 'RARE NUTS Executive Corporate Gifting' }],
  },
  alternates: {
    canonical: 'https://rarenuts.in/corporate-gifts',
  },
};

export default function CorporateGiftingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
