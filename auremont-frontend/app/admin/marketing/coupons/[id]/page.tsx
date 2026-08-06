/* jscpd:ignore-start */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AdminEditCouponPage() {
  const router = useRouter();
  const rawParams = useParams();
  const id = rawParams?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (!id) return;
    api.get(`/coupons/${id}`).then(res => {
      const { data } = res;
      setForm({
        code: data.code,
        type: data.type,
        value: data.value,
        minimumOrder: data.minimumOrder || "",
        maxDiscount: data.maxDiscount || "",
        startDate: new Date(data.startDate).toISOString().slice(0, 16),
        endDate: new Date(data.endDate).toISOString().slice(0, 16),
        usageLimit: data.usageLimit || "",
        status: data.status,
      });
      return null;
    }).catch(err => {
      console.error(err);
      setError("Failed to load coupon details.");
    }).finally(() => setLoading(false)).catch(console.error);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.patch(`/coupons/${id}`, {
        ...form,
        value: Number(form.value),
        minimumOrder: form.minimumOrder ? Number(form.minimumOrder) : undefined,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      });
      router.push("/admin/marketing/coupons");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update coupon.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-secondaryText font-serif">
        <div className="w-8 h-8 border-2 border-luxuryGold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading Privilege Code...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/admin/marketing/coupons" className="flex items-center gap-2 text-xs uppercase tracking-widest text-secondaryText hover:text-luxuryGold transition-colors">
          <ArrowLeft size={16} /> Back to Privilege Codes
        </Link>
        <h1 className="text-3xl font-serif text-primaryText">Edit Privilege Code</h1>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-secondaryBg/40 border border-divider p-8 rounded-2xl">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-secondaryText">Coupon Code</label>
          <input type="text" name="code" value={form.code} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText uppercase" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondaryText">Discount Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondaryText">Discount Value</label>
            <input type="number" step="0.01" name="value" value={form.value} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondaryText">Minimum Order (₹)</label>
            <input type="number" step="0.01" name="minimumOrder" value={form.minimumOrder} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondaryText">Max Discount Cap (₹)</label>
            <input type="number" step="0.01" name="maxDiscount" value={form.maxDiscount} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondaryText">Start Date</label>
            <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondaryText">End Date</label>
            <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-secondaryText">Usage Limit</label>
          <input type="number" name="usageLimit" value={form.usageLimit} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer pt-2">
          <input type="checkbox" name="status" checked={form.status} onChange={handleChange} className="w-4 h-4 accent-luxuryGold" />
          <span className="text-sm text-primaryText font-medium">Active Privilege Code</span>
        </label>

        <button type="submit" disabled={saving} className="w-full bg-luxuryGold text-background py-4 rounded-xl font-medium uppercase tracking-widest shadow-lg hover:bg-goldHover transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          <Save size={18} />
          {saving ? "Saving Changes..." : "Update Privilege Code"}
        </button>
      </form>
    </div>
  );
}
