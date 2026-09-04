import React from "react";
import { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "Luxury Gift Collections & Keepsake Boxes | RARE NUTS",
  description: "Discover our collection of handcrafted wooden presentation gift boxes, velvet-lined compartments, and reserve California almonds.",
  alternates: {
    canonical: `${siteUrl}/gift-boxes`,
  },
  openGraph: {
    title: "Luxury Gift Collections & Keepsake Boxes | RARE NUTS",
    description: "Handcrafted wooden presentation gift boxes and reserve California almonds.",
    url: `${siteUrl}/gift-boxes`,
    siteName: "RARE NUTS",
    images: [{ url: `${siteUrl}/images/royal-almonds-wooden-box.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Gift Collections & Keepsake Boxes | RARE NUTS",
    description: "Handcrafted wooden presentation gift boxes and reserve California almonds.",
    images: [`${siteUrl}/images/royal-almonds-wooden-box.png`],
  },
};

export default function GiftBoxesPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Gift Boxes", url: "/gift-boxes" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText">
        <div className="max-w-5xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbItems.map(i => ({ label: i.name, url: i.url }))} />
          
          {/* Header */}
          <div className="text-center my-12">
            <h1 className="text-4xl sm:text-6xl font-serif text-luxuryGold mb-6 tracking-wide uppercase">The Gift Collections</h1>
            <p className="text-lg sm:text-xl text-secondaryText max-w-2xl mx-auto font-light leading-relaxed">
              Discover our exquisite collection of premium almond gift boxes, meticulously designed for the ultimate unboxing experience.
            </p>
          </div>

          {/* The Unboxing Experience */}
          <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="h-96 rounded-2xl border border-luxuryGold/20 overflow-hidden relative shadow-2xl">
              <Image 
                src="/images/royal-almonds-wooden-box.png"
                alt="RARE NUTS Luxury Presentation Box"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/60 to-transparent"></div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-primaryText">An Unforgettable Reveal</h2>
              <p className="text-secondaryText leading-relaxed font-light">
                Every RARE NUTS gift box is a testament to our dedication to presentation. Crafted from sustainably sourced European oak, our presentation cases feature brass hinges, a magnetic closure, and our signature gold-embossed crest. 
              </p>
              <p className="text-secondaryText leading-relaxed font-light">
                Inside, the almonds rest in custom-molded velvet-lined compartments, preserving their integrity and delivering an auditory snap upon opening that signifies absolute freshness.
              </p>
              <Link href="/shop" className="inline-block border border-luxuryGold text-luxuryGold font-medium px-8 py-3 rounded-xl hover:bg-luxuryGold/10 transition-colors tracking-wide uppercase text-sm mt-4">
                Explore Collections
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
