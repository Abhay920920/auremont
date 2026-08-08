import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import React from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Contact Us | RARE NUTS',
  description: 'Get in touch with RARE NUTS for concierge support, corporate inquiries, or questions about our luxury curations.',
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Us | RARE NUTS',
    description: 'Get in touch with RARE NUTS for support, corporate inquiries, or questions about our luxury curations.',
    url: `${siteUrl}/contact`,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "RARE NUTS",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-REPLACE-WITH-REAL-NUMBER",
        "contactType": "customer service",
        "email": "concierge@rarenuts.com"
      }
    }
  };

  return (
    <>
      <JsonLd data={contactJsonLd} />
      {children}
    </>
  );
}
