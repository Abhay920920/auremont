"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Rotate3d } from "lucide-react";
import FlavorRadarChart from "./FlavorRadarChart";
import Packaging3DViewer from "./Packaging3DViewer";
import { useCurrencyStore } from "@/store/currencyStore";

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={size} fill={star <= rating ? "currentColor" : "none"} className={star <= rating ? "text-luxuryGold" : "text-divider"} strokeWidth={1} />
      ))}
    </div>
  );
}

import JsonLd from "@/components/JsonLd";

export default function ProductInfo({ product, reviews, avgRating }: { product: any, reviews: any[], avgRating: number }) {
  const { currency, formatPrice } = useCurrencyStore();
  const [is3DOpen, setIs3DOpen] = useState(false);

  const displayPrice = product.salePrice ? Number(product.salePrice) : Number(product.price);
  const originalPrice = product.salePrice ? Number(product.price) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://auremont.com';

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.thumbnailUrl ? [`${siteUrl}${product.thumbnailUrl}`] : undefined,
    "description": product.shortDescription || product.description || "Luxury California Almonds crafted for discerning tastes.",
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": "Auremont"
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
        "name": "Auremont"
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

      {/* 3D Packaging Inspector Trigger Button */}
      <div className="pt-2">
        <button
          onClick={() => setIs3DOpen(true)}
          className="luxury-button-outline w-full flex items-center justify-center gap-2.5 py-3 text-xs tracking-ultra border-luxuryGold/40 hover:bg-luxuryGold/10 text-luxuryGold"
        >
          <Rotate3d size={16} />
          <span>Inspect 3D Vessel & Engraving</span>
        </button>
      </div>

      {/* Interactive Botanical Flavor & Texture Radar Chart */}
      <div className="pt-4">
        <FlavorRadarChart />
      </div>

      {/* 3D Packaging Viewer Modal */}
      <Packaging3DViewer 
        isOpen={is3DOpen} 
        onClose={() => setIs3DOpen(false)} 
        defaultText={product.name.toUpperCase()}
      />
    </div>
  );
}
