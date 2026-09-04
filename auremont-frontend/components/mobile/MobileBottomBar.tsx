"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Store, Gift, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import CartDrawer from "../cart/CartDrawer";

export default function MobileBottomBar() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hide on admin routes and product detail pages (where dedicated product purchase bar is active)
  const isProductDetailPage = pathname?.startsWith("/shop/") && pathname.split("/").filter(Boolean).length > 1;
  if (pathname?.startsWith("/admin") || isProductDetailPage) return null;

  const totalCount = (items || []).reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Store },
    { label: "Bespoke", href: "/custom-gift-box", icon: Gift },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/85 backdrop-blur-xl border-t border-luxuryGold/20 pb-safe-bottom px-3 py-2 transition-all">
        <div className="flex items-center justify-around">
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                  isActive ? "text-luxuryGold font-medium scale-105" : "text-secondaryText hover:text-primaryText"
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[9px] uppercase tracking-wider font-mono">{item.label}</span>
              </Link>
            );
          })}

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-secondaryText hover:text-luxuryGold transition-all relative"
            aria-label="Open cart drawer"
          >
            <div className="relative">
              <ShoppingBag size={19} strokeWidth={1.5} />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-luxuryGold text-background font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="text-[9px] uppercase tracking-wider font-mono">Cart</span>
          </button>

          {/* Account */}
          <Link
            href={user ? "/account" : "/login"}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
              pathname === "/account" || pathname === "/login"
                ? "text-luxuryGold font-medium scale-105"
                : "text-secondaryText hover:text-primaryText"
            }`}
          >
            <User size={19} strokeWidth={pathname === "/account" ? 2 : 1.5} />
            <span className="text-[9px] uppercase tracking-wider font-mono">Account</span>
          </Link>

        </div>
      </div>

      {/* Slide-over Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
