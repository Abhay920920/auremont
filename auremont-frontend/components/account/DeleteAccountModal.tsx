"use client";

import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, Eye, EyeOff, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string | undefined, confirmText: string) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  errorMessage,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setShowPassword(false);
      setConfirmText("");
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  const isConfirmed = confirmText.trim().toUpperCase() === "DELETE";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed || loading) return;
    onConfirm(password.trim() || undefined, confirmText.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) {
              onClose();
            }
          }}
        >
          {/* Centered Scrollable Wrapper */}
          <div className="min-h-full flex items-center justify-center p-3.5 sm:p-6 md:p-8 py-8 sm:py-12 text-center">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md sm:max-w-lg bg-[#0e0e0e] border border-red-500/30 rounded-card p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-primaryText text-left my-auto space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 text-secondaryText hover:text-primaryText rounded-full hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Close deletion dialog"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-3.5 sm:gap-4 pr-8 sm:pr-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                  <AlertTriangle size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 id="delete-account-title" className="font-serif text-xl sm:text-2xl text-primaryText tracking-tight">
                    Delete My Account
                  </h3>
                  <p className="text-[10px] sm:text-xs uppercase tracking-ultra text-red-400/90 mt-1">
                    Irreversible Action
                  </p>
                </div>
              </div>

              {/* Explanation & Policy Notice */}
              <div className="text-xs text-secondaryText leading-relaxed space-y-2.5 bg-secondaryBg/80 p-3.5 sm:p-4 border border-divider/60 rounded-card">
                <p>
                  Deleting your account will permanently revoke your concierge credentials, remove your saved addresses, wishlists, and active carts.
                </p>
                <p>
                  If you have historical completed orders, financial and tax records will be retained in accordance with statutory accounting requirements, with your personal information completely anonymized.
                </p>
                <p className="text-amber-300/90 font-medium">
                  Note: If you have active orders currently in transit or pending payments, account deletion is blocked until delivery is finalized.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-card bg-red-500/10 border border-red-500/30 text-xs text-red-400 leading-normal animate-shake">
                  {errorMessage}
                </div>
              )}

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-secondaryText block">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your current password"
                      disabled={loading}
                      className="w-full bg-background border border-divider focus:border-red-500/60 rounded-sm px-3.5 py-2.5 text-sm text-primaryText placeholder:text-mutedText/50 focus:outline-none transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-secondaryText hover:text-primaryText rounded cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-mutedText">
                    Required for password-secured accounts (leave blank if registered via Google).
                  </p>
                </div>

                {/* Explicit Confirmation Text */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-secondaryText block">
                    Type <span className="text-red-400 font-bold font-mono">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    disabled={loading}
                    className="w-full bg-background border border-divider focus:border-red-500/60 rounded-sm px-3.5 py-2.5 text-sm font-mono text-primaryText placeholder:text-mutedText/40 focus:outline-none transition-colors uppercase"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs uppercase tracking-widest text-secondaryText hover:text-primaryText border border-divider/60 hover:border-divider transition-all rounded-sm disabled:opacity-50 text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isConfirmed || loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 hover:border-red-500 text-red-300 hover:text-red-200 text-xs uppercase tracking-widest rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed text-center cursor-pointer"
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {loading ? "Deleting Account..." : "Permanently Delete Account"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
