import React from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Metadata } from 'next';
import { Heart, Brain, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Health & Longevity Benefits of Premium Almonds & Nuts | RARE NUTS',
  description: 'Explore the peer-reviewed health benefits of premium California almonds, walnuts, and pistachios. Discover the impact on cardiovascular wellness, metabolic balance, cognitive function, and cellular longevity.',
  keywords: [
    'health benefits of almonds',
    'almonds for heart health',
    'omega 3 in walnuts',
    'almond nutrition antioxidant',
    'nut consumption longevity',
    'vitamin E California almonds',
  ],
  alternates: {
    canonical: `${siteUrl}/journal/health-benefits`,
  },
  openGraph: {
    title: 'Health & Longevity Benefits of Premium Almonds | RARE NUTS',
    description: 'Explore the scientifically validated cardiovascular, cognitive, and metabolic benefits of reserve almonds and walnuts.',
    url: `${siteUrl}/journal/health-benefits`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/california-almonds-250g.png', width: 1200, height: 630, alt: 'Almond Health Benefits' }],
    type: 'article',
  },
};

export default function HealthBenefitsHub() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}/journal/health-benefits#article`,
    "headline": "Health and Longevity Benefits of California Almonds and Nutrient-Dense Nuts",
    "description": "Scientific review of micronutrients, polyphenol antioxidants, and cardiovascular benefits of reserve tree nuts.",
    "image": [`${siteUrl}/images/california-almonds-250g.png`],
    "datePublished": "2026-01-20T08:00:00+05:30",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "RARE NUTS Science & Wellness Desk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RARE NUTS",
      "logo": `${siteUrl}/images/og-rarenuts.png`
    },
    "mainEntityOfPage": `${siteUrl}/journal/health-benefits`
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <main className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText px-6 md:px-12 max-w-[1400px] mx-auto">
        <Breadcrumbs items={[
          { label: "Home", url: "/" },
          { label: "The Journal", url: "/journal" },
          { label: "Health & Longevity" }
        ]} />

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center my-12 space-y-6">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-4 py-1.5 border border-luxuryGold/20 rounded-full inline-block">
            Evidence-Based Botanical Wellness
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText tracking-tight leading-tight">
            The Science of <span className="text-luxuryGold italic">Longevity & Vitality</span> in Every Kernel
          </h1>
          <p className="text-secondaryText text-lg font-light leading-relaxed max-w-2xl mx-auto">
            From potent polyphenol antioxidants to bioactive alpha-linolenic acids, discover how daily mindful consumption of premium nuts supports cellular rejuvenation.
          </p>
        </header>

        {/* 4 Pillars Grid */}
        <section className="my-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Heart className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">Cardiovascular Resilience</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              California almonds are exceptionally rich in monounsaturated oleic acid and plant sterols, scientifically proven to help modulate LDL cholesterol while protecting arterial endothelial health.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Brain className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">Neuroprotective Alpha-Lipids</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Kashmiri walnuts deliver the highest plant-based concentration of Omega-3 ALA, vital for cognitive clarity, neuroplasticity, and reducing cerebral neuroinflammation.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Zap className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">Glycemic Modulation</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              With an ideal macro ratio of dietary fiber, healthy fats, and plant protein, whole raw almonds stabilize postprandial glucose surges and sustain clean metabolic energy.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Shield className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">Cellular Vitamin E & Polyphenols</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Just a 28g serving of reserve almonds provides over 50% of the daily recommended intake of natural d-alpha-tocopherol, guarding cell membranes from oxidative stressors.
            </p>
          </div>
        </section>

        {/* Nutritional Breakdown Table */}
        <section className="my-20 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-serif text-primaryText">Micronutrient Concentration (per 100g)</h2>
            <p className="text-secondaryText text-sm font-light">
              Comparative nutritional density across the RARE NUTS Master Reserve collection.
            </p>
          </div>

          <div className="overflow-x-auto rounded-card border border-luxuryGold/30">
            <table className="w-full text-left text-sm text-secondaryText">
              <thead className="bg-secondaryBg text-luxuryGold font-serif uppercase tracking-widest text-xs border-b border-luxuryGold/30">
                <tr>
                  <th className="p-4 sm:p-6">Botanical Reserve</th>
                  <th className="p-4 sm:p-6">Protein</th>
                  <th className="p-4 sm:p-6">Healthy Fats</th>
                  <th className="p-4 sm:p-6">Primary Micronutrient</th>
                  <th className="p-4 sm:p-6">Primary Health Focus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxuryGold/15 bg-background">
                <tr>
                  <td className="p-4 sm:p-6 font-semibold text-primaryText">California Reserve Raw Almonds</td>
                  <td className="p-4 sm:p-6 text-luxuryGold font-medium">21.2g</td>
                  <td className="p-4 sm:p-6">49.9g (MUFA dominant)</td>
                  <td className="p-4 sm:p-6">Vitamin E (26mg) + Magnesium</td>
                  <td className="p-4 sm:p-6">Antioxidant Defense & Skin Health</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-semibold text-primaryText">Kashmiri Snow Walnuts</td>
                  <td className="p-4 sm:p-6 text-luxuryGold font-medium">15.2g</td>
                  <td className="p-4 sm:p-6">65.2g (Omega-3 ALA rich)</td>
                  <td className="p-4 sm:p-6">Plant Omega-3 (9.1g) + Folate</td>
                  <td className="p-4 sm:p-6">Cognitive Function & Memory</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-semibold text-primaryText">Persian Akbari Pistachios</td>
                  <td className="p-4 sm:p-6 text-luxuryGold font-medium">20.1g</td>
                  <td className="p-4 sm:p-6">45.3g (Lutein & Zeaxanthin)</td>
                  <td className="p-4 sm:p-6">Vitamin B6 + Potassium</td>
                  <td className="p-4 sm:p-6">Vision Health & Ocular Protection</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-semibold text-primaryText">Himalayan Wild Chilgoza</td>
                  <td className="p-4 sm:p-6 text-luxuryGold font-medium">13.7g</td>
                  <td className="p-4 sm:p-6">68.4g (Pinolenic Acid)</td>
                  <td className="p-4 sm:p-6">Zinc + Vitamin K1</td>
                  <td className="p-4 sm:p-6">Appetite Satiety & Immunity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="my-20 bg-secondaryBg border border-luxuryGold/30 rounded-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">Daily Wellness Ritual</span>
            <h3 className="text-3xl font-serif text-primaryText">Unpasteurized California Raw Almonds</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Experience the purest form of natural nutrition. Uncooked, unpasteurized, and naturally nutrient-dense.
            </p>
          </div>
          <Link href="/shop/california-reserve-raw" className="luxury-button px-8 py-4 text-xs tracking-widest whitespace-nowrap">
            Shop Raw Almonds <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
