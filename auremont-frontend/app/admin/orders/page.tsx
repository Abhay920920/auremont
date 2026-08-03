"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Download } from "lucide-react";
import { format } from "date-fns";

import api from "@/lib/axios";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/admin/all');
        // The backend returns { data: Order[], total: number }
        setOrders(data.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'placed': return <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-medium">Placed</span>;
      case 'confirmed': return <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-xs font-medium">Confirmed</span>;
      case 'packed': return <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md text-xs font-medium">Packed</span>;
      case 'shipped': return <span className="px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md text-xs font-medium">Shipped</span>;
      case 'delivered': return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium">Delivered</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-xs font-medium">Cancelled</span>;
      default: return <span>{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch(status) {
      case 'paid': return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium">Paid</span>;
      case 'pending': return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-md text-xs font-medium">Pending</span>;
      case 'failed': return <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-xs font-medium">Failed</span>;
      case 'refunded': return <span className="px-2 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-md text-xs font-medium">Refunded</span>;
      default: return <span>{status}</span>;
    }
  };

  const filteredOrders = statusFilter === 'ALL' ? orders : orders.filter(o => o.orderStatus === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-luxuryGold">Orders</h2>
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
              placeholder="Search by Order ID or Customer..." 
              className="w-full pl-10 pr-4 py-3 bg-surface border border-divider text-primaryText rounded-xl focus:outline-none focus:ring-1 focus:ring-luxuryGold focus:border-luxuryGold"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              className="bg-surface border border-divider text-primaryText rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-luxuryGold focus:border-luxuryGold flex-1 md:flex-none appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-secondaryText">
            <thead className="bg-surface text-primaryText uppercase font-medium tracking-wider">
              <tr>
                <th className="px-6 py-5">Order</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Total</th>
                <th className="px-6 py-5">Payment</th>
                <th className="px-6 py-5">Fulfillment</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider bg-secondaryBg">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-secondaryText">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-secondaryText">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-surface transition-colors group">
                    <td className="px-6 py-5 font-medium text-primaryText">
                      <Link href={`/admin/orders/${o.id}`} className="hover:text-luxuryGold transition-colors">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-5">{format(new Date(o.createdAt), "MMM dd, yyyy HH:mm")}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-primaryText">{o.user?.firstName || 'Unknown'} {o.user?.lastName || 'User'}</span>
                        <span className="text-xs text-secondaryText">{o.user?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-primaryText font-medium">₹{Number(o.total).toFixed(2)}</td>
                    <td className="px-6 py-5">{getPaymentBadge(o.paymentStatus)}</td>
                    <td className="px-6 py-5">{getStatusBadge(o.orderStatus)}</td>
                    <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/orders/${o.id}`}
                        className="text-luxuryGold hover:text-goldHover font-medium transition-colors border border-luxuryGold px-4 py-1.5 rounded-lg"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-divider flex items-center justify-between text-sm text-secondaryText bg-secondaryBg">
          <span>Showing 1 to {filteredOrders.length} of {orders.length} entries</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-divider rounded-lg hover:bg-surface disabled:opacity-50 transition-colors" disabled>Prev</button>
            <button className="px-4 py-2 border border-divider rounded-lg hover:bg-surface disabled:opacity-50 transition-colors" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
