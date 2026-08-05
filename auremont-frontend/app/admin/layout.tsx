"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Package, Users, FileText, MessageSquare, LogOut, ArrowLeft } from "lucide-react";
import { useCurrencyStore, CurrencyCode } from "@/store/currencyStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Support', href: '/admin/support', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background flex text-primaryText">
      {/* Sidebar */}
      <aside className="w-64 bg-secondaryBg border-r border-divider flex flex-col fixed h-full z-10 print:hidden">
        <div className="p-6 border-b border-divider">
          <Link href="/admin" className="text-2xl font-serif text-luxuryGold tracking-tight flex items-center gap-2">
            Admin Panel
          </Link>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-luxuryGold text-background shadow-md' 
                    : 'text-secondaryText hover:bg-surface hover:text-primaryText'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-divider space-y-2">
          {/* Currency Dropdown */}
          <div className="px-4 py-2 flex items-center justify-between text-sm">
            <span className="text-secondaryText font-medium">Currency</span>
            <select 
              value={mounted ? currency : 'INR'}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-secondaryBg border border-luxuryGold/30 text-luxuryGold text-xs uppercase tracking-ultra px-2 py-1 rounded-md outline-none cursor-pointer hover:border-luxuryGold transition-colors"
            >
              <option value="INR" className="bg-background text-primaryText">INR ₹</option>
              <option value="USD" className="bg-background text-primaryText">USD $</option>
              <option value="EUR" className="bg-background text-primaryText">EUR €</option>
              <option value="GBP" className="bg-background text-primaryText">GBP £</option>
            </select>
          </div>

          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondaryText hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Storefront</span>
          </Link>
          <button 
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 print:ml-0 p-8 print:p-0 bg-background print:bg-background">
        {children}
      </main>
    </div>
  );
}
