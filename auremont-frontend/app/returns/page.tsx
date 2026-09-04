import React from "react";
import { Metadata } from "next";
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "Culinary Guarantee & Returns Policy | RARE NUTS",
  description: "Read the RARE NUTS 100% culinary excellence guarantee. We provide immediate white-glove replacements or full refunds for damaged, unsealed, or unsatisfactory orders.",
  alternates: {
    canonical: `${siteUrl}/returns`,
  },
  openGraph: {
    title: "Culinary Guarantee & Returns Policy | RARE NUTS",
    description: "Our 100% culinary satisfaction pledge: rapid replacements and refunds with white-glove care.",
    url: `${siteUrl}/returns`,
    siteName: "RARE NUTS",
    images: [{ url: `${siteUrl}/images/og-rarenuts.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Culinary Guarantee & Returns Policy | RARE NUTS",
    description: "Our 100% culinary satisfaction pledge and white-glove replacement process.",
    images: [`${siteUrl}/images/og-rarenuts.png`],
  },
};

export default function ReturnsPage() {
  const steps = [
    {
      num: "01",
      title: "Contact Concierge Within 7 Days",
      desc: "Reach out via email to concierge@rarenuts.com or call our client helpline at 1800 890 4100 with your order number."
    },
    {
      num: "02",
      title: "Share Order Details & Photos",
      desc: "Provide a brief description of the transit damage or seal defect alongside a quick photo of the outer box and affected item."
    },
    {
      num: "03",
      title: "Immediate White-Glove Resolution",
      desc: "Our client care team will dispatch an expedited complimentary replacement via Next-Day Air or issue an instant refund to your original payment method."
    }
  ];

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Returns & Guarantee", url: "/returns" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText">
        <div className="site-container-reading">
          <Breadcrumbs items={breadcrumbItems.map(i => ({ label: i.name, url: i.url }))} />

          {/* Header */}
          <div className="text-center my-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-luxuryGold/25 bg-luxuryGold/5 text-luxuryGold text-[10px] uppercase tracking-ultra">
              <HeartHandshake size={12} />
              <span>The RARE NUTS Culinary Guarantee</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight">
              Returns & <span className="text-luxuryGold italic">Care Policy</span>
            </h1>
            <p className="text-secondaryText text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              At RARE NUTS, our dedication to exceptional craftsmanship and your total culinary delight is unconditional.
            </p>
          </div>

          {/* Pledge Card */}
          <div className="p-8 md:p-10 bg-secondaryBg border border-luxuryGold/30 rounded-card my-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-luxuryGold/[0.03] rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <ShieldCheck size={32} className="text-luxuryGold flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <h2 className="font-serif text-2xl sm:text-3xl text-primaryText">
                  The 100% Culinary Excellence Pledge
                </h2>
                <p className="text-secondaryText text-sm sm:text-base font-light leading-relaxed">
                  Because our reserve harvests are fresh, perishable artisanal foodstuffs, we take extreme pride in every single jar and presentation box that leaves our atelier. If your unboxing experience is anything less than immaculate—whether due to courier mishandling, a breached vacuum seal, or an imperfect flavor profile—we will make it right immediately.
                </p>
              </div>
            </div>
          </div>

          {/* 3-Step Resolution Flow */}
          <div className="my-16">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium">Simple 3-Step Process</span>
              <h2 className="text-2xl sm:text-3xl font-serif text-primaryText mt-1">How Our White-Glove Resolution Works</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, idx) => (
                <div key={idx} className="p-6 bg-surface border border-divider rounded-card flex flex-col justify-between space-y-4">
                  <div>
                    <span className="font-serif text-3xl text-luxuryGold block mb-2">{step.num}</span>
                    <h3 className="font-serif text-lg text-primaryText mb-2">{step.title}</h3>
                    <p className="text-secondaryText text-xs sm:text-sm font-light leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-divider/60 flex items-center gap-1.5 text-luxuryGold text-[10px] font-mono uppercase tracking-wider">
                    <CheckCircle2 size={12} />
                    <span>No Physical Return Required</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Specifics */}
          <div className="space-y-8 my-16 text-sm text-secondaryText font-light leading-relaxed">
            <div className="p-6 bg-secondaryBg/60 border border-divider rounded-card space-y-3">
              <h3 className="font-serif text-lg text-primaryText text-luxuryGold">Transit Damage & Seal Tampering</h3>
              <p>
                In the rare event that courier transit results in shattered glass, dented presentation chests, or broken wax seals, please photograph the parcel exterior and affected merchandise before discarding packaging. We will dispatch an identical replacement package immediately via Priority Express.
              </p>
            </div>

            <div className="p-6 bg-secondaryBg/60 border border-divider rounded-card space-y-3">
              <h3 className="font-serif text-lg text-primaryText text-luxuryGold">Custom Corporate & Bespoke Engraved Orders</h3>
              <p>
                Heirloom gift boxes personalized with laser-engraved names, custom corporate brass plaques, or bespoke ribbon colors are handcrafted specifically for you and cannot be returned for change of mind. However, our full quality guarantee still applies: if any personalized merchandise arrives defective or damaged, we will remanufacture and replace it without delay.
              </p>
            </div>

            <div className="p-6 bg-secondaryBg/60 border border-divider rounded-card space-y-3">
              <h3 className="font-serif text-lg text-primaryText text-luxuryGold">Refund Timeline & Methods</h3>
              <p>
                When a refund is approved by our concierge, credit is initiated immediately. Depending on your financial institution, domestic card refunds reflect within 3 to 5 business days, UPI refunds reflect within 24 hours, and international wire or credit card transactions reflect within 5 to 7 business days.
              </p>
            </div>
          </div>

          {/* Contact Concierge CTA */}
          <div className="text-center p-8 bg-secondaryBg border border-divider rounded-card space-y-4">
            <h3 className="font-serif text-2xl text-primaryText">Need Assistance With An Existing Order?</h3>
            <p className="text-secondaryText text-sm font-light max-w-md mx-auto">
              Our concierge team is standing by to assist with replacements, tracking updates, and questions.
            </p>
            <div className="pt-2 flex items-center justify-center gap-4">
              <a 
                href="mailto:concierge@rarenuts.com"
                className="luxury-button text-xs px-8 py-3.5 uppercase tracking-widest inline-block font-medium"
              >
                Email Concierge (concierge@rarenuts.com)
              </a>
              <Link 
                href="/contact"
                className="luxury-button-outline text-xs px-8 py-3.5 uppercase tracking-widest inline-block font-medium"
              >
                Inquiry Form
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
