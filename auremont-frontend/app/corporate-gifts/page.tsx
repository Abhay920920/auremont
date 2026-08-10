"use client";

import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import SquirrelLogo from '@/components/ui/SquirrelLogo';
import { Award, Briefcase, Users, Sparkles, Box, ShieldCheck, Mail, ArrowRight, PackageCheck } from 'lucide-react';

import CorporateQuoteEstimator from "@/components/corporate/CorporateQuoteEstimator";

export default function CorporateGiftsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.com';

  return (
    <>
      <main className="w-full bg-background pt-24 md:pt-32 pb-24 min-h-screen text-primaryText px-6 md:px-12 max-w-[1800px] mx-auto">
        <Breadcrumbs items={[{ label: "Home", url: "/" }, { label: "Corporate Gifting" }]} />

        {/* Hero Header */}
        <section className="text-center max-w-4xl mx-auto my-12 space-y-6">
          <SquirrelLogo size={56} variant="badge" />
          <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight">
            Luxury <span className="text-luxuryGold italic">Corporate Gifting</span>
          </h1>
          <p className="text-luxuryGold font-serif italic text-lg sm:text-xl">
            Exceptional by Nature. Distinct by Choice.
          </p>
          <p className="text-secondaryText text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Elevate business relationships with bespoke RARE NUTS almond assortments, presented in velvet-lined mahogany chests with custom-engraved company logos.
          </p>
        </section>

        {/* Featured Hero Banner */}
        <section className="w-full h-[350px] md:h-[500px] rounded-card border border-luxuryGold/30 my-12 relative overflow-hidden shadow-2xl">
          <Image 
            src="/images/royal-almonds-wooden-box.png"
            alt="RARE NUTS Executive Corporate Gifting Mahogany Chest"
            fill
            className="object-cover filter brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-luxuryGold font-serif italic text-2xl tracking-widest block">Executive Distinction</span>
              <span className="text-xs uppercase tracking-widest text-secondaryText">Bespoke Corporate Curation</span>
            </div>
            <Link href="#quote-estimator" className="px-8 py-3 bg-luxuryGold text-black font-medium tracking-widest text-xs uppercase hover:bg-goldHover transition-colors">
              Request Corporate Catalog
            </Link>
          </div>
        </section>

        {/* 8 Structured Corporate Sections */}
        <section className="my-20 space-y-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif text-luxuryGold uppercase tracking-widest">Tailored Corporate Solutions</h2>
            <div className="w-16 h-0.5 bg-luxuryGold/40 mx-auto mt-3"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 border border-luxuryGold/20 rounded-card bg-secondaryBg/40 space-y-3">
              <Award className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">1. Executive Gifting</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Handcrafted solid mahogany presentation boxes designed for C-suite executives, board directors, and key stakeholders.
              </p>
            </div>

            <div className="p-8 border border-luxuryGold/20 rounded-card bg-secondaryBg/40 space-y-3">
              <Briefcase className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">2. Client Appreciation</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Express gratitude and strengthen business partnerships with curated reserve roasts and gold-stamped luxury pouches.
              </p>
            </div>

            <div className="p-8 border border-luxuryGold/20 rounded-card bg-secondaryBg/40 space-y-3">
              <Users className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">3. Employee Rewards</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Celebrate milestones, work anniversaries, and high performers with premium health-focused gourmet gifts.
              </p>
            </div>

            <div className="p-8 border border-luxuryGold/20 rounded-card bg-secondaryBg/40 space-y-3">
              <Sparkles className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">4. Festive Corporate Gifting</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Bespoke Diwali, New Year, and festival hampers combining raw California kernels and roasted sea salt almonds.
              </p>
            </div>

            <div className="p-8 border border-luxuryGold/20 rounded-card bg-secondaryBg/40 space-y-3">
              <Box className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">5. Custom Packaging</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Choose between rigid matte black gift boxes, wooden presentation chests, and gold foil embossed gift sleeves.
              </p>
            </div>

            <div className="p-8 border border-luxuryGold/20 rounded-card bg-secondaryBg/40 space-y-3">
              <ShieldCheck className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">6. Laser Personalization</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Engrave company logos, individual recipient names, or personalized greetings on solid brass lid plates.
              </p>
            </div>

            <div className="p-8 border border-luxuryGold/20 rounded-card bg-secondaryBg/40 space-y-3">
              <PackageCheck className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">7. Bulk Order Privileges</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Enjoy tiered pricing privileges, customized gift note insertion, and multi-address fulfillment support.
              </p>
            </div>

            <div className="p-8 border border-luxuryGold/20 rounded-card bg-secondaryBg/40 space-y-3">
              <Mail className="text-luxuryGold" size={28} />
              <h3 className="text-xl font-serif text-primaryText">8. Concierge Service</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Dedicated corporate account managers to assist with sampling, logistics, and individual tracking across India.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Corporate Bulk Quote Estimator */}
        <div id="quote-estimator">
          <CorporateQuoteEstimator />
        </div>

        {/* CTA Contact Inquiry */}
        <section className="text-center border-t border-divider pt-16 max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif text-primaryText">Connect with Corporate Concierge</h2>
          <p className="text-secondaryText font-light">
            Contact our corporate team at <span className="text-luxuryGold">concierge@rarenuts.com</span> to discuss bulk orders, request a tasting kit, or arrange custom branding.
          </p>
          <div>
            <Link href="/contact" className="inline-flex items-center gap-3 bg-luxuryGold text-black font-medium px-8 py-4 rounded-card hover:bg-goldHover transition-colors tracking-widest uppercase text-xs">
              Inquire Corporate Gifting <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
