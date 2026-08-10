"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Phone, MessageCircle, Clock, ChevronRight, HelpCircle } from "lucide-react";
import SquirrelLogo from "@/components/ui/SquirrelLogo";

const PRESET_TOPICS = [
  {
    id: "corporate",
    question: "Corporate & Bulk Order Privileges",
    answer: "Our Corporate Concierge offers custom mahogany logo engraving, volume discounts (up to 30% off), and multi-address fulfillment. Would you like to estimate a quote?",
    actionUrl: "/corporate-gifts",
    actionText: "Open Corporate Estimator",
  },
  {
    id: "bespoke",
    question: "Bespoke Gift Box Personalization",
    answer: "You can curate custom 2, 3, or 4 slot gift vessels with 24k gold laser etching and hand-stamped wax seals in our Custom Studio.",
    actionUrl: "/custom-gift-box",
    actionText: "Build Custom Gift Set",
  },
  {
    id: "shipping",
    question: "Shipping Timelines & Vault Dispatch",
    answer: "All orders undergo temperature-controlled vault packing. Orders are dispatched within 24 hours via Express Insured Courier across India (2-4 business days).",
    actionUrl: "/shipping",
    actionText: "View Shipping Policy",
  },
  {
    id: "tasting",
    question: "Request a Tasting Sample Kit",
    answer: "For corporate inquiries of 50+ units, we offer complimentary tasting kits containing our Signature Raw, Slow-Roasted Sea Salt, and Smokey Hickory varieties.",
    actionUrl: "/contact",
    actionText: "Inquire Tasting Kit",
  },
];

export default function ConciergeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "whatsapp">("chat");
  const [selectedTopic, setSelectedTopic] = useState<typeof PRESET_TOPICS[0] | null>(null);
  const [customMsg, setCustomMsg] = useState("");
  const [sentMsg, setSentMsg] = useState(false);

  const whatsappNumber = "919876543210";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    customMsg || "Hello RARE NUTS Concierge, I would like assistance with luxury gifting."
  )}`;

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    setSentMsg(true);
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setCustomMsg("");
      setSentMsg(false);
    }, 800);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Ultra-Small & Minimal Circular Badge) */}
      <div className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Concierge Support"
          className="relative bg-secondaryBg/90 backdrop-blur-xl border border-luxuryGold/40 text-luxuryGold w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
        >
          <MessageCircle size={17} strokeWidth={1.5} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-background animate-pulse" />
        </button>
      </div>

      {/* ULTRA-COMPACT CHAT DRAWER MODAL (270px wide) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-16 md:bottom-18 right-3 md:right-6 z-50 w-[80vw] max-w-[270px] bg-background/95 backdrop-blur-2xl border border-luxuryGold/40 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[60vh]"
          >
            {/* Header */}
            <div className="bg-secondaryBg border-b border-divider p-2.5 flex justify-between items-center relative">
              <div className="flex items-center gap-2">
                <SquirrelLogo size={18} variant="badge" />
                <div>
                  <h3 className="font-serif text-xs text-primaryText flex items-center gap-1">
                    Concierge
                    <Sparkles size={10} className="text-luxuryGold" />
                  </h3>
                  <div className="flex items-center gap-1 text-[8px] text-emerald-400 font-mono">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping inline-block" />
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-secondaryText hover:text-luxuryGold p-0.5 transition-colors"
                aria-label="Close Concierge"
              >
                <X size={14} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-divider bg-secondaryBg/50 text-[9px] uppercase tracking-wider font-mono">
              <button
                onClick={() => { setActiveTab("chat"); setSelectedTopic(null); }}
                className={`flex-1 py-1.5 text-center transition-colors flex items-center justify-center gap-1 ${
                  activeTab === "chat" ? "text-luxuryGold border-b border-luxuryGold font-medium bg-background/40" : "text-secondaryText hover:text-primaryText"
                }`}
              >
                <HelpCircle size={10} /> FAQ
              </button>
              <button
                onClick={() => setActiveTab("whatsapp")}
                className={`flex-1 py-1.5 text-center transition-colors flex items-center justify-center gap-1 ${
                  activeTab === "whatsapp" ? "text-luxuryGold border-b border-luxuryGold font-medium bg-background/40" : "text-secondaryText hover:text-primaryText"
                }`}
              >
                <MessageCircle size={10} /> WhatsApp
              </button>
            </div>

            {/* Body */}
            <div className="p-3.5 flex-1 overflow-y-auto space-y-3 scrollbar-hide">
              {activeTab === "chat" ? (
                <>
                  {selectedTopic ? (
                    <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                      <button
                        onClick={() => setSelectedTopic(null)}
                        className="text-[10px] text-luxuryGold hover:underline flex items-center gap-1 font-mono"
                      >
                        ← Back to Topics
                      </button>
                      <div className="p-3 bg-secondaryBg border border-luxuryGold/30 rounded-card space-y-2">
                        <h4 className="font-serif text-xs text-primaryText font-medium">{selectedTopic.question}</h4>
                        <p className="text-secondaryText text-[11px] font-light leading-relaxed">{selectedTopic.answer}</p>
                        {selectedTopic.actionUrl && (
                          <a
                            href={selectedTopic.actionUrl}
                            onClick={() => setIsOpen(false)}
                            className="luxury-button text-[9px] py-2 px-3 inline-flex items-center gap-1.5 mt-1"
                          >
                            {selectedTopic.actionText} <ChevronRight size={10} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[11px] text-secondaryText font-light">
                        Select a quick inquiry topic:
                      </p>
                      {PRESET_TOPICS.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopic(topic)}
                          className="w-full text-left p-2.5 border border-divider bg-secondaryBg/60 hover:border-luxuryGold/50 hover:bg-secondaryBg rounded-card transition-all flex justify-between items-center group"
                        >
                          <span className="font-serif text-xs text-primaryText group-hover:text-luxuryGold transition-colors">
                            {topic.question}
                          </span>
                          <ChevronRight size={12} className="text-mutedText group-hover:text-luxuryGold transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* WHATSAPP TAB */
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-card space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono block font-medium">
                      Direct WhatsApp Concierge
                    </span>
                    <p className="text-secondaryText text-[11px] font-light leading-relaxed">
                      Connect with a personal account manager on WhatsApp for bespoke orders.
                    </p>
                  </div>

                  <form onSubmit={handleSendCustomMessage} className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-secondaryText font-mono block">
                      Your Inquiry Message
                    </label>
                    <textarea
                      rows={2}
                      value={customMsg}
                      onChange={(e) => setCustomMsg(e.target.value)}
                      placeholder="Hi, I am looking for corporate gift boxes..."
                      className="w-full bg-secondaryBg border border-divider p-2.5 text-xs text-primaryText outline-none focus:border-luxuryGold transition-colors resize-none rounded-card"
                    />
                    <button
                      type="submit"
                      disabled={sentMsg}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[10px] uppercase tracking-widest rounded-card transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle size={14} />
                      {sentMsg ? "Opening WhatsApp..." : "Start WhatsApp Chat"}
                    </button>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Footer Status */}
            <div className="bg-secondaryBg/80 border-t border-divider p-2.5 text-center text-[9px] text-mutedText font-mono flex items-center justify-center gap-1.5">
              <Clock size={10} className="text-luxuryGold" /> Response Time: &lt; 5 Minutes
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
