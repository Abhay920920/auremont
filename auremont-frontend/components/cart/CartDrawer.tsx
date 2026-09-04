"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import QuantityControl from "./QuantityControl";
import { useCurrencyStore } from "@/store/currencyStore";
import SquirrelLogo from "@/components/ui/SquirrelLogo";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, fetchCart, updateQuantity, removeItem } = useCartStore();
  const { user } = useAuthStore();
  const { formatPrice } = useCurrencyStore();

  useEffect(() => {
    if (isOpen && user) {
      fetchCart();
    }
  }, [isOpen, user, fetchCart]);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * Number(item.unitPrice)), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-background border-l border-divider z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-safe-top border-b border-divider flex-shrink-0">
              <h2 className="font-serif text-2xl text-primaryText flex items-center gap-3">
                <ShoppingBag size={20} className="text-luxuryGold" />
                <span>Your Cart</span>
              </h2>
              <button 
                onClick={onClose}
                aria-label="Close cart"
                className="text-secondaryText hover:text-luxuryGold transition-colors w-11 h-11 flex items-center justify-center -mr-2 cursor-pointer"
              >
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {/* MEMBER AUTH GATE: Cart works only after login */}
              {!user ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-2 py-8 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-secondaryBg border border-luxuryGold/40 flex items-center justify-center text-luxuryGold shadow-[0_0_20px_rgba(212,175,55,0.15)] mb-2">
                    <SquirrelLogo size={36} variant="icon" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-luxuryGold font-medium px-2.5 py-0.5 border border-luxuryGold/20 bg-luxuryGold/5">
                    Private Member Access
                  </span>
                  <h3 className="font-serif text-2xl text-primaryText">Sign In Required</h3>
                  <p className="text-secondaryText text-xs leading-relaxed max-w-xs mx-auto">
                    Cart and reserve allocations are accessible exclusively to registered members. Please sign in or create an account to view and manage your selections.
                  </p>
                  <div className="w-full space-y-2.5 pt-4">
                    <Link 
                      href="/login?reason=cart" 
                      onClick={onClose}
                      className="luxury-button w-full h-12 flex items-center justify-center gap-2 text-xs tracking-widest"
                    >
                      <span>Sign In to Access Cart</span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={onClose}
                      className="luxury-button-outline w-full h-12 flex items-center justify-center text-xs tracking-widest"
                    >
                      Create an Account
                    </Link>
                  </div>
                </div>
              ) : items.length > 0 ? (
                <>
                  <div className="mb-6 p-4 bg-secondaryBg border border-luxuryGold/30 rounded-card space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                      <span className="text-primaryText">
                        {subtotal >= 1500 ? "✨ Free Velvet Vault Packaging Unlocked!" : `Add ${formatPrice(1500 - subtotal)} for Free Velvet Packaging`}
                      </span>
                      <span className="text-luxuryGold font-bold">{Math.min(100, Math.round((subtotal / 1500) * 100))}%</span>
                    </div>
                    <div className="w-full bg-background h-1.5 rounded-full overflow-hidden border border-divider">
                      <div 
                        className="bg-gradient-to-r from-luxuryGold via-goldHover to-goldDark h-full transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((subtotal / 1500) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b border-divider pb-6 last:border-0">
                        <div className="relative w-20 h-24 bg-secondaryBg flex-shrink-0">
                          <Image 
                            src={item.product?.thumbnailUrl || '/images/california-almonds-250g.png'} 
                            alt={item.product?.name || 'Product'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <Link href={`/shop/${item.product?.slug}`} onClick={onClose} className="font-serif text-lg text-primaryText hover:text-luxuryGold transition-colors pr-2">
                              {item.product?.name}
                            </Link>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-mutedText hover:text-luxuryGold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="text-xs text-secondaryText mb-4">
                            {formatPrice(Number(item.unitPrice))}
                          </p>
                          <div className="mt-auto">
                            <QuantityControl 
                              quantity={item.quantity} 
                              onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                              onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <ShoppingBag size={48} strokeWidth={0.5} className="text-divider mb-4" />
                  <h3 className="font-serif text-xl text-primaryText">Your cart is empty</h3>
                  <p className="text-secondaryText font-light text-sm">Discover our collection of premium almonds.</p>
                  <Link href="/shop" onClick={onClose} className="luxury-button w-full mt-4">Continue Shopping</Link>
                </div>
              )}
            </div>

            {/* Footer */}
            {user && items.length > 0 && (
              <div className="border-t border-divider p-6 pb-safe-bottom bg-secondaryBg space-y-4 flex-shrink-0">
                {/* Bespoke Laser Engraving & Gift Option */}
                <div className="p-3 bg-background border border-luxuryGold/20 rounded-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium">Bespoke Concierge Options</span>
                    <span className="text-[9px] uppercase tracking-ultra text-mutedText">Complimentary</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter custom initials or text for laser engraving..." 
                    className="w-full bg-secondaryBg border border-divider px-3 py-2 text-xs text-primaryText rounded-sm outline-none focus:border-luxuryGold transition-colors placeholder:text-mutedText"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-serif text-xl text-primaryText">Subtotal</span>
                  <span className="font-serif text-2xl text-luxuryGold">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[10px] text-mutedText text-center font-light">
                  Complimentary Vault Dispatch & Insured Shipping applied at checkout.
                </p>
                <Link 
                  href="/checkout" 
                  onClick={onClose}
                  className="luxury-button w-full flex justify-center py-4 text-xs tracking-ultra"
                >
                  Proceed to Concierge Checkout
                </Link>
                <div className="text-center">
                  <Link href="/cart" onClick={onClose} className="text-[10px] uppercase tracking-ultra text-secondaryText hover:text-primaryText transition-all p-1 inline-block">
                    View Complete Vault Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
