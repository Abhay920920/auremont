import Link from 'next/link';
import Image from 'next/image';

export default function GiftBoxesPage() {
  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-luxuryGold mb-6 tracking-wide uppercase">The Gift Collections</h1>
          <p className="text-xl text-secondaryText max-w-2xl mx-auto font-light leading-relaxed">
            Discover our exquisite collection of premium almond gift boxes, meticulously designed for the ultimate unboxing experience.
          </p>
        </div>

        {/* The Unboxing Experience */}
        <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="h-96 rounded-2xl border border-luxuryGold/20 overflow-hidden relative shadow-2xl">
            <Image 
              src="/images/royal-almonds-wooden-box.png"
              alt="RARE NUTS Luxury Presentation Box"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/60 to-transparent"></div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-primaryText">An Unforgettable Reveal</h2>
            <p className="text-secondaryText leading-relaxed">
              Every RARE NUTS gift box is a testament to our dedication to presentation. Crafted from sustainably sourced European oak, our presentation cases feature brass hinges, a magnetic closure, and our signature gold-embossed crest. 
            </p>
            <p className="text-secondaryText leading-relaxed">
              Inside, the almonds rest in custom-molded velvet-lined compartments, preserving their integrity and delivering an auditory snap upon opening that signifies absolute freshness.
            </p>
            <Link href="/shop" className="inline-block border border-luxuryGold text-luxuryGold font-medium px-8 py-3 rounded-xl hover:bg-luxuryGold/10 transition-colors tracking-wide uppercase text-sm mt-4">
              Explore Collections
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
