"use client";

import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

export default function StickyPurchasePanel({ product }: { product: any }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items: wishlistItems, addWishlist, removeWishlist } = useWishlistStore();
  const isWishlisted = wishlistItems.some(w => w.productId === product.id);

  const displayPrice = product.salePrice ? Number(product.salePrice) : Number(product.price);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <div className="flex-grow">
          <AddToCartButton
            productId={product.id}
            className="w-full bg-luxuryGold hover:bg-goldHover text-background font-medium text-sm tracking-widest uppercase h-14 rounded-btn transition-colors duration-300"
          />
        </div>
        <button
          onClick={() => {
            if (!user) { router.push('/login'); return; }
            isWishlisted ? removeWishlist(user.id, product.id) : addWishlist(user.id, product.id);
          }}
          className={`h-14 px-8 border rounded-btn flex items-center justify-center transition-all duration-300 ${
            isWishlisted 
              ? 'border-luxuryGold bg-luxuryGold/5 text-luxuryGold' 
              : 'border-divider hover:border-luxuryGold text-secondaryText hover:text-luxuryGold'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* Mobile Sticky Add To Cart Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-md border-t border-divider p-4 pb-safe-bottom lg:hidden z-50 animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="hidden sm:block">
            <p className="text-sm font-serif text-primaryText truncate">{product.name}</p>
            <p className="text-luxuryGold text-xs font-serif">₹{displayPrice.toFixed(2)}</p>
          </div>
          <AddToCartButton
            productId={product.id}
            className="flex-grow sm:w-auto bg-luxuryGold hover:bg-goldHover text-background font-medium text-xs tracking-widest uppercase h-12 px-8 rounded-btn transition-colors duration-300"
          />
        </div>
      </div>
    </>
  );
}
