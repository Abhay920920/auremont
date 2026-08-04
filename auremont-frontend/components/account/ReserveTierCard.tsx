"use client";

import React from "react";
import { Crown, Sparkles, ShieldCheck, Gift } from "lucide-react";

export default function ReserveTierCard({ orderCount = 5 }: { orderCount?: number }) {
  // Determine tier based on order count
  const getTier = () => {
    if (orderCount >= 10) return { name: "Black Heirloom Vault", color: "text-amber-300", bg: "bg-amber-500/10", border: "border-amber-500/30", next: "Maximum Status Achieved", target: 10, current: 10 };
    if (orderCount >= 4) return { name: "Gold Reserve Member", color: "text-luxuryGold", bg: "bg-luxuryGold/10", border: "border-luxuryGold/30", next: "Black Heirloom Vault", target: 10, current: orderCount };
    return { name: "Silver Member", color: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30", next: "Gold Reserve Member", target: 4, current: orderCount };
  };

  const tier = getTier();
  const progressPercent = Math.min(100, Math.round((tier.current / tier.target) * 100));

  return (
    <div className="w-full bg-secondaryBg border border-luxuryGold/30 rounded-card p-6 md:p-8 space-y-6 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Background Accent Lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-luxuryGold/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Tier Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-divider pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-background border border-luxuryGold/40 flex items-center justify-center shadow-inner">
            <Crown size={22} className="text-luxuryGold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-ultra font-medium px-2.5 py-0.5 rounded-full border ${tier.bg} ${tier.color} ${tier.border}`}>
                {tier.name}
              </span>
            </div>
            <h3 className="font-serif text-2xl text-primaryText mt-1">Auremont Reserve Privileges</h3>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase tracking-ultra text-mutedText block">Member ID</span>
          <span className="font-mono text-xs text-luxuryGold tracking-widest">AUR-RSV-88209</span>
        </div>
      </div>

      {/* Tier Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-ultra">
          <span className="text-secondaryText">Vault Progression &bull; {tier.current} of {tier.target} Orders</span>
          <span className="text-luxuryGold font-medium">Next Tier: {tier.next}</span>
        </div>
        <div className="w-full h-2 bg-background border border-divider rounded-full overflow-hidden p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-goldDark via-luxuryGold to-goldHover rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Unlocked Privileges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-background border border-divider rounded-card space-y-2">
          <div className="flex items-center gap-2 text-luxuryGold">
            <Sparkles size={16} />
            <span className="text-[10px] uppercase tracking-ultra font-medium">10% Privilege</span>
          </div>
          <p className="text-xs text-secondaryText font-light">Automatic 10% privilege discount on all reserve orders.</p>
        </div>

        <div className="p-4 bg-background border border-divider rounded-card space-y-2">
          <div className="flex items-center gap-2 text-luxuryGold">
            <Gift size={16} />
            <span className="text-[10px] uppercase tracking-ultra font-medium">Bespoke Engraving</span>
          </div>
          <p className="text-xs text-secondaryText font-light">Complimentary laser engraving on all mahogany gift boxes.</p>
        </div>

        <div className="p-4 bg-background border border-divider rounded-card space-y-2">
          <div className="flex items-center gap-2 text-luxuryGold">
            <ShieldCheck size={16} />
            <span className="text-[10px] uppercase tracking-ultra font-medium">Vault Dispatch</span>
          </div>
          <p className="text-xs text-secondaryText font-light">Priority insured vault dispatch within 12 hours.</p>
        </div>
      </div>
    </div>
  );
}
