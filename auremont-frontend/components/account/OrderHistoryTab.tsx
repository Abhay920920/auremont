import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

interface OrderHistoryTabProps {
  orders: any[];
  loadingOrders: boolean;
}

export default function OrderHistoryTab({ orders, loadingOrders }: OrderHistoryTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="font-serif text-3xl text-primaryText border-b border-divider pb-6 flex items-center gap-3">
        <Package className="text-luxuryGold" size={24} strokeWidth={1.5} />
        Order History
      </h2>
      
      {loadingOrders ? (
        <div className="py-12 space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="w-full h-32 bg-secondaryBg rounded-sm animate-pulse border border-divider"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-divider bg-secondaryBg rounded-sm flex flex-col items-center justify-center">
          <Package className="text-mutedText mb-4" size={40} strokeWidth={1} />
          <p className="text-secondaryText text-lg mb-6">You have not placed any orders yet.</p>
          <button onClick={() => router.push('/shop')} className="luxury-button">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-divider rounded-sm p-6 space-y-6 bg-secondaryBg hover:border-luxuryGold/50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-divider pb-6 gap-4">
                <div>
                  <p className="font-medium text-lg text-primaryText">Order #{order.orderNumber}</p>
                  <p className="text-xs text-secondaryText tracking-widest uppercase mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-left md:text-right flex flex-col md:items-end">
                  <p className="font-medium text-luxuryGold text-xl">₹{Number(order.total).toFixed(2)}</p>
                  <span className="inline-flex items-center px-3 py-1 bg-background border border-divider text-mutedText text-[10px] uppercase tracking-widest rounded-sm mt-2">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${order.orderStatus === 'DELIVERED' ? 'bg-green-500' : 'bg-luxuryGold animate-pulse'}`}></span>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[11px] font-medium uppercase tracking-widest text-secondaryText">Items Purchased:</p>
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm bg-background p-4 border border-divider">
                    <span className="text-primaryText">{item.quantity} × {item.product?.name || 'Auremont Product'}</span>
                    <span className="text-secondaryText">₹{Number(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
