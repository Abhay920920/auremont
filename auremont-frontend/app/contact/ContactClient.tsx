"use client";

import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock, Sparkles, Building2 } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiries",
    message: "",
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const inquiryTopics = [
    "General Inquiries",
    "Order Tracking & Dispatch",
    "Bespoke Gifting Concierge",
    "Corporate & Bulk Orders",
    "Press & Editorial Media",
    "Culinary Partnerships"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ name: "", email: "", subject: "General Inquiries", message: "" });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || "Our concierge desk could not process your inquiry at this moment. Please try again or email concierge@rarenuts.com directly.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full bg-background pt-32 pb-24 md:pb-32 relative overflow-hidden min-h-screen text-primaryText">
      {/* Background glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-luxuryGold/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="site-container relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-luxuryGold/25 bg-luxuryGold/5 text-luxuryGold text-[10px] uppercase tracking-ultra mb-4">
            <Sparkles size={12} />
            <span>White-Glove Concierge Desk</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight mb-4">
            Connect With Our <span className="text-luxuryGold italic">Concierge</span>
          </h1>
          <p className="text-secondaryText text-base sm:text-lg font-light leading-relaxed">
            Whether inquiring about our seasonal California reserves, personalizing an heirloom gift box, or arranging corporate bulk commissions, our dedicated team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Direct Communication Channels & Locations */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Contact Channels Card */}
            <div className="bg-secondaryBg/80 border border-divider rounded-card p-8 space-y-6">
              <h2 className="text-xl font-serif text-primaryText flex items-center gap-2">
                <span>Direct Communications</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-divider flex items-center justify-center bg-surface text-luxuryGold flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-widest text-mutedText mb-0.5">Customer & Order Concierge</h3>
                    <a href="mailto:concierge@rarenuts.com" className="text-primaryText hover:text-luxuryGold transition-colors text-sm font-medium">
                      concierge@rarenuts.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-divider flex items-center justify-center bg-surface text-luxuryGold flex-shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-widest text-mutedText mb-0.5">Corporate & Private Gifting Desk</h3>
                    <a href="mailto:corporate@rarenuts.com" className="text-primaryText hover:text-luxuryGold transition-colors text-sm font-medium">
                      corporate@rarenuts.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-divider flex items-center justify-center bg-surface text-luxuryGold flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-widest text-mutedText mb-0.5">Toll-Free Client Assistance</h3>
                    <a href="tel:18008904100" className="text-primaryText hover:text-luxuryGold transition-colors text-sm font-medium">
                      1800 890 4100
                    </a>
                    <p className="text-xs text-mutedText mt-0.5">Direct Line: +91 (022) 6985 4100</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-divider flex items-center justify-center bg-surface text-luxuryGold flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-widest text-mutedText mb-0.5">Operating Hours</h3>
                    <p className="text-sm text-secondaryText">Monday – Saturday: 9:00 AM – 8:00 PM IST</p>
                    <p className="text-xs text-mutedText">Sunday: 10:00 AM – 5:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Offices Card */}
            <div className="bg-secondaryBg/80 border border-divider rounded-card p-8 space-y-6">
              <h2 className="text-xl font-serif text-primaryText">Global Locations</h2>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-luxuryGold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-base text-primaryText">Corporate Headquarters</h3>
                    <p className="text-secondaryText text-xs font-light leading-relaxed mt-1">
                      RARE NUTS Private Limited<br />
                      Level 14, Platina Tower, G Block<br />
                      Bandra Kurla Complex (BKC), Mumbai 400051, India
                    </p>
                  </div>
                </div>

                <div className="border-t border-divider/60 pt-4 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-luxuryGold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-base text-primaryText">Roasting Atelier & Orchards</h3>
                    <p className="text-secondaryText text-xs font-light leading-relaxed mt-1">
                      Central Valley Botanical Reserve<br />
                      Orchard Way, San Joaquin County<br />
                      Modesto, California 95354, United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Link to FAQ */}
            <div className="p-6 border border-luxuryGold/20 rounded-card bg-luxuryGold/5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-serif text-primaryText">Looking for immediate answers?</h3>
                <p className="text-xs text-secondaryText font-light mt-0.5">Explore our guide on sourcing, dispatch, and storage.</p>
              </div>
              <Link href="/faq" className="text-xs text-luxuryGold hover:text-goldHover uppercase tracking-widest font-medium">
                Visit FAQ &rarr;
              </Link>
            </div>

          </div>

          {/* Right Column: Interactive Dispatch Form */}
          <div className="lg:col-span-7">
            <div className="bg-secondaryBg/80 border border-divider rounded-card p-8 md:p-12 shadow-2xl relative">
              {status === 'success' ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-luxuryGold/10 border border-luxuryGold/30 rounded-full flex items-center justify-center mx-auto text-luxuryGold">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-primaryText">Inquiry Received</h2>
                  <p className="text-secondaryText text-sm max-w-md mx-auto font-light leading-relaxed">
                    Thank you for reaching out to RARE NUTS. A dedicated concierge specialist will review your note and respond within 4 business hours.
                  </p>
                  <div className="pt-4">
                    <button 
                      onClick={() => setStatus('idle')}
                      className="luxury-button-outline text-xs px-6 py-3 uppercase tracking-widest"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-serif text-primaryText mb-2">Direct Concierge Dispatch</h2>
                    <p className="text-secondaryText text-xs sm:text-sm font-light">
                      Please submit your message below. We prioritize personalized responses with complete discretion.
                    </p>
                  </div>

                  {status === 'error' && (
                    <div className="p-4 bg-error/10 border border-error/30 text-error rounded text-xs flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-[10px] uppercase tracking-widest text-mutedText font-medium">
                        Your Full Name *
                      </label>
                      <input
                        required
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-surface border border-divider px-4 py-3.5 rounded text-sm text-primaryText focus:border-luxuryGold outline-none transition-colors placeholder:text-mutedText/60"
                        placeholder="e.g. Lord Alistair Vance"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-[10px] uppercase tracking-widest text-mutedText font-medium">
                        Email Address *
                      </label>
                      <input
                        required
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-surface border border-divider px-4 py-3.5 rounded text-sm text-primaryText focus:border-luxuryGold outline-none transition-colors placeholder:text-mutedText/60"
                        placeholder="alistair@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-subject" className="text-[10px] uppercase tracking-widest text-mutedText font-medium">
                      Inquiry Category *
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-surface border border-divider px-4 py-3.5 rounded text-sm text-primaryText focus:border-luxuryGold outline-none transition-colors"
                    >
                      {inquiryTopics.map((topic) => (
                        <option key={topic} value={topic} className="bg-secondaryBg text-primaryText">
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-[10px] uppercase tracking-widest text-mutedText font-medium">
                      Detailed Message *
                    </label>
                    <textarea
                      required
                      id="contact-message"
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-surface border border-divider p-4 rounded text-sm text-primaryText focus:border-luxuryGold outline-none transition-colors placeholder:text-mutedText/60 resize-none"
                      placeholder="Share your requirements, order numbers, custom corporate box quantities, or special requests..."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full luxury-button flex items-center justify-center gap-3 py-4 text-xs tracking-superwide uppercase font-medium disabled:opacity-50"
                    >
                      {status === 'loading' ? (
                        <span>Connecting with Concierge...</span>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Dispatch to Concierge Desk</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-mutedText text-center font-light">
                    Protected by RARE NUTS Client Privacy Charter. We never share correspondence with third parties.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
