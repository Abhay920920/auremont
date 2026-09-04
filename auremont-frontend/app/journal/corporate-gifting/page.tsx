import React from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Metadata } from 'next';
import { Briefcase, Building2, Gift, ShieldCheck, ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Executive Corporate Dry Fruit Gifting Guide & Protocol | RARE NUTS',
  description: 'Master the art of B2B executive gifting. A strategic guide for luxury corporate gifts, client appreciation hampers, logo engraving etiquette, and nationwide multi-destination logistics.',
  keywords: [
    'corporate gifting guide India',
    'executive dry fruit gifts',
    'B2B client gifting etiquette',
    'luxury corporate hampers protocol',
    'custom branded dry fruit boxes',
  ],
  alternates: {
    canonical: `${siteUrl}/journal/corporate-gifting`,
  },
  openGraph: {
    title: 'Executive Corporate Gifting Guide & Protocol | RARE NUTS',
    description: 'Master the art of B2B executive gifting with our strategic guide on luxury dry fruit hampers.',
    url: `${siteUrl}/journal/corporate-gifting`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/royal-almonds-wooden-box.png', width: 1200, height: 630, alt: 'Corporate Gifting Guide' }],
    type: 'article',
  },
};

export default function CorporateGiftingHub() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}/journal/corporate-gifting#article`,
    "headline": "Executive Corporate Dry Fruit Gifting Guide and Protocol",
    "description": "Strategic insights on choosing memorable corporate food gifts, custom branding options, and logistics management.",
    "image": [`${siteUrl}/images/royal-almonds-wooden-box.png`],
    "datePublished": "2026-02-10T08:00:00+05:30",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "RARE NUTS Corporate Advisory Desk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RARE NUTS",
      "logo": `${siteUrl}/images/og-rarenuts.png`
    },
    "mainEntityOfPage": `${siteUrl}/journal/corporate-gifting`
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <main className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText site-container">
        <Breadcrumbs items={[
          { label: "Home", url: "/" },
          { label: "The Journal", url: "/journal" },
          { label: "Corporate Gifting Guide" }
        ]} />

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center my-12 space-y-6">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-4 py-1.5 border border-luxuryGold/20 rounded-full inline-block">
            Corporate Advisory • Strategic B2B Gifting
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText tracking-tight leading-tight">
            The Executive Protocol: <span className="text-luxuryGold italic">Corporate Dry Fruit Gifting</span>
          </h1>
          <p className="text-secondaryText text-lg font-light leading-relaxed max-w-2xl mx-auto">
            How forward-thinking enterprises use bespoke gourmet almond hampers to cement multi-million-dollar client relationships and express genuine executive gratitude.
          </p>
        </header>

        {/* 3 Strategic Rules */}
        <section className="my-16 grid md:grid-cols-3 gap-8">
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Building2 className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">1. Universal Dietary Appeal</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Unlike perishables or alcohol, premium California almonds and rare nuts are universally cherished across cultures, dietary preferences (vegetarian, vegan, gluten-free, keto), and corporate compliance codes.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Gift className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">2. Permanent Keepsake Packaging</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              A cardboard box is discarded in minutes. Solid mahogany and oak presentation cases with gold-engraved nameplates remain on executive desks as perpetual brand reminders for years.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <ShieldCheck className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">3. White-Glove Multi-Address Logistics</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Managing 500 individual VIP deliveries across 40 cities requires temperature-controlled logistics, personalized greeting cards, and real-time recipient tracking dashboards.
            </p>
          </div>
        </section>

        {/* Corporate Concierge Banner */}
        <section className="my-20 bg-secondaryBg border border-luxuryGold/30 rounded-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">B2B Concierge Desk</span>
            <h3 className="text-3xl font-serif text-primaryText">Planning Bulk Corporate Gifting (25+ Units)?</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Access wholesale pricing tiers, bespoke brass logo engraving, and dedicated fulfillment managers.
            </p>
          </div>
          <Link href="/corporate-gifts" className="luxury-button px-8 py-4 text-xs tracking-widest whitespace-nowrap">
            Explore Corporate Services <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
