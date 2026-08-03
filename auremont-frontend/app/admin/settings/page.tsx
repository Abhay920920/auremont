"use client";

import { useState } from "react";
import { Save, Settings2, ShieldCheck, Globe, Percent } from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    storeName: "AUREMONT",
    contactEmail: "concierge@auremont.com",
    taxRate: "18",
    currency: "USD",
    shippingFee: "25.00",
    freeShippingThreshold: "500",
    orderPrefix: "AUR-",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Mock save since there is no backend table for settings yet
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif text-luxuryGold">Store Settings</h1>
        <Link 
          href="/admin/settings/audit-logs" 
          className="flex items-center gap-2 bg-secondaryBg text-primaryText border border-divider px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-surface transition-colors"
        >
          <ShieldCheck size={18} />
          View Audit Logs
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="bg-secondaryBg border border-divider rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-divider flex items-center gap-3">
            <Settings2 className="text-luxuryGold" size={20} />
            <h2 className="text-xl font-medium text-primaryText">General Information</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Store Name</label>
              <input type="text" name="storeName" value={form.storeName} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Support Email</label>
              <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
            </div>
          </div>
        </div>

        {/* Regional & Tax */}
        <div className="bg-secondaryBg border border-divider rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-divider flex items-center gap-3">
            <Globe className="text-luxuryGold" size={20} />
            <h2 className="text-xl font-medium text-primaryText">Regional & Tax</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Store Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText appearance-none">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Global Tax Rate (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-3.5 text-secondaryText" size={16} />
                <input type="number" name="taxRate" value={form.taxRate} onChange={handleChange} className="w-full bg-background border border-divider pl-10 pr-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Orders */}
        <div className="bg-secondaryBg border border-divider rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-divider flex items-center gap-3">
            <ShieldCheck className="text-luxuryGold" size={20} />
            <h2 className="text-xl font-medium text-primaryText">Shipping & Orders</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Standard Shipping Fee</label>
              <input type="number" name="shippingFee" value={form.shippingFee} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Free Shipping Threshold</label>
              <input type="number" name="freeShippingThreshold" value={form.freeShippingThreshold} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Order ID Prefix</label>
              <input type="text" name="orderPrefix" value={form.orderPrefix} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          {success && <span className="text-emerald-400 font-medium">Settings saved successfully!</span>}
          <button type="submit" disabled={loading} className="bg-luxuryGold text-background px-8 py-4 rounded-xl font-medium shadow hover:bg-goldHover transition-colors flex items-center gap-2">
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
