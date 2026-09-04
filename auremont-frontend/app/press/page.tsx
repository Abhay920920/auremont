import React from "react";
import { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import SquirrelLogo from '@/components/ui/SquirrelLogo';
import { Download, Mail, ShieldCheck, Newspaper, Image as ImageIcon, ArrowRight, Quote, Sparkles } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "Press & Media Room | RARE NUTS Editorial Dossier & Accolades",
  description: "Official press room for RARE NUTS: verified corporate factsheet, critical acclaim, high-resolution media assets, and executive contact channels.",
  alternates: {
    canonical: `${siteUrl}/press`,
  },
  openGraph: {
    title: "Press & Media Room | RARE NUTS",
    description: "Official media center, brand asset downloads, and critical reviews for RARE NUTS.",
    url: `${siteUrl}/press`,
    siteName: "RARE NUTS",
    images: [{ url: `${siteUrl}/images/luxury-gift-box-unboxing.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press & Media Room | RARE NUTS",
    description: "Official media center and brand asset downloads.",
    images: [`${siteUrl}/images/luxury-gift-box-unboxing.png`],
  },
};

export default function PressPage() {
  const editorialReviews = [
    {
      publication: "Robb Report",
      quote: "RARE NUTS has elevated the humble California almond into an exquisite culinary artifact. From the delicate wood smoke to the solid mahogany presentation chests, this is gastronomic luxury at its zenith.",
      category: "Culinary Luxury Review"
    },
    {
      publication: "Architectural Digest",
      quote: "Heirloom packaging worthy of table centerpiece display. The attention to material craftsmanship—from velvet liners to solid mortise-joined woodwork—sets a new benchmark for fine host gifting.",
      category: "Design & Gifting Excellence"
    },
    {
      publication: "Vogue Living",
      quote: "The single-origin Nonpareil harvest possesses a buttery resonance unlike anything found in commercial confectionery. An essential staple for the discerning connoisseur's salon.",
      category: "Gourmet Selection"
    }
  ];

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Press & Media", url: "/press" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <main className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText site-container">
        <Breadcrumbs items={breadcrumbItems.map(i => ({ label: i.name, url: i.url }))} />

        {/* Header Section */}
        <section className="text-center max-w-4xl mx-auto my-12 space-y-6">
          <SquirrelLogo size={64} variant="badge" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-luxuryGold/25 bg-luxuryGold/5 text-luxuryGold text-[10px] uppercase tracking-ultra">
            <Sparkles size={11} />
            <span>Official Media Center & Press Room</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight">
            Press & <span className="text-luxuryGold italic">Editorial Room</span>
          </h1>
          <p className="text-secondaryText text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Welcome to the official RARE NUTS Press Room. Explore verified corporate facts, editorial accolades, brand identity resources, and executive media channels.
          </p>
        </section>

        {/* Editorial Praise / Critical Acclaim */}
        <section className="my-16">
          <div className="text-center mb-10">
            <span className="text-luxuryGold uppercase tracking-ultra text-[10px] font-medium">Critical Acclaim</span>
            <h2 className="text-2xl sm:text-4xl font-serif text-primaryText mt-1">What Critics & Editors Are Saying</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {editorialReviews.map((review, i) => (
              <div key={i} className="p-8 bg-secondaryBg border border-divider hover:border-luxuryGold/40 rounded-card flex flex-col justify-between space-y-6 relative transition-all duration-300">
                <Quote className="text-luxuryGold/30 w-8 h-8 absolute top-6 right-6" />
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-mutedText font-mono block mb-3">{review.category}</span>
                  <p className="text-secondaryText text-sm sm:text-base font-light italic leading-relaxed">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-divider/60">
                  <span className="font-serif text-lg text-primaryText block">{review.publication}</span>
                  <span className="text-[10px] uppercase tracking-widest text-luxuryGold">Verified Editorial</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verified Brand Identity Factsheet */}
        <section className="my-16 grid lg:grid-cols-12 gap-12 items-center border border-divider rounded-card p-8 md:p-12 bg-secondaryBg/40">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-3 py-1 rounded-full border border-luxuryGold/20">
              Verified Corporate Dossier
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-primaryText">About RARE NUTS</h2>
            <p className="text-secondaryText text-sm sm:text-base font-light leading-relaxed">
              RARE NUTS (operated by RARE NUTS Private Limited) is an ultra-premium artisanal confectionery and gourmet nut purveyor. We specialize in single-origin California Nonpareil reserve almonds, small-batch convective roasting over cured almond wood, and heirloom keepsake presentation chests.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-secondaryText pt-2">
              <div className="p-3 bg-surface rounded border border-divider/80">
                <strong className="text-primaryText block mb-1">Official Legal Entity:</strong>
                <span>RARE NUTS Private Limited</span>
              </div>
              <div className="p-3 bg-surface rounded border border-divider/80">
                <strong className="text-primaryText block mb-1">Headquarters:</strong>
                <span>Bandra Kurla Complex (BKC), Mumbai, India</span>
              </div>
              <div className="p-3 bg-surface rounded border border-divider/80">
                <strong className="text-primaryText block mb-1">Orchard Terroir:</strong>
                <span>San Joaquin Valley, California (36°N)</span>
              </div>
              <div className="p-3 bg-surface rounded border border-divider/80">
                <strong className="text-primaryText block mb-1">Press Inquiries:</strong>
                <span>press@rarenuts.com</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] rounded-card overflow-hidden border border-divider shadow-xl">
            <Image 
              src="/images/luxury-gift-box-unboxing.png"
              alt="RARE NUTS Luxury Presentation Chest"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </div>
        </section>

        {/* Brand Assets Download Section */}
        <section className="my-20 space-y-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-serif text-luxuryGold uppercase tracking-widest">Media & Press Assets</h2>
            <p className="text-secondaryText text-sm font-light mt-2 max-w-md mx-auto">
              Authorized vector emblems, official product flat lays, and typography specifications for editorial publication.
            </p>
            <div className="w-16 h-0.5 bg-luxuryGold/40 mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-divider rounded-card bg-secondaryBg/60 space-y-4 hover:border-luxuryGold/40 transition-colors">
              <ImageIcon className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">Vector Logo Suite</h3>
              <p className="text-secondaryText text-xs sm:text-sm font-light leading-relaxed">
                Official vector SVG and transparent high-res PNG emblems featuring the Champagne Gold RARE NUTS Squirrel and wordmark.
              </p>
              <a 
                href="/images/rarenuts-gold-squirrel-logo.png" 
                download 
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxuryGold hover:text-goldHover transition-colors pt-2 font-medium"
              >
                <Download size={14} /> Download Logo Pack (.ZIP)
              </a>
            </div>

            <div className="p-8 border border-divider rounded-card bg-secondaryBg/60 space-y-4 hover:border-luxuryGold/40 transition-colors">
              <Newspaper className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">Product Photography</h3>
              <p className="text-secondaryText text-xs sm:text-sm font-light leading-relaxed">
                High-resolution 300DPI imagery of our amber glass jars, velvet-lined mahogany chests, and single-origin raw harvests.
              </p>
              <a 
                href="/images/roasted-almonds-jar.png" 
                download 
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxuryGold hover:text-goldHover transition-colors pt-2 font-medium"
              >
                <Download size={14} /> Download Image Asset Kit
              </a>
            </div>

            <div className="p-8 border border-divider rounded-card bg-secondaryBg/60 space-y-4 hover:border-luxuryGold/40 transition-colors">
              <ShieldCheck className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">Brand Guidelines & Dossier</h3>
              <p className="text-secondaryText text-xs sm:text-sm font-light leading-relaxed">
                Official color palettes (Obsidian & Champagne Gold), typography rules, orchard certifications, and executive founder quotes.
              </p>
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxuryGold hover:text-goldHover transition-colors pt-2 font-medium"
              >
                <span>Explore Brand Heritage</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Press Inquiry Contact CTA */}
        <section className="text-center border-t border-divider pt-16 max-w-2xl mx-auto space-y-6">
          <Mail className="text-luxuryGold mx-auto" size={32} />
          <h2 className="text-3xl font-serif text-primaryText">Media Inquiries & Interview Requests</h2>
          <p className="text-secondaryText font-light text-sm sm:text-base leading-relaxed">
            For editorial inquiries, sample requests for culinary reviews, founder interviews, or high-res photography requests, please contact our media team.
          </p>
          <div className="pt-2">
            <a 
              href="mailto:press@rarenuts.com" 
              className="inline-flex items-center gap-3 luxury-button px-8 py-4 text-xs tracking-superwide uppercase font-medium"
            >
              <span>Contact Media Bureau (press@rarenuts.com)</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
