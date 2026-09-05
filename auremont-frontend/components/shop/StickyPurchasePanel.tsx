"use client";

import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

export default function StickyPurchasePanel({ product }: { product: any }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items: wishlistItems, addWishlist, removeWishlist } = useWishlistStore();
  const { formatPrice } = useCurrencyStore();
  const isWishlisted = wishlistItems.some(w => w.productId === product.id);

  const displayPrice = product.salePrice ? Number(product.salePrice) : Number(product.price);

  return (
    <>
      {/* Desktop & Inline Purchase Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        <div className="flex-grow">
          <AddToCartButton
            productId={product.id}
            product={product}
            className="w-full bg-luxuryGold hover:bg-goldHover text-background font-medium text-xs sm:text-sm tracking-widest uppercase h-13 sm:h-14 rounded-btn transition-colors duration-300 shadow-md"
          />
        </div>
        <button
          onClick={() => {
            if (!user) { router.push('/login'); return; }
            if (isWishlisted) {
              removeWishlist(user.id, product.id);
            } else {
              addWishlist(user.id, product.id);
            }
          }}
          className={`h-13 sm:h-14 px-6 sm:px-8 border rounded-btn flex items-center justify-center transition-all duration-300 ${
            isWishlisted 
              ? 'border-luxuryGold bg-luxuryGold/10 text-luxuryGold' 
              : 'border-divider hover:border-luxuryGold text-secondaryText hover:text-luxuryGold'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* Mobile Sticky Add To Cart Bar - Flush bottom with safe area padding */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-background/95 backdrop-blur-xl border-t border-luxuryGold/30 px-4 py-2.5 pb-safe-bottom lg:hidden z-40 animate-slide-up shadow-[0_-10px_35px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex flex-col min-w-0 flex-1 pr-2">
            <p className="text-xs font-serif text-primaryText truncate">{product.name}</p>
            <span suppressHydrationWarning className="text-luxuryGold text-xs sm:text-sm font-serif font-light">
              {formatPrice(displayPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                if (!user) { router.push('/login'); return; }
                if (isWishlisted) {
                  removeWishlist(user.id, product.id);
                } else {
                  addWishlist(user.id, product.id);
                }
              }}
              className={`h-10 w-10 border rounded-btn flex items-center justify-center transition-colors ${
                isWishlisted 
                  ? 'border-luxuryGold bg-luxuryGold/10 text-luxuryGold' 
                  : 'border-divider text-secondaryText hover:text-luxuryGold'
              }`}
              aria-label="Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
            <AddToCartButton
              productId={product.id}
              product={product}
              className="bg-luxuryGold hover:bg-goldHover text-background font-medium text-xs tracking-wider uppercase h-10 px-5 rounded-btn transition-colors duration-300"
            />
          </div>
        </div>
      </div>
    </>
  );
}
