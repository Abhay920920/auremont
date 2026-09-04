import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | RARE NUTS",
  description: "Join RARE NUTS for private reserve allocations and order tracking.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
