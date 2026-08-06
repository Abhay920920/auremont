"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Users, ShoppingBag, Package } from "lucide-react";
import Link from "next/link";
import { useCurrencyStore } from "@/store/currencyStore";

export default function AdminDashboardPage() {
  const { formatPrice } = useCurrencyStore();
  const [stats, setStats] = useState({
    todaySales: 0,
    monthlySales: 0,
    monthOrders: 0,
    totalCustomers: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard/metrics');
        setStats({
          todaySales: res.data.todaySales || 0,
          monthlySales: res.data.monthlySales || 0,
          monthOrders: res.data.monthOrders || 0,
          totalCustomers: res.data.totalCustomers || 0,
          lowStockProducts: res.data.lowStockProducts || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { title: "Today's Sales", value: formatPrice(stats.todaySales), icon: ShoppingBag, href: "/admin/orders", color: "bg-emerald-500/10 text-emerald-400" },
    { title: "Monthly Sales", value: formatPrice(stats.monthlySales), icon: ShoppingBag, href: "/admin/orders", color: "bg-blue-500/10 text-blue-400" },
    { title: "Total Customers", value: stats.totalCustomers, icon: Users, href: "/admin/customers", color: "bg-purple-500/10 text-purple-400" },
    { title: "Low Stock Items", value: stats.lowStockProducts, icon: Package, href: "/admin/inventory", color: "bg-amber-500/10 text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-luxuryGold mb-2">Dashboard Overview</h1>
        <p className="text-secondaryText">Welcome to the Auremont control center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-secondaryBg rounded-2xl p-6 shadow-sm border border-divider flex flex-col hover:border-luxuryGold/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondaryText uppercase tracking-wider">{card.title}</p>
                </div>
              </div>
              <div className="mt-auto">
                {loading ? (
                  <div className="h-10 w-16 bg-surface rounded animate-pulse"></div>
                ) : (
                  <p className="text-4xl font-serif text-primaryText">{card.value}</p>
                )}
              </div>
              <Link 
                href={card.href}
                className="mt-6 text-sm font-medium text-luxuryGold hover:text-goldHover underline underline-offset-4 decoration-luxuryGold/30 hover:decoration-luxuryGold transition-colors"
              >
                View Details &rarr;
              </Link>
            </div>
          );
        })}
      </div>

      <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider p-8 text-center mt-12">
        <h2 className="text-2xl font-serif text-luxuryGold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/admin/products" className="px-6 py-3 bg-surface text-primaryText rounded-xl font-medium hover:bg-luxuryGold hover:text-background transition-colors border border-divider">
            Manage Inventory
          </Link>
          <Link href="/admin/orders" className="px-6 py-3 bg-surface text-primaryText rounded-xl font-medium hover:bg-luxuryGold hover:text-background transition-colors border border-divider">
            Fulfill Orders
          </Link>
          <Link href="/admin/blogs" className="px-6 py-3 bg-surface text-primaryText rounded-xl font-medium hover:bg-luxuryGold hover:text-background transition-colors border border-divider">
            Publish Content
          </Link>
        </div>
      </div>
    </div>
  );
}
