import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Bag | RARE NUTS",
  description: "View and manage items in your RARE NUTS shopping bag.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
