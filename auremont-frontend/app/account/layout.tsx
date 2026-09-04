import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal & Order History | RARE NUTS",
  description: "Manage your RARE NUTS account, addresses, and track active orders.",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
