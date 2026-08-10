"use client";

import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import SquirrelLogo from "@/components/ui/SquirrelLogo";
import { Gift, Award, ShieldCheck, ArrowRight, PackageCheck, Sparkles } from "lucide-react";

export default function GiftingPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.com';

  const giftingFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why do premium nuts make memorable luxury gifts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Premium nuts symbolize prosperity, health, and thoughtful care. Presented in velvet-lined mahogany chests with custom gold engraving, RARE NUTS creates an enduring impression far beyond traditional gifting."
        }
      },
      {
        "@type": "Question",
        "name": "Can RARE NUTS gift boxes be personalized with custom names or corporate logos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our Bespoke Gift Box Builder allows you to personalize solid brass plates with laser-engraved names, corporate emblems, or custom messages."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide white-glove corporate and festive gifting services across India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide nationwide express delivery across India with individual recipient tracking and concierge customization."
        }
      }
    ]
  };

  return (
    <>
      <JsonLd data={giftingFaqSchema} />
      
      <main className="min-h-screen bg-background text-primaryText pt-32 pb-24 px-6 md:px-12 max-w-[1800px] mx-auto">
        <Breadcrumbs items={[{ label: "Home", url: "/" }, { label: "Gifting", url: "/gifting" }]} />

        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto my-12 space-y-6">
          <SquirrelLogo size={56} variant="badge" />
          <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight leading-tight">
            The Art of <span className="text-luxuryGold italic">Luxury Gifting</span>
          </h1>
          <p className="text-luxuryGold font-serif italic text-lg sm:text-xl">
            Exceptional by Nature. Distinct by Choice.
          </p>
          <p className="text-secondaryText text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Purveyors of exceptionally sourced extra-large California almonds, slow-roasted to peak crunch and presented in velvet-lined mahogany presentation chests.
          </p>
        </section>

        {/* Gifting Occasions Grid */}
        <section className="my-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif text-luxuryGold uppercase tracking-widest">Curated Gifting Occasions</h2>
            <div className="w-16 h-0.5 bg-luxuryGold/40 mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/gifting/diwali" className="group border border-luxuryGold/30 bg-secondaryBg p-8 rounded-card hover:border-luxuryGold transition-all">
              <div className="flex items-center justify-between mb-4">
                <Sparkles className="text-luxuryGold" size={24} />
                <ArrowRight className="text-secondaryText group-hover:text-luxuryGold group-hover:translate-x-1 transition-all" size={18} />
              </div>
              <h3 className="font-serif text-xl text-primaryText mb-2 group-hover:text-luxuryGold transition-colors">Diwali & Festive</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Opulent festive gift boxes crafted for royal celebrations, family blessings, and corporate prosperity.
              </p>
            </Link>

            <Link href="/gifting/weddings" className="group border border-luxuryGold/30 bg-secondaryBg p-8 rounded-card hover:border-luxuryGold transition-all">
              <div className="flex items-center justify-between mb-4">
                <Gift className="text-luxuryGold" size={24} />
                <ArrowRight className="text-secondaryText group-hover:text-luxuryGold group-hover:translate-x-1 transition-all" size={18} />
              </div>
              <h3 className="font-serif text-xl text-primaryText mb-2 group-hover:text-luxuryGold transition-colors">Weddings & Bridal</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Bespoke favor boxes and grand wedding hampers personalized with monogrammed brass crests.
              </p>
            </Link>

            <Link href="/corporate-gifts" className="group border border-luxuryGold/30 bg-secondaryBg p-8 rounded-card hover:border-luxuryGold transition-all">
              <div className="flex items-center justify-between mb-4">
                <Award className="text-luxuryGold" size={24} />
                <ArrowRight className="text-secondaryText group-hover:text-luxuryGold group-hover:translate-x-1 transition-all" size={18} />
              </div>
              <h3 className="font-serif text-xl text-primaryText mb-2 group-hover:text-luxuryGold transition-colors">Corporate & Executive</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                White-glove business gifting for valued clients, executives, board members, and team appreciation.
              </p>
            </Link>

            <Link href="/custom-gift-box" className="group border border-luxuryGold/30 bg-secondaryBg p-8 rounded-card hover:border-luxuryGold transition-all">
              <div className="flex items-center justify-between mb-4">
                <PackageCheck className="text-luxuryGold" size={24} />
                <ArrowRight className="text-secondaryText group-hover:text-luxuryGold group-hover:translate-x-1 transition-all" size={18} />
              </div>
              <h3 className="font-serif text-xl text-primaryText mb-2 group-hover:text-luxuryGold transition-colors">Custom Gift Builder</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Design your custom gift chest with your choice of nut varieties, lining velvet, and brass plate text.
              </p>
            </Link>
          </div>
        </section>

        {/* Featured Presentation Image Banner */}
        <section className="my-20 relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-card border border-luxuryGold/40">
          <Image 
            src="/images/rarenuts-packaging-showcase.png"
            alt="RARE NUTS Luxury Gifting Presentation Suite"
            fill
            className="object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-8 md:p-12">
            <h2 className="text-3xl md:text-5xl font-serif text-primaryText mb-3">Uncompromising Presentation</h2>
            <p className="text-secondaryText max-w-xl font-light text-sm sm:text-base mb-6">
              Every RARE NUTS gift box features solid mahogany craftsmanship, hand-finished gold velvet lining, and our iconic gold squirrel seal of authenticity.
            </p>
            <div>
              <Link href="/shop" className="inline-flex items-center gap-3 px-8 py-3.5 bg-luxuryGold text-black font-medium tracking-widest text-xs uppercase hover:bg-goldHover transition-colors">
                Explore Gift Collections <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Gifting FAQ */}
        <section className="my-20 max-w-4xl mx-auto border-t border-divider pt-16">
          <h2 className="text-2xl sm:text-3xl font-serif text-luxuryGold text-center uppercase tracking-widest mb-12">Gifting FAQ</h2>
          <div className="space-y-8">
            <div className="bg-secondaryBg p-6 rounded-card border border-divider">
              <h3 className="text-lg font-serif text-primaryText mb-2">Why do premium nuts make memorable luxury gifts?</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Premium nuts symbolize health, longevity, and royal hospitality. Presented in velvet-lined mahogany chests with custom gold engraving, RARE NUTS creates an enduring impression for any occasion.
              </p>
            </div>
            <div className="bg-secondaryBg p-6 rounded-card border border-divider">
              <h3 className="text-lg font-serif text-primaryText mb-2">Can RARE NUTS gift boxes be personalized?</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Yes. Our Bespoke Gift Box Builder allows you to personalize solid brass plates with laser-engraved names, corporate emblems, or custom messages.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
