import React from "react";
import { Metadata } from "next";
import AboutClient from "./AboutClient";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "About Us | The Terroir & Botanical Heritage of RARE NUTS",
  description: "Discover the heritage of RARE NUTS: single-origin California Nonpareil almonds from the 36th parallel, slow wood-convection roasting, and sustainable closed-loop stewardship.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About Us | The Terroir & Botanical Heritage of RARE NUTS",
    description: "From San Joaquin Valley terroir to heirloom mahogany presentation chests, learn the story behind RARE NUTS.",
    url: `${siteUrl}/about`,
    siteName: "RARE NUTS",
    images: [{ url: `${siteUrl}/images/our_story_orchard.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | The Terroir & Botanical Heritage of RARE NUTS",
    description: "The pursuit of botanical perfection in single-origin California almonds.",
    images: [`${siteUrl}/images/our_story_orchard.png`],
  },
};

export default function AboutPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <AboutClient />
    </>
  );
}
