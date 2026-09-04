import React from "react";
import { Metadata } from "next";
import CorporateGiftsClient from "./CorporateGiftsClient";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "Luxury Corporate Gifting & Executive Hampers | RARE NUTS",
  description: "Bespoke corporate gifting solutions featuring single-origin California almonds in solid mahogany chests with custom laser-engraved brass branding.",
  alternates: {
    canonical: `${siteUrl}/corporate-gifts`,
  },
  openGraph: {
    title: "Luxury Corporate Gifting & Executive Hampers | RARE NUTS",
    description: "Solid mahogany presentation chests, custom brass engraving, and white-glove corporate dispatch.",
    url: `${siteUrl}/corporate-gifts`,
    siteName: "RARE NUTS",
    images: [{ url: `${siteUrl}/images/royal-almonds-wooden-box.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Corporate Gifting & Executive Hampers | RARE NUTS",
    description: "Solid mahogany presentation chests and white-glove corporate dispatch.",
    images: [`${siteUrl}/images/royal-almonds-wooden-box.png`],
  },
};

export default function CorporateGiftsPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Corporate Gifting", url: "/corporate-gifts" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <CorporateGiftsClient />
    </>
  );
}
