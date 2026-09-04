import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmation | RARE NUTS",
  description: "Your order details and dispatch information.",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
