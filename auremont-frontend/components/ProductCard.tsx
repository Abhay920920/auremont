import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';

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
  
  const isWishlisted = wishlistItems.some(item => item.productId === product.id);

  return (
    <div className="group cursor-pointer flex flex-col">
      <div className="w-full aspect-[4/5] relative bg-secondaryBg overflow-hidden mb-8 border border-divider">
        <Link href={`/shop/${product.slug}`}>
          <Image 
            src={product.thumbnailUrl || '/images/california-almonds-250g.png'} 
            alt={product.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
          />
        </Link>
        
        {/* Wishlist Heart */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            className="bg-background/80 backdrop-blur-md w-11 h-11 flex items-center justify-center rounded-full border border-divider text-primaryText hover:border-luxuryGold hover:text-luxuryGold transition-colors"
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
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
        </div>

        {/* Desktop Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <AddToCartButton productId={product.id} className="luxury-button-outline bg-background/50 backdrop-blur-md" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-serif text-2xl text-primaryText mb-2 group-hover:text-luxuryGold transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-secondaryText tracking-superwide uppercase mb-4">{product.weightGrams || 250}G</p>
        <span className="font-medium text-primaryText mb-4">₹{Number(product.price).toFixed(2)}</span>
        
        {/* Mobile Quick Add */}
        <div className="md:hidden w-full px-4">
          <AddToCartButton productId={product.id} className="luxury-button w-full text-xs py-3" />
        </div>
      </div>
    </div>
  );
}
