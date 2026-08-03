import Link from 'next/link';
import Image from 'next/image';

export default function CorporateGiftsPage() {
  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-luxuryGold mb-6 tracking-wide uppercase">Corporate Gifting</h1>
          <p className="text-xl text-secondaryText max-w-2xl mx-auto font-light leading-relaxed">
            Elevate your corporate relationships with bespoke Auremont almond assortments, presented in our signature luxury wooden boxes.
          </p>
        </div>

        {/* Hero Image */}
        <div className="w-full h-80 md:h-[450px] rounded-2xl border border-luxuryGold/20 mb-16 relative overflow-hidden shadow-2xl">
          <Image 
            src="/images/royal-almonds-wooden-box.png"
            alt="Auremont Royal Almonds Luxury Wooden Box"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <span className="text-luxuryGold font-serif italic text-2xl tracking-widest">Bespoke Curation</span>
            <span className="text-xs uppercase tracking-widest text-secondaryText bg-background/80 px-4 py-2 rounded-full border border-divider">Handcrafted Signature Line</span>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 border border-luxuryGold/10 rounded-2xl text-center bg-secondaryBg/40 backdrop-blur-sm">
            <h3 className="text-xl font-serif text-primaryText mb-4">Personalized Curation</h3>
            <p className="text-secondaryText leading-relaxed">Work with our concierge team to select the perfect flavor profiles and roast varieties for your clients.</p>
          </div>
          <div className="p-8 border border-luxuryGold/10 rounded-2xl text-center bg-secondaryBg/40 backdrop-blur-sm">
            <h3 className="text-xl font-serif text-primaryText mb-4">Custom Branding</h3>
            <p className="text-secondaryText leading-relaxed">Engrave your company logo alongside the Auremont crest on our handcrafted oak presentation boxes.</p>
          </div>
          <div className="p-8 border border-luxuryGold/10 rounded-2xl text-center bg-secondaryBg/40 backdrop-blur-sm">
            <h3 className="text-xl font-serif text-primaryText mb-4">Volume Privileges</h3>
            <p className="text-secondaryText leading-relaxed">Enjoy exclusive tiered pricing and dedicated white-glove logistical support for orders exceeding 50 units.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border-t border-luxuryGold/20 pt-16">
          <h2 className="text-3xl font-serif text-primaryText mb-6">Begin Your Order</h2>
          <p className="text-secondaryText mb-8 max-w-xl mx-auto">
            Contact our corporate concierge team to request a catalog, arrange a tasting, or discuss your bespoke requirements.
          </p>
          <Link href="/contact" className="inline-block bg-luxuryGold text-background font-medium px-8 py-4 rounded-xl hover:bg-goldHover transition-colors tracking-wide uppercase text-sm shadow-lg">
            Contact Concierge
          </Link>
        </div>

      </div>
    </div>
  );
}
