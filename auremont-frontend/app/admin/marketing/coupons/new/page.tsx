/* jscpd:ignore-start */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AdminNewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minimumOrder: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    status: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        value: Number(form.value),
        minimumOrder: form.minimumOrder ? Number(form.minimumOrder) : undefined,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };
      
      await api.post('/coupons', payload);
      router.push('/admin/marketing/coupons');
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create coupon");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/marketing/coupons" className="p-2 rounded-xl bg-surface border border-divider hover:bg-secondaryBg transition-colors">
          <ArrowLeft className="w-5 h-5 text-primaryText" />
        </Link>
        <h1 className="text-3xl font-serif text-luxuryGold">Create New Coupon</h1>
      </div>

      {error && <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-secondaryBg border border-divider rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-medium text-primaryText border-b border-divider pb-4 mb-6">Coupon Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Coupon Code *</label>
              <input type="text" name="code" value={form.code} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText uppercase" placeholder="e.g. SUMMER20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Discount Type *</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText appearance-none">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Discount Value *</label>
              <input type="number" step="0.01" name="value" value={form.value} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" placeholder="e.g. 20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Usage Limit (Optional)</label>
              <input type="number" name="usageLimit" value={form.usageLimit} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" placeholder="Number of times it can be used" />
            </div>
          </div>
        </div>

        <div className="bg-secondaryBg border border-divider rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-medium text-primaryText border-b border-divider pb-4 mb-6">Requirements & Validity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Minimum Order Amount (₹)</label>
              <input type="number" step="0.01" name="minimumOrder" value={form.minimumOrder} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Max Discount Amount (₹)</label>
              <input type="number" step="0.01" name="maxDiscount" value={form.maxDiscount} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" placeholder="Only applies to percentage" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Start Date *</label>
              <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">End Date *</label>
              <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
            </div>
          </div>
        </div>

        <div className="bg-secondaryBg border border-divider rounded-2xl p-8 space-y-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="status" checked={form.status} onChange={handleChange} className="w-5 h-5 accent-luxuryGold bg-transparent" />
            <span className="text-primaryText font-medium">Coupon is Active</span>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="bg-luxuryGold text-background px-8 py-4 rounded-xl font-medium shadow hover:bg-goldHover transition-colors flex items-center gap-2">
            <Save className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create Coupon'}
          </button>
        </div>
      </form>
    </div>
  );
}
