"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import SquirrelLogo from '@/components/ui/SquirrelLogo';
import { Eye, EyeOff, ShieldCheck, AlertCircle, Mail, Lock, ArrowRight, Sparkles, UserPlus, ShoppingBag } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');
  const reason = searchParams?.get('reason');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isNotRegistered, setIsNotRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsNotRegistered(false);

    try {
      const response = await api.post('/auth/login', { email: email.trim(), password });
      setAuth(response.data.user, response.data.access_token, response.data.refresh_token);
      
      // Trigger cart merge and fetch wishlist (do not await so it doesn't block routing)
      import('@/store/cartStore').then(({ useCartStore }) => {
        useCartStore.getState().mergeCart();
        return null;
      }).catch(console.error);
      import('@/store/wishlistStore').then(({ useWishlistStore }) => {
        useWishlistStore.getState().fetchWishlist(response.data.user.id);
        return null;
      }).catch(console.error);

      if (response.data.user.role === 'admin') {
        router.push('/admin');
      } else if (redirect) {
        router.push(redirect);
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Authentication failed. Please verify your credentials.';
      const notFound = typeof msg === 'string' && (
        msg.toLowerCase().includes('no account found') || 
        msg.toLowerCase().includes('sign up first') ||
        msg.toLowerCase().includes('not found')
      );
      
      if (notFound) {
        setIsNotRegistered(true);
        setError(`No account found for "${email.trim()}". Please sign up first to access your account.`);
      } else {
        setIsNotRegistered(false);
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setIsNotRegistered(false);
  };

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 pt-24 sm:pt-32 pb-28 sm:pb-20 bg-background overflow-x-hidden">
      {/* Ambient Luxury Lighting Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-luxuryGold/[0.06] rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-goldGlow/25 rounded-full blur-[70px] sm:blur-[90px] pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="relative w-full max-w-[440px] bg-[#0A0A0D]/95 backdrop-blur-2xl border border-luxuryGold/30 sm:border-divider/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.95),0_0_30px_rgba(212,175,55,0.08)] p-6 sm:p-8 md:p-10 z-10 animate-fade-in rounded-sm">
        
        {/* Subtle Luxury Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-luxuryGold to-transparent" />
        
        {/* Delicate Corner Accents for High-Jewelry Aesthetic */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-luxuryGold/40 pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-luxuryGold/40 pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-luxuryGold/40 pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-luxuryGold/40 pointer-events-none" />

        {/* Reason Banner: e.g. when redirected from attempting to use Cart without logging in */}
        {reason === 'cart' && (
          <div className="mb-6 p-3.5 bg-luxuryGold/10 border border-luxuryGold/30 text-luxuryGold text-xs flex items-center gap-2.5 rounded-sm">
            <ShoppingBag size={16} className="flex-shrink-0" />
            <span className="leading-snug">
              Please sign in or create an account first to reserve items and activate your personal cart.
            </span>
          </div>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2.5 sm:space-y-3 mb-6 sm:mb-7">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#161619] to-[#0A0A0C] border border-luxuryGold/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.18)]">
            <SquirrelLogo size={32} variant="icon" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-luxuryGold/30 bg-luxuryGold/[0.07]">
              <span className="w-1.5 h-1.5 rounded-full bg-luxuryGold animate-pulse" />
              <span className="text-[9px] uppercase tracking-widest text-luxuryGold font-medium">Private Member Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-primaryText font-normal tracking-tight">Welcome Back</h1>
            <p className="text-secondaryText text-[11px] sm:text-xs leading-relaxed max-w-[280px] sm:max-w-xs mx-auto">
              Sign in to manage your vault allocations, bespoke gifts, and member privileges.
            </p>
          </div>
        </div>

        {/* Specific Notification: User Tried Logging In Without Signing Up */}
        {isNotRegistered ? (
          <div className="mb-5 p-4 bg-luxuryGold/10 border border-luxuryGold/40 rounded-sm text-xs space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-luxuryGold font-medium">
              <UserPlus size={16} className="flex-shrink-0" />
              <span className="uppercase tracking-wider text-[11px]">Account Not Found</span>
            </div>
            <p className="text-secondaryText leading-relaxed">
              No registered member account was found for <strong className="text-primaryText">{email}</strong>. Please first sign up to activate your account.
            </p>
            <div>
              <Link
                href={`/register?email=${encodeURIComponent(email)}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="w-full h-11 luxury-button flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <span>First Sign Up to Login</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : error ? (
          <div className="mb-5 p-3 sm:p-3.5 bg-error/10 border border-error/30 text-error text-xs flex items-start gap-2.5">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        ) : null}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-secondaryText font-medium">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedText pointer-events-none">
                <Mail size={15} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@rarenuts.in"
                className="w-full h-12 sm:h-11 pl-10 pr-3.5 bg-[#0F0F12]/80 border border-divider text-base sm:text-sm text-primaryText placeholder-mutedText/40 focus:border-luxuryGold focus:bg-background/90 focus:ring-1 focus:ring-luxuryGold/30 focus:outline-none transition-all rounded-none"
                required
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest text-secondaryText font-medium">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] text-luxuryGold hover:text-goldHover hover:underline underline-offset-4 transition-colors py-1">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedText pointer-events-none">
                <Lock size={15} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-12 sm:h-11 pl-10 pr-11 bg-[#0F0F12]/80 border border-divider text-base sm:text-sm text-primaryText placeholder-mutedText/40 focus:border-luxuryGold focus:bg-background/90 focus:ring-1 focus:ring-luxuryGold/30 focus:outline-none transition-all rounded-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mutedText hover:text-primaryText transition-colors p-2 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2.5 cursor-pointer select-none group py-1">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 sm:w-3.5 sm:h-3.5 border border-divider rounded-none bg-background accent-luxuryGold cursor-pointer"
              />
              <span className="text-xs sm:text-[11px] text-secondaryText group-hover:text-primaryText transition-colors">
                Remember this device
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-luxuryGold via-goldHover to-luxuryGold hover:opacity-95 text-background font-semibold uppercase tracking-[0.2em] text-xs shadow-[0_4px_20px_rgba(212,175,55,0.22)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.38)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Sign In to Reserve</span>
                <ArrowRight size={14} />
              </span>
            )}
          </button>
        </form>

        {/* Quick Demo Access Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px]">
          <span className="text-mutedText uppercase tracking-wider text-[9px] sm:text-[10px] w-full sm:w-auto text-center sm:text-left mb-0.5 sm:mb-0">
            Fast Access:
          </span>
          <button 
            type="button" 
            onClick={() => handleDemoFill('client@rarenuts.in', 'Client@123')}
            className="px-3 py-1 border border-divider/80 hover:border-luxuryGold/60 text-secondaryText hover:text-luxuryGold transition-colors tracking-wide bg-surface/50 active:scale-95 cursor-pointer"
          >
            Client Demo
          </button>
          <button 
            type="button" 
            onClick={() => handleDemoFill('admin@rarenuts.in', 'Admin@123')}
            className="px-3 py-1 border border-divider/80 hover:border-luxuryGold/60 text-secondaryText hover:text-luxuryGold transition-colors tracking-wide bg-surface/50 active:scale-95 cursor-pointer"
          >
            Admin Demo
          </button>
        </div>

        {/* Registration Prompt Footer */}
        <div className="text-center pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-divider/60">
          <p className="text-xs text-secondaryText">
            New to RARE NUTS?{' '}
            <Link 
              href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-luxuryGold hover:text-goldHover font-medium underline underline-offset-4 transition-colors"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>

      {/* Trust & Security Badges Row */}
      <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] sm:text-[10px] uppercase tracking-widest text-mutedText relative z-10 text-center max-w-sm">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-luxuryGold" />
          256-Bit SSL Encrypted
        </span>
        <span className="text-divider hidden sm:inline">•</span>
        <span className="flex items-center gap-1.5">
          <Lock size={12} className="text-luxuryGold" />
          Private Vault Protocol
        </span>
        <span className="text-divider hidden sm:inline">•</span>
        <span className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-luxuryGold" />
          Bespoke Concierge
        </span>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-luxuryGold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
