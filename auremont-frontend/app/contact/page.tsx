"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import React, { useState } from "react";
import api from "@/lib/axios";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full bg-background pt-32 pb-24 md:pb-super relative overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          
          {/* Left Column: Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-serif text-luxuryGold mb-6 tracking-tight animate-fade-in-up">
              Contact Us
            </h1>
            <p className="text-secondaryText text-lg md:text-xl leading-relaxed mb-12 animate-fade-in-up delay-100 max-w-lg">
              Whether you have a question about our products, a corporate gifting inquiry, or simply want to say hello, our concierge team is at your service.
            </p>
            
            <div className="space-y-8 animate-fade-in-up delay-200">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full border border-divider flex items-center justify-center bg-surface group-hover:border-luxuryGold transition-colors">
                  <Mail className="w-5 h-5 text-luxuryGold" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-secondaryText mb-1">Email</h3>
                  <a href="mailto:concierge@auremont.com" className="text-primaryText hover:text-luxuryGold transition-colors text-lg">concierge@auremont.com</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full border border-divider flex items-center justify-center bg-surface group-hover:border-luxuryGold transition-colors">
                  <Phone className="w-5 h-5 text-luxuryGold" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-secondaryText mb-1">Concierge Helpline</h3>
                  <a href="tel:+9118001234567" className="text-primaryText hover:text-luxuryGold transition-colors text-lg">1800 123 4567</a>
                  <p className="text-mutedText text-sm mt-1">Mon-Sat, 9am - 7pm IST</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full border border-divider flex items-center justify-center bg-surface group-hover:border-luxuryGold transition-colors">
                  <MapPin className="w-5 h-5 text-luxuryGold" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-secondaryText mb-1">Headquarters</h3>
                  <p className="text-primaryText text-lg">Auremont Private Limited<br/>Corporate Towers, Bandra Kurla Complex<br/>Mumbai, MH 400051</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Form */}
          <div className="relative animate-fade-in-up delay-300">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-luxuryGold/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="bg-secondaryBg/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-divider shadow-2xl relative z-10">
              {status === 'success' ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-20 h-20 text-luxuryGold mx-auto mb-6" />
                  <h2 className="text-3xl font-serif text-primaryText mb-4">Message Sent</h2>
                  <p className="text-secondaryText text-lg mb-8">Thank you for reaching out. A member of our concierge team will contact you shortly.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-luxuryGold hover:text-goldHover transition-colors border-b border-luxuryGold/30 hover:border-luxuryGold pb-1 uppercase tracking-widest text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && (
                    <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-xs uppercase tracking-widest text-secondaryText">Name</label>
                      <input
                        required
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-background border border-divider px-5 py-4 rounded-xl focus:border-luxuryGold outline-none transition-all text-primaryText placeholder:text-mutedText"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-xs uppercase tracking-widest text-secondaryText">Email</label>
                      <input
                        required
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-background border border-divider px-5 py-4 rounded-xl focus:border-luxuryGold outline-none transition-all text-primaryText placeholder:text-mutedText"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contact-subject" className="text-xs uppercase tracking-widest text-secondaryText">Subject</label>
                    <input
                      required
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-background border border-divider px-5 py-4 rounded-xl focus:border-luxuryGold outline-none transition-all text-primaryText placeholder:text-mutedText"
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-xs uppercase tracking-widest text-secondaryText">Message</label>
                    <textarea
                      required
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full bg-background border border-divider px-5 py-4 rounded-xl focus:border-luxuryGold outline-none transition-all text-primaryText placeholder:text-mutedText resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full bg-luxuryGold text-background py-4 rounded-xl font-medium uppercase tracking-widest shadow-lg hover:shadow-luxuryGold/20 hover:bg-goldHover transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <span className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
