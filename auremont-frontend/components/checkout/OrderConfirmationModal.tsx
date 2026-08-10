"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShieldCheck, Download, Sparkles, X, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import SquirrelLogo from "@/components/ui/SquirrelLogo";

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  orderNumber,
  totalAmount,
}: {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  totalAmount: string;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-background border border-luxuryGold/40 rounded-card p-6 md:p-8 max-w-md w-full space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-center relative overflow-hidden"
        >
          {/* Top Decorative Gold Foil Header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-luxuryGold via-goldHover to-goldDark" />

          <button
            onClick={onClose}
            aria-label="Close Confirmation"
            className="absolute top-4 right-4 text-secondaryText hover:text-luxuryGold transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex justify-center pt-2">
            <div className="w-16 h-16 bg-luxuryGold/10 border border-luxuryGold/40 rounded-full flex items-center justify-center text-luxuryGold shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <CheckCircle size={32} />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-mono block font-medium">
              Vault Dispatch Confirmed
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-primaryText">
              Order Received
            </h2>
            <p className="text-secondaryText text-xs font-light max-w-xs mx-auto">
              Your bespoke almond reserve order has been transferred to our temperature-controlled packing vault.
            </p>
          </div>

          {/* Receipt Breakdown Card */}
          <div className="p-4 bg-secondaryBg border border-divider rounded-card text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-divider pb-2">
              <span className="text-mutedText">Order Reference</span>
              <span className="text-luxuryGold font-bold">{orderNumber || "ORD-2026-8941"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-divider pb-2">
              <span className="text-mutedText">Total Investment</span>
              <span className="text-primaryText font-serif text-sm">{totalAmount}</span>
            </div>
            <div className="flex justify-between items-center pt-1 text-[10px] text-emerald-400">
              <span className="flex items-center gap-1">
                <Package size={12} /> Dispatch Status
              </span>
              <span>Vault Packing</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => window.print()}
              className="luxury-button-outline w-full text-xs py-3.5 inline-flex items-center justify-center gap-2"
            >
              <Download size={14} />
              <span>Download Printable Invoice</span>
            </button>
            
            <Link
              href="/shop"
              onClick={onClose}
              className="luxury-button w-full text-xs py-3.5 inline-flex items-center justify-center gap-2"
            >
              <span>Return to Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="text-[10px] text-mutedText font-mono flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck size={12} className="text-luxuryGold" /> OWASP Level 3 Cryptographic Encryption
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
