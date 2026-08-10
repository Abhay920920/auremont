export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-background pt-40 md:pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-serif text-luxuryGold mb-4 capitalize text-center">Privacy Policy</h1>
        <p className="text-secondaryText text-sm text-center mb-12">Last updated: August 1, 2026</p>

        <div className="prose prose-invert prose-gold max-w-none text-secondaryText space-y-8">

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">1. Information We Collect</h2>
            <p className="mb-4">When you place an order or create an account, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and shipping address</li>
              <li>Payment information (processed securely by Razorpay — we never store card details)</li>
              <li>Order history and product preferences</li>
              <li>Device and browser information for security and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use your information exclusively to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmation and shipping notifications</li>
              <li>Provide customer support</li>
              <li>Improve our products and website experience</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-4">We do not sell, trade, or rent your personal information to any third party for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">3. Cookies</h2>
            <p>We use strictly necessary cookies to maintain your session and shopping cart. We also use analytics cookies (anonymized) to understand how our website is used. You may disable cookies via your browser settings, though this may affect the functionality of the Site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data, including TLS 1.3 encryption in transit, bcrypt password hashing, and strict server access controls. While we strive for the highest security standards, no method of electronic transmission is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">5. Your Rights (GDPR & CCPA)</h2>
            <p className="mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to or restrict the processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-4">To exercise any of these rights, please email us at <span className="text-luxuryGold">privacy@rarenuts.com</span>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-luxuryGold mb-4">6. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last Updated" date. We encourage you to review this page periodically.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
