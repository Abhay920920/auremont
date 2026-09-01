"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Boxes, 
  Users, 
  Star, 
  Tag, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ArrowLeft,
  Menu,
  X
} from "lucide-react";
import SquirrelLogo from "@/components/ui/SquirrelLogo";
import { useCurrencyStore, CurrencyCode } from "@/store/currencyStore";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, mounted, router]);

  if (!mounted || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-luxuryGold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Coupons', href: '/admin/marketing/coupons', icon: Tag },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Support', href: '/admin/support', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-primaryText">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-secondaryBg border-b border-divider sticky top-0 z-30">
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="w-10 h-10 flex items-center justify-center text-primaryText hover:text-luxuryGold"
          aria-label="Toggle admin navigation"
        >
          {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <SquirrelLogo size={24} variant="header" />
        </Link>
        <Link href="/" className="text-xs text-secondaryText hover:text-luxuryGold flex items-center gap-1">
          <ArrowLeft size={14} />
          <span>Shop</span>
        </Link>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`w-64 bg-secondaryBg border-r border-divider flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 print:hidden ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-divider flex items-center justify-between">
          <Link href="/admin" onClick={() => setIsMobileSidebarOpen(false)} className="flex items-center gap-3">
            <SquirrelLogo size={36} variant="header" />
            <div className="border-l border-divider pl-3">
              <span className="text-[10px] tracking-widest uppercase text-secondaryText block font-mono">Control Center</span>
              <span className="text-xs font-serif text-luxuryGold tracking-wider font-semibold">Admin Panel</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden text-secondaryText hover:text-primaryText"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive 
                    ? 'bg-luxuryGold text-background font-medium shadow-md' 
                    : 'text-secondaryText hover:bg-surface hover:text-primaryText'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-divider space-y-2">
          {/* Currency Dropdown */}
          <div className="px-4 py-2 flex items-center justify-between text-xs">
            <span className="text-secondaryText font-medium">Currency</span>
            <select 
              value={mounted ? currency : 'INR'}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-background border border-luxuryGold/30 text-luxuryGold text-xs uppercase tracking-ultra px-2 py-1 rounded-md outline-none cursor-pointer hover:border-luxuryGold transition-colors"
            >
              <option value="INR" className="bg-background text-primaryText">INR ₹</option>
              <option value="USD" className="bg-background text-primaryText">USD $</option>
              <option value="EUR" className="bg-background text-primaryText">EUR €</option>
              <option value="GBP" className="bg-background text-primaryText">GBP £</option>
            </select>
          </div>

          <Link 
            href="/"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-secondaryText hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Return to Storefront</span>
          </Link>
          <button 
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-error hover:bg-error/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-w-0 print:ml-0 p-4 sm:p-6 md:p-8 print:p-0 bg-background print:bg-background overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
