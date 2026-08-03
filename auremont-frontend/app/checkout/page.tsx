"use client";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import { Lock, ShieldCheck, CreditCard } from "lucide-react";

import CustomInput from "@/components/checkout/CustomInput";
import ProgressIndicator from "@/components/checkout/ProgressIndicator";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, cartId, clearCart, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Information", "Payment"];

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [address, setAddress] = useState({
    fullName: "",
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
    if (user) {
      fetchCart();
      setAddress(prev => ({ ...prev, fullName: `${user.firstName} ${user.lastName}` }));
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

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center space-y-8 bg-background pt-40">
        <h1 className="text-4xl md:text-5xl font-serif text-primaryText">Secure Checkout</h1>
        <p className="text-secondaryText text-lg max-w-md">Please sign in to proceed with your checkout securely.</p>
        <button onClick={() => router.push('/login')} className="luxury-button mt-4">Sign In to Continue</button>
      </div>
    );
  }

  if (safeItems.length === 0 && !successMessage) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center space-y-8 bg-background pt-40">
        <h1 className="text-4xl md:text-5xl font-serif text-primaryText">Your Cart is Empty</h1>
        <button onClick={() => router.push('/shop')} className="luxury-button mt-4">Return to Collection</button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.postalCode) {
      setError("Please fill out all required address fields.");
      return false;
    }
    setError("");
    return true;
  };

  const openRazorpayModal = (paymentSession: any, orderId: string) => {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId && !paymentSession.razorpayOrderId?.startsWith('order_mock_')) {
      setError("Payment gateway is not properly configured. Please contact support.");
      setPaymentLoading(false);
      return;
    }

    if (paymentSession.razorpayOrderId?.startsWith('order_mock_')) {
      setTimeout(async () => {
        try {
          await api.post('/payments/verify', {
            razorpay_order_id: paymentSession.razorpayOrderId,
            razorpay_payment_id: 'pay_mock_' + Date.now(),
            razorpay_signature: 'mock_signature'
          });
          setPaymentLoading(false);
          clearCart();
          window.sessionStorage.removeItem('checkout_idempotency_key');
          setSuccessMessage("Payment successful! Your order has been confirmed (Dev Mode).");
          setTimeout(() => router.push('/account'), 2000);
        } catch (err) {
          setPaymentLoading(false);
          setError("Dev Mode verification failed.");
        }
      }, 1000);
      return;
    }

    const options = {
      key: keyId,
      amount: paymentSession.amount,
      currency: paymentSession.currency || 'INR',
      name: 'AUREMONT',
      description: 'Premium California Almonds',
      order_id: paymentSession.razorpayOrderId,
      handler: async (response: any) => {
        try {
          setPaymentLoading(true);
          await api.post('/payments/verify', {
            razorpay_order_id: response.razorpay_order_id || paymentSession.razorpayOrderId,
            razorpay_payment_id: response.razorpay_payment_id || 'pay_mock_' + Date.now(),
            razorpay_signature: response.razorpay_signature || 'mock_signature'
          });

          setPaymentLoading(false);
          clearCart();
          window.sessionStorage.removeItem('checkout_idempotency_key');
          setSuccessMessage("Payment successful! Your order has been confirmed.");
          setTimeout(() => router.push('/account'), 2500);
        } catch (err: any) {
          setPaymentLoading(false);
          setError("Payment verification failed. Please check your account or contact support.");
        }
      },
      prefill: {
        name: address.fullName,
        contact: address.phone,
        email: user?.email || '',
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
      setError("Payment failed. Your order is saved — please try again from your account.");
    });
    rzp.open();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to place an order.");
      router.push('/login');
      return;
    }

    setLoading(true);
    setError("");

    try {
      const idempotencyKey =
        window.sessionStorage.getItem('checkout_idempotency_key') ||
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      window.sessionStorage.setItem('checkout_idempotency_key', idempotencyKey);

      const res = await api.post('/orders', {
        cartId,
        couponId: appliedCoupon ? appliedCoupon.id : undefined,
        idempotencyKey,
        address,
      });

      setLoading(false);
      const { paymentSession } = res.data;

      if (paymentSession?.razorpayOrderId && window.Razorpay) {
        setPaymentLoading(true);
        openRazorpayModal(paymentSession, res.data.order.id);
      } else {
        clearCart();
        window.sessionStorage.removeItem('checkout_idempotency_key');
        setSuccessMessage("Order placed successfully!");
        setTimeout(() => router.push('/account'), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen pt-40 pb-24 md:pb-super animate-fade-in">
      {/* Success overlay */}
      {successMessage && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-secondaryBg border border-divider p-12 text-center max-w-md w-full space-y-6">
            <div className="w-16 h-16 rounded-full bg-background border border-luxuryGold flex items-center justify-center mx-auto mb-8 animate-pulse">
              <ShieldCheck className="w-8 h-8 text-luxuryGold" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-primaryText">Order Confirmed</h2>
            <p className="text-secondaryText leading-relaxed">{successMessage}</p>
            <p className="text-mutedText text-xs uppercase tracking-widest pt-4">Redirecting to Concierge...</p>
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
          <h1 className="text-4xl md:text-5xl font-serif text-primaryText mb-12 flex items-center gap-4">
            Secure Checkout
            <Lock className="text-luxuryGold" size={28} strokeWidth={1.5} />
          </h1>
          
          <ProgressIndicator steps={steps} currentStep={currentStep} />

          <form onSubmit={handlePlaceOrder} className="space-y-12">
            
            {/* Step 0: Information */}
            {currentStep === 0 && (
              <div className="space-y-12 animate-fade-in">
                {error && <div className="text-error bg-error/10 border border-error/20 p-4 rounded-sm text-sm">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                  <div className="md:col-span-2">
                    <h2 className="text-[13px] tracking-widest uppercase text-primaryText border-b border-divider pb-4 font-medium mb-8">Shipping Information</h2>
                  </div>
                  
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
                  className="w-full luxury-button mt-12 h-16"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 1: Payment */}
            {currentStep === 1 && (
              <div className="space-y-12 animate-fade-in">
                {error && <div className="text-error bg-error/10 border border-error/20 p-4 rounded-sm text-sm">{error}</div>}

                <div>
                  <h2 className="text-[13px] tracking-widest uppercase text-primaryText border-b border-divider pb-4 font-medium mb-8 flex justify-between items-center">
                    Payment
                    <button type="button" onClick={() => setCurrentStep(0)} className="text-luxuryGold hover:text-goldHover text-[10px]">Edit Info</button>
                  </h2>
                  
                  <div className="flex items-start gap-6 p-6 border border-luxuryGold bg-secondaryBg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-luxuryGold" />
                    <div className="flex-shrink-0 mt-1">
                      <CreditCard className="w-6 h-6 text-luxuryGold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-serif text-xl text-primaryText mb-1">Razorpay Secure Checkout</p>
                      <p className="text-xs tracking-wide text-secondaryText mb-4">You will be redirected to Razorpay to complete your purchase securely.</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-background border border-divider text-[9px] uppercase tracking-widest text-mutedText rounded-sm">UPI</span>
                        <span className="px-2 py-1 bg-background border border-divider text-[9px] uppercase tracking-widest text-mutedText rounded-sm">Cards</span>
                        <span className="px-2 py-1 bg-background border border-divider text-[9px] uppercase tracking-widest text-mutedText rounded-sm">Net Banking</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-divider bg-background text-sm text-secondaryText leading-relaxed">
                  <p>By clicking "Complete Purchase", you acknowledge that you have read and agree to Auremont's <Link href="/terms" className="text-luxuryGold underline hover:text-goldHover" target="_blank">Terms of Service</Link> and <Link href="/privacy-policy" className="text-luxuryGold underline hover:text-goldHover" target="_blank">Privacy Policy</Link>.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || paymentLoading} 
                  className="w-full luxury-button mt-12 disabled:opacity-50 flex items-center justify-center h-16 group"
                >
                  {loading ? (
                    <span className="flex items-center gap-4">
                      <span className="w-4 h-4 border border-background border-t-transparent rounded-full animate-spin" />
                      Processing Securely...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
                      Complete Purchase — ₹{total.toFixed(2)}
                    </span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[450px] flex-shrink-0 mt-12 lg:mt-0">
          <div className="bg-secondaryBg p-8 border border-divider sticky top-32">
            <h2 className="font-serif text-3xl text-primaryText border-b border-divider pb-6 mb-8">Summary</h2>

            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
              {safeItems.map(item => (
                <div key={item.id} className="flex gap-4 items-center group">
                  <div className="w-16 h-20 bg-background border border-divider relative flex-shrink-0 overflow-hidden">
                    <Image 
                      src={(item as any).product?.thumbnailUrl || '/images/california-almonds-250g.png'} 
                      alt={(item as any).product?.name || 'Product'} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex-grow flex justify-between items-center text-sm">
                    <div>
                      <p className="text-primaryText font-serif text-lg group-hover:text-luxuryGold transition-colors">{(item as any).product?.name}</p>
                      <p className="text-secondaryText text-[10px] uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-primaryText font-medium">₹{(item.quantity * Number(item.unitPrice || 0)).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-divider pt-6 space-y-6 mb-8">
              <div className="space-y-4">
                <CustomInput 
                  label="Gift Card or Privilege Code" 
                  name="couponCode" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                />
                
                <button
                  type="button"
                  onClick={appliedCoupon ? removeCoupon : applyCoupon}
                  disabled={applyingCoupon || (!couponCode && !appliedCoupon)}
                  className="w-full h-12 luxury-button-outline disabled:opacity-50"
                >
                  {applyingCoupon ? 'Verifying...' : appliedCoupon ? 'Remove Code' : 'Apply Code'}
                </button>
                {couponError && <p className="text-error text-xs text-center">{couponError}</p>}
                {appliedCoupon && <p className="text-luxuryGold text-xs text-center">Privilege '{appliedCoupon.code}' Applied</p>}
              </div>
            </div>

            <div className="border-t border-divider pt-6 space-y-4 text-sm text-secondaryText mb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-primaryText">₹{subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-luxuryGold">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-primaryText">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5% GST)</span>
                <span className="text-primaryText">₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-divider pt-6 flex justify-between font-serif text-3xl text-primaryText">
              <span>Total</span>
              <span className="text-luxuryGold">₹{total.toFixed(2)}</span>
            </div>
            
            <div className="mt-8 pt-6 border-t border-divider flex flex-col gap-4 text-[10px] text-mutedText uppercase tracking-widest text-center">
              <p className="flex items-center justify-center gap-2">
                <ShieldCheck size={14} /> 256-Bit Encryption
              </p>
              <p>Auremont Quality Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
