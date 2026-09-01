"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Lock } from "lucide-react";

import QuantityControl from "@/components/cart/QuantityControl";
import GiftOptions from "@/components/cart/GiftOptions";

export default function CartPage() {
  const { items, fetchCart, updateQuantity, removeItem, loading } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, [fetchCart]);

  if (!mounted) return null;

  const safeItems = items || [];
  const subtotal = safeItems.reduce((sum, item) => sum + (item.quantity * Number(item.unitPrice)), 0);

  if (safeItems.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center space-y-8 bg-background pt-32">
        <h1 className="text-4xl md:text-5xl font-serif text-primaryText">Your Cart is Empty</h1>
        <p className="text-secondaryText text-lg max-w-md">The collection awaits. Discover our exclusive curations of premium almonds.</p>
        <Link href="/shop" className="luxury-button mt-4">Return to Collection</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen pt-32 pb-24 md:pb-super">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-serif text-primaryText mb-16 text-center">Shopping Bag</h1>
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="flex-grow space-y-8 animate-fade-in">
            {/* Header for Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-6 pb-4 border-b border-divider text-[13px] tracking-widest uppercase text-secondaryText">
               <div className="col-span-6">Product</div>
               <div className="col-span-3 text-center">Quantity</div>
               <div className="col-span-3 text-right">Total</div>
            </div>

            {safeItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 py-6 border-b border-divider/50 group">
                 {/* Product Info */}
                 <div className="flex gap-4 sm:gap-6 items-center flex-1 min-w-0">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-mutedText hover:text-error transition-colors -ml-2"
                      title="Remove Item"
                      aria-label="Remove Item"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>

                    <Link href={`/shop/${item.product?.slug}`} className="w-20 sm:w-28 aspect-[4/5] bg-secondaryBg relative flex-shrink-0 border border-divider overflow-hidden group-hover:border-luxuryGold transition-colors">
                        <Image 
                          src={item.product?.thumbnailUrl || '/images/california-almonds-250g.png'} 
                          alt={item.product?.name || 'RARE NUTS Product'} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/shop/${item.product?.slug}`} className="font-serif text-lg sm:text-2xl text-primaryText mb-1 hover:text-luxuryGold transition-colors block truncate">
                        {item.product?.name}
                      </Link>
                      <p className="text-secondaryText text-xs uppercase tracking-widest mb-1">{item.product?.weightGrams || 250}G</p>
                      <p className="text-luxuryGold font-medium text-sm">₹{Number(item.unitPrice).toFixed(2)}</p>
                    </div>
                 </div>

                 {/* Quantity & Item Total */}
                 <div className="flex items-center justify-between sm:justify-end gap-6 pl-11 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-divider/30">
                    <QuantityControl 
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                      max={item.product?.stockQty || 10}
                    />
                    <p className="font-serif text-lg sm:text-xl text-primaryText sm:w-28 text-right">
                      ₹{(item.quantity * Number(item.unitPrice)).toFixed(2)}
                    </p>
                 </div>
              </div>
            ))}

            <GiftOptions 
              onSave={(message, includeReceipt) => {
                // Gift options saved
              }} 
            />
          </div>

          <div className="w-full lg:w-[400px] flex-shrink-0 animate-slide-up">
             <div className="bg-secondaryBg p-8 border border-divider sticky top-32">
               <h2 className="font-serif text-3xl text-primaryText border-b border-divider pb-6 mb-6">Order Summary</h2>
               
               <div className="space-y-4 text-base text-secondaryText mb-8">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span className="text-primaryText">₹{subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Complimentary Shipping</span>
                   <span className="text-luxuryGold">₹0.00</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Taxes</span>
                   <span className="text-mutedText italic text-sm">Calculated at Checkout</span>
                 </div>
               </div>

               <div className="border-t border-divider pt-6 mb-8 flex justify-between font-serif text-2xl text-primaryText">
                  <span>Estimated Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
               </div>

               <button 
                 onClick={() => router.push('/checkout')}
                 disabled={loading}
                 className="w-full luxury-button flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 <Lock size={16} />
                 Secure Checkout
               </button>

               <div className="mt-6 flex flex-col items-center justify-center gap-3 text-xs text-mutedText">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" fill="currentColor"><rect width="24" height="16" rx="2" fill="#E5E7EB"/><text x="12" y="11" fontSize="8" fontWeight="bold" fill="#374151" textAnchor="middle">VISA</text></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" fill="currentColor"><rect width="24" height="16" rx="2" fill="#E5E7EB"/><circle cx="10" cy="8" r="4" fill="#EF4444"/><circle cx="14" cy="8" r="4" fill="#F59E0B"/></svg>
                    <span className="uppercase tracking-widest text-primaryText">Razorpay Secure</span>
                  </div>
                  <span className="uppercase tracking-widest">RARE NUTS Quality Guarantee</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
