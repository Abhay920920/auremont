"use client";

import { useState } from "react";
import { Gift } from "lucide-react";

export default function GiftOptions({
  onSave
}: {
  onSave: (message: string, includeReceipt: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [noReceipt, setNoReceipt] = useState(false);

  const handleSave = () => {
    onSave(message, !noReceipt);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-4 border border-divider/60 hover:border-luxuryGold/50 bg-secondaryBg/40 hover:bg-secondaryBg/70 rounded-xl transition-all group mt-6 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface border border-divider flex items-center justify-center text-luxuryGold group-hover:border-luxuryGold/40 transition-colors">
            <Gift size={16} />
          </div>
          <div>
            <span className="font-serif text-sm text-primaryText group-hover:text-luxuryGold transition-colors block">
              Add Complimentary Gift Note
            </span>
            <span className="text-[11px] text-secondaryText font-light block">
              Hand-inscribed card & optional concealed pricing for gifting
            </span>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider text-luxuryGold px-2.5 py-1 rounded-full border border-luxuryGold/30 group-hover:bg-luxuryGold/10 transition-colors flex-shrink-0">
          + Add
        </span>
      </button>
    );
  }

  return (
    <div className="mt-6 p-4 sm:p-5 border border-luxuryGold/30 bg-secondaryBg/80 rounded-xl space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-divider pb-3">
        <div className="flex items-center gap-2.5">
          <Gift size={16} className="text-luxuryGold" />
          <h4 className="font-serif text-base text-primaryText font-medium">Bespoke Gift Note</h4>
        </div>
        <span className="text-[10px] text-mutedText font-mono">Max 200 chars</span>
      </div>
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Inscribe a personalized gift message to accompany the recipient's delivery..."
        maxLength={200}
        rows={3}
        className="w-full bg-background/80 border border-divider rounded-lg p-3 text-xs sm:text-sm text-primaryText focus:outline-none focus:border-luxuryGold transition-colors resize-none placeholder:text-mutedText/60"
      />
      
      <label className="flex items-center gap-3 cursor-pointer group select-none">
        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${noReceipt ? 'border-luxuryGold bg-luxuryGold' : 'border-divider group-hover:border-luxuryGold'}`}>
          {noReceipt && <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        </div>
        <input 
          type="checkbox" 
          className="hidden" 
          checked={noReceipt} 
          onChange={(e) => setNoReceipt(e.target.checked)} 
        />
        <span className="text-xs text-secondaryText group-hover:text-primaryText transition-colors">
          Omit pricing details from enclosed parcel packing slip
        </span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button 
          onClick={handleSave}
          className="luxury-button text-[10px] uppercase tracking-wider py-2 px-5 font-medium"
        >
          Save Gift Note
        </button>
        <button 
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-xs text-secondaryText hover:text-primaryText transition-colors font-mono"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
