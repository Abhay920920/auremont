import JsonLd from "../JsonLd";

interface ProductSchemaProps {
  name: string;
  description: string;
  sku: string;
  image: string;
  price: number;
  currency?: string;
  inStock?: boolean;
  ratingValue?: number;
  reviewCount?: number;
  slug: string;
}

export default function ProductSchema({
  name,
  description,
  sku,
  image,
  price,
  currency = "INR",
  inStock = true,
  ratingValue,
  reviewCount,
  slug,
}: ProductSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "image": image.startsWith('http') ? image : `${siteUrl}${image}`,
    "description": description,
    "sku": sku,
    "mpn": sku,
    "brand": {
      "@type": "Brand",
      "name": "RARE NUTS"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/shop/${slug}`,
      "priceCurrency": currency,
      "price": price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "RARE NUTS"
      }
    },
    ...(reviewCount && reviewCount > 0 && ratingValue ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingValue,
        "reviewCount": reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    } : {})
  };

  return <JsonLd data={schema} />;
}
