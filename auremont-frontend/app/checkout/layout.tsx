import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | RARE NUTS",
  description: "Complete your luxury almond order securely with 256-bit encryption.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
