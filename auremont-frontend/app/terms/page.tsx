import React from "react";
import { Metadata } from "next";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

export const metadata: Metadata = {
  title: "Terms of Service | RARE NUTS Luxury Almonds",
  description: "Read the terms and conditions governing purchases, orders, payments, intellectual property, and site usage at RARE NUTS.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    title: "Terms of Service | RARE NUTS",
    description: "Terms and conditions governing purchases and site usage at RARE NUTS.",
    url: `${siteUrl}/terms`,
    siteName: "RARE NUTS",
    images: [{ url: `${siteUrl}/images/og-rarenuts.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | RARE NUTS",
    description: "Terms and conditions governing purchases and site usage at RARE NUTS.",
    images: [`${siteUrl}/images/og-rarenuts.png`],
  },
};

export default function TermsPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Terms of Service", url: "/terms" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="w-full bg-background pt-32 pb-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbItems.map(i => ({ label: i.name, url: i.url }))} />
          
          <h1 className="text-4xl font-serif text-luxuryGold my-6 capitalize text-center">Terms of Service</h1>
          <p className="text-secondaryText text-sm text-center mb-12">Last updated: August 1, 2026</p>

          <div className="prose prose-invert prose-gold max-w-none text-secondaryText space-y-8">

            <section>
              <h2 className="text-2xl font-serif text-luxuryGold mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or purchasing from rarenuts.in (&ldquo;Site&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the Site immediately. These Terms apply to all visitors, customers, and registered users.</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-luxuryGold mb-4">2. Products &amp; Pricing</h2>
              <p>All prices are listed in INR / USD. RARE NUTS reserves the right to modify prices at any time without prior notice. Product descriptions and imagery are for illustrative purposes only. We have made every effort to display colors and packaging as accurately as possible, but cannot guarantee exact color reproduction on all display devices.</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-luxuryGold mb-4">3. Orders &amp; Payment</h2>
              <p className="mb-4">By placing an order, you represent that you are of legal age and authorized to use the payment method provided. RARE NUTS reserves the right to refuse or cancel any order at our sole discretion. In the event of order cancellation, any charges will be promptly refunded.</p>
              <p>Payments are processed securely via verified payment gateways (Razorpay). RARE NUTS does not store or have access to your full credit card details.</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-luxuryGold mb-4">4. Intellectual Property</h2>
              <p>All content on this Site — including text, graphics, logos, images, and software — is the exclusive property of RARE NUTS Luxury Almonds and is protected by applicable intellectual property laws. Reproduction, distribution, or commercial use of any content without express written consent is strictly prohibited.</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-luxuryGold mb-4">5. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law, RARE NUTS shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or Site. Our maximum aggregate liability to you shall not exceed the total amount paid for the relevant order.</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-luxuryGold mb-4">6. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-luxuryGold mb-4">7. Contact</h2>
              <p>For any questions regarding these Terms, please contact us at <span className="text-luxuryGold">legal@rarenuts.com</span>.</p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
