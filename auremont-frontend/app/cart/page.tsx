"use client";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Lock, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles, Check } from "lucide-react";

import QuantityControl from "@/components/cart/QuantityControl";
import GiftOptions from "@/components/cart/GiftOptions";

const FREE_SHIPPING_THRESHOLD = 1999;

export default function CartPage() {
  const { items, fetchCart, updateQuantity, removeItem, loading } = useCartStore();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push("/login?redirect=/cart&reason=cart");
      return;
    }
    if (!items || items.length === 0) {
      fetchCart();
    }
  }, [user]);

  if (!mounted) return null;

  const safeItems = items || [];
  const itemCount = safeItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = safeItems.reduce((sum, item) => sum + (item.quantity * Number(item.unitPrice)), 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + shippingCost;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // EMPTY BAG STATE
  if (safeItems.length === 0) {
    return (
      <div className="w-full bg-background min-h-[75vh] flex items-center justify-center pt-28 pb-32 px-4 sm:px-6">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl border border-luxuryGold/30 bg-secondaryBg/80 mx-auto flex items-center justify-center text-luxuryGold shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <ShoppingBag size={34} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif text-primaryText">Your Shopping Bag is Empty</h1>
            <p className="text-secondaryText text-xs sm:text-sm font-light leading-relaxed max-w-sm mx-auto">
              Your botanical vault is currently unfilled. Explore our private harvest almonds or curate a bespoke wooden presentation chest.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/shop" 
              className="luxury-button text-xs py-3 px-6 uppercase tracking-wider inline-flex items-center justify-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </Link>
            <Link 
              href="/custom-gift-box" 
              className="py-3 px-6 text-xs uppercase tracking-wider font-mono border border-divider hover:border-luxuryGold/50 rounded-lg text-secondaryText hover:text-primaryText transition-colors inline-flex items-center justify-center"
            >
              Bespoke Studio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen pt-24 sm:pt-28 md:pt-32 pb-32 md:pb-24">
      <div className="site-container">
        
        {/* TOP BAR & BREADCRUMB PROGRESS */}
        <div className="border-b border-divider/60 pb-6 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-mutedText mb-1.5">
                <span className="text-luxuryGold font-medium">1. Shopping Bag</span>
                <span>/</span>
                <span>2. Checkout</span>
                <span>/</span>
                <span>3. Dispatch</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primaryText flex items-center gap-3">
                <span>Shopping Bag</span>
                <span className="text-xs sm:text-sm font-sans font-normal text-mutedText tracking-normal">
                  ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
              </h1>
            </div>

            <Link 
              href="/shop" 
              className="text-xs sm:text-sm text-secondaryText hover:text-luxuryGold flex items-center gap-1.5 font-light transition-colors w-fit"
            >
              <span>← Continue Browsing</span>
            </Link>
          </div>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          
          {/* LEFT: CART ITEMS LIST */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* DESKTOP TABLE HEADER */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-divider text-[11px] font-mono uppercase tracking-wider text-mutedText">
              <div className="col-span-6">Botanical Creation</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Line Subtotal</div>
            </div>

            {/* CART ITEMS */}
            <div className="divide-y divide-divider/50">
              {safeItems.map((item) => (
                <div 
                  key={item.id} 
                  className="py-5 sm:py-6 group transition-colors"
                >
                  {/* DESKTOP ROW (md and above) */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    {/* Col 1-6: Product Info */}
                    <div className="col-span-6 flex items-center gap-4 min-w-0">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-mutedText hover:text-red-400 hover:bg-red-950/20 transition-colors flex-shrink-0"
                        title="Remove Item"
                        aria-label="Remove Item"
                      >
                        <X size={15} strokeWidth={1.75} />
                      </button>

                      <Link 
                        href={`/shop/${item.product?.slug || ''}`} 
                        className="w-20 sm:w-24 aspect-[4/5] bg-secondaryBg rounded-lg relative flex-shrink-0 border border-divider overflow-hidden group-hover:border-luxuryGold/50 transition-colors"
                      >
                        <Image 
                          src={item.product?.thumbnailUrl || '/images/california-almonds-250g.png'} 
                          alt={item.product?.name || 'RARE NUTS Product'} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </Link>

                      <div className="min-w-0 flex-1 pr-2">
                        <Link 
                          href={`/shop/${item.product?.slug || ''}`} 
                          className="font-serif text-base text-primaryText hover:text-luxuryGold transition-colors block truncate mb-1"
                        >
                          {item.product?.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs font-mono text-mutedText mb-1">
                          <span className="uppercase tracking-wider">{item.product?.weightGrams || 250}G Reserve</span>
                        </div>
                        <p className="text-luxuryGold font-medium text-xs font-mono">
                          ₹{Number(item.unitPrice).toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    {/* Col 7-9: Quantity Control (Centered) */}
                    <div className="col-span-3 flex justify-center">
                      <QuantityControl 
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                        max={item.product?.stockQty || 10}
                      />
                    </div>

                    {/* Col 10-12: Total (Right Aligned) */}
                    <div className="col-span-3 text-right">
                      <p className="font-serif text-lg text-primaryText font-medium">
                        ₹{(item.quantity * Number(item.unitPrice)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* MOBILE ROW (< md) */}
                  <div className="md:hidden flex gap-3.5 sm:gap-4 items-start">
                    {/* Thumbnail */}
                    <Link 
                      href={`/shop/${item.product?.slug || ''}`} 
                      className="w-20 sm:w-24 aspect-[4/5] bg-secondaryBg rounded-lg relative flex-shrink-0 border border-divider overflow-hidden"
                    >
                      <Image 
                        src={item.product?.thumbnailUrl || '/images/california-almonds-250g.png'} 
                        alt={item.product?.name || 'RARE NUTS Product'} 
                        fill 
                        className="object-cover" 
                      />
                    </Link>

                    {/* Details & Controls */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Title & Delete button */}
                      <div className="flex items-start justify-between gap-2">
                        <Link 
                          href={`/shop/${item.product?.slug || ''}`} 
                          className="font-serif text-sm sm:text-base text-primaryText hover:text-luxuryGold transition-colors leading-snug line-clamp-2"
                        >
                          {item.product?.name}
                        </Link>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-mutedText hover:text-red-400 transition-colors flex-shrink-0 -mr-1"
                          aria-label="Remove Item"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Weight & Unit price */}
                      <div className="flex items-center gap-2 text-[11px] font-mono text-mutedText">
                        <span>{item.product?.weightGrams || 250}G</span>
                        <span>·</span>
                        <span className="text-luxuryGold">₹{Number(item.unitPrice).toFixed(2)}</span>
                      </div>

                      {/* Bottom Row: Quantity + Line Total */}
                      <div className="flex items-center justify-between pt-1">
                        <QuantityControl 
                          quantity={item.quantity}
                          onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                          onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                          max={item.product?.stockQty || 10}
                        />
                        <span className="font-serif text-base text-primaryText font-medium">
                          ₹{(item.quantity * Number(item.unitPrice)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* GIFT NOTE & PACKING OPTIONS */}
            <GiftOptions 
              onSave={(message, includeReceipt) => {
                // Stored in session/checkout
              }} 
            />

            {/* VALUE PROPOSITION BADGES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-divider/40">
              <div className="p-3 bg-secondaryBg/40 border border-divider/50 rounded-xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface border border-divider flex items-center justify-center text-luxuryGold flex-shrink-0">
                  <Truck size={14} />
                </div>
                <div className="text-[11px] leading-tight">
                  <p className="font-medium text-primaryText">Vault Packed Dispatch</p>
                  <p className="text-mutedText font-light">Dispatches within 24 hours</p>
                </div>
              </div>

              <div className="p-3 bg-secondaryBg/40 border border-divider/50 rounded-xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface border border-divider flex items-center justify-center text-luxuryGold flex-shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <div className="text-[11px] leading-tight">
                  <p className="font-medium text-primaryText">Culinary Guarantee</p>
                  <p className="text-mutedText font-light">100% Quality Assurance</p>
                </div>
              </div>

              <div className="p-3 bg-secondaryBg/40 border border-divider/50 rounded-xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface border border-divider flex items-center justify-center text-luxuryGold flex-shrink-0">
                  <Sparkles size={14} />
                </div>
                <div className="text-[11px] leading-tight">
                  <p className="font-medium text-primaryText">24k Gold Foil Seals</p>
                  <p className="text-mutedText font-light">Hand-inspected tins</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: ORDER SUMMARY CARD */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-secondaryBg/90 backdrop-blur-md border border-divider rounded-2xl p-5 sm:p-6 md:p-7 sticky top-28 space-y-6 shadow-xl">
              
              <div className="border-b border-divider pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-primaryText font-medium">Order Summary</h2>
                <p className="text-xs text-secondaryText font-light mt-0.5">Verified prices and logistics estimates</p>
              </div>

              {/* FREE SHIPPING PROGRESS INDICATOR */}
              <div className="p-3.5 bg-surface/70 border border-luxuryGold/25 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5 font-mono text-[11px]">
                      <Check size={13} className="text-emerald-400" />
                      Complimentary Express Shipping Unlocked
                    </span>
                  ) : (
                    <span className="text-secondaryText text-[11px]">
                      Add <strong className="text-luxuryGold font-mono">₹{amountNeededForFreeShipping}</strong> for Complimentary Shipping
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-mutedText">
                    {progressToFreeShipping}%
                  </span>
                </div>
                
                {/* Progress bar track */}
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-divider/40">
                  <div 
                    className="h-full bg-gradient-to-r from-luxuryGold/80 to-luxuryGold transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* LINE ITEM CALCULATIONS */}
              <div className="space-y-3 text-xs sm:text-sm text-secondaryText">
                <div className="flex justify-between items-center">
                  <span>Bag Subtotal</span>
                  <span className="text-primaryText font-mono font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span>Insured Climate-Shield Shipping</span>
                  </div>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-medium">Complimentary</span>
                  ) : (
                    <span className="text-primaryText font-mono">₹{shippingCost.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex justify-between items-center text-mutedText text-xs">
                  <span>Applicable GST / Taxes</span>
                  <span className="font-mono">Included in item prices</span>
                </div>
              </div>

              {/* GRAND TOTAL */}
              <div className="border-t border-divider pt-4 flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-lg sm:text-xl text-primaryText font-medium block">Estimated Total</span>
                  <span className="text-[10px] text-mutedText font-mono uppercase tracking-wider">INR Currency</span>
                </div>
                <span className="font-serif text-2xl sm:text-3xl text-luxuryGold font-medium">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>

              {/* CHECKOUT BUTTON */}
              <button 
                onClick={() => router.push('/checkout')}
                disabled={loading}
                className="w-full luxury-button py-3.5 px-6 flex items-center justify-center gap-2.5 uppercase tracking-wider text-xs sm:text-sm font-medium disabled:opacity-50 active:scale-98 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
              >
                <Lock size={15} />
                <span>Proceed to Secure Checkout</span>
              </button>

              {/* TRUST & PAYMENT MARKS */}
              <div className="pt-2 border-t border-divider/40 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-mono tracking-widest text-mutedText">
                  <Lock size={11} className="text-luxuryGold" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <p className="text-[10px] text-mutedText font-light">
                  Protected by Razorpay · UPI, Cards & NetBanking accepted
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

