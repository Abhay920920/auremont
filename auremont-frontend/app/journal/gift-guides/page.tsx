import React from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Metadata } from 'next';
import { Gift, PackageCheck, Award, ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'The Art of Luxury Dry Fruit Gift Curation | RARE NUTS',
  description: 'An insider guide to curating luxury dry fruit and almond gift boxes. Learn how to balance textures, flavor profiles, packaging materials, and personalized touches for maximum unboxing impact.',
  keywords: [
    'dry fruit gift box guide',
    'luxury unboxing gift box',
    'how to curate a gift hamper',
    'mahogany wood gift box nuts',
    'personalized nut gifting ideas',
  ],
  alternates: {
    canonical: `${siteUrl}/journal/gift-guides`,
  },
  openGraph: {
    title: 'The Art of Luxury Dry Fruit Gift Curation | RARE NUTS',
    description: 'Learn how to balance textures, flavor profiles, and packaging materials for maximum unboxing impact.',
    url: `${siteUrl}/journal/gift-guides`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/royal-almonds-wooden-box.png', width: 1200, height: 630, alt: 'Luxury Gift Curation Guide' }],
    type: 'article',
  },
};

export default function GiftGuidesHub() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}/journal/gift-guides#article`,
    "headline": "The Art of Luxury Dry Fruit Gift Box Curation",
    "description": "Essential design principles for curating unforgettable gourmet nut gift presentations.",
    "image": [`${siteUrl}/images/royal-almonds-wooden-box.png`],
    "datePublished": "2026-02-18T08:00:00+05:30",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "RARE NUTS Packaging & Design Studio"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RARE NUTS",
      "logo": `${siteUrl}/images/og-rarenuts.png`
    },
    "mainEntityOfPage": `${siteUrl}/journal/gift-guides`
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <main className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText site-container">
        <Breadcrumbs items={[
          { label: "Home", url: "/" },
          { label: "The Journal", url: "/journal" },
          { label: "Gift Curation Guides" }
        ]} />

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center my-12 space-y-6">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-4 py-1.5 border border-luxuryGold/20 rounded-full inline-block">
            Haute Presentation • Curation Guide
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText tracking-tight leading-tight">
            Curating the Unforgettable: <span className="text-luxuryGold italic">Haute Packaging & Nut Curation</span>
          </h1>
          <p className="text-secondaryText text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Explore the multi-sensory journey of luxury gifting—from the tactile weight of European oak to the aroma release of slow-roasted kernels upon lifting the brass latches.
          </p>
        </header>

        {/* 3 Principles */}
        <section className="my-16 grid md:grid-cols-3 gap-8">
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <PackageCheck className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">1. Tactile & Auditory Drama</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Every detail matters: solid 12mm wood construction, velvet-flocked beddings, magnetic closure dampening, and the characteristic crisp snap of vacuum-sealed gold foil pouches.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Award className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">2. Flavor & Texture Harmony</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Pair naturally sweet unpasteurized raw California almonds with crunchy slow-roasted sea salt almonds, buttery Mangalore cashews, and savory Persian pistachios for dynamic tasting progression.
            </p>
          </div>
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4">
            <Gift className="text-luxuryGold w-8 h-8" />
            <h3 className="font-serif text-xl text-primaryText">3. Monogram Personalization</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Transform a gourmet gift into an enduring personal heirloom with laser-engraved solid brass nameplates and handwritten botanical gold-ink notes.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="my-20 bg-secondaryBg border border-luxuryGold/30 rounded-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">Flagship Presentation</span>
            <h3 className="text-3xl font-serif text-primaryText">Royal Almonds Mahogany Gift Chest (1kg)</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Handcrafted solid mahogany chest with brass hinges, velvet interior, and 1kg of California Reserve almonds.
            </p>
          </div>
          <Link href="/shop/royal-almonds-wooden-box" className="luxury-button px-8 py-4 text-xs tracking-widest whitespace-nowrap">
            View Mahogany Chest <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
