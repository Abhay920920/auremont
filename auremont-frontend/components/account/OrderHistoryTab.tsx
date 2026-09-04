import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Package, Truck, CheckCircle, FileText, AlertCircle, Clock } from "lucide-react";
import { useCurrencyStore } from "@/store/currencyStore";

const OrderInvoiceModal = dynamic(() => import("./OrderInvoiceModal"), { ssr: false });

interface OrderHistoryTabProps {
  orders: any[];
  loadingOrders: boolean;
}

export default function OrderHistoryTab({ orders, loadingOrders }: OrderHistoryTabProps) {
  const router = useRouter();
  const { formatPrice } = useCurrencyStore();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);

  const getDispatchSteps = (status: string) => {
    const s = (status || "").toLowerCase();
    return [
      { label: "Order Placed", done: true },
      { label: "Harvest Selection", done: s !== "placed" },
      { label: "Velvet Packing", done: s === "packed" || s === "shipped" || s === "delivered" },
      { label: "Vault Dispatch", done: s === "shipped" || s === "delivered" },
      { label: "Delivered", done: s === "delivered" },
    ];
  };

  const getPaymentBadge = (paymentStatus: string, orderStatus: string) => {
    const ps = (paymentStatus || "").toLowerCase();
    if (ps === "paid") {
      return {
        dot: "bg-emerald-400",
        text: "Paid & Verified",
        color: "text-emerald-400",
      };
    } else if (ps === "failed") {
      return {
        dot: "bg-error",
        text: "Payment Failed",
        color: "text-error",
      };
    } else if (ps === "cancelled") {
      return {
        dot: "bg-mutedText",
        text: "Payment Cancelled",
        color: "text-mutedText",
      };
    } else if (ps === "processing") {
      return {
        dot: "bg-amber-400 animate-pulse",
        text: "Verifying Payment",
        color: "text-amber-400",
      };
    } else {
      return {
        dot: "bg-amber-400 animate-ping",
        text: "Awaiting Payment",
        color: "text-amber-400",
      };
    }
  };

  const getOrderStatusBadge = (orderStatus: string) => {
    const s = (orderStatus || "").toLowerCase();
    if (s === "delivered") return { dot: "bg-emerald-400", text: "Delivered" };
    if (s === "shipped") return { dot: "bg-blue-400 animate-ping", text: "Shipped" };
    if (s === "packed") return { dot: "bg-luxuryGold", text: "Packed" };
    if (s === "confirmed") return { dot: "bg-luxuryGold animate-ping", text: "Confirmed" };
    if (s === "cancelled") return { dot: "bg-mutedText", text: "Cancelled" };
    return { dot: "bg-divider", text: orderStatus };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-divider pb-6">
        <h2 className="font-serif text-3xl text-primaryText flex items-center gap-3">
          <Package className="text-luxuryGold" size={24} strokeWidth={1.5} />
          Vault Orders &amp; Dispatch Tracking
        </h2>
        <span className="text-[10px] uppercase tracking-ultra text-mutedText hidden sm:inline">
          Insured Vault Courier
        </span>
      </div>

      {loadingOrders ? (
        <div className="py-12 space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="w-full h-40 bg-secondaryBg rounded-card animate-pulse border border-divider"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-divider bg-secondaryBg rounded-card flex flex-col items-center justify-center space-y-4">
          <Package className="text-mutedText" size={44} strokeWidth={1} />
          <h3 className="font-serif text-2xl text-primaryText">No Vault Orders Found</h3>
          <p className="text-secondaryText text-xs sm:text-sm font-light max-w-sm">
            Discover our California reserve editions and experience bespoke vault dispatch.
          </p>
          <button onClick={() => router.push("/shop")} className="luxury-button">
            Explore Reserve Collection
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const paymentBadge = getPaymentBadge(order.paymentStatus, order.orderStatus);
            const orderBadge = getOrderStatusBadge(order.orderStatus);
            const isPaid = (order.paymentStatus || "").toLowerCase() === "paid";
            const isFailed = (order.paymentStatus || "").toLowerCase() === "failed";
            const isCancelled =
              (order.paymentStatus || "").toLowerCase() === "cancelled" ||
              (order.orderStatus || "").toLowerCase() === "cancelled";
            const steps = getDispatchSteps(order.orderStatus);

            return (
              <div
                key={order.id}
                className="border border-divider rounded-card p-6 md:p-8 space-y-6 bg-secondaryBg hover:border-luxuryGold/40 transition-colors shadow-lg"
              >
                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-divider pb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm text-primaryText font-medium">
                        Order #{order.orderNumber}
                      </span>
                      {isPaid && (
                        <span className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-2 py-0.5 border border-luxuryGold/20 rounded-full">
                          Insured Dispatch
                        </span>
                      )}
                      {isFailed && (
                        <span className="text-[9px] uppercase tracking-ultra text-error font-medium bg-error/10 px-2 py-0.5 border border-error/20 rounded-full">
                          Payment Failed
                        </span>
                      )}
                      {isCancelled && (
                        <span className="text-[9px] uppercase tracking-ultra text-mutedText font-medium bg-background px-2 py-0.5 border border-divider rounded-full">
                          Cancelled
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-secondaryText tracking-ultra uppercase mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} &bull;{" "}
                      {isPaid
                        ? `Tracking ID: RN-TRK-${order.id.slice(0, 6).toUpperCase()}`
                        : "Pending payment verification"}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p
                      className="font-serif text-2xl text-luxuryGold"
                      suppressHydrationWarning
                    >
                      {formatPrice(order.total)}
                    </p>
                    <div className="flex items-center gap-2 mt-1 justify-start md:justify-end flex-wrap">
                      {/* Payment Status */}
                      <span className="inline-flex items-center px-2.5 py-0.5 bg-background border border-divider text-[9px] uppercase tracking-ultra rounded-full">
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${paymentBadge.dot}`} />
                        <span className={paymentBadge.color}>{paymentBadge.text}</span>
                      </span>
                      {/* Order Status */}
                      <span className="inline-flex items-center px-2.5 py-0.5 bg-background border border-divider text-secondaryText text-[9px] uppercase tracking-ultra rounded-full">
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${orderBadge.dot}`} />
                        {orderBadge.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dispatch Progress — only shown for paid, confirmed orders */}
                {isPaid && !isCancelled && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-ultra text-mutedText">
                      <span className="flex items-center gap-1.5 text-secondaryText">
                        <Truck size={14} className="text-luxuryGold" />
                        Vault Dispatch Progress
                      </span>
                      <span className="text-luxuryGold">Guaranteed Courier Dispatch</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 relative">
                      {steps.map((st, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center text-center space-y-1.5 relative z-10"
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                              st.done
                                ? "bg-luxuryGold text-background border-luxuryGold"
                                : "bg-background text-mutedText border-divider"
                            }`}
                          >
                            {st.done ? <CheckCircle size={12} /> : idx + 1}
                          </div>
                          <span
                            className={`text-[8px] sm:text-[10px] uppercase tracking-wider font-medium line-clamp-1 ${
                              st.done ? "text-primaryText" : "text-mutedText"
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awaiting payment verification state */}
                {!isPaid && !isFailed && !isCancelled && (
                  <div className="flex items-center gap-3 p-4 bg-background border border-amber-400/20 rounded-card">
                    <Clock size={16} className="text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-amber-400 text-xs font-medium">Payment Verification Pending</p>
                      <p className="text-secondaryText text-[11px] mt-0.5">
                        Your order has been placed. Dispatch will begin once payment is verified.
                      </p>
                    </div>
                  </div>
                )}

                {/* Failed payment state */}
                {isFailed && (
                  <div className="flex items-center gap-3 p-4 bg-background border border-error/20 rounded-card">
                    <AlertCircle size={16} className="text-error flex-shrink-0" />
                    <div>
                      <p className="text-error text-xs font-medium">Payment Verification Failed</p>
                      <p className="text-secondaryText text-[11px] mt-0.5">
                        Payment was not captured. No charges were applied. Please try again.
                      </p>
                    </div>
                  </div>
                )}

                {/* Purchased Items List */}
                <div className="space-y-3 pt-4 border-t border-divider/60">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-medium uppercase tracking-ultra text-secondaryText">
                      Reserved Harvest Items:
                    </p>
                    {isPaid && (
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-3 py-1 bg-luxuryGold/10 border border-luxuryGold/30 text-luxuryGold hover:bg-luxuryGold hover:text-background text-[10px] rounded transition-all font-mono uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <FileText size={12} /> View Tax Invoice
                      </button>
                    )}
                  </div>
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 bg-background p-3.5 border border-divider rounded-card hover:border-luxuryGold/30 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden bg-secondaryBg border border-divider/60 flex-shrink-0">
                          <Image
                            src={
                              item.imageUrl ||
                              item.product?.thumbnailUrl ||
                              "/images/california-almonds-250g.png"
                            }
                            alt={item.productName || item.product?.name || "RARE NUTS Reserve Almonds"}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-primaryText font-serif text-sm font-medium truncate">
                            {item.productName || item.product?.name || "RARE NUTS Reserve Almonds"}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-mutedText font-mono mt-0.5">
                            {item.sku && <span>SKU: {item.sku}</span>}
                            <span>Qty: {item.quantity}</span>
                            {item.price && (
                              <span suppressHydrationWarning>@ {formatPrice(item.price)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span
                        className="text-luxuryGold font-serif text-sm sm:text-base font-medium flex-shrink-0"
                        suppressHydrationWarning
                      >
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      <OrderInvoiceModal
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
      />
    </div>
  );
}
