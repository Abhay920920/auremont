"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Send, 
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
  CheckCircle2,
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
    tag: "Corporate & B2B",
    icon: Building2,
    question: "Corporate & Bulk Gifting Privileges",
    answer: "Our Corporate Concierge specializes in executive curations, precision laser logo engraving on solid mahogany chests, volume tiers (up to 30% savings), and multi-recipient white-glove dispatch.",
    actionUrl: "/corporate-gifts",
    actionText: "Open Corporate Estimator",
  },
  {
    id: "bespoke",
    tag: "Custom Studio",
    icon: Gift,
    question: "Bespoke Gift Box Personalization",
    answer: "Through our 3D Custom Studio, you can compose 2, 3, or 4-slot mahogany presentation chests, customize brass nameplates, hand-pick velvet linings, and select hand-stamped gold wax seals.",
    actionUrl: "/custom-gift-box",
    actionText: "Launch Bespoke Box Studio",
  },
  {
    id: "terroir",
    tag: "Botanical Standard",
    icon: Leaf,
    question: "The RARE NUTS Terroir & Roasting Craft",
    answer: "We source exclusively Extra Large Nonpareil kernels from California's 36th parallel North. Every batch is gently convective-roasted over seasoned almond wood without industrial frying oils, yielding an airy, delicate crunch.",
    actionUrl: "/about",
    actionText: "Explore Brand Heritage",
  },
  {
    id: "shipping",
    tag: "Logistics",
    icon: Package,
    question: "Shipping Timelines & Thermal Packaging",
    answer: "Domestic orders arrive within 2–4 business days via Blue Dart Apex or Delhivery Express (complimentary over ₹1,999). International orders dispatch via insured DHL Express with climate-shield thermal barrier liners.",
    actionUrl: "/shipping",
    actionText: "Review Shipping Charter",
  },
  {
    id: "guarantee",
    tag: "Quality Pledge",
    icon: ShieldCheck,
    question: "The 100% Culinary Excellence Guarantee",
    answer: "Every consignment is packed in climate-regulated vaults. If any shipment arrives compromised or if kernel flavor falls short of perfection, our concierge arranges an immediate priority replacement or refund within 7 days.",
    actionUrl: "/returns",
    actionText: "View Culinary Guarantee",
  },
  {
    id: "tasting",
    tag: "Curated Tasting",
    icon: Sparkles,
    question: "Request a Tasting Sample Kit",
    answer: "For corporate commissions or wedding favor orders of 50+ units, our concierge delivers complimentary tasting sample chests featuring our California Raw Reserve, Wood-Roasted Sea Salt, and Royal Saffron editions.",
    actionUrl: "/contact",
    actionText: "Inquire for Sample Chest",
  },
];

const WHATSAPP_CHIPS = [
  "Corporate Gifting Quote",
  "Custom Mahogany Engraving",
  "Wedding Favor Curations",
  "Order Dispatch Status",
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
              maxHeight: "calc(100dvh - 120px)",
              height: "min(510px, calc(100dvh - 120px))",
            }}
            className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 md:right-8 left-3 sm:left-auto w-auto sm:w-[380px] md:w-[390px] z-[95] bg-[#0A0A0D]/98 backdrop-blur-2xl border border-luxuryGold/40 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col"
          >
            {/* Top Accent Gold Shimmer Line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-luxuryGold to-transparent flex-shrink-0" />

            {/* Header */}
            <div className="bg-surface/95 border-b border-divider px-4 py-3 flex justify-between items-center relative flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-luxuryGold/40 bg-secondaryBg flex items-center justify-center text-luxuryGold shadow-inner">
                  <SquirrelLogo size={20} variant="icon" />
                </div>
                <div>
                  <h3 className="font-serif text-sm text-primaryText flex items-center gap-1.5 font-medium leading-tight">
                    <span>RARE NUTS Concierge</span>
                    <Sparkles size={11} className="text-luxuryGold flex-shrink-0" />
                  </h3>
                  <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-mono mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Private Client Desk · Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-secondaryText hover:text-luxuryGold p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Minimize Concierge"
                  title="Minimize"
                >
                  <Minus size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-secondaryText hover:text-luxuryGold p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close Concierge"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 border-b border-divider bg-surface/50 text-[10px] uppercase tracking-wider font-mono flex-shrink-0">
              <button
                onClick={() => { setActiveTab("chat"); setSelectedTopic(null); }}
                className={`py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 font-medium cursor-pointer ${
                  activeTab === "chat" 
                    ? "text-luxuryGold border-b-2 border-luxuryGold bg-secondaryBg" 
                    : "text-secondaryText hover:text-primaryText"
                }`}
              >
                <HelpCircle size={12} />
                <span>Concierge</span>
              </button>

              <button
                onClick={() => setActiveTab("whatsapp")}
                className={`py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 font-medium cursor-pointer ${
                  activeTab === "whatsapp" 
                    ? "text-emerald-400 border-b-2 border-emerald-400 bg-secondaryBg" 
                    : "text-secondaryText hover:text-primaryText"
                }`}
              >
                <MessageCircle size={12} />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveTab("call")}
                className={`py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 font-medium cursor-pointer ${
                  activeTab === "call" 
                    ? "text-luxuryGold border-b-2 border-luxuryGold bg-secondaryBg" 
                    : "text-secondaryText hover:text-primaryText"
                }`}
              >
                <Phone size={12} />
                <span>Call Us</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 min-h-0 overflow-y-auto space-y-4 text-xs">
              
              {/* TAB 1: CONCIERGE Q&A / TOPIC BROWSER */}
              {activeTab === "chat" && (
                <>
                  {selectedTopic ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="space-y-4"
                    >
                      {/* Back button */}
                      <button
                        onClick={() => setSelectedTopic(null)}
                        className="text-[11px] text-luxuryGold hover:text-goldHover flex items-center gap-1 font-mono transition-colors cursor-pointer"
                      >
                        ← Back to All Inquiries
                      </button>

                      {/* User's query bubble */}
                      <div className="flex justify-end">
                        <div className="bg-luxuryGold/15 border border-luxuryGold/30 text-primaryText rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[85%] text-xs font-medium">
                          {selectedTopic.question}
                        </div>
                      </div>

                      {/* Concierge answer bubble */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full border border-luxuryGold/40 bg-surface flex items-center justify-center text-luxuryGold flex-shrink-0 mt-1">
                          <SquirrelLogo size={14} variant="icon" />
                        </div>
                        <div className="bg-surface border border-divider rounded-2xl rounded-tl-sm p-3.5 space-y-3 flex-1">
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
                                className="luxury-button text-[10px] py-2 px-3.5 inline-flex items-center gap-1.5 uppercase tracking-wider font-medium"
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
                          className="flex-1 text-center py-2 text-[10px] text-secondaryText hover:text-primaryText border border-divider hover:border-luxuryGold/30 rounded-lg transition-colors font-mono cursor-pointer"
                        >
                          Explore Inquiries
                        </button>
                        <button
                          onClick={() => setActiveTab("whatsapp")}
                          className="flex-1 text-center py-2 text-[10px] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-950/20 rounded-lg transition-colors font-mono flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MessageCircle size={11} />
                          <span>WhatsApp Desk</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {/* Welcome Concierge Card */}
                      <div className="p-3 bg-surface/80 border border-luxuryGold/20 rounded-xl space-y-1">
                        <p className="text-primaryText text-xs font-medium">
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
                              className="w-full text-left p-3 border border-divider hover:border-luxuryGold/40 bg-surface/40 hover:bg-surface rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 pr-2">
                                <div className="w-7 h-7 rounded-lg bg-surface border border-divider flex items-center justify-center text-luxuryGold flex-shrink-0 group-hover:border-luxuryGold/40 transition-colors">
                                  <Icon size={13} />
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase tracking-wider text-luxuryGold font-mono block leading-none mb-1">
                                    {topic.tag}
                                  </span>
                                  <h4 className="font-serif text-xs text-primaryText group-hover:text-luxuryGold transition-colors line-clamp-1">
                                    {topic.question}
                                  </h4>
                                </div>
                              </div>
                              <ChevronRight size={13} className="text-mutedText group-hover:text-luxuryGold group-hover:translate-x-0.5 transition-all flex-shrink-0" />
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
                  className="space-y-3"
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
                          className="text-[10px] px-2.5 py-1 rounded-full border border-divider hover:border-emerald-500/50 bg-surface/60 text-secondaryText hover:text-primaryText transition-colors font-mono cursor-pointer"
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
                      className="w-full bg-surface border border-divider focus:border-emerald-500/60 p-3 text-xs text-primaryText outline-none transition-colors resize-none rounded-xl placeholder:text-mutedText/60"
                    />
                    <button
                      type="submit"
                      disabled={sentMsg}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
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
                  className="space-y-3"
                >
                  <div className="p-3.5 bg-surface border border-divider rounded-xl space-y-2">
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
                      className="p-3 border border-divider hover:border-luxuryGold/50 bg-surface/40 hover:bg-surface rounded-xl flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-luxuryGold/30 bg-surface flex items-center justify-center text-luxuryGold">
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
                      className="p-3 border border-divider hover:border-luxuryGold/50 bg-surface/40 hover:bg-surface rounded-xl flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-luxuryGold/30 bg-surface flex items-center justify-center text-luxuryGold">
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

                  <div className="p-3 bg-surface/40 rounded-xl text-[10px] text-mutedText font-mono space-y-1">
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
            <div className="bg-surface/80 border-t border-divider px-4 py-2.5 flex items-center justify-between text-[10px] text-mutedText font-mono flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <Clock size={11} className="text-luxuryGold" />
                <span>Response &lt; 5m</span>
              </span>
              <span className="text-luxuryGold">RARE NUTS Client Desk</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
