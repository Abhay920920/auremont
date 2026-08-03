"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, UserX, UserCheck, Mail, MapPin, Package, RefreshCw, LogOut } from "lucide-react";
import { format } from "date-fns";

import api from "@/lib/axios";

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data } = await api.get(`/users/admin/${id}`);
        setCustomer(data);
      } catch (err) {
        console.error("Failed to fetch customer profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) {
    return <div className="text-secondaryText animate-pulse">Loading customer profile...</div>;
  }

  if (!customer) return <div>Customer not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-secondaryBg p-5 rounded-2xl shadow-sm border border-divider">
        <div>
          <Link href="/admin/customers" className="text-secondaryText hover:text-luxuryGold text-sm flex items-center gap-1 transition-colors">
            <ArrowLeft size={16} /> Back to Customers
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <h2 className="text-2xl font-serif text-primaryText">{customer.firstName} {customer.lastName}</h2>
            {customer.status === 'active' ? (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium flex items-center gap-1">
                <UserCheck size={14} /> Active
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium flex items-center gap-1">
                <UserX size={14} /> Blocked
              </span>
            )}
          </div>
          <p className="text-secondaryText text-sm mt-1">Customer since {format(new Date(customer.createdAt), "MMMM yyyy")}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2 border border-divider text-primaryText rounded-xl hover:bg-surface transition-colors font-medium">
            <RefreshCw size={16} /> Reset Password
          </button>
          {customer.status === 'active' ? (
            <button className="flex items-center gap-2 bg-red-500/10 text-red-400 px-5 py-2 rounded-xl font-medium shadow hover:bg-red-500/20 transition-colors">
              <LogOut size={16} /> Block Account
            </button>
          ) : (
            <button className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-xl font-medium shadow hover:bg-emerald-500/20 transition-colors">
              <UserCheck size={16} /> Activate Account
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-secondaryBg p-6 rounded-2xl shadow-sm border border-divider">
          <p className="text-secondaryText text-sm font-medium mb-1">Lifetime Value (LTV)</p>
          <p className="text-3xl font-serif text-luxuryGold">₹{customer.metrics.lifetimeValue.toFixed(2)}</p>
        </div>
        <div className="bg-secondaryBg p-6 rounded-2xl shadow-sm border border-divider">
          <p className="text-secondaryText text-sm font-medium mb-1">Average Order Value (AOV)</p>
          <p className="text-3xl font-serif text-primaryText">₹{customer.metrics.averageOrderValue.toFixed(2)}</p>
        </div>
        <div className="bg-secondaryBg p-6 rounded-2xl shadow-sm border border-divider">
          <p className="text-secondaryText text-sm font-medium mb-1">Total Orders</p>
          <p className="text-3xl font-serif text-primaryText">{customer.metrics.totalOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
            <div className="p-5 border-b border-divider flex items-center gap-2">
              <Mail size={18} className="text-luxuryGold" />
              <h3 className="font-medium text-primaryText">Contact Info</h3>
            </div>
            <div className="p-5 space-y-3 text-sm text-secondaryText">
              <div>
                <p className="text-xs uppercase tracking-wider mb-1 font-medium">Email Address</p>
                <p className="text-primaryText">{customer.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1 font-medium">Phone Number</p>
                <p className="text-primaryText">{customer.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
            <div className="p-5 border-b border-divider flex items-center gap-2">
              <MapPin size={18} className="text-luxuryGold" />
              <h3 className="font-medium text-primaryText">Address Book</h3>
            </div>
            <div className="p-5 space-y-4 text-sm text-secondaryText divide-y divide-divider">
              {customer.addresses.length === 0 ? (
                <p>No addresses on file.</p>
              ) : (
                customer.addresses.map((addr: any, idx: number) => (
                  <div key={addr.id} className={idx > 0 ? "pt-4" : ""}>
                    {addr.isDefault && (
                      <span className="text-[10px] uppercase bg-surface text-primaryText px-2 py-0.5 rounded border border-divider mb-2 inline-block">Default</span>
                    )}
                    <p className="font-medium text-primaryText">{addr.fullName}</p>
                    <p>{addr.addressLine1}</p>
                    <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p>{addr.country}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
            <div className="p-5 border-b border-divider flex items-center gap-2">
              <Package size={18} className="text-luxuryGold" />
              <h3 className="font-medium text-primaryText">Order History</h3>
            </div>
            
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-secondaryText uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4 font-medium">Order ID</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider bg-secondaryBg">
                {customer.orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-secondaryText">No orders found.</td>
                  </tr>
                ) : (
                  customer.orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-surface transition-colors group cursor-pointer">
                      <td className="px-5 py-4 text-primaryText font-medium">
                        <Link href={`/admin/orders/${order.id}`} className="hover:text-luxuryGold transition-colors">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-secondaryText">{format(new Date(order.createdAt), "MMM dd, yyyy")}</td>
                      <td className="px-5 py-4 text-secondaryText capitalize">{order.orderStatus}</td>
                      <td className="px-5 py-4 text-primaryText font-medium text-right">₹{Number(order.total).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {customer.orders.length > 0 && (
              <div className="p-4 border-t border-divider bg-surface text-center">
                <Link href={`/admin/orders?search=${customer.email}`} className="text-sm text-luxuryGold hover:text-goldHover transition-colors font-medium">
                  View All Orders in Master List &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
