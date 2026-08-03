import { Heart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";

interface WishlistTabProps {
  wishlistItems: any[];
  loadingWishlist: boolean;
}

export default function WishlistTab({ wishlistItems, loadingWishlist }: WishlistTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="font-serif text-3xl text-primaryText border-b border-divider pb-6 flex items-center gap-3">
        <Heart className="text-luxuryGold" size={24} strokeWidth={1.5} />
        My Wishlist
      </h2>
      
      {loadingWishlist ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-full aspect-[4/5] bg-secondaryBg border border-divider animate-pulse"></div>
          ))}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-divider bg-secondaryBg rounded-sm flex flex-col items-center justify-center">
          <Heart className="text-mutedText mb-4" size={40} strokeWidth={1} />
          <p className="text-secondaryText text-lg mb-6">Your wishlist is currently empty.</p>
          <button onClick={() => router.push('/shop')} className="luxury-button-outline">Explore the Collection</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <ProductCard key={item.id} product={item.product as any} />
          ))}
        </div>
      )}
    </div>
  );
}
