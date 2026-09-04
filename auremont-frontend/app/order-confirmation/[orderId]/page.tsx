"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import Link from "next/link";
import { ShieldCheck, AlertCircle, Clock, Package, ArrowRight } from "lucide-react";
import { useCurrencyStore } from "@/store/currencyStore";

type PageState = "LOADING" | "CONFIRMED" | "PENDING" | "FAILED" | "CANCELLED" | "NOT_FOUND";

/**
 * Server-authoritative order confirmation page.
 */
export default function OrderConfirmationPage() {
  const routeParams = useParams();
  const orderId = (routeParams?.orderId as string) || "";
  const { user } = useAuthStore();
  const { formatPrice } = useCurrencyStore();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>("LOADING");
  const [order, setOrder] = useState<any>(null);
  const [pollCount, setPollCount] = useState(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      let orderToken = "";
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        orderToken = urlParams.get("token") || window.sessionStorage.getItem(`order_token_${orderId}`) || "";
      }

      const endpoint = orderToken
        ? `/orders/${orderId}/payment-status?token=${encodeURIComponent(orderToken)}`
        : `/orders/${orderId}/payment-status`;

      const res = await api.get(endpoint);
      const { paymentStatus, orderStatus } = res.data;

      if (paymentStatus === "paid" && orderStatus === "confirmed") {
        // Confirmed — fetch full order for display if authenticated, or use status data
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        try {
          const fullRes = await api.get(`/orders/${orderId}`);
          setOrder(fullRes.data);
        } catch {
          setOrder(res.data);
        }
        setPageState("CONFIRMED");
      } else if (paymentStatus === "failed") {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setOrder(res.data);
        setPageState("FAILED");
      } else if (paymentStatus === "cancelled") {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setOrder(res.data);
        setPageState("CANCELLED");
      } else {

        // Pending or processing — keep polling
        setOrder(res.data);
        setPageState("PENDING");
      }
    } catch (err: any) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      setPageState("NOT_FOUND");
    }
  }, [orderId]);

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pageState === "PENDING") {
      let count = 0;
      pollIntervalRef.current = setInterval(() => {
        count++;
        setPollCount(count);
        if (count >= 20) {
          clearInterval(pollIntervalRef.current!);
          return;
        }
        fetchStatus();
      }, 3000);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [pageState, fetchStatus]);

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (pageState === "LOADING") {
    return (
      <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-10 h-10 border border-luxuryGold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-secondaryText text-xs uppercase tracking-widest">Fetching order status...</p>
        </div>
      </div>
    );
  }

  // ── CONFIRMED ────────────────────────────────────────────────────────────────
  if (pageState === "CONFIRMED" && order) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 animate-fade-in">
        <div className="max-w-2xl mx-auto px-6">

          {/* Hero confirmation block */}
          <div className="text-center space-y-6 mb-16">
            <div className="w-20 h-20 rounded-full bg-background border border-luxuryGold flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10 text-luxuryGold" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium mb-3">
                Payment Verified by RARE NUTS
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-primaryText mb-4">
                Order Confirmed
              </h1>
              <p className="text-secondaryText text-sm leading-relaxed max-w-md mx-auto">
                Your payment has been independently verified. Your vault order is now being prepared.
              </p>
            </div>
          </div>

          {/* Order card */}
          <div className="bg-secondaryBg border border-divider p-8 space-y-8 mb-8">

            {/* Order meta */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-divider">
              <div>
                <p className="text-[10px] uppercase tracking-ultra text-mutedText mb-1">Order Number</p>
                <p className="font-mono text-xl text-primaryText font-medium">#{order.orderNumber}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] uppercase tracking-ultra text-mutedText mb-1">Total Paid</p>
                <p className="font-serif text-2xl text-luxuryGold" suppressHydrationWarning>
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-luxuryGold/30 text-[10px] uppercase tracking-ultra text-luxuryGold rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Payment Verified
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-divider text-[10px] uppercase tracking-ultra text-secondaryText rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-luxuryGold animate-ping" />
                {order.orderStatus || "Confirmed"}
              </span>
            </div>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-ultra text-mutedText">Reserved Items</p>
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 bg-background p-4 border border-divider"
                  >
                    <div className="min-w-0">
                      <p className="text-primaryText font-serif text-sm font-medium truncate">
                        {item.productName}
                      </p>
                      <p className="text-mutedText text-[10px] font-mono mt-0.5">
                        {item.sku && `SKU: ${item.sku} · `}Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-luxuryGold font-serif flex-shrink-0" suppressHydrationWarning>
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Address */}
            {order.address && (
              <div className="pt-4 border-t border-divider space-y-2">
                <p className="text-[10px] uppercase tracking-ultra text-mutedText">Dispatching To</p>
                <p className="text-primaryText text-sm">{order.address.fullName}</p>
                <p className="text-secondaryText text-xs leading-relaxed">
                  {order.address.addressLine1}
                  {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}
                  <br />
                  {order.address.city}, {order.address.state} — {order.address.postalCode}
                  <br />
                  {order.address.country}
                </p>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            {user && (
              <button
                onClick={() => router.push("/account")}
                className="luxury-button flex items-center justify-center gap-2 flex-1 py-3 text-xs"
              >
                <Package size={16} />
                Track Your Order
              </button>
            )}
            <button
              onClick={() => router.push("/shop")}
              className="luxury-button-outline flex items-center justify-center gap-2 flex-1 py-3 text-xs"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-divider flex items-center justify-center gap-6 text-[10px] text-mutedText uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-luxuryGold" />
              Payment Verified
            </span>
            <span>·</span>
            <span>Insured Vault Dispatch</span>
            <span>·</span>
            <span>RARE NUTS Quality Guarantee</span>
          </div>
        </div>
      </div>
    );
  }

  // ── PENDING (payment verification in progress) ────────────────────────────────
  if (pageState === "PENDING") {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center animate-fade-in">
        <div className="max-w-md mx-auto px-6 text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-background border border-amber-400/50 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-primaryText mb-4">
              Verifying Your Payment
            </h1>
            <p className="text-secondaryText text-sm leading-relaxed">
              We&apos;re confirming your payment with our secure verification system.
              This usually takes only a moment.
            </p>
          </div>

          <div className="bg-secondaryBg border border-divider p-6 space-y-3">
            {order?.orderNumber && (
              <p className="text-[10px] uppercase tracking-ultra text-mutedText">
                Order <span className="font-mono text-primaryText">#{order.orderNumber}</span>
              </p>
            )}
            <div className="flex items-center justify-center gap-3 text-secondaryText text-xs">
              <div className="w-4 h-4 border border-luxuryGold border-t-transparent rounded-full animate-spin" />
              Checking payment status...
              {pollCount > 0 && (
                <span className="text-mutedText">({pollCount})</span>
              )}
            </div>
          </div>

          {pollCount >= 20 && (
            <div className="space-y-4">
              <p className="text-secondaryText text-xs">
                Verification is taking longer than usual. Your order is safe — check &apos;My Orders&apos; in a few minutes.
              </p>
              <button
                onClick={() => router.push(user ? "/account" : "/shop")}
                className="luxury-button text-xs px-6 py-2"
              >
                {user ? "Go to My Orders" : "Continue Shopping"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── FAILED ────────────────────────────────────────────────────────────────────
  if (pageState === "FAILED") {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center animate-fade-in">
        <div className="max-w-md mx-auto px-6 text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-background border border-error/50 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-primaryText mb-4">Payment Failed</h1>
            <p className="text-secondaryText text-sm leading-relaxed">
              Your payment could not be verified. No charges were applied to your account.
              {order?.orderNumber && (
                <> Your order <span className="font-mono text-primaryText">#{order.orderNumber}</span> has been saved and you can retry from your account.</>
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/checkout" className="luxury-button text-xs px-6 py-3 text-center">
              Retry Payment
            </Link>
            {user && (
              <button
                onClick={() => router.push("/account")}
                className="luxury-button-outline text-xs px-6 py-3"
              >
                My Orders
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── CANCELLED ─────────────────────────────────────────────────────────────────
  if (pageState === "CANCELLED") {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center animate-fade-in">
        <div className="max-w-md mx-auto px-6 text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-background border border-amber-400/50 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-primaryText mb-4">Payment Cancelled</h1>
            <p className="text-secondaryText text-sm leading-relaxed">
              You cancelled the payment. Your order is saved —
              {user ? " you can retry the payment from your account." : " please contact us if you need assistance."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/checkout" className="luxury-button text-xs px-6 py-3 text-center">
              Retry Payment
            </Link>
            {user && (
              <button onClick={() => router.push("/account")} className="luxury-button-outline text-xs px-6 py-3">
                My Orders
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── NOT FOUND ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center animate-fade-in">
      <div className="max-w-md mx-auto px-6 text-center space-y-8">
        <Package className="w-12 h-12 text-mutedText mx-auto" />
        <div>
          <h1 className="font-serif text-3xl text-primaryText mb-4">Order Not Found</h1>
          <p className="text-secondaryText text-sm">
            We couldn&apos;t find this order. Please check &apos;My Orders&apos; in your account.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push(user ? "/account" : "/shop")} className="luxury-button text-xs px-6 py-3">
            {user ? "My Orders" : "Shop"}
          </button>
        </div>
      </div>
    </div>
  );
}
