import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: "%s | Auremont",
    default: "Auremont | Premium California Almonds",
  },
  description: "Luxury California Almonds crafted for those who appreciate the finest. 100% natural, premium quality.",
  openGraph: {
    title: "Auremont | Premium California Almonds",
    description: "Luxury California Almonds crafted for those who appreciate the finest. 100% natural, premium quality.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Auremont',
    images: [
      {
        url: '/images/og-auremont.png',
        width: 1200,
        height: 630,
        alt: 'Auremont — Premium California Almonds',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Auremont | Premium California Almonds",
    description: "Luxury California Almonds crafted for those who appreciate the finest.",
    images: ['/images/og-auremont.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  }
};

import JsonLd from "@/components/JsonLd";
import FilmGrain from "@/components/FilmGrain";
import EntranceSplash from "@/components/EntranceSplash";
import StorefrontWrapper from "@/components/StorefrontWrapper";
import AnnouncementBar from "@/components/AnnouncementBar";
import CookieBanner from "@/components/CookieBanner";
import CustomCursor from "@/components/ui/CustomCursor";
import TransitionProvider from "@/components/providers/TransitionProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "Auremont",
      "url": siteUrl,
      "logo": `${siteUrl}/images/og-auremont.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-REPLACE-WITH-REAL-NUMBER",
        "contactType": "customer service"
      }
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "Auremont",
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteUrl}/shop?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} font-sans bg-background text-primaryText min-h-screen antialiased flex flex-col overflow-x-hidden selection:bg-luxuryGold/30 selection:text-luxuryGold print:bg-background print:text-primaryText`}>
        <EntranceSplash />
        <div className="print:hidden">
          <FilmGrain />
        </div>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        
        <AnnouncementBar />
        
        <CustomCursor />
        <StorefrontWrapper>
          <TransitionProvider>
            {children}
          </TransitionProvider>
        </StorefrontWrapper>

        <CookieBanner />
      </body>
    </html>
  );
}
