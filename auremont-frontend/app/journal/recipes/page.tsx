import React from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Metadata } from 'next';
import { UtensilsCrossed, Clock, ChefHat, ArrowRight } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: 'Artisanal Culinary Recipes Featuring California Almonds | RARE NUTS',
  description: 'Elevate your gastronomy with chef-crafted recipes featuring RARE NUTS California almonds. From homemade artisanal almond butter to rosemary-truffle roasted nuts and almond flour confectionery.',
  keywords: [
    'gourmet almond recipes',
    'homemade artisanal almond butter',
    'rosemary sea salt roasted almonds recipe',
    'almond flour luxury baking',
    'chef nut recipes',
  ],
  alternates: {
    canonical: `${siteUrl}/journal/recipes`,
  },
  openGraph: {
    title: 'Artisanal Culinary Recipes Featuring California Almonds | RARE NUTS',
    description: 'Elevate your gastronomy with chef-crafted recipes featuring RARE NUTS California almonds.',
    url: `${siteUrl}/journal/recipes`,
    siteName: 'RARE NUTS',
    images: [{ url: '/images/roasted-almonds-jar.png', width: 1200, height: 630, alt: 'Artisanal Almond Recipes' }],
    type: 'article',
  },
};

export default function RecipesHub() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}/journal/recipes#article`,
    "headline": "Artisanal Culinary Recipes Featuring California Almonds and Gourmet Tree Nuts",
    "description": "Chef-developed gourmet recipes utilizing raw kernels, slow-roasted nuts, and natural nut butters.",
    "image": [`${siteUrl}/images/roasted-almonds-jar.png`],
    "datePublished": "2026-02-25T08:00:00+05:30",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "RARE NUTS Culinary Kitchen"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RARE NUTS",
      "logo": `${siteUrl}/images/og-rarenuts.png`
    },
    "mainEntityOfPage": `${siteUrl}/journal/recipes`
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <main className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText site-container">
        <Breadcrumbs items={[
          { label: "Home", url: "/" },
          { label: "The Journal", url: "/journal" },
          { label: "Culinary Recipes" }
        ]} />

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center my-12 space-y-6">
          <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-4 py-1.5 border border-luxuryGold/20 rounded-full inline-block">
            Haute Gastronomy • Chef’s Kitchen
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText tracking-tight leading-tight">
            Culinary Mastery: <span className="text-luxuryGold italic">Artisanal Almond Creations</span>
          </h1>
          <p className="text-secondaryText text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Transform reserve-grade California almonds into culinary masterpieces with these elevated, step-by-step epicurean recipes.
          </p>
        </header>

        {/* 3 Recipes Cards */}
        <section className="my-16 grid md:grid-cols-3 gap-8">
          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-luxuryGold uppercase tracking-widest">
                <span>Confectionery</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 20 Mins</span>
              </div>
              <h3 className="font-serif text-2xl text-primaryText">Velvety Raw Stone-Ground Almond Butter</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Made with 100% California Reserve Raw Almonds and a touch of Madagascar vanilla bean. Silky, pure, and free of palm oil or added sugars.
              </p>
            </div>
            <Link href="/shop/california-reserve-raw" className="text-xs text-luxuryGold font-medium tracking-wider hover:underline pt-4 block">
              Ingredient: California Reserve Raw &rarr;
            </Link>
          </div>

          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-luxuryGold uppercase tracking-widest">
                <span>Savory Appetizer</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 15 Mins</span>
              </div>
              <h3 className="font-serif text-2xl text-primaryText">Warm Rosemary & Smoked Salt Roasted Almonds</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Slow-roasted sea salt almonds tossed in fresh garden rosemary, cold-pressed olive oil, and smoked applewood sea salt flakes.
              </p>
            </div>
            <Link href="/shop/roasted-sea-salt-almonds" className="text-xs text-luxuryGold font-medium tracking-wider hover:underline pt-4 block">
              Ingredient: Slow-Roasted Sea Salt &rarr;
            </Link>
          </div>

          <div className="bg-secondaryBg/40 border border-luxuryGold/20 p-8 rounded-card space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-luxuryGold uppercase tracking-widest">
                <span>Haute Patisserie</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 45 Mins</span>
              </div>
              <h3 className="font-serif text-2xl text-primaryText">French Almond Financiers with Orange Blossom</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Traditional Parisian tea cakes crafted with finely milled California almond flour, beurre noisette (brown butter), and delicate orange blossom honey.
              </p>
            </div>
            <Link href="/shop/california-reserve-raw" className="text-xs text-luxuryGold font-medium tracking-wider hover:underline pt-4 block">
              Ingredient: California Raw Almonds &rarr;
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="my-20 bg-secondaryBg border border-luxuryGold/30 rounded-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">The Epicurean Standard</span>
            <h3 className="text-3xl font-serif text-primaryText">Slow-Roasted Sea Salt Almonds (500g Jar)</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Arrives in a thick culinary glass jar with metallic gold cap to seal in crunch and aroma.
            </p>
          </div>
          <Link href="/shop/roasted-sea-salt-almonds" className="luxury-button px-8 py-4 text-xs tracking-widest whitespace-nowrap">
            View Roasted Reserve <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
