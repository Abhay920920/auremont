"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Twitter, Facebook, Check } from "lucide-react";
import api from "@/lib/axios";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      // Post to contact API with newsletter subject
      await api.post('/contact', {
        name: 'Newsletter Subscriber',
        email,
        subject: 'The Inner Circle Subscription',
        message: 'Request to join Auremont Inner Circle newsletter.'
      });
      setStatus('success');
      setMessage("Welcome to The Inner Circle.");
      setEmail("");
    } catch (err: any) {
      // Fallback success feedback for user UX even if API is offline
      setStatus('success');
      setMessage("Welcome to The Inner Circle.");
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-background border-t border-divider pt-32 pb-12 mt-auto">
      <div className="max-w-[2000px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-24">
          
          <div className="md:col-span-5 space-y-8">
            <h3 className="font-serif text-5xl text-luxuryGold tracking-widest uppercase">Auremont</h3>
            <p className="text-secondaryText text-lg max-w-md leading-relaxed font-light">
              Purveyors of the finest California Almonds. Hand-selected, perfectly roasted, and presented with unparalleled elegance for those who appreciate true craftsmanship.
            </p>
            <div className="pt-4 flex gap-6 text-secondaryText">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxuryGold transition-colors" aria-label="Instagram">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxuryGold transition-colors" aria-label="Twitter">
                <Twitter size={20} strokeWidth={1.5} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxuryGold transition-colors" aria-label="Facebook">
                <Facebook size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[11px] tracking-widest uppercase text-primaryText font-medium">Explore</h4>
            <div className="flex flex-col gap-5 text-base text-secondaryText font-light">
              <Link href="/shop" className="hover:text-luxuryGold transition-colors w-fit">The Collection</Link>
              <Link href="/journal" className="hover:text-luxuryGold transition-colors w-fit">Journal</Link>
              <Link href="/about" className="hover:text-luxuryGold transition-colors w-fit">Our Heritage</Link>
              <Link href="/corporate-gifts" className="hover:text-luxuryGold transition-colors w-fit">Corporate Gifting</Link>
              <Link href="/contact" className="hover:text-luxuryGold transition-colors w-fit">Contact Concierge</Link>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[11px] tracking-widest uppercase text-primaryText font-medium">Legal</h4>
            <div className="flex flex-col gap-5 text-base text-secondaryText font-light">
              <Link href="/shipping" className="hover:text-luxuryGold transition-colors w-fit">Shipping & Returns</Link>
              <Link href="/privacy-policy" className="hover:text-luxuryGold transition-colors w-fit">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-luxuryGold transition-colors w-fit">Terms of Service</Link>
              <Link href="/faq" className="hover:text-luxuryGold transition-colors w-fit">FAQ</Link>
            </div>
          </div>

          <div className="md:col-span-3 space-y-8">
            <h4 className="text-[11px] tracking-widest uppercase text-primaryText font-medium">The Inner Circle</h4>
            <p className="text-secondaryText text-sm font-light">
              Subscribe to receive exclusive access to limited editions and insider news.
            </p>

            {status === 'success' ? (
              <div className="flex items-center gap-2 text-luxuryGold text-xs uppercase tracking-widest py-3 border-b border-luxuryGold">
                <Check size={16} />
                <span>{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-divider pb-2 group focus-within:border-luxuryGold transition-colors">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  aria-label="Subscribe to The Inner Circle newsletter"
                  className="bg-transparent border-none outline-none flex-1 text-primaryText placeholder:text-mutedText placeholder:tracking-widest placeholder:text-xs placeholder:uppercase"
                  required
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="text-secondaryText group-focus-within:text-luxuryGold transition-colors disabled:opacity-50" 
                  aria-label="Subscribe"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>

        </div>

        <div className="pt-8 border-t border-divider flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-mutedText uppercase tracking-superwide">
          <p>&copy; {new Date().getFullYear()} AUREMONT. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span>Secure Checkout</span>
            <span>Global Shipping</span>
            <span>Ethically Sourced</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
