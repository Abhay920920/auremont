import React from "react";
import { Metadata } from "next";
import ContactClient from "./ContactClient";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "Contact Concierge Desk | RARE NUTS Luxury Almonds & Gifting",
  description: "Connect with the RARE NUTS private concierge for bespoke gifting inquiries, order tracking, corporate commissions, and culinary partnerships.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Concierge Desk | RARE NUTS",
    description: "Connect with the RARE NUTS concierge for bespoke gifting, corporate orders, and culinary partnerships.",
    url: `${siteUrl}/contact`,
    siteName: "RARE NUTS",
    images: [{ url: `${siteUrl}/images/og-rarenuts.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Concierge Desk | RARE NUTS",
    description: "Reach the RARE NUTS white-glove concierge desk.",
    images: [`${siteUrl}/images/og-rarenuts.png`],
  },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ContactClient />
    </>
  );
}
