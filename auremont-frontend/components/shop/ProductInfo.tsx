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
      
      {/* Category & Origin Tags */}
      <div className="flex flex-wrap items-center gap-2.5">
        {product.category && (
          <Link 
            href={`/shop?category=${product.category.slug}`} 
            className="text-[11px] uppercase tracking-wider text-luxuryGold font-medium bg-luxuryGold/10 px-3 py-1 border border-luxuryGold/30 hover:bg-luxuryGold/20 transition-colors"
          >
            {product.category.name}
          </Link>
        )}
        <span className="text-[11px] uppercase tracking-wider text-zinc-300 border border-zinc-700/80 px-3 py-1 bg-secondaryBg/60">
          California Reserve 2026
        </span>
      </div>

      {/* Product Title */}
      <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-5xl leading-tight font-light text-primaryText tracking-tight">
        {product.name}
      </h1>

      {/* Star Rating & Review Count */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-2.5 pt-1">
          <StarRating rating={avgRating} size={15} />
          <span className="text-zinc-400 text-xs font-mono tracking-wide">
            {reviews.length} Client Review{reviews.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Price Section */}
      <div className="flex flex-wrap items-baseline gap-3.5 sm:gap-4 pt-2 border-y border-divider/80 py-5">
        <span suppressHydrationWarning className="text-3xl sm:text-4xl font-serif text-luxuryGold font-light">
          {formatPrice(displayPrice)}
        </span>
        {originalPrice && (
          <span suppressHydrationWarning className="text-zinc-400 line-through text-lg font-serif">
            {formatPrice(originalPrice)}
          </span>
        )}
        {product.salePrice && (
          <span className="bg-luxuryGold/15 text-luxuryGold border border-luxuryGold/30 text-[10px] px-2.5 py-1 uppercase tracking-widest font-mono">
            Bespoke Offer
          </span>
        )}
      </div>
      
      {/* Volume Discount Tier Pill */}
      <div className="p-3.5 sm:p-4 bg-secondaryBg/90 border border-luxuryGold/30 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm">
        <span className="text-xs tracking-wide text-zinc-200 font-sans flex items-center gap-2">
          <span className="text-base leading-none">🎁</span>
          <span>Buy 2+ Units: <strong className="text-luxuryGold font-medium">10% Extra Volume Discount</strong> Auto-Applied</span>
        </span>
        <span className="self-start sm:self-auto text-[10px] uppercase tracking-widest text-luxuryGold font-mono bg-luxuryGold/10 px-2.5 py-1 border border-luxuryGold/30 rounded whitespace-nowrap">
          Vault Special
        </span>
      </div>

      {/* Stock Status with stable glowing dot */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          {product.stockQty > 0 ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxuryGold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-luxuryGold shadow-[0_0_8px_rgba(212,175,55,0.9)]"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          )}
        </span>
        <span className="text-xs tracking-wider uppercase text-zinc-300 font-medium">
          {product.stockQty > 10 
            ? 'In Stock — Guaranteed Vault Dispatch' 
            : product.stockQty > 0 
            ? `Bespoke Allocation — Only ${product.stockQty} Units Remaining` 
            : 'Vault Depleted — Inquire Concierge'}
        </span>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base font-light pt-1">
          {product.shortDescription}
        </p>
      )}
    </div>
  );
}
