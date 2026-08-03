"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import QuantityControl from "./QuantityControl";
import { useAuthStore } from "@/store/authStore";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, fetchCart, updateQuantity, removeItem } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

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
            <div className="flex items-center justify-between p-6 pt-safe-top border-b border-divider">
              <h2 className="font-serif text-2xl text-primaryText flex items-center gap-3">
                <ShoppingBag size={20} className="text-luxuryGold" />
                Your Cart
              </h2>
              <button 
                onClick={onClose}
                aria-label="Close cart"
                className="text-secondaryText hover:text-luxuryGold transition-colors w-11 h-11 flex items-center justify-center -mr-2"
              >
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {!user ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <ShoppingBag size={48} strokeWidth={0.5} className="text-divider mb-4" />
                  <h3 className="font-serif text-xl text-primaryText">Sign in to view your cart</h3>
                  <Link href="/login" onClick={onClose} className="luxury-button w-full mt-4">Sign In</Link>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <ShoppingBag size={48} strokeWidth={0.5} className="text-divider mb-4" />
                  <h3 className="font-serif text-xl text-primaryText">Your cart is empty</h3>
                  <p className="text-secondaryText font-light text-sm">Discover our collection of premium almonds.</p>
                  <Link href="/shop" onClick={onClose} className="luxury-button w-full mt-4">Continue Shopping</Link>
                </div>
              ) : (
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
                            className="text-mutedText hover:text-error transition-colors w-11 h-11 flex items-center justify-center -mr-3 -mt-3"
                            aria-label="Remove item"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-xs uppercase tracking-widest text-secondaryText mb-4">{item.product?.weightGrams || 250}G</p>
                        
                        <div className="mt-auto flex items-end justify-between">
                          <QuantityControl 
                            quantity={item.quantity}
                            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                          />
                          <span className="font-medium text-primaryText">₹{(item.quantity * Number(item.unitPrice)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {user && items.length > 0 && (
              <div className="border-t border-divider p-6 pb-safe-bottom bg-secondaryBg">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-xl text-primaryText">Subtotal</span>
                  <span className="font-serif text-2xl text-luxuryGold">₹{subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-mutedText text-center mb-6 font-light">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link 
                  href="/checkout" 
                  onClick={onClose}
                  className="luxury-button w-full flex justify-center"
                >
                  Proceed to Checkout
                </Link>
                <div className="mt-4 text-center">
                  <Link href="/cart" onClick={onClose} className="text-xs uppercase tracking-widest text-secondaryText hover:text-primaryText hover:underline transition-all p-2 inline-block">
                    View Full Cart
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
