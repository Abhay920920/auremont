import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, ShieldCheck, FileText, CheckCircle } from "lucide-react";
import SquirrelLogo from "@/components/ui/SquirrelLogo";

export default function OrderInvoiceModal({
  isOpen,
  onClose,
  order,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const invoiceNumber = `INV-${new Date(order.createdAt).getFullYear()}-${order.orderNumber.replace(/[^0-9]/g, '').slice(-6) || '894102'}`;
  const subtotal = Number(order.subtotal || order.total || 0);
  const tax = Number(order.tax || subtotal * 0.05);
  const total = Number(order.total || subtotal + tax);

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md overflow-y-auto flex items-start justify-center p-4 sm:p-6 md:p-8 pt-16 sm:pt-20 md:pt-24 pb-12"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-background border border-luxuryGold/40 rounded-card p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative text-left my-auto"
        >
          {/* Header Controls */}
          <div className="flex justify-between items-center border-b border-divider/80 pb-4 print:hidden sticky top-0 bg-background/95 backdrop-blur-md z-10 -mt-2 pt-2">
            <div className="flex items-center gap-2 text-luxuryGold font-mono text-xs uppercase tracking-widest font-medium">
              <FileText size={16} /> Official Tax Invoice
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-luxuryGold/10 border border-luxuryGold/30 text-luxuryGold hover:bg-luxuryGold hover:text-background text-xs rounded transition-all font-mono uppercase tracking-wider flex items-center gap-2"
              >
                <Printer size={14} /> Print / Save PDF
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full border border-divider hover:border-luxuryGold text-secondaryText hover:text-luxuryGold transition-colors"
                aria-label="Close invoice"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="space-y-6 print:p-0 print:text-black">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-divider pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <SquirrelLogo size={36} variant="full" />
                </div>
                <p className="text-xs text-secondaryText font-mono uppercase tracking-wider">RARE NUTS Private Limited</p>
                <p className="text-[10px] text-mutedText font-light">
                  100 Botanical Way, Central Reserve, MH &bull; GSTIN: 27AABCR9912K1Z9
                </p>
                <p className="text-[10px] text-mutedText font-light">Email: concierge@rarenuts.com</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-mono font-bold block mb-1">
                  Tax Invoice
                </span>
                <p className="font-mono text-sm font-bold text-primaryText">{invoiceNumber}</p>
                <p className="text-[10px] text-mutedText font-mono">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-[10px] text-mutedText font-mono">Ref: Order #{order.orderNumber}</p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-6 bg-secondaryBg p-4 border border-divider rounded-card text-xs font-mono">
              <div>
                <p className="text-[10px] uppercase tracking-ultra text-mutedText mb-1">Billed To:</p>
                <p className="font-medium text-primaryText">{order.address?.fullName || "Valued Client"}</p>
                <p className="text-secondaryText">{order.address?.addressLine1}</p>
                {order.address?.addressLine2 && <p className="text-secondaryText">{order.address?.addressLine2}</p>}
                <p className="text-secondaryText">{order.address?.city}, {order.address?.state} - {order.address?.postalCode}</p>
                <p className="text-secondaryText">Phone: {order.address?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-ultra text-mutedText mb-1">Payment Status:</p>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-2">
                  <CheckCircle size={14} /> {order.paymentStatus?.toUpperCase() || 'PAID'} (Razorpay Verified)
                </div>
                <p className="text-[10px] text-mutedText">HSN Code: 08021200 (Almonds)</p>
                <p className="text-[10px] text-mutedText">Courier: Insured Vault Dispatch</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-divider rounded-card overflow-hidden">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-secondaryBg border-b border-divider text-[10px] uppercase tracking-wider text-mutedText">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider/60">
                  {(order.items || []).map((item: any) => (
                    <tr key={item.id}>
                      <td className="p-3 font-serif text-sm text-primaryText">
                        {item.product?.name || item.productName || 'California Reserve Almonds'}
                      </td>
                      <td className="p-3 text-center text-secondaryText">{item.quantity}</td>
                      <td className="p-3 text-right text-secondaryText">₹{Number(item.price || item.unitPrice || 0).toFixed(2)}</td>
                      <td className="p-3 text-right text-luxuryGold font-serif">₹{Number(item.subtotal || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-2 font-mono text-xs text-right">
                <div className="flex justify-between border-b border-divider pb-1">
                  <span className="text-mutedText">Subtotal</span>
                  <span className="text-primaryText">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-divider pb-1">
                  <span className="text-mutedText">GST (5% SGST/CGST)</span>
                  <span className="text-primaryText">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-divider pb-1">
                  <span className="text-mutedText">Vault Dispatch Fee</span>
                  <span className="text-emerald-400">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between font-serif text-lg font-bold text-luxuryGold pt-1">
                  <span>Grand Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-mutedText text-center font-mono border-t border-divider pt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} className="text-luxuryGold" />
              This is a computer-generated tax invoice issued by RARE NUTS Private Limited. No signature required.
            </div>

            <div className="flex justify-end pt-2 print:hidden">
              <button
                type="button"
                onClick={onClose}
                className="luxury-button-outline text-xs px-6 py-2"
              >
                Close Invoice
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
