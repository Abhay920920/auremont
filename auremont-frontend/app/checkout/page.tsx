/* eslint-disable max-lines-per-function, complexity */
"use client";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import { Lock, ShieldCheck, CreditCard, AlertCircle, Clock, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import CustomInput from "@/components/checkout/CustomInput";
import ProgressIndicator from "@/components/checkout/ProgressIndicator";
import { useCurrencyStore } from "@/store/currencyStore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Explicit payment state machine.
 *
 * IDLE → ORDER_CREATING → PAYMENT_PENDING → VERIFYING → CONFIRMED | FAILED | CANCELLED | UNKNOWN
 *
 * IMPORTANT: "CONFIRMED" is only set AFTER the backend responds with
 * { success: true, order: { paymentStatus: "paid", orderStatus: "confirmed" } }
 *
 * The frontend NEVER decides that payment succeeded.
 */
type PaymentState =
  | "IDLE"
  | "ORDER_CREATING"
  | "PAYMENT_PENDING"
  | "VERIFYING"
  | "CONFIRMED"
  | "FAILED"
  | "CANCELLED"
  | "UNKNOWN";

export default function CheckoutPage() {
  const { items, cartId, clearCart, fetchCart, loading: cartLoading } = useCartStore();
  const { user } = useAuthStore();
  const { currency, formatPrice } = useCurrencyStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // ── Payment State Machine ──────────────────────────────────────────────────
  const [paymentState, setPaymentState] = useState<PaymentState>("IDLE");
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [stateMessage, setStateMessage] = useState("");
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const verificationAttemptedRef = useRef(false);

  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Information", "Payment"];

  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // ── Coupon State ──────────────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push("/login?redirect=/checkout&reason=cart");
      return;
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const recoverId = params.get("recover");
      if (recoverId) {
        useCartStore.setState({ cartId: recoverId });
      }
    }
    if (!items || items.length === 0) {
      fetchCart();
    }
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const safeItems = items || [];
  const subtotal = safeItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.unitPrice || 0),
    0
  );

  const applyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await api.post("/coupons/validate", { code: couponCode, subtotal });
      setAppliedCoupon(res.data.coupon);
    } catch (err: any) {
      setCouponError(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discount = subtotal * (Number(appliedCoupon.value) / 100);
      if (appliedCoupon.maxDiscount && discount > Number(appliedCoupon.maxDiscount)) {
        discount = Number(appliedCoupon.maxDiscount);
      }
    } else {
      discount = Number(appliedCoupon.value);
    }
  }

  const shipping = 0.0;
  const tax = subtotal * 0.05;
  const total = Math.max(subtotal + shipping + tax - discount, 0);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    if (
      !address.fullName ||
      (!user && !address.email) ||
      !address.phone ||
      !address.addressLine1 ||
      !address.city ||
      !address.state ||
      !address.postalCode
    ) {
      setError("Please fill out all required address and contact fields.");
      return false;
    }
    setError("");
    return true;
  };

  /**
   * AUTHORITATIVE payment verification.
   *
   * This is called after Razorpay redirects/callbacks. The backend independently:
   *   1. Verifies the Razorpay signature
   *   2. Fetches the actual payment from Razorpay API
   *   3. Validates amount, currency, capture status
   *   4. Atomically marks the order as paid + confirmed
   *   5. Returns the confirmed order state
   *
   * The frontend shows "Order Confirmed" ONLY IF the backend returns paymentStatus === 'paid'.
   */
  const handleVerifyPayment = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    createdOrderId: string,
  ) => {
      if (verificationAttemptedRef.current) return;
      verificationAttemptedRef.current = true;

      setPaymentState("VERIFYING");
      setStateMessage("Verifying payment with our server...");

      try {
        const res = await api.post("/payments/verify", {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        });

        const { success, order: serverOrder } = res.data;

        // Backend is authoritative — only show confirmed if backend says paid
        if (success && serverOrder?.paymentStatus === "paid") {
          clearCart();
          window.sessionStorage.removeItem("checkout_idempotency_key");
          setConfirmedOrder(serverOrder);
          setPaymentState("CONFIRMED");
          // Redirect to the server-authoritative confirmation page
          setTimeout(
            () => router.push(`/order-confirmation/${serverOrder.id}`),
            1500,
          );
        } else {
          // Backend returned success: false or non-paid status — do NOT confirm
          setPaymentState("UNKNOWN");
          setStateMessage(
            "Payment verification is pending. Your order has been saved. " +
              "We will confirm once payment is verified.",
          );
          // Begin polling the authoritative status
          startPollingStatus(createdOrderId);
        }
      } catch (err: any) {
        const code = err.response?.data?.code;
        const message = err.response?.data?.message || "Payment verification failed.";

        if (code === "PAYMENT_NOT_CAPTURED" || code === "AMOUNT_MISMATCH" || code === "CURRENCY_MISMATCH") {
          setPaymentState("FAILED");
          setStateMessage(message);
        } else if (code === "INVALID_SIGNATURE") {
          setPaymentState("FAILED");
          setStateMessage("Payment signature is invalid. Your order has not been confirmed.");
        } else {
          // Network error or unknown — don't confirm, show pending
          setPaymentState("UNKNOWN");
          setStateMessage(
            "We couldn't confirm your payment right now. Please check 'My Orders' in a few minutes.",
          );
          startPollingStatus(createdOrderId);
        }
      }
  };

  /**
   * Polls the backend authoritative payment status every 3 seconds.
   * Used when verification is in-progress or uncertain.
   * Stops once a terminal state (paid/failed/cancelled) is confirmed.
   */
  const startPollingStatus = (orderId: string, token?: string) => {
    let attempts = 0;
    const maxAttempts = 20; // 60 seconds max polling
    const orderToken = token || (typeof window !== "undefined" ? window.sessionStorage.getItem(`order_token_${orderId}`) : null);

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(pollIntervalRef.current!);
        return;
      }

      try {
        const url = orderToken
          ? `/orders/${orderId}/payment-status?token=${encodeURIComponent(orderToken)}`
          : `/orders/${orderId}/payment-status`;
        const res = await api.get(url);
        const { paymentStatus, orderStatus } = res.data;

        if (paymentStatus === "paid" && orderStatus === "confirmed") {
          clearInterval(pollIntervalRef.current!);
          clearCart();
          window.sessionStorage.removeItem("checkout_idempotency_key");
          setConfirmedOrder(res.data);
          setPaymentState("CONFIRMED");
          const targetUrl = orderToken
            ? `/order-confirmation/${orderId}?token=${encodeURIComponent(orderToken)}`
            : `/order-confirmation/${orderId}`;
          router.push(targetUrl);
        } else if (paymentStatus === "failed") {
          clearInterval(pollIntervalRef.current!);
          setPaymentState("FAILED");
          setStateMessage("Payment failed. Your order could not be confirmed.");
        } else if (paymentStatus === "cancelled") {
          clearInterval(pollIntervalRef.current!);
          setPaymentState("CANCELLED");
          setStateMessage("Payment was cancelled.");
        }
      } catch {
        // Polling error — keep trying
      }
    }, 3000);
  };

  const openRazorpayModal = (paymentSession: any, createdOrderId: string) => {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    // ── Dev/mock mode ──────────────────────────────────────────────────────────
    // Even in mock mode, we ALWAYS call /payments/verify on the backend.
    // The backend mock path skips the Razorpay API call but still performs
    // full DB state transitions (amount validation, atomic paid→confirmed).
    if (!keyId || paymentSession.razorpayOrderId?.startsWith("order_mock_")) {
      handleVerifyPayment(
        paymentSession.razorpayOrderId,
        `pay_mock_${Date.now()}`,
        "mock_signature",
        createdOrderId,
      );
      return;
    }

    // ── Live Razorpay modal ────────────────────────────────────────────────────
    const options = {
      key: keyId,
      amount: paymentSession.amount,
      currency: currency || paymentSession.currency || "INR",
      name: "RARE NUTS",
      description: "Premium Reserve Nuts",
      order_id: paymentSession.razorpayOrderId,
      handler: (response: any) => {
        // Razorpay calls this on payment completion. We ALWAYS verify with backend.
        handleVerifyPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
          createdOrderId,
        );
      },
      prefill: {
        name: address.fullName,
        contact: address.phone,
        email: address.email || user?.email || "",
      },
      theme: { color: "#D4AF37" },
      modal: {
        ondismiss: () => {
          // User closed the modal without completing payment
          setPaymentState("CANCELLED");
          setStateMessage(
            "Payment was cancelled. Your order is saved — you can retry from your account.",
          );
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response: any) => {
      setPaymentState("FAILED");
      setStateMessage(
        response?.error?.description ||
          "Payment failed. Please try again from your account.",
      );
    });
    rzp.open();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentState !== "IDLE") return;
    if (!validateAddress()) {
      setCurrentStep(0);
      return;
    }

    setPaymentState("ORDER_CREATING");
    setError("");

    try {
      const randomUuid =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const idempotencyKey =
        window.sessionStorage.getItem("checkout_idempotency_key") ||
        `${Date.now()}-${randomUuid}`;
      window.sessionStorage.setItem("checkout_idempotency_key", idempotencyKey);

      const { email: addrEmail, ...cleanAddress } = address;

      const res = await api.post("/orders", {
        cartId,
        couponId: appliedCoupon ? appliedCoupon.id : undefined,
        idempotencyKey,
        guestEmail: user?.email || address.email || undefined,
        address: cleanAddress,
      });

      const { paymentSession, orderToken } = res.data;
      const createdOrderId = res.data.id || res.data.order?.id;

      if (orderToken && typeof window !== "undefined") {
        window.sessionStorage.setItem(`order_token_${createdOrderId}`, orderToken);
      }

      setPaymentState("PAYMENT_PENDING");

      if (paymentSession?.razorpayOrderId && window.Razorpay) {
        openRazorpayModal(paymentSession, createdOrderId);
      } else if (paymentSession?.razorpayOrderId) {
        // Razorpay SDK not loaded yet — verify directly (mock/dev path)
        handleVerifyPayment(
          paymentSession.razorpayOrderId,
          `pay_mock_${Date.now()}`,
          "mock_signature",
          createdOrderId,
        );
      } else {
        // No payment session returned — verify with backend to determine status
        // This should not happen in normal flow but we handle it safely
        setPaymentState("UNKNOWN");
        setStateMessage("Payment session unavailable. Please check your orders.");
        if (createdOrderId) startPollingStatus(createdOrderId, orderToken);
      }
    } catch (err: any) {
      const errorMsg = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(", ")
        : err.response?.data?.message || err.message || "Failed to place order. Please try again.";
      setError(errorMsg);
      setPaymentState("IDLE");
    }
  };

  const isLoading = paymentState === "ORDER_CREATING" || paymentState === "PAYMENT_PENDING" || paymentState === "VERIFYING";

  if (!mounted || (cartLoading && safeItems.length === 0)) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-background pt-32">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border border-luxuryGold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-secondaryText text-xs uppercase tracking-widest">Initializing Secure Checkout...</p>
        </div>
      </div>
    );
  }

  if (
    safeItems.length === 0 &&
    !cartLoading &&
    paymentState === "IDLE"
  ) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center bg-background pt-32">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 rounded-full bg-secondaryBg border border-divider flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-luxuryGold" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-serif text-primaryText">Your Cart is Empty</h1>
            <p className="text-xs uppercase tracking-widest text-secondaryText leading-relaxed">
              Explore our master reserve collection and select your artisanal nuts before proceeding to checkout.
            </p>
          </div>
          <button onClick={() => router.push("/shop")} className="luxury-button inline-flex items-center gap-2">
            <span>Return to Collection</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen pt-32 pb-24 md:pb-super animate-fade-in">

      {/* ── CONFIRMED overlay ─────────────────────────────────────────────────── */}
      {paymentState === "CONFIRMED" && confirmedOrder && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-secondaryBg border border-luxuryGold p-12 text-center max-w-md w-full space-y-6">
            <div className="w-16 h-16 rounded-full bg-background border border-luxuryGold flex items-center justify-center mx-auto mb-8">
              <ShieldCheck className="w-8 h-8 text-luxuryGold" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-primaryText">Order Confirmed</h2>
            <p className="text-secondaryText text-sm">
              Order <span className="font-mono text-primaryText">#{confirmedOrder.orderNumber}</span>
            </p>
            <p className="text-luxuryGold font-serif text-2xl" suppressHydrationWarning>
              {formatPrice(confirmedOrder.total)}
            </p>
            <p className="text-mutedText text-xs uppercase tracking-widest pt-2">
              Payment verified · Redirecting...
            </p>
          </div>
        </div>
      )}

      {/* ── VERIFYING overlay ─────────────────────────────────────────────────── */}
      {(paymentState === "VERIFYING" || paymentState === "PAYMENT_PENDING" || paymentState === "ORDER_CREATING") && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-6 max-w-xs">
            <div className="w-12 h-12 border border-luxuryGold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-primaryText font-serif text-xl tracking-widest uppercase">
              {paymentState === "ORDER_CREATING"
                ? "Preparing Your Order..."
                : paymentState === "VERIFYING"
                ? "Verifying Payment..."
                : "Connecting to Secure Gateway"}
            </p>
            {stateMessage && (
              <p className="text-secondaryText text-xs">{stateMessage}</p>
            )}
          </div>
        </div>
      )}

      {/* ── UNKNOWN overlay (polling) ─────────────────────────────────────────── */}
      {paymentState === "UNKNOWN" && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-secondaryBg border border-divider p-12 text-center max-w-md w-full space-y-6">
            <Clock className="w-10 h-10 text-amber-400 mx-auto" />
            <h2 className="font-serif text-2xl text-primaryText">Payment Verification In Progress</h2>
            <p className="text-secondaryText text-sm leading-relaxed">{stateMessage}</p>
            <button
              onClick={() => router.push(user ? "/account" : "/shop")}
              className="luxury-button-outline text-xs px-6 py-2"
            >
              {user ? "Go to My Orders" : "Continue Shopping"}
            </button>
          </div>
        </div>
      )}

      {/* ── FAILED overlay ────────────────────────────────────────────────────── */}
      {paymentState === "FAILED" && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-secondaryBg border border-error/30 p-12 text-center max-w-md w-full space-y-6">
            <AlertCircle className="w-10 h-10 text-error mx-auto" />
            <h2 className="font-serif text-2xl text-primaryText">Payment Failed</h2>
            <p className="text-secondaryText text-sm leading-relaxed">{stateMessage}</p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => { setPaymentState("IDLE"); setError(""); verificationAttemptedRef.current = false; }}
                className="luxury-button text-xs px-6 py-2"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push(user ? "/account" : "/shop")}
                className="luxury-button-outline text-xs px-6 py-2"
              >
                My Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CANCELLED overlay ─────────────────────────────────────────────────── */}
      {paymentState === "CANCELLED" && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-secondaryBg border border-divider p-12 text-center max-w-md w-full space-y-6">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <h2 className="font-serif text-2xl text-primaryText">Payment Cancelled</h2>
            <p className="text-secondaryText text-sm leading-relaxed">
              You cancelled the payment. Your order is saved — you can retry from your account.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => { setPaymentState("IDLE"); verificationAttemptedRef.current = false; }}
                className="luxury-button text-xs px-6 py-2"
              >
                Retry Payment
              </button>
              <button
                onClick={() => router.push(user ? "/account" : "/shop")}
                className="luxury-button-outline text-xs px-6 py-2"
              >
                My Orders
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Security Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-8 sm:mb-10 border-b border-divider/60">
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondaryText hover:text-luxuryGold transition-colors"
            >
              <ArrowLeft size={14} /> Return to Cart
            </Link>
            <span className="text-divider hidden sm:inline">•</span>
            <span className="text-xs uppercase tracking-widest text-mutedText hidden sm:inline">Checkout</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-ultra text-luxuryGold font-medium">
            <ShieldCheck size={14} /> Private Vault Dispatch · 256-Bit SSL
          </div>
        </div>

        {/* Responsive 12-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">

          {/* Left Column: Form & Stepper (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif text-primaryText mb-2 flex items-center gap-3">
                Secure Checkout
                <Lock className="text-luxuryGold" size={20} strokeWidth={1.5} />
              </h1>
              <p className="text-xs uppercase tracking-widest text-secondaryText">
                Provide your dispatch details and complete your reserve order.
              </p>
            </div>

            <ProgressIndicator steps={steps} currentStep={currentStep} />

            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {error && (
                <div className="text-error bg-error/10 border border-error/20 p-4 rounded-sm text-xs font-medium flex items-start gap-2.5">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 0: Information */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-divider/80 pb-3">
                    <h2 className="text-[11px] tracking-widest uppercase text-primaryText font-medium">
                      Shipping Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                    {!user && (
                      <div className="sm:col-span-2">
                        <CustomInput
                          label="Email Address (for order tracking & receipt)"
                          name="email"
                          value={address.email}
                          onChange={handleChange}
                          required
                          type="email"
                        />
                      </div>
                    )}

                    <CustomInput label="Full Name" name="fullName" value={address.fullName} onChange={handleChange} required />
                    <CustomInput label="Phone Number" name="phone" value={address.phone} onChange={handleChange} required type="tel" />

                    <div className="sm:col-span-2">
                      <CustomInput label="Address Line 1" name="addressLine1" value={address.addressLine1} onChange={handleChange} required />
                    </div>
                    <div className="sm:col-span-2">
                      <CustomInput label="Address Line 2 (Apartment, suite, etc.)" name="addressLine2" value={address.addressLine2} onChange={handleChange} />
                    </div>

                    <CustomInput label="City" name="city" value={address.city} onChange={handleChange} required />
                    <CustomInput label="State / Province" name="state" value={address.state} onChange={handleChange} required />
                    <CustomInput label="Postal Code" name="postalCode" value={address.postalCode} onChange={handleChange} required />
                    <CustomInput label="Country/Region" name="country" value={address.country} readOnly className="text-mutedText" />
                  </div>

                  <button
                    type="button"
                    onClick={() => validateAddress() && setCurrentStep(1)}
                    className="w-full luxury-button mt-6 h-12 text-xs flex items-center justify-center gap-2"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Step 1: Payment */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-divider/80 pb-3 flex justify-between items-center">
                    <h2 className="text-[11px] tracking-widest uppercase text-primaryText font-medium">
                      Payment Method
                    </h2>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="text-luxuryGold hover:text-goldHover text-[10px] uppercase tracking-wider font-medium flex items-center gap-1"
                    >
                      Edit Address
                    </button>
                  </div>

                  {/* Delivery Address Summary Card */}
                  <div className="bg-secondaryBg/40 border border-divider p-4 sm:p-5 flex justify-between items-start">
                    <div className="space-y-1 text-xs">
                      <p className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium">Deliver To</p>
                      <p className="text-primaryText font-medium">{address.fullName} • {address.phone}</p>
                      <p className="text-secondaryText">{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
                      <p className="text-secondaryText">{address.city}, {address.state} {address.postalCode}, {address.country}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="text-luxuryGold hover:text-goldHover text-xs uppercase tracking-wider font-medium"
                    >
                      Change
                    </button>
                  </div>

                  {/* Gateway Banner */}
                  <div className="p-5 border border-luxuryGold bg-secondaryBg relative overflow-hidden space-y-3">
                    <div className="absolute top-0 left-0 w-1 h-full bg-luxuryGold" />
                    <div className="flex items-start gap-3.5">
                      <div className="flex-shrink-0 mt-0.5">
                        <CreditCard className="w-5 h-5 text-luxuryGold" strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-serif text-lg text-primaryText">Razorpay Secure Checkout</p>
                        <p className="text-xs text-secondaryText leading-relaxed">
                          Instant verification via UPI, Credit/Debit Cards, and Net Banking. All transactions are SSL encrypted.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1 pl-8">
                      <span className="px-2 py-0.5 bg-background border border-divider text-[9px] uppercase tracking-widest text-mutedText rounded-sm">UPI (GPay / PhonePe / Paytm)</span>
                      <span className="px-2 py-0.5 bg-background border border-divider text-[9px] uppercase tracking-widest text-mutedText rounded-sm">Visa / Mastercard / RuPay</span>
                      <span className="px-2 py-0.5 bg-background border border-divider text-[9px] uppercase tracking-widest text-mutedText rounded-sm">Net Banking</span>
                    </div>
                  </div>

                  <div className="p-4 border border-divider bg-background text-xs text-secondaryText leading-relaxed">
                    <p>
                      By clicking &ldquo;Complete Purchase&rdquo;, you agree to RARE NUTS&rsquo;s{" "}
                      <Link href="/terms" className="text-luxuryGold underline hover:text-goldHover" target="_blank">Terms of Service</Link>{" "}
                      and{" "}
                      <Link href="/privacy-policy" className="text-luxuryGold underline hover:text-goldHover" target="_blank">Privacy Policy</Link>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="w-full luxury-button disabled:opacity-50 flex items-center justify-center h-12 text-xs group"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 border border-background border-t-transparent rounded-full animate-spin" />
                        Processing Securely...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
                        Complete Purchase —{" "}
                        <span suppressHydrationWarning>{formatPrice(total)}</span>
                      </span>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="bg-secondaryBg/70 backdrop-blur-sm p-6 sm:p-7 border border-divider sticky top-28 space-y-6">
              <div className="flex justify-between items-baseline border-b border-divider pb-4">
                <h2 className="font-serif text-xl md:text-2xl text-primaryText">Order Summary</h2>
                <span className="text-xs uppercase tracking-widest text-mutedText">
                  {safeItems.reduce((sum, item) => sum + item.quantity, 0)} {safeItems.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Items scroll area */}
              <div className="space-y-4 max-h-[38vh] overflow-y-auto pr-2 scrollbar-hide">
                {safeItems.map((item) => (
                  <div key={item.id} className="flex gap-3.5 items-start group">
                    <div className="w-14 h-16 bg-background border border-divider relative flex-shrink-0 overflow-hidden">
                      <Image
                        src={(item as any).product?.thumbnailUrl || "/images/california-almonds-250g.png"}
                        alt={(item as any).product?.name || "Product"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-primaryText font-serif text-sm truncate group-hover:text-luxuryGold transition-colors">
                        {(item as any).product?.name}
                      </p>
                      <p className="text-secondaryText text-[10px] uppercase tracking-widest mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-primaryText font-medium text-sm" suppressHydrationWarning>
                        {formatPrice(item.quantity * Number(item.unitPrice || 0))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Privilege / Gift card input */}
              <div className="border-t border-divider pt-5">
                <div className="flex gap-2.5 items-end">
                  <div className="flex-grow">
                    <CustomInput
                      label="Privilege or Promo Code"
                      name="couponCode"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={Boolean(appliedCoupon)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={appliedCoupon ? removeCoupon : applyCoupon}
                    disabled={applyingCoupon || (!couponCode && !appliedCoupon)}
                    className="h-11 px-5 luxury-button-outline text-[11px] whitespace-nowrap flex-shrink-0 disabled:opacity-50"
                  >
                    {applyingCoupon ? "Verifying..." : appliedCoupon ? "Remove" : "Apply"}
                  </button>
                </div>
                {couponError && <p className="text-error text-xs mt-2">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-luxuryGold text-xs mt-2 flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    Privilege &apos;{appliedCoupon.code}&apos; applied successfully
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-divider pt-5 space-y-3 text-xs text-secondaryText">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-primaryText font-medium" suppressHydrationWarning>{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-luxuryGold">
                    <span>Privilege Discount</span>
                    <span suppressHydrationWarning>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Vault Dispatch</span>
                  <span className="text-primaryText font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="text-primaryText font-medium" suppressHydrationWarning>{formatPrice(tax)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="border-t border-divider pt-4 flex justify-between items-baseline font-serif text-xl sm:text-2xl text-primaryText">
                <span>Total</span>
                <span className="text-luxuryGold font-medium" suppressHydrationWarning>{formatPrice(total)}</span>
              </div>

              {/* Trust Guarantees */}
              <div className="pt-4 border-t border-divider/60 grid grid-cols-2 gap-3 text-[10px] text-mutedText uppercase tracking-widest text-center">
                <div className="flex items-center justify-center gap-1.5 p-2 bg-background/50 border border-divider/40">
                  <ShieldCheck size={13} className="text-luxuryGold flex-shrink-0" />
                  <span>256-Bit SSL</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-2 bg-background/50 border border-divider/40">
                  <Clock size={13} className="text-luxuryGold flex-shrink-0" />
                  <span>Vault Transit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
