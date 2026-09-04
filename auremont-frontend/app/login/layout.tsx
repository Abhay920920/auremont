import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Sign In | RARE NUTS",
  description: "Sign in to your private RARE NUTS account.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
