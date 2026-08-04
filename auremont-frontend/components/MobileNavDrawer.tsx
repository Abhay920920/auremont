"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { useCurrencyStore, CurrencyCode } from "@/store/currencyStore";

export default function MobileNavDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuthStore();
  const { currency, setCurrency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.5 }}
            className="fixed top-0 left-0 w-[85%] max-w-[320px] h-full bg-background border-r border-divider z-[100] shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-divider pt-safe-top">
              <span className="font-serif text-2xl text-luxuryGold tracking-widest uppercase">Auremont</span>
              <button 
                onClick={onClose}
                aria-label="Close menu"
                className="w-11 h-11 flex items-center justify-center text-secondaryText hover:text-primaryText transition-colors -mr-2"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-secondaryText mb-4">Shop</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="/shop" onClick={onClose} className="flex justify-between items-center text-primaryText font-serif text-xl">
                      The Collection <ChevronRight size={18} className="text-mutedText" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=raw" onClick={onClose} className="flex justify-between items-center text-primaryText font-serif text-xl">
                      Raw Almonds <ChevronRight size={18} className="text-mutedText" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=roasted" onClick={onClose} className="flex justify-between items-center text-primaryText font-serif text-xl">
                      Roasted Almonds <ChevronRight size={18} className="text-mutedText" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=gift" onClick={onClose} className="flex justify-between items-center text-primaryText font-serif text-xl">
                      Corporate Gifting <ChevronRight size={18} className="text-mutedText" />
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-secondaryText mb-4">Explore</h4>
                <ul className="space-y-4">
                  <li><Link href="/about" onClick={onClose} className="block text-secondaryText hover:text-primaryText font-serif text-lg">Our Heritage</Link></li>
                  <li><Link href="/process" onClick={onClose} className="block text-secondaryText hover:text-primaryText font-serif text-lg">The Craftsmanship</Link></li>
                  <li><Link href="/journal" onClick={onClose} className="block text-secondaryText hover:text-primaryText font-serif text-lg">Journal</Link></li>
                  <li><Link href="/contact" onClick={onClose} className="block text-secondaryText hover:text-primaryText font-serif text-lg">Contact Us</Link></li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-divider bg-secondaryBg space-y-4 pb-safe-bottom">
              {mounted && user ? (
                <Link href={user.role === 'admin' ? '/admin' : '/account'} onClick={onClose} className="flex items-center gap-3 text-sm tracking-widest uppercase text-primaryText">
                  <div className="w-10 h-10 rounded-full bg-background border border-divider flex items-center justify-center">
                    <User size={18} className="text-luxuryGold" />
                  </div>
                  My Account
                </Link>
              ) : (
                <Link href="/login" onClick={onClose} className="flex items-center gap-3 text-sm tracking-widest uppercase text-primaryText">
                  <div className="w-10 h-10 rounded-full bg-background border border-divider flex items-center justify-center">
                    <User size={18} className="text-secondaryText" />
                  </div>
                  Sign In / Register
                </Link>
              )}

              {/* Currency Selector */}
              <div className="pt-2 border-t border-divider/60 flex items-center justify-between text-xs text-secondaryText">
                <span className="uppercase tracking-widest">Currency</span>
                <select 
                  value={mounted ? currency : 'INR'}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="bg-background border border-divider rounded px-2.5 py-1 text-xs text-primaryText outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
