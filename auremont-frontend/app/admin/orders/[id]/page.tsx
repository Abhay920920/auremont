"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Package, Truck, Printer, Info, CreditCard, Box } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/axios";

const STEPS = ["placed", "confirmed", "packed", "shipped", "delivered"];

export default function OrderDetailPage() {
  const rawParams = useParams();
  const id = rawParams?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/admin/${id}`);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="text-secondaryText animate-pulse">Loading order details...</div>;
  }

  if (!order) return <div>Order not found.</div>;

  const updateStatus = async (newStatus: string) => {
    try {
      setLoading(true);
      const res = await api.patch(`/orders/admin/${id}/status`, { status: newStatus });
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = STEPS.indexOf(order.orderStatus);

  const getPaymentBadge = (status: string) => {
    switch(status) {
      case 'paid': return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">Paid</span>;
      case 'pending': return <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-medium">Pending</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 print:pb-0">
      <div className="flex justify-between items-center bg-secondaryBg p-5 rounded-2xl shadow-sm border border-divider print:border-none print:shadow-none print:bg-transparent">
        <div>
          <Link href="/admin/orders" className="text-secondaryText hover:text-luxuryGold text-sm flex items-center gap-1 transition-colors print:hidden">
            <ArrowLeft size={16} /> Back to Orders
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <h2 className="text-2xl font-serif text-primaryText print:text-black">Order {order.orderNumber}</h2>
            {getPaymentBadge(order.paymentStatus)}
          </div>
          <p className="text-secondaryText text-sm mt-1 print:text-gray-600">{format(new Date(order.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}</p>
        </div>
        <div className="flex gap-3 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2 border border-divider text-primaryText rounded-xl hover:bg-surface transition-colors font-medium"
          >
            <Printer size={16} /> Print Invoice
          </button>
          {order.orderStatus !== 'cancelled' && (
            <button 
              onClick={() => updateStatus('cancelled')}
              className="bg-red-500/10 text-red-400 px-5 py-2 rounded-xl font-medium shadow hover:bg-red-500/20 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="bg-secondaryBg p-8 rounded-2xl shadow-sm border border-divider print:hidden">
        <h3 className="text-lg font-medium text-primaryText mb-6">Fulfillment Pipeline</h3>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-divider -translate-y-1/2"></div>
          
          <div className="absolute top-1/2 left-0 h-1 bg-luxuryGold -translate-y-1/2 transition-all duration-500" 
               style={{ width: `${(Math.max(0, currentStepIndex) / (STEPS.length - 1)) * 100}%` }}></div>

          <div className="relative flex justify-between w-full">
            {STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isActive = idx === currentStepIndex;
              
              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors ${
                    isCompleted ? 'bg-luxuryGold text-background' : 'bg-surface border-2 border-divider text-secondaryText'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={20} /> : <Box size={18} />}
                  </div>
                  <span className={`mt-3 text-sm font-medium capitalize ${isActive ? 'text-luxuryGold' : isCompleted ? 'text-primaryText' : 'text-secondaryText'}`}>
                    {step.replace('_', ' ')}
                  </span>
                  {isActive && idx < STEPS.length - 1 && (
                    <button 
                      onClick={() => updateStatus(STEPS[idx+1])}
                      className="mt-2 text-xs bg-luxuryGold/10 text-luxuryGold px-3 py-1 rounded-full border border-luxuryGold/20 hover:bg-luxuryGold/20 transition-colors"
                    >
                      Mark {STEPS[idx+1]}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
            <div className="p-5 border-b border-divider flex items-center gap-2">
              <Package size={18} className="text-luxuryGold" />
              <h3 className="font-medium text-primaryText">Order Items</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-secondaryText uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4 font-medium">Product</th>
                  <th className="px-5 py-4 font-medium">Price</th>
                  <th className="px-5 py-4 font-medium">Qty</th>
                  <th className="px-5 py-4 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider bg-secondaryBg">
                {order.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4 text-primaryText">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-xs text-secondaryText mt-1">SKU: {item.sku}</div>
                    </td>
                    <td className="px-5 py-4 text-secondaryText">₹{Number(item.price).toFixed(2)}</td>
                    <td className="px-5 py-4 text-secondaryText">{item.quantity}</td>
                    <td className="px-5 py-4 text-primaryText font-medium text-right">₹{Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-5 bg-surface border-t border-divider space-y-2">
              <div className="flex justify-between text-secondaryText text-sm">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-secondaryText text-sm">
                <span>Shipping</span>
                <span>{Number(order.shipping) === 0 ? 'Free' : `₹${Number(order.shipping).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-secondaryText text-sm">
                <span>Tax</span>
                <span>₹{Number(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-primaryText font-medium pt-2 border-t border-divider mt-2">
                <span>Total</span>
                <span className="text-lg text-luxuryGold">₹{Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
            <div className="p-5 border-b border-divider flex items-center gap-2">
              <Info size={18} className="text-luxuryGold" />
              <h3 className="font-medium text-primaryText">Customer Details</h3>
            </div>
            <div className="p-5 space-y-4 text-sm text-secondaryText">
              {order.user && (
                <div>
                  <p className="font-medium text-primaryText">{order.user.firstName} {order.user.lastName}</p>
                  <p>{order.user.email}</p>
                  <p>{order.user.phone || 'N/A'}</p>
                </div>
              )}
              <hr className="border-divider" />
              {order.address && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-2 font-medium">Shipping Address</p>
                  <p className="font-medium text-primaryText">{order.address.fullName}</p>
                  <p>{order.address.addressLine1}</p>
                  {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                  <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                  <p>{order.address.country}</p>
                  <p className="mt-1">Phone: {order.address.phone}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
            <div className="p-5 border-b border-divider flex items-center gap-2">
              <CreditCard size={18} className="text-luxuryGold" />
              <h3 className="font-medium text-primaryText">Payment Info</h3>
            </div>
            <div className="p-5 space-y-2 text-sm text-secondaryText">
              <div className="flex justify-between">
                <span>Status</span>
                {getPaymentBadge(order.paymentStatus)}
              </div>
              {order.payment && (
                <div className="flex justify-between">
                  <span>Provider</span>
                  <span className="capitalize">{order.payment.provider || 'Razorpay'}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Printable Invoice Section */}
      <div 
        className="hidden print:block print:absolute print:inset-0 print:w-full print:min-h-screen bg-background text-primaryText print:p-12"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page { size: A4; margin: 0; }
            body { background: #050505 !important; color: #E5E5E5 !important; margin: 0; padding: 0; }
          }
        `}} />
        <div className="flex justify-between items-start border-b border-divider pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-serif tracking-widest uppercase text-luxuryGold mb-1">AUREMONT</h1>
            <p className="text-xs text-secondaryText">Premium California Almonds</p>
            <p className="text-xs text-secondaryText mt-2">Auremont Private Limited<br/>Corporate Towers, BKC, Mumbai, MH 400051<br/>concierge@auremont.com</p>
          </div>
          <div className="text-right max-w-[50%]">
            <h2 className="text-2xl font-serif text-primaryText uppercase mb-4">Invoice</h2>
            <div className="flex flex-col gap-2 text-xs text-secondaryText text-right">
              <div className="flex justify-end gap-3">
                <span className="font-medium text-primaryText">Invoice No:</span>
                <span className="break-all">{order.orderNumber}</span>
              </div>
              <div className="flex justify-end gap-3">
                <span className="font-medium text-primaryText">Date:</span>
                <span>{format(new Date(order.createdAt), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-end gap-3">
                <span className="font-medium text-primaryText">Payment:</span>
                <span className="capitalize">{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          {order.address && (
            <div className="w-1/2">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-mutedText mb-3 border-b border-divider pb-1">Billed To</h3>
              <p className="font-medium text-primaryText text-sm">{order.address.fullName}</p>
              <p className="text-secondaryText text-xs mt-1">{order.address.addressLine1}</p>
              {order.address.addressLine2 && <p className="text-secondaryText text-xs">{order.address.addressLine2}</p>}
              <p className="text-secondaryText text-xs">{order.address.city}, {order.address.state} {order.address.postalCode}</p>
              <p className="text-secondaryText text-xs">{order.address.country}</p>
              <p className="text-secondaryText text-xs mt-1">{order.address.phone}</p>
            </div>
          )}
        </div>

        <table className="w-full text-left mb-8 border-collapse">
          <thead>
            <tr className="border-b border-divider text-[10px] uppercase tracking-widest font-bold text-mutedText">
              <th className="py-3">Item Description</th>
              <th className="py-3 text-center w-20">Qty</th>
              <th className="py-3 text-right w-24">Price</th>
              <th className="py-3 text-right w-28">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider/50">
            {order.items?.map((item: any) => (
              <tr key={item.id}>
                <td className="py-4">
                  <div className="font-medium text-primaryText text-sm">{item.productName}</div>
                  <div className="text-[10px] text-mutedText mt-1">SKU: {item.sku}</div>
                </td>
                <td className="py-4 text-center text-sm text-secondaryText">{item.quantity}</td>
                <td className="py-4 text-right text-sm text-secondaryText">₹{Number(item.price).toFixed(2)}</td>
                <td className="py-4 text-right text-sm text-primaryText font-medium">₹{Number(item.subtotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-[300px] bg-secondaryBg p-5 border border-divider rounded-lg">
            <div className="flex justify-between text-secondaryText text-xs mb-3">
              <span>Subtotal</span>
              <span>₹{Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-secondaryText text-xs mb-3">
              <span>Shipping</span>
              <span>{Number(order.shipping) === 0 ? 'Free' : `₹${Number(order.shipping).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-secondaryText text-xs mb-4">
              <span>Tax</span>
              <span>₹{Number(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-luxuryGold font-medium text-base pt-3 border-t border-divider">
              <span>Total</span>
              <span>₹{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-divider text-center text-[10px] text-mutedText">
          <p className="font-serif tracking-widest text-primaryText mb-1 text-xs">THANK YOU FOR YOUR BUSINESS</p>
          <p>For any questions regarding this invoice, please contact support at support@auremont.com</p>
        </div>
      </div>
    </div>
  );
}
