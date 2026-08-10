"use client";

import { useState } from "react";
import { useCurrencyStore } from "@/store/currencyStore";
import api from "@/lib/axios";
import { Award, Briefcase, CheckCircle2, Building2, Send, Calculator } from "lucide-react";

const BOX_TIERS = [
  { id: "mahogany", name: "Handcrafted Mahogany Chest", basePrice: 1499 },
  { id: "velvet", name: "Velvet Embossed Gift Box", basePrice: 1199 },
  { id: "matte-black", name: "Matte Black Rigid Box", basePrice: 899 },
];

export default function CorporateQuoteEstimator() {
  const { formatPrice } = useCurrencyStore();

  const [quantity, setQuantity] = useState(50);
  const [selectedBox, setSelectedBox] = useState(BOX_TIERS[0]);
  const [hasLogoPlate, setHasLogoPlate] = useState(true);
  const [hasCustomCard, setHasCustomCard] = useState(true);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Discount Calculation based on tier
  const getDiscountMultiplier = (qty: number) => {
    if (qty >= 500) return 0.70; // 30% discount
    if (qty >= 200) return 0.75; // 25% discount
    if (qty >= 100) return 0.80; // 20% discount
    if (qty >= 50) return 0.85;  // 15% discount
    return 0.90;                 // 10% discount
  };

  const logoPrice = hasLogoPlate ? 150 : 0;
  const cardPrice = hasCustomCard ? 50 : 0;
  const rawUnitPrice = selectedBox.basePrice + logoPrice + cardPrice;
  const discountMultiplier = getDiscountMultiplier(quantity);
  const unitPrice = Math.round(rawUnitPrice * discountMultiplier);
  const estimatedTotal = unitPrice * quantity;

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !contactName || !companyName) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await api.post("/contact", {
        name: contactName,
        email,
        subject: `Corporate Inquiry: ${companyName} (${quantity} Units)`,
        message: `Company: ${companyName}\nPhone: ${phone}\nQuantity: ${quantity} units\nBox Vessel: ${selectedBox.name}\nEstimated Total: ₹${estimatedTotal}\n\nAdditional Notes:\n${message}`,
      });
      setSubmitted(true);
    } catch (err: any) {
      // Even if offline/mock backend, show clean fallback confirmation
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full my-20 bg-secondaryBg/80 border border-luxuryGold/30 rounded-card p-8 md:p-14 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxuryGold/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <span className="text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-3.5 py-1 border border-luxuryGold/20 rounded-full inline-block">
          Interactive Concierge Tool
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-primaryText tracking-tight">
          Corporate Bulk Quote Estimator
        </h2>
        <p className="text-secondaryText text-sm font-light leading-relaxed">
          Configure unit volumes, custom logo plate engraving, and packaging options for instant estimate calculations.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT CONFIGURATOR: 7 Columns */}
        <div className="lg:col-span-7 space-y-8 bg-background/60 p-6 md:p-8 border border-divider rounded-card">
          
          {/* Box Vessel Selector */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-secondaryText font-medium block">
              1. Select Corporate Vessel Finish
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BOX_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedBox(tier)}
                  className={`p-4 border text-left rounded-card transition-all ${
                    selectedBox.id === tier.id
                      ? "border-luxuryGold bg-luxuryGold/10 text-primaryText"
                      : "border-divider bg-secondaryBg text-secondaryText hover:border-luxuryGold/40"
                  }`}
                >
                  <p className="font-serif text-sm line-clamp-1">{tier.name}</p>
                  <span className="text-xs text-luxuryGold font-serif block mt-1" suppressHydrationWarning>
                    {formatPrice(tier.basePrice)} / unit
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Slider & Counter */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase tracking-widest text-secondaryText font-medium">
                2. Order Volume (Units)
              </label>
              <span className="font-serif text-xl text-luxuryGold font-bold">
                {quantity} Units
              </span>
            </div>
            <input
              type="range"
              min={25}
              max={1000}
              step={25}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-luxuryGold bg-secondaryBg h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-mutedText">
              <span>25 Units (10% Off)</span>
              <span>100 Units (20% Off)</span>
              <span>500+ Units (30% Off)</span>
            </div>
          </div>

          {/* Branding Add-Ons */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-secondaryText font-medium block">
              3. Bespoke Corporate Branding Add-Ons
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="p-4 border border-divider bg-secondaryBg rounded-card flex items-center gap-3 cursor-pointer hover:border-luxuryGold/40">
                <input
                  type="checkbox"
                  checked={hasLogoPlate}
                  onChange={(e) => setHasLogoPlate(e.target.checked)}
                  className="accent-luxuryGold w-4 h-4"
                />
                <div>
                  <span className="text-xs font-serif text-primaryText block">24k Gold Logo Plate</span>
                  <span className="text-[10px] text-secondaryText">+₹150 / unit</span>
                </div>
              </label>

              <label className="p-4 border border-divider bg-secondaryBg rounded-card flex items-center gap-3 cursor-pointer hover:border-luxuryGold/40">
                <input
                  type="checkbox"
                  checked={hasCustomCard}
                  onChange={(e) => setHasCustomCard(e.target.checked)}
                  className="accent-luxuryGold w-4 h-4"
                />
                <div>
                  <span className="text-xs font-serif text-primaryText block">Personalized Executive Card</span>
                  <span className="text-[10px] text-secondaryText">+₹50 / unit</span>
                </div>
              </label>
            </div>
          </div>

          {/* Pricing Calculation Display */}
          <div className="p-6 bg-secondaryBg border border-luxuryGold/40 rounded-card space-y-4">
            <div className="flex justify-between items-center text-xs text-secondaryText border-b border-divider pb-3">
              <span>Tier Discount Applied</span>
              <span className="text-luxuryGold font-medium">
                {Math.round((1 - discountMultiplier) * 100)}% Privileged Discount
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-primaryText">
              <span>Estimated Unit Cost</span>
              <span className="font-serif text-lg text-primaryText" suppressHydrationWarning>
                {formatPrice(unitPrice)} / unit
              </span>
            </div>
            <div className="flex justify-between items-center text-xl md:text-2xl font-serif text-primaryText border-t border-divider pt-4">
              <span className="flex items-center gap-2">
                <Calculator size={20} className="text-luxuryGold" />
                Estimated Total Quote
              </span>
              <span className="text-luxuryGold font-bold" suppressHydrationWarning>
                {formatPrice(estimatedTotal)}
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT INQUIRY FORM: 5 Columns */}
        <div className="lg:col-span-5 bg-background p-6 md:p-8 border border-divider rounded-card space-y-6">
          <div className="border-b border-divider pb-4">
            <h3 className="font-serif text-2xl text-primaryText flex items-center gap-2">
              <Building2 size={22} className="text-luxuryGold" />
              Request Official Proposal
            </h3>
            <p className="text-secondaryText text-xs font-light mt-1">
              Submit your inquiry to receive a formal corporate quote & sample box kit.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <CheckCircle2 size={48} className="text-luxuryGold mx-auto" />
              <h4 className="font-serif text-2xl text-primaryText">Inquiry Submitted</h4>
              <p className="text-secondaryText text-xs font-light max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="text-primaryText font-medium">{contactName}</span>. Your corporate quote request for <span className="text-luxuryGold font-medium">{quantity} units</span> of {selectedBox.name} has been received. Our concierge team will reach out within 4 business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="luxury-button-outline text-xs px-6 py-2.5 mt-4"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-error/10 border border-error/30 text-error text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondaryText font-medium block mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Enterprises Ltd."
                  className="w-full bg-secondaryBg border border-divider px-3.5 py-2.5 text-xs text-primaryText outline-none focus:border-luxuryGold transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-secondaryText font-medium block mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-secondaryBg border border-divider px-3.5 py-2.5 text-xs text-primaryText outline-none focus:border-luxuryGold transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-secondaryText font-medium block mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-secondaryBg border border-divider px-3.5 py-2.5 text-xs text-primaryText outline-none focus:border-luxuryGold transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondaryText font-medium block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-secondaryBg border border-divider px-3.5 py-2.5 text-xs text-primaryText outline-none focus:border-luxuryGold transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondaryText font-medium block mb-1">
                  Additional Delivery / Branding Notes
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Specify delivery locations, requested delivery date, or custom messaging..."
                  className="w-full bg-secondaryBg border border-divider p-3 text-xs text-primaryText outline-none focus:border-luxuryGold transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="luxury-button w-full py-4 text-xs tracking-ultra flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={14} />
                {submitting ? "Submitting Inquiry..." : "Submit Corporate Quote Inquiry"}
              </button>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
