import Link from "next/link";
import { Star } from "lucide-react";
import { useCurrencyStore } from "@/store/currencyStore";
import JsonLd from "@/components/JsonLd";

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={size} fill={star <= rating ? "currentColor" : "none"} className={star <= rating ? "text-luxuryGold" : "text-divider"} strokeWidth={1} />
      ))}
    </div>
  );
}

export default function ProductInfo({ product, reviews, avgRating }: { product: any, reviews: any[], avgRating: number }) {
  const { currency, formatPrice } = useCurrencyStore();

  const displayPrice = product.salePrice ? Number(product.salePrice) : Number(product.price);
  const originalPrice = product.salePrice ? Number(product.price) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.thumbnailUrl ? [`${siteUrl}${product.thumbnailUrl}`] : undefined,
    "description": product.shortDescription || product.description || "Luxury California Almonds crafted for discerning tastes.",
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": "RARE NUTS"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/shop/${product.slug}`,
      "priceCurrency": currency || "INR",
      "price": displayPrice,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stockQty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "RARE NUTS"
      }
    },
    ...(reviews.length > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": avgRating || 5,
        "reviewCount": reviews.length
      }
    })
  };

  return (
    <div className="space-y-6">
      <JsonLd data={productSchema} />
      <div className="flex flex-wrap items-center gap-3">
        {product.category && (
          <Link href={`/shop?category=${product.category.slug}`} className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-3 py-1 border border-luxuryGold/20">
            {product.category.name}
          </Link>
        )}
        <span className="text-[10px] uppercase tracking-ultra text-mutedText border border-divider px-3 py-1">
          California Reserve 2026
        </span>
      </div>

      <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl leading-[1.05] font-light text-primaryText tracking-tight">
        {product.name}
      </h1>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3 pt-1">
          <StarRating rating={avgRating} size={14} />
          <span className="text-secondaryText text-xs tracking-wider">{reviews.length} Client Review{reviews.length > 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="flex items-baseline gap-4 pt-2 border-y border-divider/60 py-6">
        <span suppressHydrationWarning className="text-3xl sm:text-4xl font-serif text-luxuryGold font-light">{formatPrice(displayPrice)}</span>
        {originalPrice && (
          <span suppressHydrationWarning className="text-mutedText line-through text-lg font-serif">{formatPrice(originalPrice)}</span>
        )}
        {product.salePrice && (
          <span className="bg-luxuryGold/10 text-luxuryGold text-[9px] px-3 py-1 rounded-sm uppercase tracking-ultra">Bespoke Offer</span>
        )}
      </div>
      
      {/* Volume Discount Tier Pill */}
      <div className="p-3 bg-secondaryBg border border-luxuryGold/30 rounded-card flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-primaryText font-mono">
          🎁 Buy 2+ Units: <strong className="text-luxuryGold">10% Extra Volume Discount</strong> Auto-Applied
        </span>
        <span className="text-[9px] uppercase tracking-ultra text-luxuryGold font-mono bg-luxuryGold/10 px-2 py-0.5 border border-luxuryGold/20 rounded">
          Vault Special
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${product.stockQty > 0 ? 'bg-luxuryGold animate-ping' : 'bg-red-500'}`} />
        <span className="text-[10px] tracking-ultra uppercase text-secondaryText">
          {product.stockQty > 10 ? 'In Stock — Guaranteed Vault Dispatch' : product.stockQty > 0 ? `Bespoke Allocation — Only ${product.stockQty} Units Remaining` : 'Vault Depleted — Inquire Concierge'}
        </span>
      </div>

      {product.shortDescription && (
        <p className="text-secondaryText leading-relaxed text-sm sm:text-base font-light pt-2">
          {product.shortDescription}
        </p>
      )}
    </div>
  );
}
