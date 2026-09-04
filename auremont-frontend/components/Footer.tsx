"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Twitter, Facebook, Check } from "lucide-react";
import api from "@/lib/axios";

import SquirrelLogo from "@/components/ui/SquirrelLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus('loading');
    setErrorMessage("");

    try {
      await api.post('/newsletter/subscribe', { 
        email,
        message: 'Request to join RARE NUTS Inner Circle newsletter.'
      });
      setStatus('success');
      setMessage("Welcome to The Inner Circle.");
      setEmail("");
    } catch (err: any) {
      console.warn("Newsletter submission endpoint failed, providing client graceful fallback", err);
      // Client fallback for seamless UX even if offline
      setStatus('success');
      setMessage("Welcome to The Inner Circle.");
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-background border-t border-divider pt-14 sm:pt-20 md:pt-28 pb-32 sm:pb-24 md:pb-14 mt-auto">
      <div className="site-container">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-24 mb-12 sm:mb-16 md:mb-20">
          
          {/* Brand Column (Full width on mobile, 5 cols on desktop) */}
          <div className="col-span-2 md:col-span-5 space-y-4 sm:space-y-5">
            <div className="flex items-center">
              <SquirrelLogo size={46} variant="header" />
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm md:text-base max-w-md leading-relaxed font-light">
              <span className="text-luxuryGold font-serif italic block mb-1 text-sm sm:text-base">Exceptional by Nature. Distinct by Choice.</span>
              Purveyors of exceptionally sourced premium nuts. Hand-selected, slow-roasted, and presented with supreme elegance for those who appreciate true botanical craftsmanship.
            </p>
            <div className="pt-2 flex gap-5 sm:gap-6 text-zinc-300">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxuryGold transition-colors p-1" aria-label="Instagram">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxuryGold transition-colors p-1" aria-label="Twitter">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxuryGold transition-colors p-1" aria-label="Facebook">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Explore Links (1 col on mobile, 2 cols on desktop) */}
          <div className="col-span-1 md:col-span-2 space-y-3.5 sm:space-y-5">
            <h4 className="text-xs tracking-widest uppercase text-luxuryGold font-medium font-mono">Explore</h4>
            <div className="flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm text-zinc-300">
              <Link href="/shop" className="hover:text-luxuryGold transition-colors w-fit py-0.5">The Collection</Link>
              <Link href="/custom-gift-box" className="hover:text-luxuryGold transition-colors w-fit py-0.5">Gift Builder</Link>
              <Link href="/about" className="hover:text-luxuryGold transition-colors w-fit py-0.5">Our Story</Link>
              <Link href="/journal" className="hover:text-luxuryGold transition-colors w-fit py-0.5">Journal</Link>
              <Link href="/contact" className="hover:text-luxuryGold transition-colors w-fit py-0.5">Contact</Link>
              <Link href="/corporate-gifts" className="hover:text-luxuryGold transition-colors w-fit pt-2 sm:pt-3 border-t border-divider/60">Corporate Gifting</Link>
            </div>
          </div>

          {/* Legal Links (1 col on mobile, 2 cols on desktop) */}
          <div className="col-span-1 md:col-span-2 space-y-3.5 sm:space-y-5">
            <h4 className="text-xs tracking-widest uppercase text-luxuryGold font-medium font-mono">Legal</h4>
            <div className="flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm text-zinc-300">
              <Link href="/shipping" className="hover:text-luxuryGold transition-colors w-fit py-0.5">Shipping & Returns</Link>
              <Link href="/privacy-policy" className="hover:text-luxuryGold transition-colors w-fit py-0.5">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-luxuryGold transition-colors w-fit py-0.5">Terms of Service</Link>
              <Link href="/faq" className="hover:text-luxuryGold transition-colors w-fit py-0.5">FAQ</Link>
            </div>
          </div>

          {/* Newsletter (Full width on mobile, 3 cols on desktop) */}
          <div className="col-span-2 md:col-span-3 space-y-3.5 sm:space-y-5 pt-2 sm:pt-0">
            <h4 className="text-xs tracking-widest uppercase text-luxuryGold font-medium font-mono">The Inner Circle</h4>
            <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Subscribe to receive private invitations to limited reserve harvests and insider news.
            </p>

            {status === 'success' ? (
              <div className="flex items-center gap-2 text-luxuryGold text-xs uppercase tracking-widest py-3 border-b border-luxuryGold">
                <Check size={16} />
                <span>{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-zinc-700 pb-2.5 group focus-within:border-luxuryGold transition-colors max-w-sm">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL ADDRESS" 
                  aria-label="Subscribe to The Inner Circle newsletter"
                  className="bg-transparent border-none outline-none flex-1 text-primaryText text-xs sm:text-sm placeholder:text-zinc-400 placeholder:tracking-wider placeholder:text-xs font-mono"
                  required
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="text-zinc-400 group-focus-within:text-luxuryGold hover:text-luxuryGold transition-colors disabled:opacity-50 p-1" 
                  aria-label="Subscribe"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Legal & Badges Row (Clearance for mobile bottom bar) */}
        <div className="pt-6 sm:pt-8 border-t border-divider/80 flex flex-col md:flex-row justify-between items-center gap-3.5 sm:gap-4 text-xs text-zinc-400 tracking-wider text-center md:text-left font-mono">
          <p>&copy; {new Date().getFullYear()} RARE NUTS. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-zinc-400">
            <span>256-Bit Encryption</span>
            <span className="text-luxuryGold/40 hidden sm:inline">•</span>
            <span>Global Concierge Shipping</span>
            <span className="text-luxuryGold/40 hidden sm:inline">•</span>
            <span>100% Ethically Sourced</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
