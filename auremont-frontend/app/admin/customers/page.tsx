"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Download, UserX, UserCheck } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/axios";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await api.get('/users/admin/all');
        setCustomers(data.data || data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-luxuryGold">Customers</h2>
        <button className="flex items-center gap-2 bg-secondaryBg text-primaryText border border-divider px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-surface transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
        <div className="p-6 border-b border-divider flex flex-col md:flex-row gap-4 bg-secondaryBg justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3.5 text-secondaryText" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-3 bg-surface border border-divider text-primaryText rounded-xl focus:outline-none focus:ring-1 focus:ring-luxuryGold focus:border-luxuryGold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-secondaryText">
            <thead className="bg-surface text-primaryText uppercase font-medium tracking-wider">
              <tr>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Joined</th>
                <th className="px-6 py-5 text-center">Total Orders</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider bg-secondaryBg">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-secondaryText">Loading customers...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-secondaryText">No customers found.</td>
                </tr>
              ) : (
                customers.map((c: any) => (
                  <tr key={c.id} className="hover:bg-surface transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <Link href={`/admin/customers/${c.id}`} className="font-medium text-primaryText hover:text-luxuryGold transition-colors">
                          {c.firstName} {c.lastName}
                        </Link>
                        <span className="text-xs text-secondaryText">{c.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">{format(new Date(c.createdAt), "MMM dd, yyyy")}</td>
                    <td className="px-6 py-5 text-center font-medium text-primaryText">{c._count?.orders ?? '-'}</td>
                    <td className="px-6 py-5">
                      {c.status === 'active' ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <UserCheck size={16} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400 font-medium">
                          <UserX size={16} /> Blocked
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/customers/${c.id}`}
                        className="text-luxuryGold hover:text-goldHover font-medium transition-colors border border-luxuryGold px-4 py-1.5 rounded-lg"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-divider flex items-center justify-between text-sm text-secondaryText bg-secondaryBg">
          <span>Showing 1 to {customers.length} of {customers.length} entries</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-divider rounded-lg hover:bg-surface disabled:opacity-50 transition-colors" disabled>Prev</button>
            <button className="px-4 py-2 border border-divider rounded-lg hover:bg-surface disabled:opacity-50 transition-colors" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
