import React from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Metadata } from 'next';
import { Activity, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Complete Nutritional Profile & Bioactive Nutrients of Tree Nuts | RARE NUTS',
  description: 'In-depth nutritional analysis of California almonds, cashews, walnuts, and pistachios. Macro breakdown, amino acid scores, mineral bioavailability, and healthy fats.',
  keywords: [
    'almond nutrition breakdown',
    'protein in California almonds',
    'healthy fats in tree nuts',
    'minerals in raw almonds',
    'keto nuts nutrition',
  ],
  alternates: {
    canonical: `${siteUrl}/journal/nutrition`,
  },
  openGraph: {
    title: 'Complete Nutritional Profile of Tree Nuts | RARE NUTS',
    description: 'In-depth nutritional analysis of California almonds, cashews, walnuts, and pistachios.',
    url: `${siteUrl}/journal/nutrition`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/california-almonds-250g.png', width: 1200, height: 630, alt: 'Tree Nut Nutrition Facts' }],
    type: 'article',
  },
};

export default function NutritionHub() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}/journal/nutrition#article`,
    "headline": "Complete Nutritional Profile and Bioactive Micronutrients of Tree Nuts",
    "description": "Comprehensive biochemical breakdown of macro- and micronutrients across California almonds and rare tree nuts.",
    "image": [`${siteUrl}/images/california-almonds-250g.png`],
    "datePublished": "2026-02-22T08:00:00+05:30",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "RARE NUTS Nutrition & Biochemical Research Desk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RARE NUTS",
      "logo": `${siteUrl}/images/og-rarenuts.png`
    },
    "mainEntityOfPage": `${siteUrl}/journal/nutrition`
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <main className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText px-6 md:px-12 max-w-[1400px] mx-auto">
        <Breadcrumbs items={[
          { label: "Home", url: "/" },
          { label: "The Journal", url: "/journal" },
          { label: "Nutritional Science" }
        ]} />

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center my-12 space-y-6">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-4 py-1.5 border border-luxuryGold/20 rounded-full inline-block">
            Biochemical Research • Nutritional Density
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText tracking-tight leading-tight">
            The Complete Nutritional Blueprint: <span className="text-luxuryGold italic">Tree Nuts & Almonds</span>
          </h1>
          <p className="text-secondaryText text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Discover why nutritionists and longevity researchers consider reserve California almonds and tree nuts the apex of functional whole foods.
          </p>
        </header>

        {/* 3 Scientific Highlights */}
        <section className="my-16 grid md:grid-cols-3 gap-8">
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Activity className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">High-Bioavailability Plant Protein</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              With 6 grams of clean plant-based protein per 28g ounce (21.2% by weight), California almonds provide essential amino acids (including L-Arginine) required for cellular repair and vascular tone.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <ShieldCheck className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">Cardioprotective Oleic Acids</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Over 65% of the total lipid content in raw almonds is comprised of healthy monounsaturated oleic acid—the identical heart-healthy fat found in extra virgin olive oil.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Zap className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">Bioactive Magnesium & Trace Minerals</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Almonds are one of nature's densest sources of magnesium (76mg per ounce), playing a crucial co-factor role in over 300 enzymatic reactions in the human body.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="my-20 bg-secondaryBg border border-luxuryGold/30 rounded-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">100% Unprocessed Purity</span>
            <h3 className="text-3xl font-serif text-primaryText">California Reserve Raw Almonds</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Whole unpasteurized almonds, preserving every milligram of natural enzymes and vitamin E.
            </p>
          </div>
          <Link href="/shop/california-reserve-raw" className="luxury-button px-8 py-4 text-xs tracking-widest whitespace-nowrap">
            Shop California Raw Almonds <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
