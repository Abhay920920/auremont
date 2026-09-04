import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | RARE NUTS",
  description: "The requested reserve harvest or page could not be located.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 bg-background pt-32 pb-16">
      <div className="max-w-md space-y-6">
        <p className="text-luxuryGold font-mono text-xs uppercase tracking-ultra">Error 404</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-primaryText tracking-tight">
          Page Not Found
        </h1>
        <p className="text-secondaryText text-sm leading-relaxed font-light">
          The reserve item or page you are seeking is either unavailable, has been relocated, or is no longer in season.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/shop" className="luxury-button text-xs py-3 px-8 w-full sm:w-auto text-center">
            Explore Collection
          </Link>
          <Link href="/" className="luxury-button-outline text-xs py-3 px-8 w-full sm:w-auto text-center">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
