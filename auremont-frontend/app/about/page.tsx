export default function AboutPage() {
  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif text-luxuryGold mb-6 tracking-wide uppercase">Our Heritage</h1>
          <p className="text-xl text-secondaryText max-w-2xl mx-auto font-light leading-relaxed">
            Discover the legacy, craftsmanship, and commitment to excellence behind Auremont, purveyors of the world's finest California almonds.
          </p>
        </div>

        {/* Section 1: The Origin */}
        <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-primaryText">Rooted in California Soil</h2>
            <p className="text-secondaryText leading-relaxed">
              Founded in the sun-drenched valleys of California, Auremont began with a singular vision: to elevate the humble almond into an unparalleled luxury experience. For over three generations, our family-owned orchards have cultivated a rare varietal of almond, celebrated for its buttery texture, delicate sweetness, and immaculate profile.
            </p>
            <p className="text-secondaryText leading-relaxed">
              We believe that true luxury takes time. Our trees are nurtured slowly, watered by Sierra Nevada snowmelt, and harvested at the precise moment of peak maturity.
            </p>
          </div>
          <div className="h-96 bg-cardBackground rounded-lg border border-luxuryGold/20 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-luxuryGold/10 to-transparent"></div>
            <span className="text-luxuryGold/40 font-serif italic text-2xl tracking-widest">Heritage</span>
          </div>
        </section>

        {/* Section 2: Craftsmanship */}
        <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="h-96 bg-cardBackground rounded-lg border border-luxuryGold/20 flex items-center justify-center overflow-hidden relative order-2 md:order-1">
            <div className="absolute inset-0 bg-gradient-to-bl from-luxuryGold/10 to-transparent"></div>
            <span className="text-luxuryGold/40 font-serif italic text-2xl tracking-widest">Craftsmanship</span>
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-serif text-primaryText">The Art of the Roast</h2>
            <p className="text-secondaryText leading-relaxed">
              Sourcing the finest almonds is only the beginning. Our master roasters employ proprietary, small-batch roasting techniques passed down through generations. Each batch is roasted slowly over sustainably sourced almond wood, ensuring an even, golden perfection that preserves the nut's essential oils and natural vitality.
            </p>
            <p className="text-secondaryText leading-relaxed">
              From the initial sorting to the final dusting of artisanal sea salt, every step of the Auremont process is executed by hand. We reject automation in favor of human intuition and craftsmanship.
            </p>
          </div>
        </section>

        {/* Section 3: Sustainability */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif text-primaryText">A Promise to the Earth</h2>
          <p className="text-secondaryText leading-relaxed">
            Luxury should never come at the expense of our planet. Auremont operates on a closed-loop sustainability model. We utilize advanced micro-irrigation to conserve water, power our facilities with 100% renewable solar energy, and package our collections in fully recyclable, bespoke materials. 
          </p>
          <p className="text-secondaryText leading-relaxed">
            When you choose Auremont, you are choosing a brand that respects the earth as much as it respects the palate.
          </p>
        </section>

      </div>
    </div>
  );
}
