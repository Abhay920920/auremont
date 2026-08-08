import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press & Media Room | RARE NUTS',
  description: 'Official RARE NUTS Press & Media Room. Access high-resolution brand assets, executive background, official logos, product photography, and media inquiries.',
  openGraph: {
    title: 'Press & Media Room | RARE NUTS',
    description: 'Official RARE NUTS Press & Media Room. Access high-resolution brand assets, executive background, official logos, product photography, and media inquiries.',
    url: 'https://rarenuts.in/press',
    images: [{ url: '/images/og-rarenuts.png', width: 1200, height: 630, alt: 'RARE NUTS Press & Media Room' }],
  },
  alternates: {
    canonical: 'https://rarenuts.in/press',
  },
};

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
