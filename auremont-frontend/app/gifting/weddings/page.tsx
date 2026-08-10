import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import SquirrelLogo from '@/components/ui/SquirrelLogo';
import { Gift, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Luxury Wedding Gifts & Custom Bridal Hampers | RARE NUTS',
  description: 'Bespoke wedding favors and luxury nut gift boxes for royal weddings. Customized brass plates, gold velvet lining, and hand-selected California almonds.',
  alternates: { canonical: 'https://rarenuts.in/gifting/weddings' },
};

export default function WeddingGiftingPage() {
  return (
    <main className="min-h-screen bg-background text-primaryText pt-40 md:pt-32 pb-24 px-6 md:px-12 max-w-[1800px] mx-auto">
      <Breadcrumbs items={[{ label: "Home", url: "/" }, { label: "Gifting", url: "/gifting" }, { label: "Weddings" }]} />

      <section className="text-center max-w-4xl mx-auto my-12 space-y-6">
        <SquirrelLogo size={56} variant="badge" />
        <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight">
          Luxury <span className="text-luxuryGold italic">Wedding Favors & Hampers</span>
        </h1>
        <p className="text-luxuryGold font-serif italic text-lg">Exceptional by Nature. Distinct by Choice.</p>
        <p className="text-secondaryText text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
          Elevate your wedding celebration with custom-carved mahogany favor boxes and personalized brass initials for your guests.
        </p>
        <div className="pt-4">
          <Link href="/custom-gift-box" className="inline-flex items-center gap-3 px-8 py-3.5 bg-luxuryGold text-black font-medium tracking-widest text-xs uppercase hover:bg-goldHover transition-colors">
            Design Custom Wedding Gift <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="my-16 relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-card border border-luxuryGold/40">
        <Image src="/images/royal-almonds-wooden-box.png" alt="RARE NUTS Wedding Gift Box" fill className="object-cover filter brightness-90" />
      </section>
    </main>
  );
}
