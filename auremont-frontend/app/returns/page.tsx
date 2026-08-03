export default function ReturnsPage() {
  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-serif text-luxuryGold mb-12 capitalize text-center">Return & Exchange Policy</h1>
        
        <div className="prose prose-invert prose-gold max-w-none text-secondaryText">
          <p className="text-lg leading-relaxed text-primaryText mb-8">
            At Auremont, we hold our products to the absolute highest standard of luxury and culinary excellence. Our commitment to your satisfaction is paramount.
          </p>
          
          <h2 className="text-2xl font-serif text-luxuryGold mt-8 mb-4">The Auremont Guarantee</h2>
          <p className="mb-6">
            Due to the perishable nature of our artisanal food products, we generally do not accept returns. However, if your order arrives damaged, defective, or fails to meet our stringent quality standards, we will gladly arrange for a complimentary replacement or a full refund within 14 days of delivery.
          </p>

          <h2 className="text-2xl font-serif text-luxuryGold mt-8 mb-4">Reporting an Issue</h2>
          <p className="mb-4">To initiate a replacement or refund request, please contact our concierge team:</p>
          <ul className="list-disc pl-6 mb-8 space-y-2">
            <li>Email: concierge@auremont.com</li>
            <li>Please include your order number and photographic evidence of the issue.</li>
            <li>Our concierge will respond within 12 hours to resolve the matter via our white-glove service.</li>
          </ul>

          <h2 className="text-2xl font-serif text-luxuryGold mt-8 mb-4">Non-Returnable Items</h2>
          <p className="mb-6">
            Custom-engraved corporate gift boxes, bespoke flavor assortments, and opened perishable items are exempt from our standard refund policy unless the product is fundamentally compromised.
          </p>
        </div>
      </div>
    </div>
  );
}
