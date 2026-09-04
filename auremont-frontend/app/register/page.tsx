"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import SquirrelLogo from '@/components/ui/SquirrelLogo';
import { Eye, EyeOff, ShieldCheck, AlertCircle, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', formData);
      const { user, access_token, refresh_token } = res.data;
      
      setAuth(user, access_token, refresh_token);
      router.push('/account');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-start sm:justify-center items-center px-4 sm:px-6 pt-24 sm:pt-32 pb-28 sm:pb-20 bg-background overflow-x-hidden">
      {/* Ambient Luxury Lighting Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-luxuryGold/[0.06] rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-goldGlow/25 rounded-full blur-[70px] sm:blur-[90px] pointer-events-none" />

      {/* Main Registration Card */}
      <div className="relative w-full max-w-[480px] bg-[#0A0A0D]/95 backdrop-blur-2xl border border-luxuryGold/30 sm:border-divider/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.95),0_0_30px_rgba(212,175,55,0.08)] p-6 sm:p-8 md:p-10 z-10 animate-fade-in rounded-sm">
        
        {/* Subtle Luxury Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-luxuryGold to-transparent" />
        
        {/* Delicate Corner Accents */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-luxuryGold/40 pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-luxuryGold/40 pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-luxuryGold/40 pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-luxuryGold/40 pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2.5 sm:space-y-3 mb-6 sm:mb-7">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#161619] to-[#0A0A0C] border border-luxuryGold/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.18)]">
            <SquirrelLogo size={32} variant="icon" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-luxuryGold/30 bg-luxuryGold/[0.07]">
              <span className="w-1.5 h-1.5 rounded-full bg-luxuryGold animate-pulse" />
              <span className="text-[9px] uppercase tracking-widest text-luxuryGold font-medium">Bespoke Membership</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-primaryText font-normal tracking-tight">Join RARE NUTS</h1>
            <p className="text-secondaryText text-[11px] sm:text-xs leading-relaxed max-w-[280px] sm:max-w-xs mx-auto">
              Create your account to unlock private reserve access, bespoke gifting, and VIP privileges.
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3 sm:p-3.5 bg-error/10 border border-error/30 text-error text-xs flex items-start gap-2.5">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest text-secondaryText font-medium">
                First Name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedText pointer-events-none">
                  <User size={14} />
                </div>
                <input 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Alexander"
                  className="w-full h-12 sm:h-11 pl-9 pr-3 bg-[#0F0F12]/80 border border-divider text-base sm:text-sm text-primaryText placeholder-mutedText/40 focus:border-luxuryGold focus:bg-background/90 focus:ring-1 focus:ring-luxuryGold/30 focus:outline-none transition-all rounded-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest text-secondaryText font-medium">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedText pointer-events-none">
                  <User size={14} />
                </div>
                <input 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Vance"
                  className="w-full h-12 sm:h-11 pl-9 pr-3 bg-[#0F0F12]/80 border border-divider text-base sm:text-sm text-primaryText placeholder-mutedText/40 focus:border-luxuryGold focus:bg-background/90 focus:ring-1 focus:ring-luxuryGold/30 focus:outline-none transition-all rounded-none"
                  required
                />
              </div>
            </div>
          </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="client@rarenuts.in"
                className="w-full h-12 sm:h-11 pl-10 pr-3.5 bg-[#0F0F12]/80 border border-divider text-base sm:text-sm text-primaryText placeholder-mutedText/40 focus:border-luxuryGold focus:bg-background/90 focus:ring-1 focus:ring-luxuryGold/30 focus:outline-none transition-all rounded-none"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest text-secondaryText font-medium">
              Password (Min. 6 characters)
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedText pointer-events-none">
                <Lock size={15} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full h-12 sm:h-11 pl-10 pr-11 bg-[#0F0F12]/80 border border-divider text-base sm:text-sm text-primaryText placeholder-mutedText/40 focus:border-luxuryGold focus:bg-background/90 focus:ring-1 focus:ring-luxuryGold/30 focus:outline-none transition-all rounded-none"
                required
                minLength={6}
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

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none group py-1">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 border border-divider rounded-none bg-background accent-luxuryGold cursor-pointer flex-shrink-0"
                required
              />
              <span className="text-xs sm:text-[11px] text-secondaryText group-hover:text-primaryText leading-relaxed transition-colors">
                I agree to the{' '}
                <Link href="/terms" className="text-luxuryGold underline hover:text-goldHover">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-luxuryGold underline hover:text-goldHover">Privacy Policy</Link>.
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-luxuryGold via-goldHover to-luxuryGold hover:opacity-95 text-background font-semibold uppercase tracking-[0.2em] text-xs shadow-[0_4px_20px_rgba(212,175,55,0.22)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.38)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-3 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Create Exclusive Account</span>
                <ArrowRight size={14} />
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-divider/60">
          <p className="text-xs text-secondaryText">
            Already have an account?{' '}
            <Link href="/login" className="text-luxuryGold hover:text-goldHover font-medium underline underline-offset-4 transition-colors py-1 inline-block">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Trust Badges */}
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
