import React from "react";
import { Metadata } from "next";
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { Truck, ShieldCheck, ThermometerSun, Globe, Clock, PackageCheck } from 'lucide-react';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "White-Glove Shipping & Dispatch | RARE NUTS Luxury Almonds",
  description: "Learn about our climate-shield thermal packaging, domestic express shipping in India, and insured DHL worldwide priority delivery.",
  alternates: {
    canonical: `${siteUrl}/shipping`,
  },
  openGraph: {
    title: "White-Glove Shipping & Dispatch | RARE NUTS",
    description: "Insured express delivery, climate-shield packaging, and international dispatch.",
    url: `${siteUrl}/shipping`,
    siteName: "RARE NUTS",
    images: [{ url: `${siteUrl}/images/og-rarenuts.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "White-Glove Shipping & Dispatch | RARE NUTS",
    description: "Insured express delivery and climate-shield packaging.",
    images: [`${siteUrl}/images/og-rarenuts.png`],
  },
};

export default function ShippingPage() {
  const tiers = [
    {
      title: "Complimentary Domestic Express",
      time: "2 – 4 Business Days",
      price: "Complimentary on orders over ₹1,999",
      description: "Dispatched via premium express couriers (Blue Dart Apex & Delhivery Express) across 24,000+ PIN codes in India. Tamper-evident security packaging included."
    },
    {
      title: "Metro Next-Day Air Priority",
      time: "1 Business Day",
      price: "₹350 flat rate (or complimentary over ₹5,000)",
      description: "Guaranteed next-day air dispatch for orders placed before 1:00 PM IST to Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, and Kolkata."
    },
    {
      title: "Worldwide Express via DHL",
      time: "3 – 6 Business Days",
      price: "Dynamically calculated at checkout",
      description: "Insured door-to-door global express to the United States, United Kingdom, European Union, United Arab Emirates, Singapore, and 80+ nations."
    }
  ];

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Shipping & Dispatch", url: "/shipping" },
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
              <Truck size={12} />
              <span>White-Glove Logistics Charter</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight">
              Shipping & <span className="text-luxuryGold italic">Dispatch</span>
            </h1>
            <p className="text-secondaryText text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Every RARE NUTS consignment is prepared by hand in our climate-regulated fulfillment atelier and protected by specialized botanical transit seals.
            </p>
          </div>

          {/* Delivery Tiers Cards */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            {tiers.map((tier, idx) => (
              <div key={idx} className="p-6 bg-secondaryBg border border-divider hover:border-luxuryGold/40 rounded-card flex flex-col justify-between space-y-4 transition-all">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-luxuryGold font-mono block mb-2">{tier.time}</span>
                  <h2 className="font-serif text-lg text-primaryText">{tier.title}</h2>
                  <p className="text-luxuryGold text-xs font-mono font-medium mt-1">{tier.price}</p>
                  <p className="text-secondaryText text-xs leading-relaxed font-light mt-3">{tier.description}</p>
                </div>
                <div className="pt-3 border-t border-divider/60 flex items-center gap-2 text-mutedText text-[10px] uppercase tracking-wider">
                  <ShieldCheck size={12} className="text-luxuryGold" />
                  <span>Fully Insured Dispatch</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Sections */}
          <div className="space-y-12 my-16 text-sm text-secondaryText font-light leading-relaxed">
            
            {/* Section 1: Climate Shield */}
            <div className="bg-surface/60 border border-divider rounded-card p-8 space-y-4">
              <div className="flex items-center gap-3 text-luxuryGold">
                <ThermometerSun size={20} />
                <h2 className="font-serif text-xl text-primaryText">Climate-Shield Thermal Packaging</h2>
              </div>
              <p>
                Fine almonds are sensitive to sudden temperature fluctuations and high humidity. During warmer months and across equatorial transit corridors, all RARE NUTS consignments are automatically fitted with multi-layer metallic insulation barriers and non-toxic, food-grade cold retention gel cushions at zero additional charge.
              </p>
              <p>
                This ensures that delicate wood-roasted kernel oils remain stable and any chocolate-robed editions arrive without surface blooming or softening.
              </p>
            </div>

            {/* Section 2: Gifting Packaging & Inspection */}
            <div className="bg-surface/60 border border-divider rounded-card p-8 space-y-4">
              <div className="flex items-center gap-3 text-luxuryGold">
                <PackageCheck size={20} />
                <h2 className="font-serif text-xl text-primaryText">White-Glove Packing & Inspection</h2>
              </div>
              <p>
                Before any order departs our atelier, a master packaging artisan conducts a physical inspection: verifying jar vacuum seals, buffing solid mahogany chest exteriors, hand-tying grosgrain ribbons, and affixing the hot-stamped gold wax emblem.
              </p>
              <p>
                Orders containing customized corporate nameplates or handwritten gift notes receive a secondary verification against client order instructions.
              </p>
            </div>

            {/* Section 3: Global Customs & Duties */}
            <div className="bg-surface/60 border border-divider rounded-card p-8 space-y-4">
              <div className="flex items-center gap-3 text-luxuryGold">
                <Globe size={20} />
                <h2 className="font-serif text-xl text-primaryText">International Customs & Clearances</h2>
              </div>
              <p>
                International deliveries are handled directly via DHL Express Priority with continuous satellite tracking.
              </p>
              <ul className="list-disc pl-5 space-y-2 pt-1 text-xs sm:text-sm">
                <li><strong>Documentation:</strong> Every international parcel includes an official phytosanitary declaration and FDA/FSSAI compliant botanical origin documentation.</li>
                <li><strong>Duties & Import Taxes:</strong> In most regions (US, UAE, UK, EU), duties are calculated transparently at checkout. For countries where duties are levied at border arrival, DHL manages local clearance directly on the recipient&apos;s behalf.</li>
              </ul>
            </div>

            {/* Section 4: Dispatch Tracking */}
            <div className="bg-surface/60 border border-divider rounded-card p-8 space-y-4">
              <div className="flex items-center gap-3 text-luxuryGold">
                <Clock size={20} />
                <h2 className="font-serif text-xl text-primaryText">Dispatch Tracking & Signature Deliveries</h2>
              </div>
              <p>
                Upon dispatch from our Mumbai or California atelier, you will receive an immediate SMS and email notification featuring a direct live tracking link. Due to the high value of our heirloom presentation chests, high-tier orders require a recipient signature upon delivery.
              </p>
              <p>
                If you require scheduled delivery for a specific anniversary, gala, or holiday date, simply note your requested arrival window in the order instructions at checkout or contact <a href="mailto:concierge@rarenuts.com" className="text-luxuryGold underline underline-offset-4">concierge@rarenuts.com</a>.
              </p>
            </div>

          </div>

          {/* Bottom CTA */}
          <div className="text-center p-8 bg-secondaryBg border border-divider rounded-card space-y-4">
            <h3 className="font-serif text-2xl text-primaryText">Have a custom logistics request?</h3>
            <p className="text-secondaryText text-sm font-light max-w-md mx-auto">
              Our private client logistics desk accommodates multi-destination corporate drops, private courier hand-deliveries, and international embassy dispatches.
            </p>
            <div className="pt-2">
              <Link href="/contact" className="luxury-button text-xs px-8 py-3.5 uppercase tracking-widest inline-block font-medium">
                Inquire with Logistics Concierge
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
