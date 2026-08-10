import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  display: "swap"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#D4AF37",
};

export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RARE NUTS',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in'),
  title: {
    template: "%s | RARE NUTS",
    default: "RARE NUTS | Premium Nuts & Luxury Gifting",
  },
  description: "Discover RARE NUTS — premium nuts and exceptional almonds curated for discerning customers, luxury gifting and corporate occasions. Crafted with uncompromising attention to quality and presentation.",
  openGraph: {
    title: "RARE NUTS | Premium Nuts & Luxury Gifting",
    description: "Discover RARE NUTS — premium nuts and exceptional almonds curated for discerning customers, luxury gifting and corporate occasions. Crafted with uncompromising attention to quality and presentation.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in',
    siteName: 'RARE NUTS',
    images: [
      {
        url: '/images/og-rarenuts.png',
        width: 1200,
        height: 630,
        alt: 'RARE NUTS — Exceptional by Nature',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "RARE NUTS | Premium Nuts & Luxury Gifting",
    description: "Discover RARE NUTS — premium nuts and exceptional almonds curated for discerning customers, luxury gifting and corporate occasions. Crafted with uncompromising attention to quality and presentation.",
    images: ['/images/og-rarenuts.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in',
  }
};

import JsonLd from "@/components/JsonLd";
import FilmGrain from "@/components/FilmGrain";
import EntranceSplash from "@/components/EntranceSplash";
import StorefrontWrapper from "@/components/StorefrontWrapper";
import CookieBanner from "@/components/CookieBanner";
import CustomCursor from "@/components/ui/CustomCursor";
import TransitionProvider from "@/components/providers/TransitionProvider";
import MobileBottomBar from "@/components/mobile/MobileBottomBar";
import ConciergeChatWidget from "@/components/concierge/ConciergeChatWidget";
import PageProgressLoader from "@/components/providers/PageProgressLoader";
import WebSiteSchema from "@/components/seo/WebSiteSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "RARE NUTS",
      "legalName": "RARE NUTS Private Limited",
      "url": siteUrl,
      "logo": `${siteUrl}/images/og-rarenuts.png`,
      "description": "Luxury gourmet nuts and premium gifting brand.",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "concierge@rarenuts.com",
        "contactType": "customer service"
      }
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "RARE NUTS",
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
        <WebSiteSchema />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} font-sans bg-background text-primaryText min-h-screen antialiased flex flex-col overflow-x-hidden selection:bg-luxuryGold/30 selection:text-luxuryGold print:bg-background print:text-primaryText pb-16 md:pb-0`}>
        <Suspense fallback={null}>
          <PageProgressLoader />
        </Suspense>
        <EntranceSplash />
        <div className="print:hidden">
          <FilmGrain />
        </div>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
        
        <CustomCursor />
        <StorefrontWrapper>
          <TransitionProvider>
            {children}
          </TransitionProvider>
        </StorefrontWrapper>

        <ConciergeChatWidget />
        <MobileBottomBar />
        <CookieBanner />
      </body>
    </html>
  );
}
