"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import NotificationDropdown from "./NotificationDropdown";
import MegaNavigation from "./MegaNavigation";
import SearchDrawer from "./SearchDrawer";
import CartDrawer from "./cart/CartDrawer";
import MobileNavDrawer from "./MobileNavDrawer";
import { Menu } from "lucide-react";

import { useCurrencyStore, CurrencyCode } from "@/store/currencyStore";

export default function Header() {
  const { user } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { fetchWishlist } = useWishlistStore();
  const { currency, setCurrency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [isMegaNavOpen, setIsMegaNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Prevent hydration mismatch for zustand persist
  useEffect(() => {
    setMounted(true);
    fetchCart();
    if (user) {
      fetchWishlist(user.id);
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchCart, fetchWishlist, user]);

  return (
    <>
      <header 
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 pt-safe-top ${
          isScrolled || isMegaNavOpen ? 'pb-4 glass' : 'pb-6 md:pb-8 md:pt-8 bg-transparent border-b-transparent'
        }`}
      >
        <div className="max-w-[2000px] mx-auto px-4 md:px-12 flex justify-between items-center relative">
          
          {/* Mobile Hamburger (Left) */}
          <div className="flex-1 md:hidden flex justify-start items-center">
            <button 
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Menu"
              className="w-11 h-11 flex items-center justify-start text-primaryText hover:text-luxuryGold transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Desktop Nav Left - Intentionally Empty as per request */}
          <nav className="hidden md:flex flex-1 gap-10 text-[13px] tracking-widest uppercase items-center text-primaryText font-medium">
          </nav>

          {/* Logo Center */}
          <div 
            className="flex-1 flex justify-center text-2xl md:text-5xl font-serif text-luxuryGold tracking-widest uppercase"
            onMouseEnter={() => setIsMegaNavOpen(false)}
          >
            <Link href="/" className="hover:text-goldHover transition-colors drop-shadow-md">
              Auremont
            </Link>
          </div>

          {/* Nav Right */}
          <div 
            className="flex flex-1 gap-3 sm:gap-6 items-center justify-end text-[13px] tracking-widest uppercase text-primaryText font-medium"
            onMouseEnter={() => setIsMegaNavOpen(false)}
          >
             {/* Currency Dropdown Pill (Desktop Only) */}
             <div className="hidden md:flex relative items-center">
               <select 
                 value={mounted ? currency : 'INR'}
                 onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                 className="bg-secondaryBg/90 border border-luxuryGold/30 text-luxuryGold text-[10px] uppercase tracking-ultra px-2 py-1 rounded-full outline-none cursor-pointer hover:border-luxuryGold transition-colors"
               >
                 <option value="INR" className="bg-background text-primaryText">INR ₹</option>
                 <option value="USD" className="bg-background text-primaryText">USD $</option>
                 <option value="EUR" className="bg-background text-primaryText">EUR €</option>
                 <option value="GBP" className="bg-background text-primaryText">GBP £</option>
               </select>
             </div>

             <button onClick={() => setIsSearchOpen(true)} className="w-11 h-11 flex items-center justify-center hover:text-luxuryGold transition-colors md:w-auto md:h-auto" aria-label="Search">
               <Search size={20} className="md:w-[18px] md:h-[18px]" />
             </button>

             <div className="hidden md:block">
               {mounted && <NotificationDropdown />}
             </div>
             
             <div className="hidden md:block">
               {mounted && user ? (
                 user.role === 'admin' ? (
                   <Link href="/admin" className="luxury-link pb-1">Admin</Link>
                 ) : (
                   <Link href="/account" className="luxury-link pb-1">Account</Link>
                 )
               ) : (
                 <Link href="/login" className="luxury-link pb-1">Sign In</Link>
               )}
             </div>
             
             <button onClick={() => setIsCartOpen(true)} className="w-11 h-11 flex items-center justify-end md:justify-center luxury-link pb-1 md:w-auto md:h-auto md:gap-1.5" aria-label="Cart">
               <span className="hidden md:inline">Cart</span>
               <span className="md:hidden relative">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  {mounted && (items?.length || 0) > 0 && (
                    <span className="absolute -top-2 -right-2 bg-luxuryGold text-background text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {items.length}
                    </span>
                  )}
               </span>
               {mounted && (items?.length || 0) > 0 && (
                 <span className="text-luxuryGold hidden md:inline">({items.length})</span>
               )}
             </button>
          </div>
        </div>

        {/* Mobile Sub-Header Currency Strip (Right-Aligned Below Search & Cart) */}
        <div className="md:hidden w-full pt-1 pb-1.5 px-6 flex justify-end items-center text-[9px] uppercase tracking-ultra text-mutedText border-t border-divider/30 bg-background/80 backdrop-blur-md">
          <span className="text-secondaryText font-light mr-1.5">Currency:</span>
          <select 
            value={mounted ? currency : 'INR'}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-secondaryBg border border-luxuryGold/40 text-luxuryGold text-[9px] uppercase tracking-ultra px-2 py-0.5 rounded-full outline-none cursor-pointer"
          >
            <option value="INR" className="bg-background text-primaryText">INR (₹)</option>
            <option value="USD" className="bg-background text-primaryText">USD ($)</option>
            <option value="EUR" className="bg-background text-primaryText">EUR (€)</option>
            <option value="GBP" className="bg-background text-primaryText">GBP (£)</option>
          </select>
        </div>

        <MegaNavigation isOpen={isMegaNavOpen} onMouseLeave={() => setIsMegaNavOpen(false)} />
      </header>

      <MobileNavDrawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
