import React from "react";
import { Metadata } from "next";
import FAQClient from "./FAQClient";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { FAQS_DATA } from "@/lib/faqData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "Frequently Asked Questions | RARE NUTS",
  description: "Clear answers on our single-origin California Nonpareil almonds, almond-wood roasting, mahogany gift boxes, and express delivery.",
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: "Frequently Asked Questions | RARE NUTS",
    description: "Learn about our single-origin California almonds, wood roasting, keepsake gift packaging, and express delivery.",
    url: `${siteUrl}/faq`,
    siteName: "RARE NUTS",
    images: [{ url: `${siteUrl}/images/og-rarenuts.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | RARE NUTS",
    description: "Answers on sourcing, wood roasting, gifting, and international shipping.",
    images: [`${siteUrl}/images/og-rarenuts.png`],
  },
};

export default function FAQPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema items={FAQS_DATA.map(f => ({ question: f.question, answer: f.answer }))} />
      <FAQClient />
    </>
  );
}
