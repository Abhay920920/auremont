import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import SquirrelLogo from '@/components/ui/SquirrelLogo';
import { Sparkles, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Luxury Diwali Gifts & Festive Nut Hampers | RARE NUTS',
  description: 'Celebrate Diwali with RARE NUTS luxury festive hampers. Hand-crafted wooden gift boxes filled with premium California almonds for family, friends, and esteemed business partners.',
  alternates: { canonical: 'https://rarenuts.in/gifting/diwali' },
};

export default function DiwaliGiftingPage() {
  return (
    <main className="min-h-screen bg-background text-primaryText pt-40 md:pt-32 pb-24 px-6 md:px-12 max-w-[1800px] mx-auto">
      <Breadcrumbs items={[{ label: "Home", url: "/" }, { label: "Gifting", url: "/gifting" }, { label: "Diwali" }]} />

      <section className="text-center max-w-4xl mx-auto my-12 space-y-6">
        <SquirrelLogo size={56} variant="badge" />
        <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight">
          Luxury <span className="text-luxuryGold italic">Diwali Gifting</span>
        </h1>
        <p className="text-luxuryGold font-serif italic text-lg">Exceptional by Nature. Distinct by Choice.</p>
        <p className="text-secondaryText text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
          Illuminate your Diwali celebrations with royal presentation chests of artisanal slow-roasted almonds, raw California kernels, and bespoke gold-embossed packaging.
        </p>
        <div className="pt-4">
          <Link href="/shop" className="inline-flex items-center gap-3 px-8 py-3.5 bg-luxuryGold text-black font-medium tracking-widest text-xs uppercase hover:bg-goldHover transition-colors">
            Browse Diwali Hampers <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="my-16 relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-card border border-luxuryGold/40">
        <Image src="/images/rarenuts-everyday-box-pouch-set.png" alt="RARE NUTS Festive Gift Box Set" fill className="object-cover filter brightness-90" />
      </section>
    </main>
  );
}
