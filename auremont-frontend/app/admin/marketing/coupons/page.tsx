"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import api from "@/lib/axios";
import { Tag, Plus, CheckCircle2, XCircle } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif text-luxuryGold flex items-center gap-3">
          <Tag size={28} />
          Discount Coupons
        </h1>
        <Link 
          href="/admin/marketing/coupons/new" 
          className="flex items-center gap-2 bg-luxuryGold text-background px-4 py-2 rounded-xl font-medium shadow hover:bg-goldHover transition-colors"
        >
          <Plus size={18} />
          Add Coupon
        </Link>
      </div>

      <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface text-secondaryText text-xs uppercase tracking-wider border-b border-divider">
              <tr>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Validity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-mutedText">Loading coupons...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-mutedText">No coupons found. Create one to get started.</td></tr>
              ) : (
                coupons.map((coupon) => {
                  const isActive = coupon.status && new Date(coupon.endDate) >= new Date();
                  return (
                    <tr key={coupon.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-surface border border-divider rounded-lg font-mono font-medium text-luxuryGold tracking-widest">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-primaryText">
                          {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                        </div>
                        {coupon.minimumOrder && (
                          <div className="text-xs text-secondaryText">Min: ₹{coupon.minimumOrder}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondaryText">
                        {format(new Date(coupon.startDate), 'MMM d, yyyy')} - {format(new Date(coupon.endDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link href={`/admin/marketing/coupons/${coupon.id}`} className="text-luxuryGold hover:text-goldHover font-medium text-sm transition-colors">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(coupon.id)} className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
