import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCurrencyStore } from '@/store/currencyStore';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  weightGrams?: number;
  thumbnailUrl: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuthStore();
  const { items: wishlistItems, addWishlist, removeWishlist } = useWishlistStore();
  const { currency, formatPrice } = useCurrencyStore();
  
  const isWishlisted = wishlistItems.some(item => item.productId === product.id);

  return (
    <div className="group cursor-pointer flex flex-col h-full">
      <div className="w-full aspect-[4/5] relative bg-secondaryBg overflow-hidden mb-3 sm:mb-8 border border-divider">
        <Link data-testid={`product-link-${product.slug}`} href={`/shop/${product.slug}`} className="block absolute inset-0 z-10">
          <Image 
            src={product.thumbnailUrl || '/images/california-almonds-250g.png'} 
            alt={product.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
          />
        </Link>
        
        {/* Wishlist Heart */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
          <button 
            className="bg-background/80 backdrop-blur-md w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border border-divider text-primaryText hover:border-luxuryGold hover:text-luxuryGold transition-colors"
            onClick={(e) => {
                e.preventDefault(); 
                if (user) {
                  if (isWishlisted) {
                    removeWishlist(user.id, product.id);
                  } else {
                    addWishlist(user.id, product.id);
                  }
                } else {
                  alert('Please log in to save to your wishlist.');
                }
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
        </div>

        {/* Desktop Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:flex items-center justify-center pointer-events-none z-20">
          <div className="pointer-events-none group-hover:pointer-events-auto">
            <AddToCartButton productId={product.id} className="luxury-button-outline bg-background/50 backdrop-blur-md" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center flex-grow justify-between">
        <div>
          <Link href={`/shop/${product.slug}`} data-testid={`product-title-link-${product.slug}`}>
            <h3 className="font-serif text-sm sm:text-2xl text-primaryText mb-1 sm:mb-2 group-hover:text-luxuryGold transition-colors line-clamp-2">{product.name}</h3>
          </Link>
          <p className="text-[10px] sm:text-xs text-secondaryText tracking-superwide uppercase mb-1 sm:mb-4">{product.weightGrams || 250}G</p>
        </div>
        
        <div className="w-full">
          <span suppressHydrationWarning className="font-medium text-xs sm:text-base text-primaryText block mb-2 sm:mb-4">{formatPrice(product.price)}</span>
          
          {/* Mobile Quick Add */}
          <div className="md:hidden w-full">
            <AddToCartButton productId={product.id} className="luxury-button w-full text-[10px] py-2 px-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
