"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import SquirrelLogo from '@/components/ui/SquirrelLogo';
import { Eye, EyeOff, ShieldCheck, AlertCircle, Mail, Lock, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
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
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 sm:px-6 pt-28 pb-16 sm:pt-32 sm:pb-20 bg-background overflow-hidden">
      {/* Ambient Luxury Lighting Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-luxuryGold/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-goldGlow/30 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="relative w-full max-w-[450px] bg-[#0A0A0C]/90 backdrop-blur-2xl border border-divider/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.07)] p-8 sm:p-10 z-10 animate-fade-in">
        
        {/* Subtle Luxury Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-luxuryGold to-transparent" />
        
        {/* Delicate Corner Accents for High-Jewelry Aesthetic */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-luxuryGold/40 pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-luxuryGold/40 pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-luxuryGold/40 pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-luxuryGold/40 pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-7">
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-[#161619] to-[#0A0A0C] border border-luxuryGold/40 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.18)]">
            <SquirrelLogo size={36} variant="icon" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-luxuryGold/30 bg-luxuryGold/[0.07]">
              <span className="w-1.5 h-1.5 rounded-full bg-luxuryGold animate-pulse" />
              <span className="text-[9px] uppercase tracking-widest text-luxuryGold font-medium">Private Member Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-primaryText font-normal tracking-tight">Welcome Back</h1>
            <p className="text-secondaryText text-xs leading-relaxed max-w-xs mx-auto">
              Sign in to manage your vault allocations, bespoke gifts, and member privileges.
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 bg-error/10 border border-error/30 text-error text-xs flex items-start gap-2.5">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-5">
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
                className="w-full h-11 pl-10 pr-3.5 bg-[#0F0F12]/80 border border-divider text-sm text-primaryText placeholder-mutedText/40 focus:border-luxuryGold focus:bg-background/90 focus:ring-1 focus:ring-luxuryGold/30 focus:outline-none transition-all rounded-none"
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
              <Link href="/forgot-password" className="text-[11px] text-luxuryGold hover:text-goldHover hover:underline underline-offset-4 transition-colors">
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
                className="w-full h-11 pl-10 pr-10 bg-[#0F0F12]/80 border border-divider text-sm text-primaryText placeholder-mutedText/40 focus:border-luxuryGold focus:bg-background/90 focus:ring-1 focus:ring-luxuryGold/30 focus:outline-none transition-all rounded-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mutedText hover:text-primaryText transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 border border-divider rounded-none bg-background accent-luxuryGold cursor-pointer"
              />
              <span className="text-[11px] text-secondaryText group-hover:text-primaryText transition-colors">
                Remember this device
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-luxuryGold via-goldHover to-luxuryGold hover:opacity-95 text-background font-semibold uppercase tracking-[0.2em] text-xs shadow-[0_4px_20px_rgba(212,175,55,0.22)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.38)] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
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
        <div className="pt-4 flex items-center justify-center gap-2 text-[10px]">
          <span className="text-mutedText uppercase tracking-wider">Fast Access:</span>
          <button 
            type="button" 
            onClick={() => handleDemoFill('client@rarenuts.in', 'Client@123')}
            className="px-2.5 py-0.5 border border-divider/80 hover:border-luxuryGold/60 text-secondaryText hover:text-luxuryGold transition-colors tracking-wide bg-surface/40 cursor-pointer"
          >
            Client Demo
          </button>
          <button 
            type="button" 
            onClick={() => handleDemoFill('admin@rarenuts.in', 'Admin@123')}
            className="px-2.5 py-0.5 border border-divider/80 hover:border-luxuryGold/60 text-secondaryText hover:text-luxuryGold transition-colors tracking-wide bg-surface/40 cursor-pointer"
          >
            Admin Demo
          </button>
        </div>

        {/* Registration Prompt Footer */}
        <div className="text-center pt-5 mt-5 border-t border-divider/60">
          <p className="text-xs text-secondaryText">
            New to RARE NUTS?{' '}
            <Link href="/register" className="text-luxuryGold hover:text-goldHover font-medium underline underline-offset-4 transition-colors">
              Create an Account
            </Link>
          </p>
        </div>
      </div>

      {/* Trust & Security Badges Row */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] uppercase tracking-widest text-mutedText relative z-10">
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
