import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rarenuts.in";
const DEFAULT_BRAND = "RARE NUTS";
const DEFAULT_TAGLINE = "Exceptional by Nature. Distinct by Choice.";
const DEFAULT_OG_IMAGE = "/images/og-rarenuts.png";

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}

/**
 * Enterprise Next.js Metadata Generator
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
  type = "website",
}: BuildMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = title.includes(DEFAULT_BRAND) ? title : `${title} | ${DEFAULT_BRAND}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: DEFAULT_BRAND,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${DEFAULT_BRAND} — ${DEFAULT_TAGLINE}`,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Enterprise Organization JSON-LD Schema Builder
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": DEFAULT_BRAND,
    "legalName": `${DEFAULT_BRAND} Private Limited`,
    "url": SITE_URL,
    "logo": `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    "description": "Luxury gourmet nuts and premium gifting brand.",
    "slogan": DEFAULT_TAGLINE,
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "concierge@rarenuts.com",
      "contactType": "customer service"
    }
  };
}

/**
 * Enterprise Product JSON-LD Schema Builder
 */
export function getProductSchema(product: {
  id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  price: number;
  currency?: string;
  sku?: string;
  inStock?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/shop/${product.slug}/#product`,
    "name": product.name,
    "description": product.description,
    "image": product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`,
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": DEFAULT_BRAND
    },
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/shop/${product.slug}`,
      "priceCurrency": product.currency || "INR",
      "price": product.price,
      "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": DEFAULT_BRAND
      }
    }
  };
}
