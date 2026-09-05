"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import NotificationDropdown from "./NotificationDropdown";
import MegaNavigation from "./MegaNavigation";
import SearchDrawer from "./SearchDrawer";
import CartDrawer from "./cart/CartDrawer";
import MobileNavDrawer from "./MobileNavDrawer";
import SquirrelLogo from "@/components/ui/SquirrelLogo";

import { useCurrencyStore, CurrencyCode } from "@/store/currencyStore";

export default function Header() {
  const { user } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { fetchWishlist } = useWishlistStore();
  const { currency, setCurrency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const [isMegaNavOpen, setIsMegaNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // One-shot mount effect: fetch cart and wishlist once
  useEffect(() => {
    setMounted(true);
    fetchCart();
    if (user && useAuthStore.getState().token) {
      fetchWishlist(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs only on mount

  // Scroll listener — separate effect for clarity and stability
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ─── Single unified fixed header ─── */}
      <header
        className={`w-full fixed top-0 left-0 right-0 z-[70] transition-all duration-300 bg-background/95 backdrop-blur-xl border-b border-divider/50 shadow-sm ${
          isScrolled || isMegaNavOpen
            ? "md:bg-background/90 md:backdrop-blur-xl md:border-b md:border-divider/50 md:shadow-sm"
            : "md:bg-transparent md:border-b-0 md:shadow-none"
        }`}
      >
        {/* ── Row 1: Announcement Bar ─────────────────────────────────────────── */}
        <AnimatePresence>
          {showAnnouncement && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full bg-secondaryBg border-b border-divider/60 flex items-center justify-center py-1.5 px-4 relative overflow-hidden"
            >
              <p className="text-[9px] md:text-[11px] uppercase tracking-widest text-primaryText font-medium text-center pr-6 truncate">
                Complimentary shipping on all orders over ₹2000
              </p>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-secondaryText hover:text-primaryText transition-colors"
                aria-label="Close announcement"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Row 2: Main Nav ──────────────────────────────────────────────────── */}
        <div className="site-container flex justify-between items-center h-14 md:h-20">

          {/* Mobile Hamburger (Left) */}
          <div className="flex-1 flex md:hidden justify-start items-center">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Menu"
              className="w-10 h-10 flex items-center justify-start text-primaryText hover:text-luxuryGold transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Desktop Nav Left */}
          <nav className="hidden md:flex flex-1 gap-8 text-[11px] tracking-widest uppercase items-center text-primaryText font-medium">
            <Link href="/shop" className="hover:text-luxuryGold transition-colors">Shop</Link>
            <Link href="/custom-gift-box" className="hover:text-luxuryGold transition-colors">Bespoke</Link>
          </nav>

          {/* Logo Center */}
          <div
            className="flex-1 flex justify-center"
            onMouseEnter={() => setIsMegaNavOpen(false)}
          >
            <Link href="/" className="hover:opacity-90 transition-opacity flex items-center justify-center">
              <SquirrelLogo size={28} variant="header" />
            </Link>
          </div>

          {/* Nav Right */}
          <div
            className="flex flex-1 gap-2 sm:gap-5 items-center justify-end text-[13px] tracking-widest uppercase text-primaryText font-medium"
            onMouseEnter={() => setIsMegaNavOpen(false)}
          >
            {/* Currency Dropdown (Desktop Only) */}
            <div className="hidden md:flex relative items-center">
              <select
                value={mounted ? currency : "INR"}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-secondaryBg/90 border border-luxuryGold/30 text-luxuryGold text-[10px] uppercase tracking-ultra px-2 py-1 rounded-full outline-none cursor-pointer hover:border-luxuryGold transition-colors"
              >
                <option value="INR" className="bg-background text-primaryText">INR ₹</option>
                <option value="USD" className="bg-background text-primaryText">USD $</option>
                <option value="EUR" className="bg-background text-primaryText">EUR €</option>
                <option value="GBP" className="bg-background text-primaryText">GBP £</option>
              </select>
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center hover:text-luxuryGold transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <div className="hidden md:block">
              {mounted && user && <NotificationDropdown />}
            </div>

            <div className="hidden md:block">
              {mounted && user ? (
                user.role === "admin" ? (
                  <Link href="/admin" className="luxury-link pb-1">Admin</Link>
                ) : (
                  <Link href="/account" className="luxury-link pb-1">Account</Link>
                )
              ) : (
                <Link href="/login" className="luxury-link pb-1">Sign In</Link>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="w-9 h-9 flex items-center justify-end md:justify-center luxury-link pb-1 md:w-auto md:h-auto md:gap-1.5"
              aria-label="Cart"
            >
              <span className="hidden md:inline">Cart</span>
              <span className="md:hidden relative">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <path d="M3 6h18"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {mounted && (items?.length || 0) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-luxuryGold text-background text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
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

        <MegaNavigation isOpen={isMegaNavOpen} onMouseLeave={() => setIsMegaNavOpen(false)} />
      </header>

      <MobileNavDrawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
