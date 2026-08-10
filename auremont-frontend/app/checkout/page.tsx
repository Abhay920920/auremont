/* eslint-disable max-lines-per-function, complexity */
"use client";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import { Lock, ShieldCheck, CreditCard } from "lucide-react";

import CustomInput from "@/components/checkout/CustomInput";
import ProgressIndicator from "@/components/checkout/ProgressIndicator";
import { useCurrencyStore } from "@/store/currencyStore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, cartId, clearCart, fetchCart, loading: cartLoading } = useCartStore();
  const { user } = useAuthStore();
  const { currency, formatPrice } = useCurrencyStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isSuccessRef = useRef(false);

  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Information", "Payment"];

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const recoverId = params.get('recover');
      if (recoverId) {
        useCartStore.setState({ cartId: recoverId });
      }
    }
    fetchCart();
    if (user) {
      setAddress(prev => ({ 
        ...prev, 
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
      }));
    }
  }, [user, fetchCart]);

  const safeItems = items || [];
  const subtotal = safeItems.reduce((sum, item) => sum + (item.quantity * Number(item.unitPrice || 0)), 0);

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, subtotal });
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
    if (appliedCoupon.type === 'percentage') {
      discount = subtotal * (Number(appliedCoupon.value) / 100);
      if (appliedCoupon.maxDiscount && discount > Number(appliedCoupon.maxDiscount)) {
        discount = Number(appliedCoupon.maxDiscount);
      }
    } else {
      discount = Number(appliedCoupon.value);
    }
  }

  const shipping = 0.00; // Complimentary shipping
  const tax = subtotal * 0.05; // 5% GST
  const total = Math.max(subtotal + shipping + tax - discount, 0);

  if (!mounted || (cartLoading && safeItems.length === 0)) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-background pt-32">
        <div className="w-10 h-10 border border-luxuryGold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (safeItems.length === 0 && !cartLoading && !successMessage && !isSuccessRef.current) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center space-y-8 bg-background pt-32">
        <h1 className="text-4xl md:text-5xl font-serif text-primaryText">Your Cart is Empty</h1>
        <button onClick={() => router.push('/shop')} className="luxury-button mt-4">Return to Collection</button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    if (!address.fullName || (!user && !address.email) || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.postalCode) {
      setError("Please fill out all required address and contact fields.");
      return false;
    }
    setError("");
    return true;
  };

  const openRazorpayModal = (paymentSession: any, orderId: string) => {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    const handleVerifyAndComplete = async (paymentId: string, signature: string) => {
      try {
        setPaymentLoading(true);
        await api.post('/payments/verify', {
          razorpay_order_id: paymentSession.razorpayOrderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature
        });
        isSuccessRef.current = true;
        setSuccessMessage("Payment successful! Your order has been confirmed (Dev Mode).");
        setPaymentLoading(false);
        clearCart();
        window.sessionStorage.removeItem('checkout_idempotency_key');
        setTimeout(() => router.push(user ? '/account' : '/shop'), 2500);
      } catch (err) {
        setPaymentLoading(false);
        setError("Payment verification failed.");
      }
    };

    // In dev mode, test environment, or for mock orders, trigger completion handler directly
    if (!keyId || paymentSession.razorpayOrderId?.startsWith('order_mock_')) {
      handleVerifyAndComplete(`pay_mock_${Date.now()}`, 'mock_signature');
      return;
    }

    const options = {
      key: keyId,
      amount: paymentSession.amount,
      currency: currency || paymentSession.currency || 'INR',
      name: 'RARE NUTS',
      description: 'Premium California Almonds',
      order_id: paymentSession.razorpayOrderId,
      handler: async (response: any) => {
        handleVerifyAndComplete(
          response.razorpay_payment_id || `pay_mock_${Date.now()}`,
          response.razorpay_signature || 'mock_signature'
        );
      },
      prefill: {
        name: address.fullName,
        contact: address.phone,
        email: address.email || user?.email || '',
      },
      theme: {
        color: '#D4AF37',
      },
      modal: {
        ondismiss: () => {
          setPaymentLoading(false);
          setError("Payment was cancelled. Your order is saved — you can retry from your account.");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      setPaymentLoading(false);
      setError("Payment failed. Your order is saved — please try again.");
    });

    rzp.open();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validateAddress()) {
      setCurrentStep(0);
      return;
    }

    setLoading(true);
    setPaymentLoading(false);
    setError("");

    try {
      const randomUuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const idempotencyKey =
        window.sessionStorage.getItem('checkout_idempotency_key') ||
        `${Date.now()}-${randomUuid}`;
      window.sessionStorage.setItem('checkout_idempotency_key', idempotencyKey);

      const { email: addrEmail, ...cleanAddress } = address;

      const res = await api.post('/orders', {
        cartId,
        couponId: appliedCoupon ? appliedCoupon.id : undefined,
        idempotencyKey,
        guestEmail: !user ? address.email : undefined,
        address: cleanAddress,
      });

      setLoading(false);
      const { paymentSession } = res.data;

      if (paymentSession?.razorpayOrderId && window.Razorpay) {
        setPaymentLoading(true);
        openRazorpayModal(paymentSession, res.data.id || res.data.order?.id);
      } else {
        isSuccessRef.current = true;
        setSuccessMessage("Order placed successfully! A confirmation email will be sent once payment is processed.");
        clearCart();
        window.sessionStorage.removeItem('checkout_idempotency_key');
        setTimeout(() => router.push(user ? '/account' : '/shop'), 2500);
      }
    } catch (err: any) {
      const errorMsg = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(', ')
        : (err.response?.data?.message || err.message || "Failed to place order. Please try again.");
      setError(errorMsg);
      setLoading(false);
      setPaymentLoading(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen pt-32 pb-24 md:pb-super animate-fade-in">
      {/* Success overlay */}
      {(successMessage || isSuccessRef.current) && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-secondaryBg border border-divider p-12 text-center max-w-md w-full space-y-6">
            <div className="w-16 h-16 rounded-full bg-background border border-luxuryGold flex items-center justify-center mx-auto mb-8 animate-pulse">
              <ShieldCheck className="w-8 h-8 text-luxuryGold" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-primaryText">Order Confirmed</h2>
            <p className="text-secondaryText leading-relaxed">{successMessage || "Payment successful! Your order has been confirmed (Dev Mode)."}</p>
            <p className="text-mutedText text-xs uppercase tracking-widest pt-4">Redirecting...</p>
          </div>
        </div>
      )}

      {/* Payment loading overlay */}
      {paymentLoading && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-6 max-w-xs">
            <div className="w-12 h-12 border border-luxuryGold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-primaryText font-serif text-xl tracking-widest uppercase">Connecting to Secure Gateway</p>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Checkout Form */}
        <div className="flex-grow max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-serif text-primaryText mb-8 flex items-center gap-3">
            Secure Checkout
            <Lock className="text-luxuryGold" size={22} strokeWidth={1.5} />
          </h1>
          
          <ProgressIndicator steps={steps} currentStep={currentStep} />

          <form onSubmit={handlePlaceOrder} className="space-y-10">
            {error && <div className="text-error bg-error/10 border border-error/20 p-4 rounded-sm text-xs font-medium">{error}</div>}
            
            {/* Step 0: Information */}
            {currentStep === 0 && (
              <div className="space-y-10 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
                  <div className="md:col-span-2">
                    <h2 className="text-[11px] tracking-widest uppercase text-primaryText border-b border-divider pb-3 font-medium mb-6">Shipping Information</h2>
                  </div>
                  
                  {!user && (
                    <div className="md:col-span-2">
                      <CustomInput label="Email Address (for order tracking & receipt)" name="email" value={address.email} onChange={handleChange} required type="email" />
                    </div>
                  )}

                  <CustomInput label="Full Name" name="fullName" value={address.fullName} onChange={handleChange} required />
                  <CustomInput label="Phone Number" name="phone" value={address.phone} onChange={handleChange} required type="tel" />
                  
                  <div className="md:col-span-2">
                    <CustomInput label="Address Line 1" name="addressLine1" value={address.addressLine1} onChange={handleChange} required />
                  </div>
                  <div className="md:col-span-2">
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
                  className="w-full luxury-button mt-8 h-12 text-xs"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 1: Payment */}
            {currentStep === 1 && (
              <div className="space-y-10 animate-fade-in">
                <div>
                  <h2 className="text-[11px] tracking-widest uppercase text-primaryText border-b border-divider pb-3 font-medium mb-6 flex justify-between items-center">
                    Payment
                    <button type="button" onClick={() => setCurrentStep(0)} className="text-luxuryGold hover:text-goldHover text-[10px]">Edit Info</button>
                  </h2>
                  
                  <div className="flex items-start gap-4 p-5 border border-luxuryGold bg-secondaryBg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-luxuryGold" />
                    <div className="flex-shrink-0 mt-0.5">
                      <CreditCard className="w-5 h-5 text-luxuryGold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-serif text-lg text-primaryText mb-1">Razorpay Secure Checkout</p>
                      <p className="text-xs tracking-wide text-secondaryText mb-3">You will be redirected to Razorpay to complete your purchase securely.</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-background border border-divider text-[9px] uppercase tracking-widest text-mutedText rounded-sm">UPI</span>
                        <span className="px-2 py-0.5 bg-background border border-divider text-[9px] uppercase tracking-widest text-mutedText rounded-sm">Cards</span>
                        <span className="px-2 py-0.5 bg-background border border-divider text-[9px] uppercase tracking-widest text-mutedText rounded-sm">Net Banking</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-divider bg-background text-xs text-secondaryText leading-relaxed">
                  <p>By clicking "Complete Purchase", you acknowledge that you have read and agree to RARE NUTS's <Link href="/terms" className="text-luxuryGold underline hover:text-goldHover" target="_blank">Terms of Service</Link> and <Link href="/privacy-policy" className="text-luxuryGold underline hover:text-goldHover" target="_blank">Privacy Policy</Link>.</p>
                </div>

                <button 
                  type="submit" 
                  onClick={handlePlaceOrder}
                  disabled={loading || paymentLoading} 
                  className="w-full luxury-button mt-8 disabled:opacity-50 flex items-center justify-center h-12 text-xs group"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 border border-background border-t-transparent rounded-full animate-spin" />
                      Processing Securely...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
                      Complete Purchase — <span suppressHydrationWarning>{formatPrice(total)}</span>
                    </span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[420px] flex-shrink-0 mt-10 lg:mt-0">
          <div className="bg-secondaryBg p-6 border border-divider sticky top-32">
            <h2 className="font-serif text-xl md:text-2xl text-primaryText border-b border-divider pb-4 mb-6">Summary</h2>

            <div className="space-y-4 mb-6 max-h-[35vh] overflow-y-auto pr-2 scrollbar-hide">
              {safeItems.map(item => (
                <div key={item.id} className="flex gap-3 items-center group">
                  <div className="w-14 h-16 bg-background border border-divider relative flex-shrink-0 overflow-hidden">
                    <Image 
                      src={(item as any).product?.thumbnailUrl || '/images/california-almonds-250g.png'} 
                      alt={(item as any).product?.name || 'Product'} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex-grow flex justify-between items-center text-xs">
                    <div>
                      <p className="text-primaryText font-serif text-sm group-hover:text-luxuryGold transition-colors">{(item as any).product?.name}</p>
                      <p className="text-secondaryText text-[9px] uppercase tracking-widest mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-primaryText font-medium" suppressHydrationWarning>{formatPrice(item.quantity * Number(item.unitPrice || 0))}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-divider pt-4 space-y-4 mb-6">
              <div className="space-y-3">
                <CustomInput 
                  label="Gift Card or Privilege Code" 
                  name="couponCode" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={Boolean(appliedCoupon)}
                />
                
                <button
                  type="button"
                  onClick={appliedCoupon ? removeCoupon : applyCoupon}
                  disabled={applyingCoupon || (!couponCode && !appliedCoupon)}
                  className="w-full h-10 luxury-button-outline text-xs disabled:opacity-50"
                >
                  {applyingCoupon ? 'Verifying...' : appliedCoupon ? 'Remove Code' : 'Apply Code'}
                </button>
                {couponError && <p className="text-error text-xs text-center">{couponError}</p>}
                {appliedCoupon && <p className="text-luxuryGold text-xs text-center">Privilege '{appliedCoupon.code}' Applied</p>}
              </div>
            </div>

            <div className="border-t border-divider pt-4 space-y-3 text-xs text-secondaryText mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-primaryText" suppressHydrationWarning>{formatPrice(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-luxuryGold">
                  <span>Discount</span>
                  <span suppressHydrationWarning>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-primaryText">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5% GST)</span>
                <span className="text-primaryText" suppressHydrationWarning>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="border-t border-divider pt-4 flex justify-between font-serif text-xl md:text-2xl text-primaryText">
              <span>Total</span>
              <span className="text-luxuryGold" suppressHydrationWarning>{formatPrice(total)}</span>
            </div>
            
            <div className="mt-8 pt-6 border-t border-divider flex flex-col gap-4 text-[10px] text-mutedText uppercase tracking-widest text-center">
              <p className="flex items-center justify-center gap-2">
                <ShieldCheck size={14} /> 256-Bit Encryption
              </p>
              <p>RARE NUTS Quality Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
