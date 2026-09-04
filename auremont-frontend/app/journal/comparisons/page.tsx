import React from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Metadata } from 'next';
import { Scale, Check, ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'California Nonpareil vs Kashmiri vs Mamra Almonds: The Definitive Comparison | RARE NUTS',
  description: 'An objective botanical comparison of California Nonpareil, Iranian Mamra, and Kashmiri Gurbandi almonds. Compare oil content, sweetness, shape, culinary versatility, and value.',
  keywords: [
    'California vs Mamra almonds',
    'Nonpareil vs Gurbandi almonds',
    'which almond is best',
    'Mamra almond comparison',
    'best almonds in India',
    'almond varieties guide',
  ],
  alternates: {
    canonical: `${siteUrl}/journal/comparisons`,
  },
  openGraph: {
    title: 'California Nonpareil vs Kashmiri vs Mamra Almonds | RARE NUTS',
    description: 'An objective botanical comparison of California Nonpareil, Iranian Mamra, and Kashmiri Gurbandi almonds.',
    url: `${siteUrl}/journal/comparisons`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/california-almonds-250g.png', width: 1200, height: 630, alt: 'Almond Varieties Comparison' }],
    type: 'article',
  },
};

export default function ComparisonsHub() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}/journal/comparisons#article`,
    "headline": "California Nonpareil vs Kashmiri vs Mamra Almonds: The Definitive Comparison",
    "description": "Comprehensive botanical analysis comparing the flavor, oil content, texture, and pricing of global almond varieties.",
    "image": [`${siteUrl}/images/california-almonds-250g.png`],
    "datePublished": "2026-02-01T08:00:00+05:30",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "RARE NUTS Sommelier Desk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RARE NUTS",
      "logo": `${siteUrl}/images/og-rarenuts.png`
    },
    "mainEntityOfPage": `${siteUrl}/journal/comparisons`
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <main className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText site-container">
        <Breadcrumbs items={[
          { label: "Home", url: "/" },
          { label: "The Journal", url: "/journal" },
          { label: "Varieties & Comparisons" }
        ]} />

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center my-12 space-y-6">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-4 py-1.5 border border-luxuryGold/20 rounded-full inline-block">
            Botanical Deep-Dive • Cultivar Analysis
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText tracking-tight leading-tight">
            California Nonpareil vs Kashmiri vs Mamra: <span className="text-luxuryGold italic">The Ultimate Guide</span>
          </h1>
          <p className="text-secondaryText text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Demystifying the global almond landscape. Examine the distinct flavor profiles, oil concentrations, and optimal culinary applications of the world’s three most renowned almond varieties.
          </p>
        </header>

        {/* Comparison Table */}
        <section className="my-16 space-y-8">
          <div className="overflow-x-auto rounded-card border border-luxuryGold/30">
            <table className="w-full text-left text-sm text-secondaryText">
              <thead className="bg-secondaryBg text-luxuryGold font-serif uppercase tracking-widest text-xs border-b border-luxuryGold/30">
                <tr>
                  <th className="p-4 sm:p-6">Feature</th>
                  <th className="p-4 sm:p-6 bg-luxuryGold/10 text-primaryText font-bold">California Nonpareil (RARE NUTS)</th>
                  <th className="p-4 sm:p-6">Iranian / Afghan Mamra</th>
                  <th className="p-4 sm:p-6">Kashmiri Gurbandi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxuryGold/15 bg-background">
                <tr>
                  <td className="p-4 sm:p-6 font-medium text-primaryText">Kernel Appearance</td>
                  <td className="p-4 sm:p-6 bg-luxuryGold/5 text-luxuryGold font-semibold">Extra Large, Flat, Uniform, Golden Pellicle</td>
                  <td className="p-4 sm:p-6">Concave / Boat-shaped, Wrinkled Skin</td>
                  <td className="p-4 sm:p-6">Small, Pointed, High Shape Variation</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-medium text-primaryText">Flavor Profile</td>
                  <td className="p-4 sm:p-6 bg-luxuryGold/5 text-luxuryGold font-semibold">Sweet, Buttery, Clean, Zero Bitterness</td>
                  <td className="p-4 sm:p-6">Intense, Earthy, Pronounced Nutty Note</td>
                  <td className="p-4 sm:p-6">Rustic, Occasional Bitter Kernels (~3%)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-medium text-primaryText">Roasting Performance</td>
                  <td className="p-4 sm:p-6 bg-luxuryGold/5 text-luxuryGold font-semibold">Exceptional (Even browning, light crunch)</td>
                  <td className="p-4 sm:p-6">Fair (Dense structure requires high heat)</td>
                  <td className="p-4 sm:p-6">Moderate (Uneven kernel sizing affects roast)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-medium text-primaryText">Best For</td>
                  <td className="p-4 sm:p-6 bg-luxuryGold/5 text-luxuryGold font-semibold">Luxury Gifting, Daily Snacking, Roasting</td>
                  <td className="p-4 sm:p-6">Traditional Ayurvedic preparations</td>
                  <td className="p-4 sm:p-6">Almond milk extraction, paste, baking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3 Columns Breakdown */}
        <section className="my-20 grid md:grid-cols-3 gap-8">
          <div className="bg-secondaryBg/40 border border-luxuryGold/30 p-8 rounded-card space-y-4">
            <span className="text-luxuryGold font-serif text-2xl block">California Nonpareil</span>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Accounting for the pinnacle of luxury table almonds, California Nonpareil kernels are renowned for their delicate, thin shell and extraordinarily uniform, unblemished shape. Their naturally high sweetness and clean buttery finish make them the worldwide choice for luxury presentation boxes.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <span className="text-primaryText font-serif text-2xl block">Iranian Mamra</span>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Grown in high-altitude dry climates of the Middle East, Mamra almonds feature a boat-like concave curve. Because they are grown on traditional non-grafted rootstocks, harvest yields are lower and oil percentages are high, giving them a dense, intense nut profile.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <span className="text-primaryText font-serif text-2xl block">Kashmiri Gurbandi</span>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Cultivated in the valleys of Kashmir, Gurbandi nuts are smaller and irregular in size. While exceptionally rich in natural oils, traditional crops contain approximately 2% to 4% naturally bitter amygdalin kernels, making them best suited for blending or oil extraction.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="my-20 bg-secondaryBg border border-luxuryGold/30 rounded-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">Taste The Benchmark</span>
            <h3 className="text-3xl font-serif text-primaryText">California Reserve Slow-Roasted Almonds</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Slow-roasted at 140°C in micro-batches with Fleur de Sel sea salt crystals.
            </p>
          </div>
          <Link href="/shop/roasted-sea-salt-almonds" className="luxury-button px-8 py-4 text-xs tracking-widest whitespace-nowrap">
            Explore Roasted Reserve <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
