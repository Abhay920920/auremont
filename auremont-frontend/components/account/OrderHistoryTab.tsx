import { useRouter } from "next/navigation";
import { Package, Truck, CheckCircle } from "lucide-react";
import { useCurrencyStore } from "@/store/currencyStore";

interface OrderHistoryTabProps {
  orders: any[];
  loadingOrders: boolean;
}

export default function OrderHistoryTab({ orders, loadingOrders }: OrderHistoryTabProps) {
  const router = useRouter();
  const { formatPrice } = useCurrencyStore();

  const getDispatchSteps = (status: string) => {
    const s = (status || '').toLowerCase();
    return [
      { label: "Order Placed", done: true },
      { label: "Harvest Selection", done: s !== 'placed' },
      { label: "Velvet Packing", done: s === 'packed' || s === 'shipped' || s === 'delivered' },
      { label: "Vault Dispatch", done: s === 'shipped' || s === 'delivered' },
      { label: "Delivered", done: s === 'delivered' },
    ];
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-divider pb-6">
        <h2 className="font-serif text-3xl text-primaryText flex items-center gap-3">
          <Package className="text-luxuryGold" size={24} strokeWidth={1.5} />
          Vault Orders & Dispatch Tracking
        </h2>
        <span className="text-[10px] uppercase tracking-ultra text-mutedText hidden sm:inline">Insured Vault Courier</span>
      </div>
      
      {loadingOrders ? (
        <div className="py-12 space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="w-full h-40 bg-secondaryBg rounded-card animate-pulse border border-divider"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-divider bg-secondaryBg rounded-card flex flex-col items-center justify-center space-y-4">
          <Package className="text-mutedText" size={44} strokeWidth={1} />
          <h3 className="font-serif text-2xl text-primaryText">No Vault Orders Found</h3>
          <p className="text-secondaryText text-xs sm:text-sm font-light max-w-sm">Discover our California reserve editions and experience bespoke vault dispatch.</p>
          <button onClick={() => router.push('/shop')} className="luxury-button">Explore Reserve Collection</button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const steps = getDispatchSteps(order.orderStatus);

            return (
              <div key={order.id} className="border border-divider rounded-card p-6 md:p-8 space-y-6 bg-secondaryBg hover:border-luxuryGold/40 transition-colors shadow-lg">
                
                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-divider pb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-primaryText font-medium">Order #{order.orderNumber}</span>
                      <span className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-2 py-0.5 border border-luxuryGold/20 rounded-full">
                        Insured Dispatch
                      </span>
                    </div>
                    <p className="text-[10px] text-secondaryText tracking-ultra uppercase mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()} &bull; Tracking ID: RN-TRK-{order.id.slice(0, 6).toUpperCase()}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-serif text-2xl text-luxuryGold" suppressHydrationWarning>{formatPrice(order.total)}</p>
                    <span className="inline-flex items-center px-3 py-1 bg-background border border-divider text-secondaryText text-[9px] uppercase tracking-ultra rounded-full mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${order.orderStatus?.toLowerCase() === 'delivered' ? 'bg-emerald-400' : 'bg-luxuryGold animate-ping'}`}></span>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Real-Time Dispatch Step Progress Bar */}
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
                      <div key={idx} className="flex flex-col items-center text-center space-y-1.5 relative z-10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                          st.done ? 'bg-luxuryGold text-background border-luxuryGold' : 'bg-background text-mutedText border-divider'
                        }`}>
                          {st.done ? <CheckCircle size={12} /> : idx + 1}
                        </div>
                        <span className={`text-[8px] sm:text-[10px] uppercase tracking-wider font-medium line-clamp-1 ${
                          st.done ? 'text-primaryText' : 'text-mutedText'
                        }`}>
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchased Items List */}
                <div className="space-y-3 pt-4 border-t border-divider/60">
                  <p className="text-[10px] font-medium uppercase tracking-ultra text-secondaryText">Reserved Harvest Items:</p>
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-xs bg-background p-3.5 border border-divider rounded-card">
                      <span className="text-primaryText font-serif text-sm">{item.quantity} × {item.product?.name || item.productName || 'RARE NUTS Reserve Almonds'}</span>
                      <span className="text-luxuryGold font-serif text-sm" suppressHydrationWarning>{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
