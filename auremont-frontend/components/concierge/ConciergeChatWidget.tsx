"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  Clock, 
  ChevronRight, 
  HelpCircle,
  ShieldCheck,
  Package,
  Gift,
  Building2,
  Leaf,
  ArrowRight,
  Minus
} from "lucide-react";
import SquirrelLogo from "@/components/ui/SquirrelLogo";

interface PresetTopic {
  id: string;
  tag: string;
  icon: any;
  question: string;
  answer: string;
  actionUrl?: string;
  actionText?: string;
}

const PRESET_TOPICS: PresetTopic[] = [
  {
    id: "corporate",
    tag: "Corporate Gifting",
    icon: Building2,
    question: "Corporate & Bulk Gifting Benefits",
    answer: "Our Corporate Concierge specializes in executive gift selections, custom laser logo engraving on solid mahogany boxes, volume pricing (up to 30% savings), and delivery to multiple addresses across India and worldwide.",
    actionUrl: "/corporate-gifts",
    actionText: "View Corporate Gifting",
  },
  {
    id: "bespoke",
    tag: "Custom Studio",
    icon: Gift,
    question: "Custom Gift Box Personalization",
    answer: "Through our Custom Studio, you can create 2, 3, or 4-compartment mahogany gift boxes, customize engraved nameplates, select velvet linings, and choose hand-stamped wax seals.",
    actionUrl: "/custom-gift-box",
    actionText: "Open Custom Box Studio",
  },
  {
    id: "terroir",
    tag: "Quality Standard",
    icon: Leaf,
    question: "RARE NUTS Sourcing & Roasting Craft",
    answer: "We source exclusively Extra Large Nonpareil almonds from California's premier orchards. Every batch is gently roasted over seasoned almond wood without frying oils, yielding an airy, crisp crunch.",
    actionUrl: "/about",
    actionText: "Explore Our Heritage",
  },
  {
    id: "shipping",
    tag: "Delivery & Shipping",
    icon: Package,
    question: "Delivery Timelines & Protective Packaging",
    answer: "Orders in India arrive within 2–4 business days via Blue Dart or Delhivery Express (Complimentary delivery over ₹1,999). International orders ship via insured DHL Express with protective thermal liners.",
    actionUrl: "/shipping",
    actionText: "View Shipping Policy",
  },
  {
    id: "guarantee",
    tag: "Quality Guarantee",
    icon: ShieldCheck,
    question: "Our 100% Quality & Freshness Guarantee",
    answer: "Every order is packed in temperature-controlled rooms. If your box arrives damaged or if nut flavor falls short of expectations, our team arranges an immediate complimentary replacement or refund within 7 days.",
    actionUrl: "/returns",
    actionText: "View Quality Guarantee",
  },
  {
    id: "tasting",
    tag: "Tasting Samples",
    icon: Sparkles,
    question: "Request a Tasting Sample Kit",
    answer: "For corporate gifts or wedding favor orders of 50+ boxes, our team delivers complimentary tasting sample boxes featuring our Raw California, Wood-Roasted Sea Salt, and Royal Saffron almonds.",
    actionUrl: "/contact",
    actionText: "Request Sample Box",
  },
];

const WHATSAPP_CHIPS = [
  "Corporate Gifting Quote",
  "Custom Box Engraving",
  "Wedding Gift Sets",
  "Order Delivery Status",
  "Tasting Sample Kit",
];

export default function ConciergeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "whatsapp" | "call">("chat");
  const [selectedTopic, setSelectedTopic] = useState<PresetTopic | null>(null);
  const [customMsg, setCustomMsg] = useState("");
  const [sentMsg, setSentMsg] = useState(false);

  const whatsappNumber = "919876543210";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    customMsg || "Hello RARE NUTS Concierge, I would like assistance with luxury gifting."
  )}`;

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    setSentMsg(true);
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setCustomMsg("");
      setSentMsg(false);
    }, 600);
  };

  const handleChipClick = (chip: string) => {
    setCustomMsg(`Hello RARE NUTS Concierge, I would like to inquire regarding ${chip}.`);
  };

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY (When Chat is Open on Small Screens) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="sm:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* FLOATING TRIGGER BUTTON (Only shown when chat is closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom, 0px))" }}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-[75]"
          >
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open Concierge Support"
              className="relative bg-secondaryBg/95 backdrop-blur-xl border border-luxuryGold/60 text-luxuryGold w-12 h-12 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.85),0_0_15px_rgba(212,175,55,0.3)] hover:border-luxuryGold hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group cursor-pointer"
            >
              <MessageCircle size={21} strokeWidth={1.75} className="group-hover:rotate-12 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background shadow-[0_0_8px_#10b981] animate-pulse" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT MODAL DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              bottom: "calc(4.75rem + env(safe-area-inset-bottom, 0px))",
              maxHeight: "calc(100dvh - 110px)",
              height: "min(530px, calc(100dvh - 110px))",
            }}
            className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 md:right-8 left-3 sm:left-auto w-auto sm:w-[390px] md:w-[410px] z-[95] bg-[#0C0C10] border border-luxuryGold/35 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.12)] overflow-hidden flex flex-col"
          >
            {/* Top Accent Gold Shimmer Line */}
            <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-luxuryGold/80 to-transparent flex-shrink-0" />

            {/* Header */}
            <div className="bg-[#101015] border-b border-divider/60 px-4 py-3.5 flex justify-between items-center relative flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-luxuryGold/40 bg-[#16161D] flex items-center justify-center text-luxuryGold shadow-inner flex-shrink-0">
                  <SquirrelLogo size={18} variant="icon" />
                </div>
                <div>
                  <h3 className="font-serif text-sm text-primaryText flex items-center gap-1.5 font-medium leading-tight">
                    <span>RARE NUTS Concierge</span>
                    <Sparkles size={11} className="text-luxuryGold flex-shrink-0" />
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Client Desk · Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-secondaryText hover:text-primaryText transition-colors cursor-pointer"
                  aria-label="Minimize Concierge"
                  title="Minimize"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-secondaryText hover:text-primaryText transition-colors cursor-pointer"
                  aria-label="Close Concierge"
                  title="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Segmented Navigation Tabs */}
            <div className="p-1.5 bg-[#09090D] border-b border-divider/50 grid grid-cols-3 gap-1 text-[11px] font-mono flex-shrink-0">
              <button
                onClick={() => { setActiveTab("chat"); setSelectedTopic(null); }}
                className={`py-2 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 font-medium cursor-pointer ${
                  activeTab === "chat" 
                    ? "text-luxuryGold bg-[#181822] border border-luxuryGold/30 shadow-sm" 
                    : "text-mutedText hover:text-primaryText hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <HelpCircle size={13} />
                <span>Concierge</span>
              </button>

              <button
                onClick={() => setActiveTab("whatsapp")}
                className={`py-2 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 font-medium cursor-pointer ${
                  activeTab === "whatsapp" 
                    ? "text-emerald-400 bg-[#131F19] border border-emerald-500/30 shadow-sm" 
                    : "text-mutedText hover:text-primaryText hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <MessageCircle size={13} />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveTab("call")}
                className={`py-2 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 font-medium cursor-pointer ${
                  activeTab === "call" 
                    ? "text-luxuryGold bg-[#181822] border border-luxuryGold/30 shadow-sm" 
                    : "text-mutedText hover:text-primaryText hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <Phone size={13} />
                <span>Call Us</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-3.5 sm:p-4 flex-1 min-h-0 overflow-y-auto space-y-3.5 text-xs overscroll-contain">
              
              {/* TAB 1: CONCIERGE Q&A / TOPIC BROWSER */}
              {activeTab === "chat" && (
                <>
                  {selectedTopic ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="space-y-3.5"
                    >
                      {/* Back button */}
                      <button
                        onClick={() => setSelectedTopic(null)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-luxuryGold/10 border border-white/[0.08] hover:border-luxuryGold/30 text-[11px] text-luxuryGold font-mono transition-colors cursor-pointer"
                      >
                        ← Back to All Inquiries
                      </button>

                      {/* User's query bubble */}
                      <div className="flex justify-end">
                        <div className="bg-luxuryGold/15 border border-luxuryGold/35 text-primaryText rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-[88%] text-xs font-medium leading-relaxed">
                          {selectedTopic.question}
                        </div>
                      </div>

                      {/* Concierge answer bubble */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full border border-luxuryGold/40 bg-[#16161D] flex items-center justify-center text-luxuryGold flex-shrink-0 mt-0.5 shadow-inner">
                          <SquirrelLogo size={14} variant="icon" />
                        </div>
                        <div className="bg-[#121217] border border-white/[0.08] rounded-2xl rounded-tl-xs p-4 space-y-3 flex-1 shadow-md">
                          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-luxuryGold font-mono">
                            <selectedTopic.icon size={11} />
                            <span>{selectedTopic.tag}</span>
                          </div>
                          <p className="text-secondaryText text-xs font-light leading-relaxed">
                            {selectedTopic.answer}
                          </p>

                          {selectedTopic.actionUrl && (
                            <div className="pt-1">
                              <a
                                href={selectedTopic.actionUrl}
                                onClick={() => setIsOpen(false)}
                                className="luxury-button text-[10px] py-2 px-3.5 inline-flex items-center gap-1.5 uppercase tracking-wider font-medium rounded-lg"
                              >
                                <span>{selectedTopic.actionText}</span>
                                <ChevronRight size={12} />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Alternative Inquiry Actions */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTopic(null)}
                          className="flex-1 text-center py-2.5 text-[10px] text-secondaryText hover:text-primaryText border border-white/[0.08] hover:border-luxuryGold/30 bg-[#121217] hover:bg-[#16161D] rounded-xl transition-colors font-mono cursor-pointer"
                        >
                          Explore Inquiries
                        </button>
                        <button
                          onClick={() => setActiveTab("whatsapp")}
                          className="flex-1 text-center py-2.5 text-[10px] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-950/20 bg-[#121217] rounded-xl transition-colors font-mono flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MessageCircle size={12} />
                          <span>WhatsApp Desk</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {/* Welcome Concierge Card */}
                      <div className="p-3.5 bg-gradient-to-br from-luxuryGold/[0.06] via-[#14141A] to-[#121217] border border-luxuryGold/20 rounded-xl space-y-1">
                        <p className="text-primaryText text-xs font-serif font-medium tracking-wide">
                          Welcome to the RARE NUTS Client Desk
                        </p>
                        <p className="text-secondaryText text-[11px] font-light leading-relaxed">
                          Select an inquiry topic below or connect with a dedicated concierge advisor.
                        </p>
                      </div>

                      {/* Topics list */}
                      <div className="space-y-2">
                        {PRESET_TOPICS.map((topic) => {
                          const Icon = topic.icon;
                          return (
                            <button
                              key={topic.id}
                              onClick={() => setSelectedTopic(topic)}
                              className="w-full text-left p-3 border border-white/[0.06] hover:border-luxuryGold/40 bg-[#121217]/90 hover:bg-[#181822] rounded-xl transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
                            >
                              <div className="flex items-center gap-3 pr-2 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-[#181822] border border-white/[0.08] group-hover:border-luxuryGold/30 flex items-center justify-center text-luxuryGold/90 group-hover:text-luxuryGold flex-shrink-0 transition-colors shadow-inner">
                                  <Icon size={14} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-[9px] uppercase tracking-widest text-luxuryGold/85 font-mono block leading-none mb-1 font-medium">
                                    {topic.tag}
                                  </span>
                                  <h4 className="font-serif text-xs sm:text-[13px] text-primaryText group-hover:text-luxuryGold transition-colors truncate font-medium">
                                    {topic.question}
                                  </h4>
                                </div>
                              </div>
                              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-white/[0.02] text-mutedText/70 group-hover:text-luxuryGold group-hover:bg-luxuryGold/10 group-hover:translate-x-0.5 transition-all flex-shrink-0">
                                <ChevronRight size={13} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: WHATSAPP DIRECT */}
              {activeTab === "whatsapp" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-3.5"
                >
                  <div className="p-3.5 bg-emerald-950/25 border border-emerald-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                      <MessageCircle size={14} />
                      <span>Dedicated WhatsApp Concierge</span>
                    </div>
                    <p className="text-secondaryText text-[11px] font-light leading-relaxed">
                      Instant direct communication with a senior culinary advisor for bespoke curations, tasting kits, and corporate gifting.
                    </p>
                  </div>

                  {/* Quick message suggestions */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase tracking-widest text-mutedText font-mono block">
                      Quick Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {WHATSAPP_CHIPS.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleChipClick(chip)}
                          className="text-[10px] px-2.5 py-1 rounded-full border border-white/[0.08] hover:border-emerald-500/50 bg-[#14141A] text-secondaryText hover:text-emerald-300 transition-colors font-mono cursor-pointer"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSendCustomMessage} className="space-y-2.5 pt-1">
                    <textarea
                      rows={3}
                      value={customMsg}
                      onChange={(e) => setCustomMsg(e.target.value)}
                      placeholder="Compose your inquiry, requested quantities, delivery cities, or special event dates..."
                      className="w-full bg-[#121217] border border-white/[0.08] focus:border-emerald-500/60 p-3 text-xs text-primaryText outline-none transition-colors resize-none rounded-xl placeholder:text-mutedText/50 leading-relaxed"
                    />
                    <button
                      type="submit"
                      disabled={sentMsg}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                    >
                      <MessageCircle size={15} />
                      <span>{sentMsg ? "Connecting to WhatsApp..." : "Start WhatsApp Conversation"}</span>
                    </button>
                  </form>
                </motion.div>
              )}

              {/* TAB 3: PHONE & CALL */}
              {activeTab === "call" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-3.5"
                >
                  <div className="p-3.5 bg-gradient-to-br from-luxuryGold/[0.06] via-[#14141A] to-[#121217] border border-luxuryGold/20 rounded-xl space-y-1.5">
                    <span className="text-[9px] uppercase tracking-widest text-luxuryGold font-mono block">
                      Client Assistance Lines
                    </span>
                    <p className="text-secondaryText text-[11px] font-light leading-relaxed">
                      Our concierge desk operates Monday through Saturday to personally attend to your inquiries.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <a
                      href="tel:18008904100"
                      className="p-3.5 border border-white/[0.06] hover:border-luxuryGold/40 bg-[#121217] hover:bg-[#16161D] rounded-xl flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-luxuryGold/30 bg-[#181822] flex items-center justify-center text-luxuryGold shadow-inner flex-shrink-0">
                          <Phone size={14} />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-mutedText font-mono block">Toll-Free (India)</span>
                          <span className="font-serif text-sm text-primaryText group-hover:text-luxuryGold font-medium">1800 890 4100</span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-mutedText group-hover:text-luxuryGold group-hover:translate-x-1 transition-all" />
                    </a>

                    <a
                      href="tel:+912269854100"
                      className="p-3.5 border border-white/[0.06] hover:border-luxuryGold/40 bg-[#121217] hover:bg-[#16161D] rounded-xl flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-luxuryGold/30 bg-[#181822] flex items-center justify-center text-luxuryGold shadow-inner flex-shrink-0">
                          <Phone size={14} />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-mutedText font-mono block">Direct Headquarters</span>
                          <span className="font-serif text-sm text-primaryText group-hover:text-luxuryGold font-medium">+91 (022) 6985 4100</span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-mutedText group-hover:text-luxuryGold group-hover:translate-x-1 transition-all" />
                    </a>
                  </div>

                  <div className="p-3.5 bg-[#101015] border border-white/[0.05] rounded-xl text-[10px] text-mutedText font-mono space-y-1.5">
                    <div className="flex justify-between">
                      <span>Mon – Sat:</span>
                      <span className="text-primaryText">9:00 AM – 8:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="text-primaryText">10:00 AM – 5:00 PM IST</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Footer Status */}
            <div className="bg-[#09090D] border-t border-divider/50 px-4 py-2.5 flex items-center justify-between text-[10px] text-mutedText font-mono flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <Clock size={11} className="text-luxuryGold" />
                <span>Average response &lt; 5m</span>
              </span>
              <span className="text-luxuryGold/85 font-medium">RARE NUTS Client Desk</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
