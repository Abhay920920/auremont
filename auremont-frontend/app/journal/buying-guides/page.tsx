import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Metadata } from 'next';
import { Award, CheckCircle2, Star, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'The Connoisseur’s Guide to Buying Premium Almonds & Luxury Nuts | RARE NUTS',
  description: 'Learn how to identify superior California almonds and luxury nuts. An insider guide to kernel grades, moisture levels, natural oils, unpasteurized reserves, and artisanal slow roasting.',
  keywords: [
    'how to buy premium almonds',
    'California almond grades',
    'extra large almonds guide',
    'raw vs roasted almonds quality',
    'choosing gourmet nuts',
    'luxury dry fruit buying guide',
  ],
  alternates: {
    canonical: `${siteUrl}/journal/buying-guides`,
  },
  openGraph: {
    title: 'The Connoisseur’s Guide to Buying Premium Almonds | RARE NUTS',
    description: 'Learn how to identify superior California almonds and luxury nuts with our expert buying guide.',
    url: `${siteUrl}/journal/buying-guides`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/california-almonds-250g.png', width: 1200, height: 630, alt: 'Premium Almond Buying Guide' }],
    type: 'article',
  },
};

export default function BuyingGuidesHub() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}/journal/buying-guides#article`,
    "headline": "The Connoisseur’s Guide to Buying Premium Almonds and Luxury Nuts",
    "description": "Comprehensive buyer guide on assessing almond grades, kernel integrity, moisture retention, and roasting methods.",
    "image": [`${siteUrl}/images/california-almonds-250g.png`],
    "datePublished": "2026-01-15T08:00:00+05:30",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "RARE NUTS Editorial Desk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RARE NUTS",
      "logo": `${siteUrl}/images/og-rarenuts.png`
    },
    "mainEntityOfPage": `${siteUrl}/journal/buying-guides`
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <main className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText site-container">
        <Breadcrumbs items={[
          { label: "Home", url: "/" },
          { label: "The Journal", url: "/journal" },
          { label: "Buying Guides" }
        ]} />

        {/* Hero Section */}
        <header className="max-w-4xl mx-auto text-center my-12 space-y-6">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-4 py-1.5 border border-luxuryGold/20 rounded-full inline-block">
            Curator’s Handbook • Editorial Edition
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText tracking-tight leading-tight">
            The Connoisseur’s Guide to <span className="text-luxuryGold italic">Premium Almonds</span> & Luxury Nuts
          </h1>
          <p className="text-secondaryText text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Not all almonds are created equal. Discover the four botanical pillars that separate mass-market commercial harvests from exceptional reserve-grade kernels.
          </p>
        </header>

        {/* Key Quality Indicators */}
        <section className="my-16 grid md:grid-cols-3 gap-8">
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Award className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-2xl text-primaryText">1. Kernel Sizing & Uniformity</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Premium California almonds are classified by count-per-ounce. Reserve-grade Nonpareil nuts range from 18/20 to 20/22 kernels per ounce, delivering superior plumpness, smooth skin, and an exquisite buttery mouthfeel.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <ShieldCheck className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-2xl text-primaryText">2. Cold-Storage & Moisture Retention</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Exceptional nuts must maintain a strict 4.5% to 5.5% internal moisture level. When exposed to heat or open air, delicate monounsaturated fats oxidize rapidly, leading to rancidity and bitterness.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Sparkles className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-2xl text-primaryText">3. Artisanal Micro-Batch Roasting</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Industrial flash-roasting scorches the outer pellicle. Artisanal slow-roasting at 140°C over 45 minutes activates the Maillard reaction evenly, preserving vitamin E while yielding an audible crisp snap.
            </p>
          </div>
        </section>

        {/* Comparison Matrix Table */}
        <section className="my-20 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-serif text-primaryText">Quality Grading Matrix</h2>
            <p className="text-secondaryText text-sm font-light">
              Understand the technical specifications of commercial commodity vs. RARE NUTS Reserve grades.
            </p>
          </div>

          <div className="overflow-x-auto rounded-card border border-luxuryGold/30">
            <table className="w-full text-left text-sm text-secondaryText">
              <thead className="bg-secondaryBg text-luxuryGold font-serif uppercase tracking-widest text-xs border-b border-luxuryGold/30">
                <tr>
                  <th className="p-4 sm:p-6">Attribute</th>
                  <th className="p-4 sm:p-6">Mass Commercial Grade</th>
                  <th className="p-4 sm:p-6 bg-luxuryGold/10 text-primaryText font-bold">RARE NUTS Master Reserve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxuryGold/15 bg-background">
                <tr>
                  <td className="p-4 sm:p-6 font-medium text-primaryText">Variety & Origin</td>
                  <td className="p-4 sm:p-6">Mixed Field Blends</td>
                  <td className="p-4 sm:p-6 bg-luxuryGold/5 font-semibold text-luxuryGold">Single-Estate California Nonpareil</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-medium text-primaryText">Sizing Specification</td>
                  <td className="p-4 sm:p-6">27/30 count (Small / Broken)</td>
                  <td className="p-4 sm:p-6 bg-luxuryGold/5 font-semibold text-luxuryGold">18/20 Extra Large Hand-Sorted</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-medium text-primaryText">Defect Tolerance</td>
                  <td className="p-4 sm:p-6">Up to 5% chipped or chipped skins</td>
                  <td className="p-4 sm:p-6 bg-luxuryGold/5 font-semibold text-luxuryGold">&lt; 0.5% Zero-Defect Hand Inspection</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-medium text-primaryText">Packaging Integrity</td>
                  <td className="p-4 sm:p-6">Polyethylene bags (permeable)</td>
                  <td className="p-4 sm:p-6 bg-luxuryGold/5 font-semibold text-luxuryGold">Airtight Gold Foil & Solid Wood Chests</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Featured Product Callout */}
        <section className="my-20 bg-secondaryBg border border-luxuryGold/30 rounded-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">Recommended Reserve</span>
            <h3 className="text-3xl font-serif text-primaryText">California Reserve Raw Almonds (250g)</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Our signature unpasteurized California Nonpareil kernels. Hand-selected for exceptional plumpness, natural vitamin E, and smooth sweet finish.
            </p>
          </div>
          <Link href="/shop/california-reserve-raw" className="luxury-button px-8 py-4 text-xs tracking-widest whitespace-nowrap">
            View California Reserve Raw <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
