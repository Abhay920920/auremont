import React from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Metadata } from 'next';
import { Sparkles, Gift, Heart, ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Royal Festive & Wedding Nut Hampers: Diwali, New Year & Celebrations | RARE NUTS',
  description: 'Discover how to curate unforgettable dry fruit gift hampers for Diwali, wedding celebrations, Eid, Christmas, and milestones. Featuring California reserve almonds and gold-embossed presentation boxes.',
  keywords: [
    'Diwali dry fruit gift hampers',
    'wedding nut gift boxes India',
    'luxury festive gifting almonds',
    'royal gift hampers Mumbai Delhi Bangalore',
    'dry fruit packaging for weddings',
  ],
  alternates: {
    canonical: `${siteUrl}/journal/festival-gifting`,
  },
  openGraph: {
    title: 'Royal Festive & Wedding Nut Hampers | RARE NUTS',
    description: 'Curating unforgettable dry fruit gift hampers for Diwali, weddings, and milestone celebrations.',
    url: `${siteUrl}/journal/festival-gifting`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/luxury-gift-box-unboxing.png', width: 1200, height: 630, alt: 'Festive Nut Hampers' }],
    type: 'article',
  },
};

export default function FestivalGiftingHub() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}/journal/festival-gifting#article`,
    "headline": "Royal Festive and Wedding Nut Hampers: Diwali, New Year, and Milestone Celebrations",
    "description": "A cultural and aesthetic exploration of luxury dry fruit gifting during festive celebrations and weddings.",
    "image": [`${siteUrl}/images/luxury-gift-box-unboxing.png`],
    "datePublished": "2026-02-15T08:00:00+05:30",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "RARE NUTS Cultural Curation Desk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RARE NUTS",
      "logo": `${siteUrl}/images/og-rarenuts.png`
    },
    "mainEntityOfPage": `${siteUrl}/journal/festival-gifting`
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <main className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText site-container">
        <Breadcrumbs items={[
          { label: "Home", url: "/" },
          { label: "The Journal", url: "/journal" },
          { label: "Festive & Wedding Gifting" }
        ]} />

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center my-12 space-y-6">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-4 py-1.5 border border-luxuryGold/20 rounded-full inline-block">
            Celebration & Heritage • Festive Curation
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText tracking-tight leading-tight">
            The Royal Tradition of <span className="text-luxuryGold italic">Festive & Wedding</span> Gifting
          </h1>
          <p className="text-secondaryText text-lg font-light leading-relaxed max-w-2xl mx-auto">
            In Indian culture and global royalty, gifting dry fruits signifies auspicious beginnings, prosperity, and enduring health. Discover how RARE NUTS reinterprets this timeless heritage through haute couture packaging.
          </p>
        </header>

        {/* 3 Occasions */}
        <section className="my-16 grid md:grid-cols-3 gap-8">
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Sparkles className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-2xl text-primaryText">Diwali & Festive Auspices</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Elevate the festival of lights with handcrafted solid oak presentation cases featuring roasted California almonds, Iranian pistachios, and Mangalore cashews that embody royal hospitality.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Heart className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-2xl text-primaryText">Wedding Invitations & Favors</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Pair your luxury wedding save-the-dates with personalized nut chests featuring couple monogram laser engraving, wax-sealed scrolls, and customized reserve nut compartments.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Gift className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-2xl text-primaryText">Milestones & Anniversaries</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Celebrate golden anniversaries, founder retirements, and institutional milestones with custom commemorative editions crafted with precision and uncompromised botanical quality.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="my-20 bg-secondaryBg border border-luxuryGold/30 rounded-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">Bespoke Studio</span>
            <h3 className="text-3xl font-serif text-primaryText">Design a Custom Festive Hamper</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Select your presentation vessel, reserve nut varieties, and personalized engraving plates.
            </p>
          </div>
          <Link href="/custom-gift-box" className="luxury-button px-8 py-4 text-xs tracking-widest whitespace-nowrap">
            Launch Gift Builder <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
