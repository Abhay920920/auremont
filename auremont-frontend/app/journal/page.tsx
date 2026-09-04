import React from "react";
import { Metadata } from "next";
import JournalClient from "./JournalClient";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "The Journal | RARE NUTS Luxury Chronicles & Confectionery Craft",
  description: "Essays on terroir, the culinary science of wood-convection roasting, sommelier pairing salons, and the philosophy of heirloom luxury almonds.",
  alternates: {
    canonical: `${siteUrl}/journal`,
  },
  openGraph: {
    title: "The Journal | RARE NUTS Luxury Chronicles",
    description: "Essays on terroir, the culinary science of wood-convection roasting, sommelier pairing salons, and the philosophy of heirloom luxury almonds.",
    url: `${siteUrl}/journal`,
    siteName: "RARE NUTS",
    images: [
      {
        url: `${siteUrl}/images/og-rarenuts.png`,
        width: 1200,
        height: 630,
        alt: "The RARE NUTS Journal",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Journal | RARE NUTS Luxury Chronicles",
    description: "Essays on terroir, culinary roasting science, and sommelier pairing salons.",
    images: [`${siteUrl}/images/og-rarenuts.png`],
  },
};

export default function JournalPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "The Journal", url: "/journal" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JournalClient />
    </>
  );
}
