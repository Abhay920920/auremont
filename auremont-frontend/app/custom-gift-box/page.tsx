import GiftBoxBuilder from "@/components/gift-builder/GiftBoxBuilder";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bespoke Gift Box Builder | Auremont",
  description: "Handcraft your personalized luxury almond gift set. Choose your mahogany box finish, reserve almond fillings, 24k gold laser engraving, and custom wax seal.",
};

export default function CustomGiftBoxPage() {
  return (
    <div className="w-full bg-background min-h-screen pt-36 pb-24">
      {/* Header */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <Breadcrumbs items={[
          { label: "Home", url: "/" },
          { label: "Shop", url: "/shop" },
          { label: "Bespoke Gift Builder" }
        ]} />

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
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 mt-24">
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
  );
}
