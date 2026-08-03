"use client";

import Link from "next/link";
import { Star } from "lucide-react";

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
  const displayPrice = product.salePrice ? Number(product.salePrice) : Number(product.price);
  const originalPrice = product.salePrice ? Number(product.price) : null;

  return (
    <div className="space-y-6">
      {product.category && (
        <Link href={`/shop?category=${product.category.slug}`} className="text-xs uppercase tracking-widest text-luxuryGold hover:underline">
          {product.category.name}
        </Link>
      )}

      <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.1] font-light text-primaryText">
        {product.name}
      </h1>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3">
          <StarRating rating={avgRating} size={16} />
          <span className="text-secondaryText text-sm tracking-wide">{reviews.length} Review{reviews.length > 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="flex items-baseline gap-4 pt-4">
        <span className="text-4xl font-serif text-luxuryGold">₹{displayPrice.toFixed(2)}</span>
        {originalPrice && (
          <span className="text-mutedText line-through text-xl font-serif">₹{originalPrice.toFixed(2)}</span>
        )}
        {product.salePrice && (
          <span className="bg-luxuryGold/10 text-luxuryGold text-[10px] px-3 py-1.5 rounded-sm uppercase tracking-widest ml-2">Sale</span>
        )}
      </div>
      
      <div className="flex items-center gap-2 pt-2">
        <div className={`w-1.5 h-1.5 rounded-full ${product.stockQty > 0 ? 'bg-luxuryGold' : 'bg-red-500'}`} />
        <span className="text-xs tracking-widest uppercase text-secondaryText">
          {product.stockQty > 10 ? 'In Stock / Ready to Ship' : product.stockQty > 0 ? `Limited Edition — ${product.stockQty} remaining` : 'Out of Stock'}
        </span>
      </div>

      {product.shortDescription && (
        <p className="text-secondaryText leading-relaxed text-lg font-light mt-6">
          {product.shortDescription}
        </p>
      )}
    </div>
  );
}
