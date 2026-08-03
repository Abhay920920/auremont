export default function ShippingPage() {
  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-serif text-luxuryGold mb-12 capitalize text-center">Shipping & Delivery</h1>
        
        <div className="prose prose-invert prose-gold max-w-none text-secondaryText">
          <p className="text-lg leading-relaxed text-primaryText mb-8">
            Every Auremont order is handled with white-glove precision. To ensure your luxury almonds arrive in pristine condition, we partner exclusively with premium couriers.
          </p>
          
          <h2 className="text-2xl font-serif text-luxuryGold mt-8 mb-4">Domestic Delivery (United States)</h2>
          <ul className="list-disc pl-6 mb-8 space-y-4">
            <li><strong>Standard Priority:</strong> Complimentary on all orders. Delivery within 3-5 business days.</li>
            <li><strong>Express Overnight:</strong> Available for a flat rate of $25. Orders placed before 1 PM PST will arrive the following business day.</li>
          </ul>

          <h2 className="text-2xl font-serif text-luxuryGold mt-8 mb-4">International Delivery</h2>
          <p className="mb-4">We are pleased to offer secure, insured global shipping via DHL Express.</p>
          <ul className="list-disc pl-6 mb-8 space-y-4">
            <li><strong>Global Priority:</strong> Rates dynamically calculated at checkout. Delivery typically within 4-7 business days depending on customs clearance.</li>
            <li><em>Note: Import duties, taxes, and customs clearance fees are the sole responsibility of the recipient.</em></li>
          </ul>

          <h2 className="text-2xl font-serif text-luxuryGold mt-8 mb-4">Climate-Controlled Logistics</h2>
          <p className="mb-6">
            During peak summer months, our shipments are automatically insulated and packed with cold-retention materials at no extra charge, preventing our delicate chocolate-robed collections from blooming or melting in transit.
          </p>
        </div>
      </div>
    </div>
  );
}
