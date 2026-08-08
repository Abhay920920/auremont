"use client";

import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import SquirrelLogo from '@/components/ui/SquirrelLogo';
import { Download, Mail, ShieldCheck, Newspaper, Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function PressPage() {
  return (
    <main className="w-full bg-background pt-24 md:pt-32 pb-24 min-h-screen text-primaryText px-6 md:px-12 max-w-[1800px] mx-auto">
      <Breadcrumbs items={[{ label: "Home", url: "/" }, { label: "Press & Media" }]} />

      {/* Header */}
      <section className="text-center max-w-4xl mx-auto my-12 space-y-6">
        <SquirrelLogo size={56} variant="badge" />
        <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight">
          Press & <span className="text-luxuryGold italic">Media Room</span>
        </h1>
        <p className="text-luxuryGold font-serif italic text-lg sm:text-xl">
          Exceptional by Nature. Distinct by Choice.
        </p>
        <p className="text-secondaryText text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
          Welcome to the official RARE NUTS Press Room. Find high-resolution brand assets, verified corporate information, product photography, and media inquiry channels.
        </p>
      </section>

      {/* Verified Brand Identity Overview */}
      <section className="my-16 grid md:grid-cols-2 gap-12 items-center border border-luxuryGold/20 rounded-card p-8 md:p-12 bg-secondaryBg/40">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-luxuryGold font-medium">Verified Brand Factsheet</span>
          <h2 className="text-3xl font-serif text-primaryText">About RARE NUTS</h2>
          <p className="text-secondaryText text-sm sm:text-base font-light leading-relaxed">
            RARE NUTS (operated by RARE NUTS Private Limited) is an ultra-premium gourmet almond and luxury gifting house. We specialize in extra-large California almonds, artisanal slow-roasting, and velvet-lined solid mahogany gift packaging.
          </p>
          <div className="space-y-3 text-sm text-secondaryText pt-2">
            <p><strong className="text-primaryText">Official Legal Entity:</strong> RARE NUTS Private Limited</p>
            <p><strong className="text-primaryText">Official Website:</strong> https://rarenuts.in</p>
            <p><strong className="text-primaryText">Primary Categories:</strong> Gourmet Nuts, Raw California Almonds, Slow-Roasted Sea Salt Almonds, Bespoke Corporate Gifting</p>
            <p><strong className="text-primaryText">Media Contact:</strong> press@rarenuts.com / concierge@rarenuts.com</p>
          </div>
        </div>

        <div className="relative aspect-[4/3] rounded-card overflow-hidden border border-divider">
          <Image 
            src="/images/og-rarenuts.png"
            alt="RARE NUTS Official Brand Banner"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Brand Assets Download Section */}
      <section className="my-20 space-y-12">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-serif text-luxuryGold uppercase tracking-widest">Media & Press Assets</h2>
          <div className="w-16 h-0.5 bg-luxuryGold/40 mx-auto mt-3"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 border border-divider rounded-card bg-secondaryBg/30 space-y-4">
            <ImageIcon className="text-luxuryGold" size={28} />
            <h3 className="text-xl font-serif text-primaryText">High-Res Brand Logos</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Official vector SVG and PNG logos featuring the Metallic Gold Squirrel Emblem and RARE NUTS typography.
            </p>
            <a href="/images/rarenuts-gold-squirrel-logo.png" download className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxuryGold hover:text-goldHover transition-colors pt-2">
              <Download size={14} /> Download Logo Pack
            </a>
          </div>

          <div className="p-8 border border-divider rounded-card bg-secondaryBg/30 space-y-4">
            <Newspaper className="text-luxuryGold" size={28} />
            <h3 className="text-xl font-serif text-primaryText">Product Photography</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              High-resolution 8K imagery of our presentation gift boxes, pouches, glass jars, and mahogany chests.
            </p>
            <a href="/images/rarenuts-everyday-box-pouch-set.png" download className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxuryGold hover:text-goldHover transition-colors pt-2">
              <Download size={14} /> Download Product Photos
            </a>
          </div>

          <div className="p-8 border border-divider rounded-card bg-secondaryBg/30 space-y-4">
            <ShieldCheck className="text-luxuryGold" size={28} />
            <h3 className="text-xl font-serif text-primaryText">Corporate Brand Guidelines</h3>
            <p className="text-secondaryText text-sm font-light leading-relaxed">
              Official color palettes, typography specifications, logo usage guidelines, and brand positioning rules.
            </p>
            <Link href="/about" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxuryGold hover:text-goldHover transition-colors pt-2">
              View Brand Heritage <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Press Inquiry Contact CTA */}
      <section className="text-center border-t border-divider pt-16 max-w-2xl mx-auto space-y-6">
        <Mail className="text-luxuryGold mx-auto" size={32} />
        <h2 className="text-3xl font-serif text-primaryText">Media Inquiries & Interviews</h2>
        <p className="text-secondaryText font-light text-sm sm:text-base">
          For press inquiries, editorial features, product sample requests for reviews, or executive interview requests, please contact our media team.
        </p>
        <div>
          <a href="mailto:press@rarenuts.com" className="inline-flex items-center gap-3 bg-luxuryGold text-black font-medium px-8 py-4 rounded-card hover:bg-goldHover transition-colors tracking-widest uppercase text-xs">
            Contact Press Office <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </main>
  );
}
