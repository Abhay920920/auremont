export default function TermsPage() {
  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-serif text-luxuryGold mb-4 capitalize text-center">Terms of Service</h1>
        <p className="text-secondaryText text-sm text-center mb-12">Last updated: August 1, 2026</p>

        <div className="prose prose-invert prose-gold max-w-none text-secondaryText space-y-8">

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or purchasing from auremont.com ("Site"), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the Site immediately. These Terms apply to all visitors, customers, and registered users.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">2. Products & Pricing</h2>
            <p>All prices are listed in USD. Auremont reserves the right to modify prices at any time without prior notice. Product descriptions and imagery are for illustrative purposes only. We have made every effort to display colors and packaging as accurately as possible, but cannot guarantee exact color reproduction on all display devices.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">3. Orders & Payment</h2>
            <p className="mb-4">By placing an order, you represent that you are of legal age and authorized to use the payment method provided. Auremont reserves the right to refuse or cancel any order at our sole discretion. In the event of order cancellation, any charges will be promptly refunded.</p>
            <p>Payments are processed securely via Razorpay. Auremont does not store or have access to your full credit card details.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">4. Intellectual Property</h2>
            <p>All content on this Site — including text, graphics, logos, images, and software — is the exclusive property of Auremont Luxury Almonds and is protected by applicable intellectual property laws. Reproduction, distribution, or commercial use of any content without express written consent is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">5. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Auremont shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or Site. Our maximum aggregate liability to you shall not exceed the total amount paid for the relevant order.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">6. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">7. Contact</h2>
            <p>For any questions regarding these Terms, please contact us at <span className="text-luxuryGold">legal@auremont.com</span>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
