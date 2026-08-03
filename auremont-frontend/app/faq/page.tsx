export default function FAQPage() {
  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-serif text-luxuryGold mb-12 capitalize text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-12">
          {/* Section: Product & Sourcing */}
          <section>
            <h2 className="text-2xl font-serif text-primaryText mb-6 border-b border-luxuryGold/20 pb-2">Product & Sourcing</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-luxuryGold mb-2">Where do your almonds come from?</h3>
                <p className="text-secondaryText leading-relaxed">All Auremont almonds are exclusively grown in our family-owned orchards in California's Central Valley, ensuring absolute traceability and quality control.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-luxuryGold mb-2">Are your products organic?</h3>
                <p className="text-secondaryText leading-relaxed">Our orchards utilize regenerative and sustainable farming practices. While our entire crop is pesticide-free, we are currently in the final stages of official USDA Organic certification.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-luxuryGold mb-2">How long do the almonds stay fresh?</h3>
                <p className="text-secondaryText leading-relaxed">When kept in their airtight luxury packaging in a cool, dry place, our roasted almonds maintain peak freshness for up to 6 months.</p>
              </div>
            </div>
          </section>

          {/* Section: Orders & Shipping */}
          <section>
            <h2 className="text-2xl font-serif text-primaryText mb-6 border-b border-luxuryGold/20 pb-2">Orders & Shipping</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-luxuryGold mb-2">Do you ship internationally?</h3>
                <p className="text-secondaryText leading-relaxed">Yes, Auremont ships globally. International shipping rates are calculated dynamically at checkout based on destination and weight via our DHL Express integration.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-luxuryGold mb-2">Can I include a gift message?</h3>
                <p className="text-secondaryText leading-relaxed">Absolutely. During checkout, you may add a complimentary bespoke gift message, which will be printed on heavy-stock card and sealed with wax in your order.</p>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
