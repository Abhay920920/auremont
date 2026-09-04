import GiftBoxBuilder from "@/components/gift-builder/GiftBoxBuilder";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "Bespoke Gift Box Builder | RARE NUTS Luxury Studio",
  description: "Handcraft your personalized luxury almond gift set. Choose your mahogany box finish, reserve almond fillings, 24k gold laser engraving, and custom wax seal.",
  alternates: {
    canonical: `${siteUrl}/custom-gift-box`,
  },
  openGraph: {
    title: "Bespoke Gift Box Builder | RARE NUTS Luxury Studio",
    description: "Design an unforgettably elegant gift set with handcrafted mahogany chests and personalized brass engraving.",
    url: `${siteUrl}/custom-gift-box`,
    siteName: "RARE NUTS",
    images: [{ url: `${siteUrl}/images/royal-almonds-wooden-box.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bespoke Gift Box Builder | RARE NUTS",
    description: "Design an unforgettably elegant gift set with handcrafted mahogany chests.",
    images: [`${siteUrl}/images/royal-almonds-wooden-box.png`],
  },
};

export default function CustomGiftBoxPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: "Bespoke Gift Builder", url: "/custom-gift-box" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="w-full bg-background min-h-screen pt-32 pb-24">
        {/* Header */}
        <div className="site-container">
          <Breadcrumbs items={breadcrumbItems.map(i => ({ label: i.name, url: i.url }))} />

          <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
            <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-3.5 py-1 border border-luxuryGold/20 rounded-full inline-block">
              Concierge Customization Studio
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primaryText tracking-tight">
              The Bespoke Gift Builder
            </h1>
            <p className="text-secondaryText text-base font-light leading-relaxed">
              Design an unforgettably elegant gift set. Select your handcrafted vessel, curate reserve almond varieties, and personalize with 24k gold foil laser etching.
            </p>
          </div>
        </div>

        {/* Interactive Builder */}
        <GiftBoxBuilder />

        {/* Corporate Teaser */}
        <div className="site-container mt-24">
          <div className="bg-secondaryBg border border-luxuryGold/30 p-10 md:p-16 rounded-card flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl space-y-3">
              <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium">Corporate Concierge Service</span>
              <h3 className="font-serif text-3xl text-primaryText">Ordering 50+ Custom Gift Sets?</h3>
              <p className="text-secondaryText text-sm font-light leading-relaxed">
                Our corporate gifting team offers custom company logo debossing, volume pricing, and multi-address fulfillment worldwide.
              </p>
            </div>
            <Link href="/corporate-gifts" className="luxury-button text-xs tracking-ultra px-8 py-4 whitespace-nowrap">
              Inquire Bulk Corporate Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
