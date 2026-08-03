import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import React from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Contact Us | Auremont',
  description: 'Get in touch with Auremont for support, corporate inquiries, or questions about our luxury almonds.',
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Us | Auremont',
    description: 'Get in touch with Auremont for support, corporate inquiries, or questions about our luxury almonds.',
    url: `${siteUrl}/contact`,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Auremont",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-REPLACE-WITH-REAL-NUMBER",
        "contactType": "customer service",
        "email": "concierge@auremont.com"
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
